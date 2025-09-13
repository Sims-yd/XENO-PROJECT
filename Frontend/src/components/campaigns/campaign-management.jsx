"use client"

import { useState, useEffect } from "react"
import { CampaignCreator } from "./campaign-creator"
import { CampaignHistory } from "./campaign-history"

export function CampaignManagement({ initialSegment = null }) {
  const [view, setView] = useState(initialSegment ? "create" : "history")
  const [selectedSegment, setSelectedSegment] = useState(initialSegment)
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: "Welcome Series",
      subject: "Welcome to our store!",
      message: "Hi {name}, welcome to our amazing store...",
      type: "email",
      segmentId: 1,
      segmentName: "New Customers",
      audienceSize: 2500,
      status: "sending",
      createdAt: "2025-01-10T10:00:00Z",
      deliveryStats: {
        sent: 1875,
        delivered: 1820,
        failed: 55,
        pending: 625,
      },
    },
    {
      id: 2,
      name: "Win-back Campaign",
      subject: "We miss you!",
      message: "Hi {name}, we noticed you haven't visited us...",
      type: "email",
      segmentId: 2,
      segmentName: "Inactive Users",
      audienceSize: 900,
      status: "completed",
      createdAt: "2025-01-09T14:30:00Z",
      deliveryStats: {
        sent: 856,
        delivered: 834,
        failed: 22,
        pending: 0,
      },
    },
    {
      id: 3,
      name: "Product Launch",
      subject: "New arrivals just for you",
      message: "Hello {name}, check out our latest products...",
      type: "email",
      segmentId: 3,
      segmentName: "High Value Customers",
      audienceSize: 1200,
      status: "draft",
      createdAt: "2025-01-08T09:15:00Z",
      deliveryStats: {
        sent: 0,
        delivered: 0,
        failed: 0,
        pending: 1200,
      },
    },
    {
      id: 4,
      name: "Holiday Promotion",
      subject: "Special holiday offers inside!",
      message: "Hi {name}, celebrate the holidays with us...",
      type: "email",
      segmentId: 4,
      segmentName: "Loyal Customers",
      audienceSize: 3400,
      status: "scheduled",
      createdAt: "2025-01-07T16:45:00Z",
      deliveryStats: {
        sent: 0,
        delivered: 0,
        failed: 0,
        pending: 3400,
      },
    },
  ])

  // Simulate real-time delivery updates for sending campaigns
  useEffect(() => {
    const interval = setInterval(() => {
      setCampaigns((prev) =>
        prev.map((campaign) => {
          if (campaign.status === "sending" && campaign.deliveryStats.pending > 0) {
            const batchSize = Math.min(50, campaign.deliveryStats.pending)
            const successRate = 0.92 // 92% success rate
            const successful = Math.floor(batchSize * successRate)
            const failed = batchSize - successful

            const newStats = {
              sent: campaign.deliveryStats.sent + successful,
              delivered: campaign.deliveryStats.delivered + successful,
              failed: campaign.deliveryStats.failed + failed,
              pending: campaign.deliveryStats.pending - batchSize,
            }

            return {
              ...campaign,
              deliveryStats: newStats,
              status: newStats.pending === 0 ? "completed" : "sending",
            }
          }
          return campaign
        }),
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const handleCampaignCreated = (newCampaign) => {
    setCampaigns((prev) => [newCampaign, ...prev])
    setView("history")

    // Start delivery simulation for immediate campaigns
    if (newCampaign.status === "sending") {
      setTimeout(() => {
        setCampaigns((prev) =>
          prev.map((campaign) => (campaign.id === newCampaign.id ? { ...campaign, status: "sending" } : campaign)),
        )
      }, 1000)
    }
  }

  const handleViewCampaign = (campaignId) => {
    console.log("View campaign details:", campaignId)
    // Could navigate to detailed campaign view
  }

  const handleCreateNew = () => {
    setSelectedSegment(null)
    setView("create")
  }

  const handleBackToHistory = () => {
    setView("history")
  }

  if (view === "create") {
    // Mock segment if none provided
    const segment = selectedSegment || {
      id: Date.now(),
      name: "Custom Segment",
      description: "Manually created segment",
      audienceSize: Math.floor(Math.random() * 5000) + 1000,
    }

    return <CampaignCreator segment={segment} onCampaignCreated={handleCampaignCreated} onBack={handleBackToHistory} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <CampaignHistory campaigns={campaigns} onViewCampaign={handleViewCampaign} onCreateNew={handleCreateNew} />
    </div>
  )
}
