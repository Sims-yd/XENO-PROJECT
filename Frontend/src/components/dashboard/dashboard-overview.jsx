"use client"

import { useState, useEffect } from "react"
import { StatsCards } from "./stats-cards"
import { QuickActions } from "./quick-actions"
import { RecentCampaigns } from "./recent-campaigns"
import { customersAPI, ordersAPI, campaignsAPI } from "../../services/api"

export function DashboardOverview({ user, onNavigate }) {
  const [dashboardData, setDashboardData] = useState({
    customers: null,
    orders: null,
    campaigns: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setDashboardData((prev) => ({ ...prev, loading: true, error: null }))

        const [customersResponse, ordersResponse, campaignsResponse] = await Promise.allSettled([
          customersAPI.getAnalytics(),
          ordersAPI.getAnalytics(),
          campaignsAPI.getAnalytics(),
        ])

        // Process results with fallback data
        const processResult = (result, fallbackData) => {
          if (result.status === "fulfilled" && result.value?.success) {
            return result.value.data
          }
          console.warn("API call failed, using fallback data:", result.reason?.message)
          return fallbackData
        }

        setDashboardData({
          customers: processResult(customersResponse, {
            total: 0,
            newThisMonth: 0,
            activeCustomers: 0,
            averageOrderValue: 0,
          }),
          orders: processResult(ordersResponse, {
            total: 0,
            thisMonth: 0,
            revenue: 0,
            averageOrderValue: 0,
          }),
          campaigns: processResult(campaignsResponse, {
            total: 0,
            active: 0,
            recentCampaigns: [],
            totalSent: 0,
          }),
          loading: false,
          error: null,
        })
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
        setDashboardData((prev) => ({
          ...prev,
          loading: false,
          error: error.message,
        }))
      }
    }

    fetchDashboardData()

    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleQuickAction = (actionId) => {
    switch (actionId) {
      case "create-segment":
        onNavigate("segments")
        break
      case "launch-campaign":
        onNavigate("campaigns")
        break
      case "view-analytics":
        onNavigate("analytics")
        break
      case "manage-customers":
        console.log("Navigate to customers")
        break
      default:
        console.log("Unknown action:", actionId)
    }
  }


  const handleViewCampaign = (campaignId) => {
    console.log("View campaign:", campaignId)
    onNavigate("campaigns")
  }

  const handleEditCampaign = (campaignId) => {
    console.log("Edit campaign:", campaignId)
    onNavigate("campaigns", { view: "edit", campaignId })
  }

  if (dashboardData.loading && !dashboardData.customers) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-2"></div>
          <div className="h-6 bg-slate-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-slate-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (dashboardData.error) {
    return (
      <div className="space-y-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Failed to load dashboard data</h3>
          <p className="text-red-600 text-sm mt-1">{dashboardData.error}</p>
          <div className="mt-3 space-x-2">
            <button
              onClick={() => window.location.reload()}
              className="text-red-700 underline text-sm hover:text-red-800"
            >
              Retry
            </button>
            <span className="text-red-400">•</span>
            <button
              onClick={() => {
                localStorage.removeItem("auth_token")
                window.location.reload()
              }}
              className="text-red-700 underline text-sm hover:text-red-800"
            >
              Re-login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="animate-slide-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome back, {user?.name?.split(" ")[0] || "there"}! 👋
            </h1>
            <p className="text-slate-600 text-lg">Here's what's happening with your campaigns today.</p>
            {dashboardData.loading && (
              <div className="flex items-center gap-2 mt-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-500">Updating data...</span>
              </div>
            )}
          </div>
          <div className="hidden sm:block">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="animate-slide-in" style={{ animationDelay: "100ms" }}>
        <StatsCards data={dashboardData} />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8 animate-slide-in" style={{ animationDelay: "200ms" }}>
        {/* Quick Actions - Takes 1 column */}
        <div className="lg:col-span-1">
          <QuickActions onAction={handleQuickAction} />
        </div>

        {/* Recent Campaigns - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentCampaigns
            onViewCampaign={handleViewCampaign}
            onEditCampaign={handleEditCampaign}
            onViewAll={() => onNavigate("campaigns")}
            campaigns={dashboardData.campaigns?.recentCampaigns || []}
          />
        </div>
      </div>
    </div>
  )
}
