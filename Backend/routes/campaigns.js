const express = require("express")
const { body, validationResult, query } = require("express-validator")
const Campaign = require("../models/Campaign")
const Customer = require("../models/Customer")
const { authenticateToken } = require("../middleware/auth")

const router = express.Router()

// Apply authentication to all routes
router.use(authenticateToken)

// Helper function to evaluate audience rules
const evaluateAudienceRules = async (rules) => {
  if (!rules || rules.length === 0) {
    return await Customer.find({ status: "active" })
  }

  // Build MongoDB query from rules
  const buildQuery = (rules) => {
    const conditions = []

    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i]
      const condition = {}

      switch (rule.operator) {
        case ">":
          condition[rule.field] = { $gt: Number(rule.value) }
          break
        case "<":
          condition[rule.field] = { $lt: Number(rule.value) }
          break
        case ">=":
          condition[rule.field] = { $gte: Number(rule.value) }
          break
        case "<=":
          condition[rule.field] = { $lte: Number(rule.value) }
          break
        case "=":
          if (rule.field === "lastPurchaseDate") {
            const date = new Date(rule.value)
            const nextDay = new Date(date)
            nextDay.setDate(date.getDate() + 1)
            condition[rule.field] = { $gte: date, $lt: nextDay }
          } else {
            condition[rule.field] = rule.value
          }
          break
        case "!=":
          condition[rule.field] = { $ne: rule.value }
          break
        case "contains":
          condition[rule.field] = { $regex: rule.value, $options: "i" }
          break
        case "not_contains":
          condition[rule.field] = { $not: { $regex: rule.value, $options: "i" } }
          break
        default:
          continue
      }

      conditions.push(condition)
    }

    // Group conditions by logic (AND/OR)
    const andConditions = []
    const orConditions = []

    for (let i = 0; i < conditions.length; i++) {
      const rule = rules[i]
      if (rule.logic === "OR" && i > 0) {
        orConditions.push(conditions[i])
      } else {
        andConditions.push(conditions[i])
      }
    }

    // Build final query
    const query = {}
    if (andConditions.length > 0) {
      query.$and = andConditions
    }
    if (orConditions.length > 0) {
      if (query.$and) {
        query.$and.push({ $or: orConditions })
      } else {
        query.$or = orConditions
      }
    }

    return query
  }

  const query = buildQuery(rules)
  return await Customer.find({ ...query, status: "active" })
}

// Get all campaigns with pagination
router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
    query("status")
      .optional()
      .isIn(["draft", "scheduled", "running", "completed", "paused", "cancelled"])
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

      const page = Number.parseInt(req.query.page) || 1
      const limit = Number.parseInt(req.query.limit) || 10
      const status = req.query.status
      const sortBy = req.query.sortBy || "createdAt"
      const sortOrder = req.query.sortOrder === "asc" ? 1 : -1

      // Build filter query
      const filter = {}
      if (status) filter.status = status

      // Execute query with pagination
      const skip = (page - 1) * limit
      const campaigns = await Campaign.find(filter)
        .populate("createdBy", "name email")
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean()

      const totalCampaigns = await Campaign.countDocuments(filter)
      const totalPages = Math.ceil(totalCampaigns / limit)

      res.json({
        success: true,
        data: {
          campaigns,
          pagination: {
            currentPage: page,
            totalPages,
            totalCampaigns,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
        },
      })
    } catch (error) {
      console.error("Get campaigns error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to fetch campaigns",
        error: error.message,
      })
    }
  },
)

// Get campaign by ID
router.get("/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate("createdBy", "name email").lean()

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      })
    }

    res.json({
      success: true,
      data: { campaign },
    })
  } catch (error) {
    console.error("Get campaign error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch campaign",
      error: error.message,
    })
  }
})

// Create new campaign
router.post(
  "/",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Campaign name must be at least 2 characters"),
    body("type").isIn(["email", "sms", "push"]).withMessage("Invalid campaign type"),
    body("message.content").trim().isLength({ min: 1 }).withMessage("Message content is required"),
    body("audienceRules").optional().isArray().withMessage("Audience rules must be an array"),
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

      // Calculate audience size
      const audienceCustomers = await evaluateAudienceRules(req.body.audienceRules || [])
      const audienceSize = audienceCustomers.length

      const campaign = new Campaign({
        ...req.body,
        audienceSize,
        createdBy: req.user._id,
      })

      await campaign.save()
      await campaign.populate("createdBy", "name email")

      res.status(201).json({
        success: true,
        message: "Campaign created successfully",
        data: { campaign },
      })
    } catch (error) {
      console.error("Create campaign error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to create campaign",
        error: error.message,
      })
    }
  },
)

// Update campaign
router.put(
  "/:id",
  [
    body("name").optional().trim().isLength({ min: 2 }).withMessage("Campaign name must be at least 2 characters"),
    body("type").optional().isIn(["email", "sms", "push"]).withMessage("Invalid campaign type"),
    body("message.content").optional().trim().isLength({ min: 1 }).withMessage("Message content is required"),
    body("audienceRules").optional().isArray().withMessage("Audience rules must be an array"),
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

      const campaign = await Campaign.findById(req.params.id)
      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: "Campaign not found",
        })
      }

      // Check if campaign can be edited
      if (["running", "completed"].includes(campaign.status)) {
        return res.status(400).json({
          success: false,
          message: "Cannot edit running or completed campaigns",
        })
      }

      // Recalculate audience size if rules changed
      if (req.body.audienceRules) {
        const audienceCustomers = await evaluateAudienceRules(req.body.audienceRules)
        req.body.audienceSize = audienceCustomers.length
      }

      Object.assign(campaign, req.body)
      await campaign.save()
      await campaign.populate("createdBy", "name email")

      res.json({
        success: true,
        message: "Campaign updated successfully",
        data: { campaign },
      })
    } catch (error) {
      console.error("Update campaign error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to update campaign",
        error: error.message,
      })
    }
  },
)

// Delete campaign
router.delete("/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      })
    }

    // Check if campaign can be deleted
    if (["running"].includes(campaign.status)) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete running campaigns",
      })
    }

    await Campaign.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: "Campaign deleted successfully",
    })
  } catch (error) {
    console.error("Delete campaign error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to delete campaign",
      error: error.message,
    })
  }
})

// Preview campaign audience
router.post(
  "/preview-audience",
  [body("audienceRules").isArray().withMessage("Audience rules must be an array")],
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

      const audienceCustomers = await evaluateAudienceRules(req.body.audienceRules)
      const audienceSize = audienceCustomers.length

      // Get sample customers (first 10)
      const sampleCustomers = audienceCustomers.slice(0, 10).map((customer) => ({
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        totalSpending: customer.totalSpending,
        visits: customer.visits,
        lastPurchaseDate: customer.lastPurchaseDate,
      }))

      res.json({
        success: true,
        data: {
          audienceSize,
          sampleCustomers,
        },
      })
    } catch (error) {
      console.error("Preview audience error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to preview audience",
        error: error.message,
      })
    }
  },
)

// Start campaign
router.post("/:id/start", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      })
    }

    if (campaign.status !== "draft" && campaign.status !== "scheduled") {
      return res.status(400).json({
        success: false,
        message: "Campaign cannot be started",
      })
    }

    // Get target audience
    const audienceCustomers = await evaluateAudienceRules(campaign.audienceRules)

    // Simulate campaign execution
    campaign.status = "running"
    campaign.sentAt = new Date()
    campaign.stats.sent = audienceCustomers.length

    // Simulate delivery success/failure rates
    const deliveryRate = 0.95 // 95% delivery rate
    const openRate = 0.25 // 25% open rate
    const clickRate = 0.05 // 5% click rate

    campaign.stats.delivered = Math.floor(campaign.stats.sent * deliveryRate)
    campaign.stats.failed = campaign.stats.sent - campaign.stats.delivered
    campaign.stats.opened = Math.floor(campaign.stats.delivered * openRate)
    campaign.stats.clicked = Math.floor(campaign.stats.opened * clickRate)

    await campaign.save()

    // Simulate campaign completion after a short delay
    setTimeout(async () => {
      try {
        const updatedCampaign = await Campaign.findById(campaign._id)
        if (updatedCampaign && updatedCampaign.status === "running") {
          updatedCampaign.status = "completed"
          updatedCampaign.completedAt = new Date()
          await updatedCampaign.save()
        }
      } catch (error) {
        console.error("Campaign completion error:", error)
      }
    }, 5000) // Complete after 5 seconds

    await campaign.populate("createdBy", "name email")

    res.json({
      success: true,
      message: "Campaign started successfully",
      data: { campaign },
    })
  } catch (error) {
    console.error("Start campaign error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to start campaign",
      error: error.message,
    })
  }
})

// Pause campaign
router.post("/:id/pause", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      })
    }

    if (campaign.status !== "running") {
      return res.status(400).json({
        success: false,
        message: "Only running campaigns can be paused",
      })
    }

    campaign.status = "paused"
    await campaign.save()
    await campaign.populate("createdBy", "name email")

    res.json({
      success: true,
      message: "Campaign paused successfully",
      data: { campaign },
    })
  } catch (error) {
    console.error("Pause campaign error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to pause campaign",
      error: error.message,
    })
  }
})

// Get campaign analytics
router.get("/analytics/overview", async (req, res) => {
  try {
    const totalCampaigns = await Campaign.countDocuments()
    const activeCampaigns = await Campaign.countDocuments({ status: "running" })
    const completedCampaigns = await Campaign.countDocuments({ status: "completed" })

    // Get campaign performance stats
    const performanceStats = await Campaign.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: null,
          totalSent: { $sum: "$stats.sent" },
          totalDelivered: { $sum: "$stats.delivered" },
          totalOpened: { $sum: "$stats.opened" },
          totalClicked: { $sum: "$stats.clicked" },
          totalFailed: { $sum: "$stats.failed" },
        },
      },
    ])

    const stats = performanceStats[0] || {
      totalSent: 0,
      totalDelivered: 0,
      totalOpened: 0,
      totalClicked: 0,
      totalFailed: 0,
    }

    // Calculate rates
    const deliveryRate = stats.totalSent > 0 ? (stats.totalDelivered / stats.totalSent) * 100 : 0
    const openRate = stats.totalDelivered > 0 ? (stats.totalOpened / stats.totalDelivered) * 100 : 0
    const clickRate = stats.totalOpened > 0 ? (stats.totalClicked / stats.totalOpened) * 100 : 0

    // Get recent campaigns
    const recentCampaigns = await Campaign.find()
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name status stats createdAt")
      .lean()

    res.json({
      success: true,
      data: {
        overview: {
          totalCampaigns,
          activeCampaigns,
          completedCampaigns,
        },
        performance: {
          ...stats,
          deliveryRate: Math.round(deliveryRate * 100) / 100,
          openRate: Math.round(openRate * 100) / 100,
          clickRate: Math.round(clickRate * 100) / 100,
        },
        recentCampaigns,
      },
    })
  } catch (error) {
    console.error("Campaign analytics error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch campaign analytics",
      error: error.message,
    })
  }
})

module.exports = router
