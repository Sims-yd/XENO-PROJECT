const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")
const User = require("../models/User")
const Customer = require("../models/Customer")
const Order = require("../models/Order")
const Campaign = require("../models/Campaign")

dotenv.config()

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/xeno-crm")
    console.log("Connected to MongoDB")

    // Clear existing data
    await User.deleteMany({})
    await Customer.deleteMany({})
    await Order.deleteMany({})
    await Campaign.deleteMany({})
    console.log("Cleared existing data")

    // Create admin user
    const adminUser = new User({
      name: "Admin User",
      email: "admin@xeno-crm.com",
      password: "admin123",
      role: "admin",
    })
    await adminUser.save()
    console.log("Created admin user")

    // Create sample customers
    const customers = []
    const customerNames = [
      "Rajesh Kumar",
      "Priya Sharma",
      "Amit Patel",
      "Sneha Gupta",
      "Vikram Singh",
      "Anita Verma",
      "Rohit Agarwal",
      "Kavya Reddy",
      "Suresh Nair",
      "Meera Joshi",
      "Arjun Mehta",
      "Divya Iyer",
      "Karan Malhotra",
      "Ritu Bansal",
      "Sanjay Rao",
      "Pooja Saxena",
      "Nikhil Jain",
      "Shreya Kapoor",
      "Manish Tiwari",
      "Nisha Agrawal",
    ]

    for (let i = 0; i < customerNames.length; i++) {
      const name = customerNames[i]
      const email = `${name.toLowerCase().replace(" ", ".")}@example.com`
      const registrationDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000) // Random date in last year

      const customer = new Customer({
        name,
        email,
        phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        totalSpending: Math.floor(Math.random() * 100000),
        visits: Math.floor(Math.random() * 50) + 1,
        lastPurchaseDate: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000), // Random date in last 6 months
        registrationDate,
        status: Math.random() > 0.1 ? "active" : "inactive", // 90% active
        tags: ["customer", Math.random() > 0.5 ? "premium" : "regular"],
        address: {
          city: ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Pune", "Hyderabad"][
            Math.floor(Math.random() * 7)
          ],
          state: "India",
          country: "India",
        },
      })

      await customer.save()
      customers.push(customer)
    }
    console.log(`Created ${customers.length} customers`)

    // Create sample orders
    const orders = []
    const productNames = [
      "Smartphone",
      "Laptop",
      "Headphones",
      "Watch",
      "Tablet",
      "Camera",
      "Speaker",
      "Keyboard",
      "Mouse",
      "Monitor",
    ]

    for (let i = 0; i < 50; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)]
      const numItems = Math.floor(Math.random() * 3) + 1
      const items = []
      let totalAmount = 0

      for (let j = 0; j < numItems; j++) {
        const productName = productNames[Math.floor(Math.random() * productNames.length)]
        const quantity = Math.floor(Math.random() * 3) + 1
        const price = Math.floor(Math.random() * 50000) + 1000
        const total = quantity * price

        items.push({
          productName,
          quantity,
          price,
          total,
        })
        totalAmount += total
      }

      const order = new Order({
        customerId: customer._id,
        items,
        totalAmount,
        status: ["pending", "confirmed", "shipped", "delivered", "cancelled"][Math.floor(Math.random() * 5)],
        paymentStatus: ["pending", "paid", "failed"][Math.floor(Math.random() * 3)],
        paymentMethod: ["credit_card", "debit_card", "upi", "net_banking"][Math.floor(Math.random() * 4)],
        orderDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Random date in last 3 months
      })

      await order.save()
      orders.push(order)
    }
    console.log(`Created ${orders.length} orders`)

    // Create sample campaigns
    const campaigns = [
      {
        name: "Welcome New Customers",
        description: "Welcome campaign for new customers",
        type: "email",
        status: "completed",
        message: {
          subject: "Welcome to our store!",
          content: "Thank you for joining us. Enjoy 10% off your first purchase!",
        },
        audienceRules: [
          {
            field: "registrationDate",
            operator: ">",
            value: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            logic: "AND",
          },
        ],
        stats: {
          sent: 156,
          delivered: 148,
          opened: 89,
          clicked: 23,
          failed: 8,
        },
        createdBy: adminUser._id,
      },
      {
        name: "High Spender Appreciation",
        description: "Thank high-value customers",
        type: "email",
        status: "completed",
        message: {
          subject: "Thank you for being a valued customer",
          content: "We appreciate your loyalty. Here's a special 15% discount just for you!",
        },
        audienceRules: [
          {
            field: "totalSpending",
            operator: ">",
            value: 50000,
            logic: "AND",
          },
        ],
        stats: {
          sent: 45,
          delivered: 44,
          opened: 32,
          clicked: 12,
          failed: 1,
        },
        createdBy: adminUser._id,
      },
      {
        name: "Win Back Inactive Customers",
        description: "Re-engage customers who haven't purchased recently",
        type: "email",
        status: "draft",
        message: {
          subject: "We miss you! Come back for exclusive offers",
          content: "It's been a while since your last purchase. Here's 20% off to welcome you back!",
        },
        audienceRules: [
          {
            field: "lastPurchaseDate",
            operator: "<",
            value: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            logic: "AND",
          },
        ],
        createdBy: adminUser._id,
      },
    ]

    for (const campaignData of campaigns) {
      const campaign = new Campaign(campaignData)
      await campaign.save()
    }
    console.log(`Created ${campaigns.length} campaigns`)

    console.log("✅ Seed data created successfully!")
    console.log("Admin login: admin@xeno-crm.com / admin123")

    process.exit(0)
  } catch (error) {
    console.error("❌ Seed data creation failed:", error)
    process.exit(1)
  }
}

seedData()
