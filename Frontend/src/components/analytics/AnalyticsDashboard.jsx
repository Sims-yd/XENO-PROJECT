import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Mail } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

export function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState({
    totalCampaigns: 0,
    totalRecipients: 0,
    averageOpenRate: 0,
    clickThroughRate: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch analytics data
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        // Replace this with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMetrics({
          totalCampaigns: 24,
          totalRecipients: 15420,
          averageOpenRate: 32.5,
          clickThroughRate: 12.8
        });
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-10 bg-gradient-to-br from-indigo-50 via-pink-50/40 to-yellow-50/30 min-h-screen p-4 md:p-8 rounded-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <MetricCard
          title="Total Campaigns"
          value={metrics.totalCampaigns}
          icon={<Mail className="h-5 w-5 text-blue-600" />}
          loading={isLoading}
          className="bg-gradient-to-r from-indigo-200 via-pink-100 to-yellow-100 shadow-lg border-0"
        />
        <MetricCard
          title="Total Recipients"
          value={metrics.totalRecipients.toLocaleString()}
          icon={<Users className="h-5 w-5 text-purple-600" />}
          loading={isLoading}
          className="bg-gradient-to-r from-pink-200 via-yellow-100 to-indigo-100 shadow-lg border-0"
        />
        <MetricCard
          title="Average Open Rate"
          value={metrics.averageOpenRate + '%'}
          icon={<BarChart3 className="h-5 w-5 text-green-600" />}
          loading={isLoading}
          className="bg-gradient-to-r from-yellow-200 via-indigo-100 to-pink-100 shadow-lg border-0"
        />
        <MetricCard
          title="Click Through Rate"
          value={metrics.clickThroughRate + '%'}
          icon={<TrendingUp className="h-5 w-5 text-orange-600" />}
          loading={isLoading}
          className="bg-gradient-to-r from-indigo-200 via-yellow-100 to-pink-100 shadow-lg border-0"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CampaignPerformanceChart />
        <AudienceGrowthChart />
      </div>

      <div className="bg-gradient-to-r from-white via-indigo-50 to-pink-50 rounded-lg shadow-lg border-0 p-8">
        <h3 className="text-xl font-bold text-indigo-700 mb-4">Recent Activity</h3>
        <RecentActivityList />
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, loading }) {
  return (
    <Card className={`shadow-lg border-0 ${typeof loading === 'object' && loading.className ? loading.className : ''}`}>
      <div className="p-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-indigo-700">{title}</h3>
          {icon}
        </div>
        {loading ? (
          <div className="h-8 bg-indigo-100 animate-pulse rounded"></div>
        ) : (
          <p className="text-3xl font-extrabold text-pink-700 drop-shadow">{value}</p>
        )}
      </div>
    </Card>
  );
}

function CampaignPerformanceChart() {
  const data = [
    { name: 'Jan', sent: 400, opened: 240, clicked: 100 },
    { name: 'Feb', sent: 300, opened: 139, clicked: 80 },
    { name: 'Mar', sent: 200, opened: 980, clicked: 50 },
    { name: 'Apr', sent: 278, opened: 390, clicked: 60 },
    { name: 'May', sent: 189, opened: 480, clicked: 70 },
  ];
  return (
    <Card className="bg-white">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Campaign Performance</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sent" fill="#8884d8" name="Sent" />
            <Bar dataKey="opened" fill="#82ca9d" name="Opened" />
            <Bar dataKey="clicked" fill="#ffc658" name="Clicked" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function AudienceGrowthChart() {
  const data = [
    { name: 'Jan', audience: 1000 },
    { name: 'Feb', audience: 1200 },
    { name: 'Mar', audience: 1500 },
    { name: 'Apr', audience: 1700 },
    { name: 'May', audience: 2000 },
  ];
  return (
    <Card className="bg-white">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Audience Growth</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="audience" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function RecentActivityList() {
  const activities = [
    { id: 1, type: 'campaign', title: 'Holiday Campaign', action: 'sent', time: '2 hours ago' },
    { id: 2, type: 'segment', title: 'High Value Customers', action: 'updated', time: '4 hours ago' },
    { id: 3, type: 'campaign', title: 'Welcome Series', action: 'created', time: '1 day ago' },
  ];

  return (
    <div className="space-y-4">
      {activities.map(activity => (
        <div key={activity.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-900">{activity.title}</span>
            <span className="text-sm text-slate-500">was {activity.action}</span>
          </div>
          <span className="text-sm text-slate-400">{activity.time}</span>
        </div>
      ))}
    </div>
  );
}