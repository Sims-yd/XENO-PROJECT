"use client"

import { Home, UserCheck, Send, TrendingUp, Settings, Target, X, Star, Zap, Menu } from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"

export function Sidebar({ user, activeTab, onTabChange, isOpen, onClose }) {
  const sidebarItems = [
    {
      id: "dashboard",
      icon: <Home className="h-5 w-5" />,
      label: "Dashboard",
      description: "Overview & insights",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: "segments",
      icon: <UserCheck className="h-5 w-5" />,
      label: "Segments",
      description: "Audience builder",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      id: "campaigns",
      icon: <Send className="h-5 w-5" />,
      label: "Campaigns",
      description: "Marketing campaigns",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: "analytics",
      icon: <TrendingUp className="h-5 w-5" />,
      label: "Analytics",
      description: "Performance reports",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      id: "settings",
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
      description: "Account & preferences",
      color: "text-slate-600",
      bgColor: "bg-slate-50",
    },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[280px] md:w-64 bg-white shadow-xl border-r border-slate-200
          transform transition-all duration-300 ease-in-out overflow-y-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm">
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="App Logo" className="h-8 w-8" />
              <div>
                <h1 className="text-lg font-bold text-slate-900">Xeno CRM</h1>
                <p className="text-xs text-slate-500">Smart Customer Management</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden hover:bg-slate-100"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User Profile */}
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                {user?.name?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-xs">Pro</Badge>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id)
                  // Close sidebar on mobile after navigation
                  if (window.innerWidth < 1024) onClose()
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left
                  transition-all duration-200 hover:shadow-sm
                  ${isActive
                    ? `${item.bgColor} ${item.color} shadow-sm`
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
              >
                {item.icon}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.label}</p>
                  <p className={`text-xs truncate ${
                    isActive ? "text-slate-600" : "text-slate-400"
                  }`}>
                    {item.description}
                  </p>
                </div>
                {isActive && (
                  <div className={`h-2 w-2 rounded-full ${item.color.replace("text-", "bg-")}`} />
                )}
              </button>
            )
          })}
        </nav>

        {/* Quick Stats */}
        <div className="p-4 mt-auto">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
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
        <div className="sticky bottom-0 bg-white/90 backdrop-blur-sm p-4 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Zap className="h-3 w-3" />
            <span>Powered by AI</span>
          </div>
        </div>
      </div>

      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed bottom-4 right-4 h-10 w-10 rounded-full shadow-lg bg-white lg:hidden z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>
    </>
  )
}
