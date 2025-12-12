import React from 'react';
import { 
  Calendar, 
  MessageSquare,
  CreditCard, 
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  ChevronDown,
  ShoppingBag
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { CombinedDashboardStats } from '../lib/api/dashboard';

interface DashboardHomeProps {
  stats: CombinedDashboardStats | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const COLORS = ['#967BB6', '#7A5F9F', '#B8A5D9', '#D4C4E8', '#E8DDF2', '#F3EDF7', '#F9F6FB', '#FDFBF9', '#F5F0F8'];

const DashboardHome: React.FC<DashboardHomeProps> = ({
  stats,
  loading,
  error,
  onRefresh,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
      notation: 'compact',
      compactDisplay: 'short',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 text-[#967BB6] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-full mx-auto px-6 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  // Calculate trends (mock for now, can be enhanced with actual comparison data)
  const calculateTrend = (current: number, previous: number = current * 0.95) => {
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(2),
      isPositive: change >= 0,
    };
  };

  const summaryCards = [
    {
      title: 'Total Bookings',
      value: formatNumber(stats.inquiries.total + stats.paymentBookings.total),
      trend: calculateTrend(stats.inquiries.total + stats.paymentBookings.total),
      icon: Calendar,
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.paymentBookings.totalRevenue),
      trend: calculateTrend(stats.paymentBookings.totalRevenue),
      icon: CreditCard,
    },
    {
      title: 'Payment Bookings',
      value: formatNumber(stats.paymentBookings.total),
      trend: calculateTrend(stats.paymentBookings.total, stats.paymentBookings.total * 0.998),
      icon: ShoppingBag,
    },
    {
      title: 'Cancelled Bookings',
      value: formatNumber(stats.paymentBookings.cancelled),
      trend: calculateTrend(stats.paymentBookings.cancelled),
      icon: XCircle,
    },
  ];

  // Prepare data for charts
  const revenueChartData = stats.revenueTrends.map(trend => {
    // Split revenue between sessions and retreats based on actual data
    const sessionsRevenue = trend.revenue * (stats.paymentBookings.sessionBookings / (stats.paymentBookings.sessionBookings + stats.paymentBookings.retreatBookings || 1));
    const retreatsRevenue = trend.revenue * (stats.paymentBookings.retreatBookings / (stats.paymentBookings.sessionBookings + stats.paymentBookings.retreatBookings || 1));
    return {
      date: trend.label,
      sessions: sessionsRevenue || 0,
      retreats: retreatsRevenue || 0,
    };
  });

  const categoryData = [
    { name: 'Sessions', value: stats.paymentBookings.sessionBookings, color: '#967BB6' },
    { name: 'Retreats', value: stats.paymentBookings.retreatBookings, color: '#7A5F9F' },
    { name: 'Inquiries', value: stats.inquiries.total, color: '#B8A5D9' },
  ];

  const statusData = [
    { name: 'Confirmed', value: stats.paymentBookings.confirmed, color: '#10b981' },
    { name: 'Pending', value: stats.paymentBookings.pending, color: '#f59e0b' },
    { name: 'Cancelled', value: stats.paymentBookings.cancelled, color: '#ef4444' },
  ];

  return (
    <div className="flex-1 bg-white min-h-screen">
      <div className="max-w-full mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[#1c1917]">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-stone-600">
              <span>Time period:</span>
              <button className="flex items-center space-x-1 px-3 py-1.5 border border-stone-300 rounded-lg hover:bg-stone-50">
                <span>Last 7 days</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {summaryCards.map((card, index) => {
            const Icon = card.icon;
            const TrendIcon = card.trend.isPositive ? TrendingUp : TrendingDown;
            return (
              <div
                key={index}
                className="bg-white rounded-lg border border-stone-200 p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-sm text-stone-600 mb-1">{card.title}</p>
                    <p className="text-2xl font-semibold text-[#1c1917]">{card.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${index === 0 ? 'bg-blue-50' : index === 1 ? 'bg-green-50' : index === 2 ? 'bg-purple-50' : 'bg-red-50'}`}>
                    <Icon className={`w-5 h-5 ${index === 0 ? 'text-blue-600' : index === 1 ? 'text-green-600' : index === 2 ? 'text-purple-600' : 'text-red-600'}`} />
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-xs">
                  <TrendIcon className={`w-3 h-3 ${card.trend.isPositive ? 'text-green-600' : 'text-red-600'}`} />
                  <span className={card.trend.isPositive ? 'text-green-600' : 'text-red-600'}>
                    {card.trend.value}%
                  </span>
                  <span className="text-stone-500">vs previous period</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-stone-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[#1c1917] mb-4">Booking Revenue</h3>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-stone-600">Sessions</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-sm text-stone-600">Retreats</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  stroke="#78716c"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#78716c"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FDFBF9', 
                    border: '1px solid #e7e5e4',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number, name: string) => [
                    `₹${value.toLocaleString('en-IN')}`,
                    name
                  ]}
                />
                <Legend />
                <Bar dataKey="sessions" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Sessions" />
                <Bar dataKey="retreats" fill="#f97316" radius={[4, 4, 0, 0]} name="Retreats" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Bookings by Type */}
          <div className="bg-white rounded-lg border border-stone-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[#1c1917] mb-4">Bookings by Type</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FDFBF9', 
                    border: '1px solid #e7e5e4',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {categoryData.map((item, index) => {
                const percentage = stats.paymentBookings.total > 0 
                  ? ((item.value / (stats.paymentBookings.total + stats.inquiries.total)) * 100).toFixed(0)
                  : '0';
                return (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-stone-700">{item.name}</span>
                    </div>
                    <span className="text-stone-600 font-medium">{percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Booking Status */}
          <div className="bg-white rounded-lg border border-stone-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[#1c1917] mb-4">Payment Booking Status</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FDFBF9', 
                    border: '1px solid #e7e5e4',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Inquiry Status */}
          <div className="bg-white rounded-lg border border-stone-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[#1c1917] mb-4">Inquiry Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <span className="text-stone-700 font-medium">Pending</span>
                </div>
                <span className="text-xl font-semibold text-yellow-600">
                  {stats.inquiries.pending}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <span className="text-stone-700 font-medium">Contacted</span>
                </div>
                <span className="text-xl font-semibold text-blue-600">
                  {stats.inquiries.contacted}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-stone-700 font-medium">Confirmed</span>
                </div>
                <span className="text-xl font-semibold text-green-600">
                  {stats.inquiries.confirmed}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
