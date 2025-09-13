const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const authRoutes = require("./routes/auth")
const customerRoutes = require("./routes/customers")
const campaignRoutes = require("./routes/campaigns")
const orderRoutes = require("./routes/orders")
const segmentRoutes = require("./routes/segments")

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.error("MongoDB Connection Error:", err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/customers", customerRoutes)
app.use("/api/campaigns", campaignRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/segments", segmentRoutes)

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Xeno CRM Backend is running",
    timestamp: new Date().toISOString(),
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
})

