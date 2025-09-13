const express = require("express")
const { body, validationResult, query } = require("express-validator")
const Order = require("../models/Order")
const Customer = require("../models/Customer")
const { authenticateToken } = require("../middleware/auth")

const router = express.Router()

// Apply authentication to all routes
router.use(authenticateToken)

// Get all orders with pagination and filtering
router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
    query("status")
      .optional()
      .isIn(["pending", "confirmed", "shipped", "delivered", "cancelled", "refunded"])
      .withMessage("Invalid status"),
    query("customerId").optional().isMongoId().withMessage("Invalid customer ID"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const page = Number.parseInt(req.query.page) || 1
      const limit = Number.parseInt(req.query.limit) || 10
      const status = req.query.status
      const customerId = req.query.customerId
      const sortBy = req.query.sortBy || "orderDate"
      const sortOrder = req.query.sortOrder === "asc" ? 1 : -1

      // Build filter query
      const filter = {}
      if (status) filter.status = status
      if (customerId) filter.customerId = customerId

      // Execute query with pagination
      const skip = (page - 1) * limit
      const orders = await Order.find(filter)
        .populate("customerId", "name email")
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean()

      const totalOrders = await Order.countDocuments(filter)
      const totalPages = Math.ceil(totalOrders / limit)

      res.json({
        success: true,
        data: {
          orders,
          pagination: {
            currentPage: page,
            totalPages,
            totalOrders,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
        },
      })
    } catch (error) {
      console.error("Get orders error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to fetch orders",
        error: error.message,
      })
    }
  },
)

// Get order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("customerId", "name email phone").lean()

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      })
    }

    res.json({
      success: true,
      data: { order },
    })
  } catch (error) {
    console.error("Get order error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    })
  }
})

// Create new order
router.post(
  "/",
  [
    body("customerId").isMongoId().withMessage("Valid customer ID is required"),
    body("items").isArray({ min: 1 }).withMessage("At least one item is required"),
    body("items.*.productName").trim().isLength({ min: 1 }).withMessage("Product name is required"),
    body("items.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
    body("items.*.price").isFloat({ min: 0 }).withMessage("Price must be non-negative"),
    body("totalAmount").isFloat({ min: 0 }).withMessage("Total amount must be non-negative"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      // Verify customer exists
      const customer = await Customer.findById(req.body.customerId)
      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found",
        })
      }

      // Calculate item totals
      const items = req.body.items.map((item) => ({
        ...item,
        total: item.quantity * item.price,
      }))

      // Verify total amount matches sum of items
      const calculatedTotal = items.reduce((sum, item) => sum + item.total, 0)
      if (Math.abs(calculatedTotal - req.body.totalAmount) > 0.01) {
        return res.status(400).json({
          success: false,
          message: "Total amount does not match sum of items",
        })
      }

      const order = new Order({
        ...req.body,
        items,
      })

      await order.save()

      // Update customer statistics
      customer.totalSpending += req.body.totalAmount
      customer.visits += 1
      customer.lastPurchaseDate = new Date()
      await customer.save()

      // Populate customer data for response
      await order.populate("customerId", "name email")

      res.status(201).json({
        success: true,
        message: "Order created successfully",
        data: { order },
      })
    } catch (error) {
      console.error("Create order error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to create order",
        error: error.message,
      })
    }
  },
)

// Update order status
router.patch(
  "/:id/status",
  [
    body("status")
      .isIn(["pending", "confirmed", "shipped", "delivered", "cancelled", "refunded"])
      .withMessage("Invalid status"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
          status: req.body.status,
          ...(req.body.status === "delivered" && { deliveryDate: new Date() }),
        },
        { new: true, runValidators: true },
      ).populate("customerId", "name email")

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        })
      }

      res.json({
        success: true,
        message: "Order status updated successfully",
        data: { order },
      })
    } catch (error) {
      console.error("Update order status error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to update order status",
        error: error.message,
      })
    }
  },
)

// Delete order
router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id)
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      })
    }

    // Update customer statistics (subtract the order amount)
    const customer = await Customer.findById(order.customerId)
    if (customer) {
      customer.totalSpending = Math.max(0, customer.totalSpending - order.totalAmount)
      customer.visits = Math.max(0, customer.visits - 1)
      await customer.save()
    }

    res.json({
      success: true,
      message: "Order deleted successfully",
    })
  } catch (error) {
    console.error("Delete order error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to delete order",
      error: error.message,
    })
  }
})

// Get order analytics
router.get("/analytics/overview", async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments()
    const pendingOrders = await Order.countDocuments({ status: "pending" })
    const deliveredOrders = await Order.countDocuments({ status: "delivered" })

    // Calculate total revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: { $in: ["delivered", "shipped"] } } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
    ])
    const totalRevenue = revenueResult[0]?.totalRevenue || 0

    // Get recent orders
    const recentOrders = await Order.find().populate("customerId", "name email").sort({ orderDate: -1 }).limit(5).lean()

    // Monthly revenue trend (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: sixMonthsAgo },
          status: { $in: ["delivered", "shipped"] },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$orderDate" },
            month: { $month: "$orderDate" },
          },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ])

    res.json({
      success: true,
      data: {
        overview: {
          totalOrders,
          pendingOrders,
          deliveredOrders,
          totalRevenue,
        },
        recentOrders,
        monthlyRevenue,
      },
    })
  } catch (error) {
    console.error("Order analytics error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch order analytics",
      error: error.message,
    })
  }
})

module.exports = router
