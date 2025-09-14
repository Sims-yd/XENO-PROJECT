import { useState, useRef, useEffect } from "react"
import { Button } from "./components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { Badge } from "./components/ui/badge"
import { Target, BarChart3, Menu, Settings, LogOut, User, Bell, Search, X } from "lucide-react"
import { Sidebar } from "./components/layout/sidebar"
import { LoginPage } from "./components/auth/LoginPage"
import { AnalyticsDashboard } from "./components/analytics/AnalyticsDashboard"
import { SettingsDashboard } from "./components/settings/SettingsDashboard"
import { DashboardOverview } from "./components/dashboard/dashboard-overview"
import { SegmentBuilder } from "./components/segments/segment-builder"
import { CampaignManagement } from "./components/campaigns/campaign-management"
import { AuthProvider, useAuth } from "./hooks/useAuth.jsx"
import { useGoogleLogin } from "@react-oauth/google"

function AppContent() {
  const { user, loading, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [campaignSegment, setCampaignSegment] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const profileMenuRef = useRef(null)
  const searchContainerRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false)
      }
    }
    if (profileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [profileMenuOpen])

  // Update the click outside effect for search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearching(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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
                {/* Search input and button - visible on larger screens */}
                <div className="relative hidden sm:block search-container" ref={searchContainerRef}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search campaigns, segments..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearching(true)}
                      className="w-64 pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSearchQuery("")
                          setSearchResults([])
                        }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Search Results Dropdown */}
                  {isSearching && (
                    <div className="absolute mt-2 w-96 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden z-50">
                      <div className="max-h-96 overflow-y-auto">
                        {searchResults.length > 0 ? (
                          <div className="divide-y divide-slate-100">
                            {searchResults.map((result, index) => (
                              <button
                                key={index}
                                onClick={() => handleSearchResultClick(result)}
                                className="w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center gap-3"
                              >
                                {getResultIcon(result.type)}
                                <div>
                                  <p className="text-sm font-medium text-slate-900">{result.title}</p>
                                  <p className="text-xs text-slate-500">{result.description}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 text-center text-slate-500 text-sm">
                            {searchQuery ? "No results found" : "Type to search..."}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </Button>
                {/* Profile Icon with Dropdown */}
                <div className="relative" ref={profileMenuRef}>
                  <button
                    className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onClick={() => setProfileMenuOpen((open) => !open)}
                    aria-label="Profile menu"
                  >
                    {user.name.charAt(0)}
                  </button>
                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-50 animate-slide-in">
                      <ul className="py-2">
                        <li>
                          <button className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                            <User className="h-4 w-4 mr-2" />
                            Profile
                          </button>
                        </li>
                        <li>
                          <button className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                          </button>
                        </li>
                        <li>
                          <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            onClick={logout}
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
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
          {activeTab === "analytics" && <AnalyticsDashboard />}
          {activeTab === "settings" && <SettingsDashboard />}
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

