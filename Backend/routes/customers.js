const express = require("express")
const { body, validationResult, query } = require("express-validator")
const Customer = require("../models/Customer")
const Order = require("../models/Order")
const { authenticateToken } = require("../middleware/auth")

const router = express.Router()

// Apply authentication to all routes
router.use(authenticateToken)

// Get all customers with pagination and filtering
router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
    query("search").optional().isString().withMessage("Search must be a string"),
    query("status").optional().isIn(["active", "inactive", "blocked"]).withMessage("Invalid status"),
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
      const search = req.query.search || ""
      const status = req.query.status
      const sortBy = req.query.sortBy || "createdAt"
      const sortOrder = req.query.sortOrder === "asc" ? 1 : -1

      // Build filter query
      const filter = {}
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ]
      }
      if (status) {
        filter.status = status
      }

      // Execute query with pagination
      const skip = (page - 1) * limit
      const customers = await Customer.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean()

      const totalCustomers = await Customer.countDocuments(filter)
      const totalPages = Math.ceil(totalCustomers / limit)

      res.json({
        success: true,
        data: {
          customers,
          pagination: {
            currentPage: page,
            totalPages,
            totalCustomers,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
        },
      })
    } catch (error) {
      console.error("Get customers error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to fetch customers",
        error: error.message,
      })
    }
  },
)

// Get customer by ID with order history
router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).lean()
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      })
    }

    // Get customer's order history
    const orders = await Order.find({ customerId: req.params.id }).sort({ orderDate: -1 }).limit(10).lean()

    res.json({
      success: true,
      data: {
        customer,
        recentOrders: orders,
      },
    })
  } catch (error) {
    console.error("Get customer error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch customer",
      error: error.message,
    })
  }
})

// Create new customer
router.post(
  "/",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
    body("phone").optional().isMobilePhone().withMessage("Please provide a valid phone number"),
    body("totalSpending").optional().isNumeric().withMessage("Total spending must be a number"),
    body("visits").optional().isInt({ min: 0 }).withMessage("Visits must be a non-negative integer"),
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

      // Check if customer with email already exists
      const existingCustomer = await Customer.findOne({ email: req.body.email })
      if (existingCustomer) {
        return res.status(400).json({
          success: false,
          message: "Customer with this email already exists",
        })
      }

      const customer = new Customer(req.body)
      await customer.save()

      res.status(201).json({
        success: true,
        message: "Customer created successfully",
        data: { customer },
      })
    } catch (error) {
      console.error("Create customer error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to create customer",
        error: error.message,
      })
    }
  },
)

// Update customer
router.put(
  "/:id",
  [
    body("name").optional().trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("email").optional().isEmail().normalizeEmail().withMessage("Please provide a valid email"),
    body("phone").optional().isMobilePhone().withMessage("Please provide a valid phone number"),
    body("totalSpending").optional().isNumeric().withMessage("Total spending must be a number"),
    body("visits").optional().isInt({ min: 0 }).withMessage("Visits must be a non-negative integer"),
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

      const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      })

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found",
        })
      }

      res.json({
        success: true,
        message: "Customer updated successfully",
        data: { customer },
      })
    } catch (error) {
      console.error("Update customer error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to update customer",
        error: error.message,
      })
    }
  },
)

// Delete customer
router.delete("/:id", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id)
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      })
    }

    // Also delete associated orders (optional - you might want to keep them for records)
    // await Order.deleteMany({ customerId: req.params.id });

    res.json({
      success: true,
      message: "Customer deleted successfully",
    })
  } catch (error) {
    console.error("Delete customer error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to delete customer",
      error: error.message,
    })
  }
})

// Get customer analytics
router.get("/analytics/overview", async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments()
    const activeCustomers = await Customer.countDocuments({ status: "active" })
    const inactiveCustomers = await Customer.countDocuments({ status: "inactive" })

    // Get top spending customers
    const topSpenders = await Customer.find()
      .sort({ totalSpending: -1 })
      .limit(5)
      .select("name email totalSpending")
      .lean()

    // Get recent customers
    const recentCustomers = await Customer.find().sort({ createdAt: -1 }).limit(5).select("name email createdAt").lean()

    res.json({
      success: true,
      data: {
        overview: {
          totalCustomers,
          activeCustomers,
          inactiveCustomers,
        },
        topSpenders,
        recentCustomers,
      },
    })
  } catch (error) {
    console.error("Customer analytics error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch customer analytics",
      error: error.message,
    })
  }
})

module.exports = router
