"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Plus, Users, Send, BarChart3, Zap } from "lucide-react"

export function QuickActions({ onAction }) {
  const actions = [
    {
      id: "create-segment",
      title: "Create Segment",
      description: "Build new audience",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-600 hover:to-blue-700",
    },
    {
      id: "launch-campaign",
      title: "Launch Campaign",
      description: "Send messages",
      icon: Send,
      color: "from-green-500 to-green-600",
      hoverColor: "hover:from-green-600 hover:to-green-700",
    },
    {
      id: "view-analytics",
      title: "View Analytics",
      description: "Check performance",
      icon: BarChart3,
      color: "from-purple-500 to-purple-600",
      hoverColor: "hover:from-purple-600 hover:to-purple-700",
    },
    {
      id: "manage-customers",
      title: "AI Insights",
      description: "Smart recommendations",
      icon: Zap,
      color: "from-orange-500 to-orange-600",
      hoverColor: "hover:from-orange-600 hover:to-orange-700",
    },
  ]

  return (
    <Card className="bg-white shadow-sm border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <div className="h-6 w-6 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <Plus className="h-4 w-4 text-white" />
          </div>
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => (
          <Button
            key={action.id}
            onClick={() => onAction(action.id)}
            className={`w-full justify-start h-auto p-4 bg-gradient-to-r ${action.color} ${action.hoverColor} text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
          >
            <div className="flex items-center gap-3 w-full">
              <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <div className="text-left flex-1">
                <div className="font-semibold text-sm">{action.title}</div>
                <div className="text-xs text-white/80">{action.description}</div>
              </div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
