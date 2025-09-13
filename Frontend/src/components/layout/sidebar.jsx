"use client"

import { Home, UserCheck, Send, TrendingUp, Settings, Target, X, Star, Zap } from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"

export function Sidebar({ user, activeTab, onTabChange, isOpen, onClose }) {
  const navigation = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: Home,
      description: "Overview & insights",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: "segments",
      name: "Segments",
      icon: UserCheck,
      description: "Audience builder",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      id: "campaigns",
      name: "Campaigns",
      icon: Send,
      description: "Marketing campaigns",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: "analytics",
      name: "Analytics",
      icon: TrendingUp,
      description: "Performance reports",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      id: "settings",
      name: "Settings",
      icon: Settings,
      description: "Account & preferences",
      color: "text-slate-600",
      bgColor: "bg-slate-50",
    },
  ]

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
              <img src="/public/logo.png" alt="App Logo" className="h-8 w-8" />
            <div>
              <h1 className="text-xl font-bold text-slate-900">Xeno CRM</h1>
              <p className="text-xs text-slate-500">Smart Customer Management</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-xs">Pro</Badge>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                  isActive
                    ? `${item.bgColor} ${item.color} shadow-sm`
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.icon
                  className={`h-5 w-5 ${isActive ? item.color : "text-slate-400 group-hover:text-slate-600"}`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className={`text-xs truncate ${isActive ? "text-slate-600" : "text-slate-400"}`}>
                    {item.description}
                  </p>
                </div>
                {isActive && <div className={`h-2 w-2 rounded-full ${item.color.replace("text-", "bg-")}`} />}
              </button>
            )
          })}
        </nav>

        {/* Quick Stats */}
        <div className="p-4 mt-auto">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-slate-700">Quick Stats</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Active Campaigns</span>
                <span className="font-semibold text-slate-900">12</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Total Segments</span>
                <span className="font-semibold text-slate-900">8</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Success Rate</span>
                <span className="font-semibold text-green-600">94.2%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Zap className="h-3 w-3" />
            <span>Powered by AI</span>
          </div>
        </div>
      </div>
    </>
  )
}
