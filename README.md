# Xeno CRM - Smart Customer Management Platform

A modern, full-stack Customer Relationship Management (CRM) system built with React and Node.js, designed for intelligent customer segmentation and targeted marketing campaigns.

## 🚀 Features

### Customer Management
- **Customer Database**: Comprehensive customer profiles with purchase history, engagement metrics, and behavioral data
- **Real-time Analytics**: Track customer lifetime value, purchase patterns, and engagement metrics
- **Data Import/Export**: Bulk customer data management capabilities

### Intelligent Segmentation
- **Dynamic Segments**: Create customer segments using flexible rule-based criteria
- **AI-Powered Insights**: Automatic segment analysis with actionable recommendations
- **Behavioral Targeting**: Segment customers based on purchase history, spending patterns, and engagement
- **Real-time Preview**: See segment size and sample customers before finalizing

### Campaign Management
- **Multi-Channel Campaigns**: Email, SMS, and push notification support
- **Personalized Messaging**: Dynamic content with customer name and data personalization
- **AI Message Suggestions**: Smart content recommendations based on segment characteristics
- **Scheduling & Automation**: Send immediately or schedule for optimal timing
- **Real-time Tracking**: Monitor delivery rates, open rates, and click-through rates

### Analytics Dashboard
- **Performance Metrics**: Comprehensive campaign and customer analytics
- **Visual Reports**: Interactive charts and graphs for data visualization
- **ROI Tracking**: Monitor campaign effectiveness and revenue attribution
- **Trend Analysis**: Historical data analysis and predictive insights

### User Experience
- **Modern UI/UX**: Clean, responsive design with gradient aesthetics
- **Real-time Updates**: Live campaign delivery status and analytics
- **Mobile Responsive**: Optimized for desktop, tablet, and mobile devices
- **Role-based Access**: Secure user authentication and authorization

## 🛠️ Technology Stack

### Frontend
- **React 18** with Hooks and Context API
- **Vite** for fast development and building
- **Tailwind CSS** for modern, responsive styling
- **Lucide React** for consistent iconography
- **Custom UI Components** for cohesive design system

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT Authentication** for secure user sessions
- **Express Validator** for input validation
- **RESTful API** architecture

### Development Tools
- **ESLint** for code quality
- **PostCSS** for CSS processing
- **Git** for version control
- **Environment configuration** for multiple deployment environments

## 📁 Project Structure

```
XENO-PROJECT/
├── Frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── analytics/   # Analytics and reporting components
│   │   │   ├── auth/        # Authentication components
│   │   │   ├── campaigns/   # Campaign management UI
│   │   │   ├── dashboard/   # Dashboard and overview components
│   │   │   ├── segments/    # Customer segmentation UI
│   │   │   ├── settings/    # User settings and preferences
│   │   │   └── ui/          # Base UI components
│   │   ├── contexts/        # React context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service layer
│   │   └── lib/             # Utility functions
│   └── public/              # Static assets
├── Backend/                 # Node.js backend API
│   ├── config/              # Database and app configuration
│   ├── middleware/          # Express middleware
│   ├── models/              # MongoDB data models
│   ├── routes/              # API route definitions
│   └── scripts/             # Database seeding and setup scripts
└── README.md

```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/xeno-project.git
   cd xeno-project
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   
   # Create environment file
   cp .env.example .env
   # Edit .env with your MongoDB connection string and JWT secret
   
   # Run database setup and seed data
   npm run setup
   npm run seed
   
   # Start the backend server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd Frontend
   npm install
   
   # Create environment file
   cp .env.example .env
   # Configure API URL (default: http://localhost:5000)
   
   # Start the frontend development server
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Default admin login: admin@xeno-crm.com / admin123

## 🎯 Usage Examples

### Creating Customer Segments
1. Navigate to the Segments section
2. Use the natural language input: "Customers who spent more than $1000 in the last 6 months"
3. Review the auto-generated rules and preview the segment
4. Save the segment for campaign targeting

### Launching Marketing Campaigns
1. Select a customer segment
2. Choose campaign type (Email/SMS/Push)
3. Create personalized messaging with dynamic fields
4. Schedule for immediate delivery or future sending
5. Monitor real-time delivery and engagement metrics

### Analyzing Performance
1. View the analytics dashboard for overview metrics
2. Drill down into specific campaign performance
3. Analyze customer behavior and segment effectiveness
4. Export reports for external analysis

## 🔧 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Customer Management
- `GET /api/customers` - List customers with filtering
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Campaign Operations
- `GET /api/campaigns` - List campaigns
- `POST /api/campaigns` - Create campaign
- `PUT /api/campaigns/:id` - Update campaign
- `POST /api/campaigns/:id/start` - Start campaign
- `POST /api/campaigns/:id/pause` - Pause campaign

### Segmentation
- `POST /api/segments/parse` - Parse natural language segment description
- `POST /api/segments/preview` - Preview segment results
- `GET /api/segments/analytics` - Get segment analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies for optimal performance
- Designed with user experience and scalability in mind
- Inspired by leading CRM platforms with enhanced AI capabilities