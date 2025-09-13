const express = require("express")
const jwt = require("jsonwebtoken")
const { body, validationResult } = require("express-validator")
const User = require("../models/User")
const { authenticateToken } = require("../middleware/auth")

const router = express.Router()

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  })
}

// Register new user
router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
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

      const { name, email, password } = req.body

      // Check if user already exists
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists with this email",
        })
      }

      // Create new user
      const user = new User({
        name,
        email,
        password,
      })

      await user.save()

      // Generate token
      const token = generateToken(user._id)

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user: user.toJSON(),
          token,
        },
      })
    } catch (error) {
      console.error("Register error:", error)
      res.status(500).json({
        success: false,
        message: "Registration failed",
        error: error.message,
      })
    }
  },
)

// Login user
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
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

      const { email, password } = req.body

      // Find user and include password for comparison
      const user = await User.findOne({ email }).select("+password")
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        })
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password)
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        })
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: "Account is deactivated",
        })
      }

      // Update last login
      user.lastLogin = new Date()
      await user.save()

      // Generate token
      const token = generateToken(user._id)

      res.json({
        success: true,
        message: "Login successful",
        data: {
          user: user.toJSON(),
          token,
        },
      })
    } catch (error) {
      console.error("Login error:", error)
      res.status(500).json({
        success: false,
        message: "Login failed",
        error: error.message,
      })
    }
  },
)

// Google OAuth callback (simplified)
router.post("/google", async (req, res) => {
  try {
    const { googleId, email, name, avatar } = req.body

    if (!googleId || !email || !name) {
      return res.status(400).json({
        success: false,
        message: "Missing required Google OAuth data",
      })
    }

    // Check if user exists
    let user = await User.findOne({
      $or: [{ email }, { googleId }],
    })

    if (user) {
      // Update existing user
      user.googleId = googleId
      user.avatar = avatar || user.avatar
      user.lastLogin = new Date()
      await user.save()
    } else {
      // Create new user
      user = new User({
        name,
        email,
        googleId,
        avatar,
      })
      await user.save()
    }

    // Generate token
    const token = generateToken(user._id)

    res.json({
      success: true,
      message: "Google OAuth successful",
      data: {
        user: user.toJSON(),
        token,
      },
    })
  } catch (error) {
    console.error("Google OAuth error:", error)
    res.status(500).json({
      success: false,
      message: "Google OAuth failed",
      error: error.message,
    })
  }
})

// Get current user profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user,
      },
    })
  } catch (error) {
    console.error("Profile error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    })
  }
})

// Update user profile
router.put(
  "/profile",
  authenticateToken,
  [
    body("name").optional().trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("email").optional().isEmail().normalizeEmail().withMessage("Please provide a valid email"),
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

      const { name, email, avatar } = req.body
      const user = req.user

      // Check if email is already taken by another user
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: "Email already taken by another user",
          })
        }
      }

      // Update user fields
      if (name) user.name = name
      if (email) user.email = email
      if (avatar) user.avatar = avatar

      await user.save()

      res.json({
        success: true,
        message: "Profile updated successfully",
        data: {
          user: user.toJSON(),
        },
      })
    } catch (error) {
      console.error("Profile update error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to update profile",
        error: error.message,
      })
    }
  },
)

// Logout (client-side token removal, but we can track it)
router.post("/logout", authenticateToken, async (req, res) => {
  try {
    // In a more complex setup, you might want to blacklist the token
    // For now, we'll just send a success response
    res.json({
      success: true,
      message: "Logged out successfully",
    })
  } catch (error) {
    console.error("Logout error:", error)
    res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message,
    })
  }
})

// Verify token endpoint
router.get("/verify", authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Token is valid",
      data: {
        user: req.user,
      },
    })
  } catch (error) {
    console.error("Token verification error:", error)
    res.status(500).json({
      success: false,
      message: "Token verification failed",
      error: error.message,
    })
  }
})

module.exports = router
