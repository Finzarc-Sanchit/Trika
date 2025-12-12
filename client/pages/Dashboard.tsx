import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Menu,
  RefreshCw
} from 'lucide-react';
import { logout } from '../lib/api/auth';
import { 
  getPaymentBookings, 
  getPaymentBookingStats, 
  getDashboardStats,
  PaymentBooking,
  CombinedDashboardStats
} from '../lib/api/dashboard';
import { getBookings, Booking } from '../lib/api/booking';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardHome from '../components/DashboardHome';
import PaymentBookingsTab from '../components/PaymentBookingsTab';
import InquiriesTab from '../components/InquiriesTab';
import SessionsTab from '../components/SessionsTab';
import RetreatsTab from '../components/RetreatsTab';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get active tab from URL, default to 'home'
  const tabFromUrl = searchParams.get('tab') || 'home';
  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<CombinedDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync activeTab with URL on mount
  useEffect(() => {
    const urlTab = searchParams.get('tab') || 'home';
    if (urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, []);

  // Update URL when activeTab changes
  useEffect(() => {
    if (activeTab) {
      setSearchParams({ tab: activeTab });
    }
  }, [activeTab, setSearchParams]);

  useEffect(() => {
    if (activeTab === 'home') {
      fetchDashboardStats();
    }
  }, [activeTab]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getDashboardStats();
      if (response.success && response.data) {
        setDashboardStats(response.data);
      }
    } catch (err) {
      setError('Failed to load dashboard statistics');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <DashboardHome
            stats={dashboardStats}
            loading={loading}
            error={error}
            onRefresh={fetchDashboardStats}
          />
        );
      case 'payment-bookings':
        return <PaymentBookingsTab />;
      case 'inquiries':
        return <InquiriesTab />;
      case 'sessions':
        return <SessionsTab />;
      case 'retreats':
        return <RetreatsTab />;
      default:
        return (
          <DashboardHome
            stats={dashboardStats}
            loading={loading}
            error={error}
            onRefresh={fetchDashboardStats}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9]">
      {/* Sidebar */}
      <DashboardSidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        isCollapsed={sidebarCollapsed}
        onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className={`flex flex-col min-h-screen ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'} transition-all duration-300`}>
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-stone-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-stone-700 hover:text-[#967BB6] transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="font-serif text-xl text-[#1c1917]">Dashboard</h1>
            <div className="w-6" /> {/* Spacer */}
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
