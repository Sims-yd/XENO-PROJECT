const mongoose = require("mongoose")
const dotenv = require("dotenv")
const User = require("../models/User")
const Customer = require("../models/Customer")
const Order = require("../models/Order")
const Campaign = require("../models/Campaign")

dotenv.config()

const setupDatabase = async () => {
  try {
    console.log("🚀 Starting database setup...")

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("✅ Connected to MongoDB")

    // Clear existing data
    console.log("🧹 Clearing existing data...")
    await User.deleteMany({})
    await Customer.deleteMany({})
    await Order.deleteMany({})
    await Campaign.deleteMany({})

    // Create admin user
    console.log("👤 Creating admin user...")
    const adminUser = new User({
      name: "Admin User",
      email: "admin@xeno-crm.com",
      password: "admin123",
      role: "admin",
    })
    await adminUser.save()
    console.log("✅ Admin user created: admin@xeno-crm.com / admin123")

    // Create sample customers
    console.log("👥 Creating sample customers...")
    const customers = []
    const customerData = [
      { name: "John Doe", email: "john@example.com", phone: "+1234567890", totalSpent: 1250.5, orderCount: 5 },
      { name: "Jane Smith", email: "jane@example.com", phone: "+1234567891", totalSpent: 890.25, orderCount: 3 },
      { name: "Bob Johnson", email: "bob@example.com", phone: "+1234567892", totalSpent: 2100.75, orderCount: 8 },
      { name: "Alice Brown", email: "alice@example.com", phone: "+1234567893", totalSpent: 450.0, orderCount: 2 },
      { name: "Charlie Wilson", email: "charlie@example.com", phone: "+1234567894", totalSpent: 1800.3, orderCount: 6 },
    ]

    for (const data of customerData) {
      const customer = new Customer({
        ...data,
        userId: adminUser._id,
        lastOrderDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      })
      await customer.save()
      customers.push(customer)
    }
    console.log(`✅ Created ${customers.length} sample customers`)

    // Create sample orders
    console.log("📦 Creating sample orders...")
    const orders = []
    for (const customer of customers) {
      for (let i = 0; i < customer.orderCount; i++) {
        const order = new Order({
          customerId: customer._id,
          userId: adminUser._id,
          orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          amount: Math.random() * 500 + 50,
          status: ["pending", "completed", "shipped", "delivered"][Math.floor(Math.random() * 4)],
          items: [
            {
              name: `Product ${i + 1}`,
              quantity: Math.floor(Math.random() * 3) + 1,
              price: Math.random() * 100 + 20,
            },
          ],
          orderDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
        })
        await order.save()
        orders.push(order)
      }
    }
    console.log(`✅ Created ${orders.length} sample orders`)

    // Create sample campaigns
    console.log("📢 Creating sample campaigns...")
    const campaigns = [
      {
        name: "Welcome New Customers",
        description: "Welcome email series for new customers",
        type: "email",
        status: "running",
        audienceRules: [
          {
            field: "orderCount",
            operator: "=",
            value: 1
          }
        ],
        message: {
          subject: "Welcome to our store!",
          content: "Welcome to our store! Here's a 10% discount on your next purchase."
        },
      },
      {
        name: "High Value Customer Retention",
        description: "Special offers for high-value customers",
        type: "email",
        status: "completed",
        audienceRules: [
          {
            field: "totalSpent",
            operator: ">",
            value: 1000
          }
        ],
        message: {
          subject: "Exclusive offer for you",
          content: "Thank you for being a valued customer! Enjoy exclusive access to our premium collection."
        },
      },
      {
        name: "Win Back Inactive Customers",
        description: "Re-engagement campaign for inactive customers",
        type: "email",
        status: "draft",
        audienceRules: [
          {
            field: "lastOrderDate",
            operator: "<",
            value: 30
          }
        ],
        message: {
          subject: "We miss you!",
          content: "We miss you! Come back and get 15% off your next order."
        },
      },
    ]

    for (const campaignData of campaigns) {
      const campaign = new Campaign({
        ...campaignData,
        createdBy: adminUser._id,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      })
      await campaign.save()
    }
    console.log(`✅ Created ${campaigns.length} sample campaigns`)

    console.log("🎉 Database setup completed successfully!")
    console.log("\n📋 Summary:")
    console.log(`- Admin user: admin@xeno-crm.com / admin123`)
    console.log(`- Customers: ${customers.length}`)
    console.log(`- Orders: ${orders.length}`)
    console.log(`- Campaigns: ${campaigns.length}`)
    console.log("\n🚀 You can now start the backend server with: npm start")
  } catch (error) {
    console.error("❌ Setup failed:", error)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log("🔌 Disconnected from MongoDB")
    process.exit(0)
  }
}

setupDatabase()

