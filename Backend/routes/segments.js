const express = require("express")
const { body, validationResult } = require("express-validator")
const Customer = require("../models/Customer")
const { authenticateToken } = require("../middleware/auth")

const router = express.Router()

// Apply authentication to all routes
router.use(authenticateToken)

// AI-powered natural language to rules conversion
router.post(
  "/ai/parse-description",
  [body("description").trim().isLength({ min: 5 }).withMessage("Description must be at least 5 characters")],
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

      const { description } = req.body

      // Simple AI simulation - parse common patterns
      const rules = []
      const lowerDesc = description.toLowerCase()

      // Parse spending patterns
      const spendingMatch = lowerDesc.match(/spent?\s+(more than|over|above|>)\s*₹?(\d+)/i)
      if (spendingMatch) {
        rules.push({
          field: "totalSpending",
          operator: ">",
          value: Number.parseInt(spendingMatch[2]),
          logic: "AND",
        })
      }

      const spendingLessMatch = lowerDesc.match(/spent?\s+(less than|under|below|<)\s*₹?(\d+)/i)
      if (spendingLessMatch) {
        rules.push({
          field: "totalSpending",
          operator: "<",
          value: Number.parseInt(spendingLessMatch[2]),
          logic: "AND",
        })
      }

      // Parse visit patterns
      const visitsMatch = lowerDesc.match(/visited?\s+(more than|over|>)\s*(\d+)/i)
      if (visitsMatch) {
        rules.push({
          field: "visits",
          operator: ">",
          value: Number.parseInt(visitsMatch[2]),
          logic: "AND",
        })
      }

      // Parse inactivity patterns
      const inactiveMatch = lowerDesc.match(/inactive\s+for\s+(\d+)\s+days?/i)
      if (inactiveMatch) {
        const daysAgo = new Date()
        daysAgo.setDate(daysAgo.getDate() - Number.parseInt(inactiveMatch[1]))
        rules.push({
          field: "lastPurchaseDate",
          operator: "<",
          value: daysAgo.toISOString().split("T")[0],
          logic: "AND",
        })
      }

      // Parse "haven't ordered" patterns
      const noOrderMatch = lowerDesc.match(/haven't\s+ordered\s+in\s+(\d+)\s+days?/i)
      if (noOrderMatch) {
        const daysAgo = new Date()
        daysAgo.setDate(daysAgo.getDate() - Number.parseInt(noOrderMatch[1]))
        rules.push({
          field: "lastPurchaseDate",
          operator: "<",
          value: daysAgo.toISOString().split("T")[0],
          logic: "AND",
        })
      }

      // Parse new customer patterns
      if (lowerDesc.includes("new customer") || lowerDesc.includes("recently joined")) {
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        rules.push({
          field: "registrationDate",
          operator: ">",
          value: thirtyDaysAgo.toISOString().split("T")[0],
          logic: "AND",
        })
      }

      // Parse high-value customer patterns
      if (lowerDesc.includes("high-value") || lowerDesc.includes("premium")) {
        rules.push({
          field: "totalSpending",
          operator: ">",
          value: 50000,
          logic: "AND",
        })
      }

      // If no rules were parsed, provide a default suggestion
      if (rules.length === 0) {
        rules.push({
          field: "totalSpending",
          operator: ">",
          value: 1000,
          logic: "AND",
        })
      }

      res.json({
        success: true,
        message: "Description parsed successfully",
        data: {
          originalDescription: description,
          parsedRules: rules,
          confidence: rules.length > 0 ? 0.8 : 0.3,
        },
      })
    } catch (error) {
      console.error("AI parse description error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to parse description",
        error: error.message,
      })
    }
  },
)

// Get segment insights
router.post("/insights", [body("rules").isArray().withMessage("Rules must be an array")], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    const { rules } = req.body

    // Get total customer count for comparison
    const totalCustomers = await Customer.countDocuments({ status: "active" })

    // Calculate segment size (reuse logic from campaigns)
    const evaluateRules = async (rules) => {
      if (!rules || rules.length === 0) {
        return await Customer.find({ status: "active" })
      }

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

        const query = { status: "active" }
        if (conditions.length > 0) {
          query.$and = conditions
        }

        return query
      }

      const query = buildQuery(rules)
      return await Customer.find(query)
    }

    const segmentCustomers = await evaluateRules(rules)
    const segmentSize = segmentCustomers.length

    // Calculate segment statistics
    const segmentStats = {
      totalSpending: 0,
      averageSpending: 0,
      totalVisits: 0,
      averageVisits: 0,
    }

    if (segmentCustomers.length > 0) {
      segmentStats.totalSpending = segmentCustomers.reduce((sum, customer) => sum + customer.totalSpending, 0)
      segmentStats.averageSpending = segmentStats.totalSpending / segmentCustomers.length
      segmentStats.totalVisits = segmentCustomers.reduce((sum, customer) => sum + customer.visits, 0)
      segmentStats.averageVisits = segmentStats.totalVisits / segmentCustomers.length
    }

    // Generate insights
    const insights = []
    const percentage = totalCustomers > 0 ? (segmentSize / totalCustomers) * 100 : 0

    if (percentage > 50) {
      insights.push("This segment represents a large portion of your customer base")
    } else if (percentage > 20) {
      insights.push("This is a moderately sized segment with good reach potential")
    } else if (percentage > 5) {
      insights.push("This is a focused segment ideal for targeted campaigns")
    } else {
      insights.push("This is a highly specific segment with limited reach")
    }

    if (segmentStats.averageSpending > 10000) {
      insights.push("High-value customers with strong purchasing power")
    } else if (segmentStats.averageSpending > 5000) {
      insights.push("Medium-value customers with moderate spending")
    } else {
      insights.push("Budget-conscious customers with lower spending")
    }

    if (segmentStats.averageVisits > 10) {
      insights.push("Highly engaged customers with frequent visits")
    } else if (segmentStats.averageVisits > 5) {
      insights.push("Moderately engaged customers")
    } else {
      insights.push("Low engagement customers who may need re-activation")
    }

    res.json({
      success: true,
      data: {
        segmentSize,
        totalCustomers,
        percentage: Math.round(percentage * 100) / 100,
        statistics: {
          totalSpending: Math.round(segmentStats.totalSpending),
          averageSpending: Math.round(segmentStats.averageSpending),
          totalVisits: segmentStats.totalVisits,
          averageVisits: Math.round(segmentStats.averageVisits * 100) / 100,
        },
        insights,
        sampleCustomers: segmentCustomers.slice(0, 5).map((customer) => ({
          _id: customer._id,
          name: customer.name,
          email: customer.email,
          totalSpending: customer.totalSpending,
          visits: customer.visits,
          lastPurchaseDate: customer.lastPurchaseDate,
        })),
      },
    })
  } catch (error) {
    console.error("Segment insights error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to generate segment insights",
      error: error.message,
    })
  }
})

module.exports = router
