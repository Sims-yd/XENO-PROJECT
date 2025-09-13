import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Users, Send, TrendingUp, Target, ArrowUp, ArrowDown } from "lucide-react"

export function StatsCards({ data }) {
  const calculateStats = () => {
    if (!data || data.loading) {
      return [
        {
          title: "Total Customers",
          value: "...",
          change: "...",
          trend: "up",
          icon: Users,
          description: "Loading...",
          color: "from-blue-500 to-blue-600",
          bgColor: "bg-blue-50",
          textColor: "text-blue-600",
        },
        {
          title: "Campaigns Sent",
          value: "...",
          change: "...",
          trend: "up",
          icon: Send,
          description: "Loading...",
          color: "from-green-500 to-green-600",
          bgColor: "bg-green-50",
          textColor: "text-green-600",
        },
        {
          title: "Success Rate",
          value: "...",
          change: "...",
          trend: "up",
          icon: TrendingUp,
          description: "Loading...",
          color: "from-purple-500 to-purple-600",
          bgColor: "bg-purple-50",
          textColor: "text-purple-600",
        },
        {
          title: "Active Segments",
          value: "...",
          change: "...",
          trend: "up",
          icon: Target,
          description: "Loading...",
          color: "from-orange-500 to-orange-600",
          bgColor: "bg-orange-50",
          textColor: "text-orange-600",
        },
      ]
    }

    const { customers, orders, campaigns } = data

    // Calculate delivery success rate
    const totalSent = campaigns?.performance?.totalSent || 0
    const totalDelivered = campaigns?.performance?.totalDelivered || 0
    const successRate = totalSent > 0 ? ((totalDelivered / totalSent) * 100).toFixed(1) : 0

    // Calculate total revenue
    const totalRevenue = orders?.overview?.totalRevenue || 0
    const formattedRevenue = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(totalRevenue)

    return [
      {
        title: "Total Customers",
        value: customers?.overview?.totalCustomers?.toLocaleString() || "0",
        change: customers?.overview?.activeCustomers > customers?.overview?.inactiveCustomers ? "+5.2%" : "-2.1%",
        trend: customers?.overview?.activeCustomers > customers?.overview?.inactiveCustomers ? "up" : "down",
        icon: Users,
        description: `${customers?.overview?.activeCustomers || 0} active`,
        color: "from-blue-500 to-blue-600",
        bgColor: "bg-blue-50",
        textColor: "text-blue-600",
      },
      {
        title: "Total Revenue",
        value: formattedRevenue,
        change: orders?.overview?.deliveredOrders > orders?.overview?.pendingOrders ? "+12.5%" : "-3.2%",
        trend: orders?.overview?.deliveredOrders > orders?.overview?.pendingOrders ? "up" : "down",
        icon: TrendingUp,
        description: `${orders?.overview?.totalOrders || 0} orders`,
        color: "from-green-500 to-green-600",
        bgColor: "bg-green-50",
        textColor: "text-green-600",
      },
      {
        title: "Campaign Success",
        value: `${successRate}%`,
        change: successRate > 90 ? "+2.1%" : "-1.5%",
        trend: successRate > 90 ? "up" : "down",
        icon: Send,
        description: `${totalDelivered.toLocaleString()} delivered`,
        color: "from-purple-500 to-purple-600",
        bgColor: "bg-purple-50",
        textColor: "text-purple-600",
      },
      {
        title: "Active Campaigns",
        value: campaigns?.overview?.activeCampaigns?.toString() || "0",
        change: campaigns?.overview?.activeCampaigns > 0 ? "+8.3%" : "0%",
        trend: campaigns?.overview?.activeCampaigns > 0 ? "up" : "neutral",
        icon: Target,
        description: `${campaigns?.overview?.completedCampaigns || 0} completed`,
        color: "from-orange-500 to-orange-600",
        bgColor: "bg-orange-50",
        textColor: "text-orange-600",
      },
    ]
  }

  const stats = calculateStats()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="bg-white shadow-sm border-slate-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105 card-hover"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
            <div
              className={`h-10 w-10 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}
            >
              <stat.icon className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
              </div>
              {stat.change !== "..." && stat.trend !== "neutral" && (
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    stat.trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {stat.trend === "up" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {stat.change}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
