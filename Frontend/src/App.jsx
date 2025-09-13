import { useState } from "react"
import { Button } from "./components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { Badge } from "./components/ui/badge"
import { Target, BarChart3, Menu, Settings, Bell, Search } from "lucide-react"
import { Sidebar } from "./components/layout/sidebar"
import { DashboardOverview } from "./components/dashboard/dashboard-overview"
import { SegmentBuilder } from "./components/segments/segment-builder"
import { CampaignManagement } from "./components/campaigns/campaign-management"
import { AuthProvider, useAuth } from "./hooks/useAuth.jsx"

function AppContent() {
  const { user, loading } = useAuth()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [campaignSegment, setCampaignSegment] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setSidebarOpen(false)
    if (tab !== "campaigns") {
      setCampaignSegment(null)
    }
  }

  const handleSegmentSaved = (segment) => {
    setCampaignSegment(segment)
    setActiveTab("campaigns")
  }

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show login page if user is not authenticated
  if (!user) {
    return <LoginPage />
  }

  // Show main application with sidebar
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Mobile menu overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <Sidebar
        user={user}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                  <Menu className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">
                    {activeTab === "dashboard" && "Dashboard"}
                    {activeTab === "segments" && "Audience Segments"}
                    {activeTab === "campaigns" && "Campaign Management"}
                    {activeTab === "analytics" && "Analytics & Reports"}
                    {activeTab === "settings" && "Settings"}
                  </h1>
                  <p className="text-sm text-slate-600 hidden sm:block">
                    {activeTab === "dashboard" && "Overview of your CRM performance"}
                    {activeTab === "segments" && "Create and manage customer segments"}
                    {activeTab === "campaigns" && "Design and launch marketing campaigns"}
                    {activeTab === "analytics" && "Track performance and insights"}
                    {activeTab === "settings" && "Manage your account and preferences"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </Button>
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                  {user.name.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="p-4 sm:p-6 lg:p-8">
          {activeTab === "dashboard" && <DashboardOverview user={user} onNavigate={handleTabChange} />}
          {activeTab === "segments" && <SegmentBuilder onSegmentSaved={handleSegmentSaved} />}
          {activeTab === "campaigns" && <CampaignManagement initialSegment={campaignSegment} />}
          {activeTab === "analytics" && <AnalyticsPlaceholder onNavigate={handleTabChange} />}
          {activeTab === "settings" && <SettingsPlaceholder />}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

function LoginPage() {
  const { login, register, googleLogin, error } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let result
      if (isRegister) {
        result = await register(formData.name, formData.email, formData.password)
      } else {
        result = await login(formData.email, formData.password)
      }

      if (!result.success) {
        console.error("Authentication failed:", result.error)
      }
    } catch (error) {
      console.error("Authentication error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    // Simulate Google OAuth - in real app, use Google OAuth library
    setTimeout(async () => {
      try {
        const mockGoogleData = {
          googleId: "123456789",
          email: "demo@example.com",
          name: "Demo User",
          avatar: "",
        }
        await googleLogin(mockGoogleData)
      } catch (error) {
        console.error("Google login error:", error)
      } finally {
        setIsLoading(false)
      }
    }, 2000)
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated background elements - lighter colors */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-48 h-48 bg-pink-100/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <img src="/src/assets/logo.png" alt="App Logo" className="h-8 w-8" />
              <div>
                <span className="text-2xl font-bold text-slate-800">Xeno CRM</span>
                <p className="text-blue-500 text-sm">Smart Customer Management</p>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-blue-300 to-indigo-300 text-white border-0">Hackathon 2025</Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-800 mb-4">{isRegister ? "Create Account" : "Welcome Back"}</h1>
              <p className="text-blue-600">
                {isRegister ? "Join Xeno CRM to manage your customers" : "Sign in to your Xeno CRM account"}
              </p>
            </div>

            {/* Login/Register Form */}
            <Card className="bg-white/80 backdrop-blur-sm border-slate-100 shadow-md">
              <CardContent className="p-6">
                {error && (
                  <div className="bg-red-100 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {isRegister && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-300 to-indigo-300 hover:from-blue-400 hover:to-indigo-400 text-white py-3 font-semibold"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {isRegister ? "Creating Account..." : "Signing In..."}
                      </div>
                    ) : isRegister ? (
                      "Create Account"
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-transparent text-slate-400">Or continue with</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full mt-4 bg-white hover:bg-blue-50 text-slate-800 border border-slate-200"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 border-2 border-blue-200 border-t-blue-400 rounded-full animate-spin" />
                        Connecting...
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        Continue with Google
                      </div>
                    )}
                  </Button>
                </div>

                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => setIsRegister(!isRegister)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {isRegister ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Demo Credentials */}
            <Card className="mt-4 bg-white/60 backdrop-blur-sm border-slate-100 shadow-sm">
              <CardContent className="p-4">
                <p className="text-sm text-blue-600 text-center">
                  <strong>Demo Credentials:</strong>
                  <br />
                  Email: admin@xeno-crm.com
                  <br />
                  Password: admin123
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

// Analytics placeholder with better design
function AnalyticsPlaceholder({ onNavigate }) {
  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <div className="h-20 w-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <img src="/public/logo.png" alt="App Logo" className="h-16 w-16" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Analytics Dashboard</h2>
        <p className="text-slate-600 mb-8">
          Advanced analytics and reporting features coming soon. Track campaign performance, customer insights, and ROI
          metrics.
        </p>
        <Button
          onClick={() => onNavigate("dashboard")}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  )
}

// Settings placeholder
function SettingsPlaceholder() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-slate-600" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">Manage your profile, preferences, and account security.</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-slate-600" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">Configure email and push notification preferences.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
