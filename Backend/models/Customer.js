const mongoose = require("mongoose")

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    totalSpending: {
      type: Number,
      default: 0,
      min: 0,
    },
    visits: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastPurchaseDate: {
      type: Date,
      default: null,
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "active",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    preferences: {
      emailMarketing: {
        type: Boolean,
        default: true,
      },
      smsMarketing: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
customerSchema.index({ email: 1 })
customerSchema.index({ totalSpending: -1 })
customerSchema.index({ lastPurchaseDate: -1 })
customerSchema.index({ visits: -1 })

module.exports = mongoose.model("Customer", customerSchema)
