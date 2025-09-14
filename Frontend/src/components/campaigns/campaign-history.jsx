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
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="relative">
          <div className="absolute -inset-3 bg-gradient-to-r from-indigo-300/30 via-pink-300/20 to-yellow-300/20 blur-2xl rounded-xl pointer-events-none" />
          <h1 className="relative text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-pink-600 to-yellow-600 flex items-center gap-3">
            <MessageSquare className="h-7 w-7 sm:h-9 sm:w-9 text-pink-500 drop-shadow" />
            Campaign History
          </h1>
          <p className="relative mt-2 text-indigo-700/80 text-sm sm:text-base font-medium">
            Track and manage all your marketing campaigns.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            onClick={onCreateNew}
            className="bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-500 hover:from-indigo-600 hover:via-pink-600 hover:to-yellow-600 text-white font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-pink-500/30 transition-all"
          >
            Create New Campaign
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative">
        <div className="absolute -inset-2 bg-gradient-to-r from-indigo-200/30 via-pink-200/20 to-yellow-200/20 rounded-3xl blur-xl opacity-70 pointer-events-none" />
        {[
          {
            title: "Total Campaigns",
            value: campaigns.length,
            icon: MessageSquare,
            color: "from-indigo-500 to-indigo-600",
          },
          {
            title: "Active Campaigns",
            value: campaigns.filter((c) => c.status === "sending" || c.status === "scheduled").length,
            icon: Clock,
            color: "from-pink-500 to-pink-600",
          },
          {
            title: "Total Sent",
            value: campaigns.reduce((sum, c) => sum + c.deliveryStats.sent, 0).toLocaleString(),
            icon: TrendingUp,
            color: "from-yellow-500 to-yellow-600",
          },
          {
            title: "Avg Success Rate",
            value: `${(campaigns.reduce((sum, c) => sum + Number.parseFloat(calculateSuccessRate(c.deliveryStats)), 0) / campaigns.length || 0).toFixed(1)}%`,
            icon: Users,
            color: "from-purple-500 to-purple-600",
          },
        ].map((stat, index) => (
          <Card
            key={index}
            className="relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-lg ring-1 ring-white/50 hover:shadow-xl transition-all group"
          >
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${stat.color} mix-blend-multiply`} />
            <CardContent className="p-4 sm:p-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs uppercase tracking-wide font-semibold text-indigo-600/70 group-hover:text-white/80 transition-colors">
                    {stat.title}
                  </p>
                  <p className="mt-1 text-xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-pink-700 to-yellow-600 group-hover:from-white group-hover:via-white group-hover:to-white drop-shadow">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-md ring-2 ring-white/40 group-hover:scale-110 transition-transform`}
                >
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white drop-shadow" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-md ring-1 ring-indigo-100/60">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 focus-visible:ring-1 focus-visible:ring-pink-400 border-indigo-200/60 bg-white/60"
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
            <Card
              key={campaign.id || campaign._id}
              className="relative overflow-hidden border-0 bg-white/70 backdrop-blur-sm shadow-lg ring-1 ring-white/50 hover:shadow-xl transition-all group"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-indigo-200 via-pink-200 to-yellow-200 transition-opacity duration-500 mix-blend-multiply" />
              <CardContent className="relative">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-xl sm:text-2xl drop-shadow-sm">{getStatusIcon(campaign.status)}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold truncate tracking-tight text-indigo-800 group-hover:text-pink-700 transition-colors">
                          {campaign.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-indigo-700/70 truncate font-medium">
                          Segment: {campaign.segmentName}
                        </p>
                      </div>
                      <Badge
                        variant={getStatusColor(campaign.status)}
                        className="ml-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wide"
                      >
                        {campaign.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                      <div>
                        <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-indigo-600/70">
                          Audience
                        </p>
                        <p className="font-semibold text-sm sm:text-base text-indigo-900">
                          {campaign.audienceSize.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-indigo-600/70">Sent</p>
                        <p className="font-semibold text-sm sm:text-base text-indigo-900">
                          {campaign.deliveryStats.sent.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-indigo-600/70">
                          Success
                        </p>
                        <p className="font-semibold text-sm sm:text-base text-indigo-900">
                          {calculateSuccessRate(campaign.deliveryStats)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-indigo-600/70">
                          Created
                        </p>
                        <p className="font-semibold text-sm sm:text-base text-indigo-900">
                          {formatDate(campaign.createdAt)}
                        </p>
                      </div>
                    </div>

                    {campaign.status === "sending" && (
                      <div className="mb-2">
                        <div className="flex justify-between text-[11px] sm:text-xs font-semibold uppercase tracking-wide mb-1 text-indigo-700/70">
                          <span>Delivery Progress</span>
                          <span>{Math.round((campaign.deliveryStats.sent / campaign.audienceSize) * 100)}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-gradient-to-r from-indigo-100 via-pink-100 to-yellow-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-500 transition-all duration-500"
                            style={{ width: `${(campaign.deliveryStats.sent / campaign.audienceSize) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 sm:ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewCampaign(campaign.id || campaign._id)}
                      className="text-indigo-700 hover:text-pink-700 hover:bg-indigo-50/70"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View campaign</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditCampaign(campaign.id || campaign._id)}
                      className="text-indigo-700 hover:text-pink-700 hover:bg-indigo-50/70"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit campaign</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-indigo-700 hover:text-pink-700 hover:bg-indigo-50/70"
                    >
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
