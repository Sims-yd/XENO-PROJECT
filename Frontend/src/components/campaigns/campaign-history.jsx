"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { MessageSquare, Search, Eye, MoreHorizontal, Users, TrendingUp, Clock } from "lucide-react"
import { Edit } from "lucide-react"
import { CampaignCardSkeleton } from "../ui/loading-skeleton"

export function CampaignHistory({ campaigns, onViewCampaign, onEditCampaign, onCreateNew }) {
  const [filteredCampaigns, setFilteredCampaigns] = useState(campaigns)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let filtered = [...campaigns]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (campaign) =>
          campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          campaign.segmentName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((campaign) => campaign.status === statusFilter)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt)
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt)
        case "name":
          return a.name.localeCompare(b.name)
        case "audience":
          return b.audienceSize - a.audienceSize
        default:
          return 0
      }
    })

    setFilteredCampaigns(filtered)
  }, [campaigns, searchTerm, statusFilter, sortBy])

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "default"
      case "sending":
        return "default"
      case "scheduled":
        return "secondary"
      case "draft":
        return "outline"
      case "failed":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return "✅"
      case "sending":
        return "📤"
      case "scheduled":
        return "⏰"
      case "draft":
        return "📝"
      case "failed":
        return "❌"
      default:
        return "⚪"
    }
  }

  const calculateSuccessRate = (stats) => {
    const total = stats.sent + stats.failed
    return total > 0 ? ((stats.sent / total) * 100).toFixed(1) : 0
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
            Campaign History
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">Track and manage all your marketing campaigns</p>
        </div>
        <Button onClick={onCreateNew} className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto">
          Create New Campaign
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          {
            title: "Total Campaigns",
            value: campaigns.length,
            icon: MessageSquare,
            color: "text-accent",
          },
          {
            title: "Active Campaigns",
            value: campaigns.filter((c) => c.status === "sending" || c.status === "scheduled").length,
            icon: Clock,
            color: "text-blue-500",
          },
          {
            title: "Total Sent",
            value: campaigns.reduce((sum, c) => sum + c.deliveryStats.sent, 0).toLocaleString(),
            icon: TrendingUp,
            color: "text-green-500",
          },
          {
            title: "Avg Success Rate",
            value: `${(campaigns.reduce((sum, c) => sum + Number.parseFloat(calculateSuccessRate(c.deliveryStats)), 0) / campaigns.length || 0).toFixed(1)}%`,
            icon: Users,
            color: "text-purple-500",
          },
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-lg sm:text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="sending">Sending</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="audience">Audience Size</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns List */}
      <div className="space-y-3 sm:space-y-4">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, i) => <CampaignCardSkeleton key={i} />)
        ) : filteredCampaigns.length === 0 ? (
          <Card>
            <CardContent className="p-6 sm:p-8 text-center">
              <MessageSquare className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-base sm:text-lg font-medium mb-2">No campaigns found</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                {campaigns.length === 0
                  ? "You haven't created any campaigns yet."
                  : "No campaigns match your current filters."}
              </p>
              {campaigns.length === 0 && (
                <Button onClick={onCreateNew} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Create Your First Campaign
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredCampaigns.map((campaign) => (
            <Card key={campaign.id || campaign._id}>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-lg">{getStatusIcon(campaign.status)}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold truncate">{campaign.name}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">
                          Segment: {campaign.segmentName}
                        </p>
                      </div>
                      <Badge variant={getStatusColor(campaign.status)} className="ml-2 text-xs">
                        {campaign.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Audience</p>
                        <p className="font-medium text-sm sm:text-base">{campaign.audienceSize.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Sent</p>
                        <p className="font-medium text-sm sm:text-base">
                          {campaign.deliveryStats.sent.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Success Rate</p>
                        <p className="font-medium text-sm sm:text-base">
                          {calculateSuccessRate(campaign.deliveryStats)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Created</p>
                        <p className="font-medium text-sm sm:text-base">{formatDate(campaign.createdAt)}</p>
                      </div>
                    </div>

                    {campaign.status === "sending" && (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs sm:text-sm mb-1">
                          <span>Delivery Progress</span>
                          <span>{Math.round((campaign.deliveryStats.sent / campaign.audienceSize) * 100)}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-accent h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(campaign.deliveryStats.sent / campaign.audienceSize) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 sm:ml-4">
                    <Button variant="ghost" size="sm" onClick={() => onViewCampaign(campaign.id || campaign._id)}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View campaign</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onEditCampaign(campaign.id || campaign._id)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit campaign</span>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
