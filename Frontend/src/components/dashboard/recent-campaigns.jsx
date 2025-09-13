"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Eye, Edit, MoreHorizontal, Calendar, Users, TrendingUp } from "lucide-react"

export function RecentCampaigns({ onViewCampaign, campaigns = [] }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "running":
        return "bg-green-100 text-green-700 border-green-200"
      case "completed":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "draft":
        return "bg-gray-100 text-gray-700 border-gray-200"
      case "scheduled":
        return "bg-orange-100 text-orange-700 border-orange-200"
      case "paused":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const calculatePerformance = (campaign) => {
    if (!campaign.stats || campaign.stats.sent === 0) return 0
    return ((campaign.stats.delivered / campaign.stats.sent) * 100).toFixed(1)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (!campaigns || campaigns.length === 0) {
    return (
      <Card className="bg-white shadow-sm border-slate-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <div className="h-6 w-6 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              Recent Campaigns
            </CardTitle>
            <Button variant="outline" size="sm" className="text-slate-600 border-slate-300 bg-transparent">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-slate-400 mb-2">No campaigns found</div>
            <p className="text-sm text-slate-500">Create your first campaign to get started</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white shadow-sm border-slate-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <div className="h-6 w-6 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            Recent Campaigns
          </CardTitle>
          <Button variant="outline" size="sm" className="text-slate-600 border-slate-300 bg-transparent">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div
              key={campaign._id}
              className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 bg-slate-50/50"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-slate-900 truncate">{campaign.name}</h3>
                  <Badge className={`text-xs ${getStatusColor(campaign.status)}`}>{campaign.status}</Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{campaign.audienceSize || 0} customers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(campaign.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="capitalize">{campaign.type}</span>
                  </div>
                </div>

                {campaign.status !== "draft" && campaign.stats && (
                  <div className="flex items-center gap-6 mt-3 text-xs">
                    <div className="text-slate-600">
                      <span className="font-medium text-slate-900">{campaign.stats.sent?.toLocaleString() || 0}</span>{" "}
                      sent
                    </div>
                    <div className="text-slate-600">
                      <span className="font-medium text-slate-900">
                        {campaign.stats.delivered?.toLocaleString() || 0}
                      </span>{" "}
                      delivered
                    </div>
                    <div className="text-slate-600">
                      <span className="font-medium text-slate-900">{campaign.stats.opened?.toLocaleString() || 0}</span>{" "}
                      opened
                    </div>
                    <div className="text-slate-600">
                      <span className="font-medium text-slate-900">
                        {campaign.stats.clicked?.toLocaleString() || 0}
                      </span>{" "}
                      clicked
                    </div>
                    {calculatePerformance(campaign) > 0 && (
                      <div className="text-green-600 font-medium">{calculatePerformance(campaign)}% delivered</div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewCampaign(campaign._id)}
                  className="text-slate-600 hover:text-slate-900"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
