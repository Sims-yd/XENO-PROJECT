const mongoose = require("mongoose")

const campaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["email", "sms", "push"],
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "scheduled", "running", "completed", "paused", "cancelled"],
      default: "draft",
    },
    message: {
      subject: String,
      content: {
        type: String,
        required: true,
      },
      template: String,
    },
    audienceRules: [
      {
        field: {
          type: String,
          required: true,
        },
        operator: {
          type: String,
          required: true,
          enum: [">", "<", ">=", "<=", "=", "!=", "contains", "not_contains"],
        },
        value: {
          type: mongoose.Schema.Types.Mixed,
          required: true,
        },
        logic: {
          type: String,
          enum: ["AND", "OR"],
          default: "AND",
        },
      },
    ],
    audienceSize: {
      type: Number,
      default: 0,
    },
    scheduledAt: {
      type: Date,
    },
    sentAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    stats: {
      sent: {
        type: Number,
        default: 0,
      },
      delivered: {
        type: Number,
        default: 0,
      },
      opened: {
        type: Number,
        default: 0,
      },
      clicked: {
        type: Number,
        default: 0,
      },
      failed: {
        type: Number,
        default: 0,
      },
      unsubscribed: {
        type: Number,
        default: 0,
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
campaignSchema.index({ status: 1 })
campaignSchema.index({ createdAt: -1 })
campaignSchema.index({ createdBy: 1 })

module.exports = mongoose.model("Campaign", campaignSchema)
