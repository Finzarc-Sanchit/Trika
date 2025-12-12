import React from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Calendar,
  MapPin,
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  section?: string;
}

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  isOpen: boolean;
  onToggle: () => void;
  isCollapsed: boolean;
  onCollapse: () => void;
}

const sidebarItems: SidebarItem[] = [
  { id: 'home', label: 'Dashboard', icon: LayoutDashboard, section: 'BOOKINGS' },
  { id: 'payment-bookings', label: 'Payment Bookings', icon: ShoppingBag, section: 'BOOKINGS' },
  { id: 'inquiries', label: 'Inquiries', icon: MessageSquare, section: 'BOOKINGS' },
  { id: 'sessions', label: 'Sessions', icon: Calendar, section: 'MANAGEMENT' },
  { id: 'retreats', label: 'Retreats', icon: MapPin, section: 'MANAGEMENT' },
];

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeTab,
  onTabChange,
  onLogout,
  isOpen,
  onToggle,
  isCollapsed,
  onCollapse,
}) => {
  const groupedItems = sidebarItems.reduce((acc, item) => {
    const section = item.section || 'OTHER';
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {} as Record<string, SidebarItem[]>);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-stone-900/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 z-50 h-screen
          ${isCollapsed ? 'w-20' : 'w-64'} bg-stone-100
          transform transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col border-r border-stone-200 overflow-hidden
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200 flex-shrink-0">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 flex items-center justify-center">
                <img 
                  src="/assets/images/logo.png" 
                  alt="Trika Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="font-semibold text-[#1c1917] text-sm">Trika</h2>
                <p className="text-xs text-stone-500">Sound Sanctuary</p>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="w-10 h-10 flex items-center justify-center mx-auto">
              <img 
                src="/assets/images/logo.png" 
                alt="Trika Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <button
            onClick={onCollapse}
            className="hidden lg:flex text-stone-500 hover:text-stone-900 transition-colors p-1"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
          <button
            onClick={onToggle}
            className="lg:hidden text-stone-500 hover:text-stone-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-2 overflow-hidden min-h-0">
          {Object.entries(groupedItems).map(([section, items]) => (
            <div key={section} className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 py-1.5">
                  <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    {section}
                  </p>
                </div>
              )}
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      if (window.innerWidth < 1024) {
                        onToggle();
                      }
                    }}
                    className={`
                      w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 rounded-lg
                      transition-all duration-200
                      ${
                        isActive
                          ? 'bg-[#967BB6] text-white shadow-sm'
                          : 'text-stone-700 hover:bg-stone-200'
                      }
                    `}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-3 border-t border-stone-200 flex-shrink-0">
          {!isCollapsed && (
            <div className="flex items-center space-x-3 px-3 py-1.5 mb-2">
              <div className="w-8 h-8 bg-[#967BB6] rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-semibold">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1c1917] truncate">Admin</p>
                <p className="text-xs text-stone-500 truncate">Admin Manager</p>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="w-8 h-8 bg-[#967BB6] rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-white text-xs font-semibold">A</span>
            </div>
          )}
          <button
            onClick={onLogout}
            className={`
              w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 rounded-lg
              text-stone-600 hover:bg-stone-200 transition-all duration-200 text-sm
            `}
            title={isCollapsed ? 'Log out' : undefined}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span>Log out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
