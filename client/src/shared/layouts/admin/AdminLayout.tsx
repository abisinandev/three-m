import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  TrendingUp,
  Receipt,
  BarChart3,
  Bell,
  Settings,
  Bot,
  LogOut,
  Menu,
  X,
  Search,
  BadgeCheck,
} from 'lucide-react';
import adminApi from '@lib/axiosAdmin';
import { LOGOUT } from '@shared/constants/adminConstants';
import { toast } from 'sonner';
import { useAdminStore } from '@stores/admin/useAdminStore';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users-management', label: 'Users', icon: Users },
  { to: '/admin/kyc-management', label: 'KYC Verification', icon: BadgeCheck },
  { to: '/admin/sips', label: 'SIPs', icon: DollarSign },
  { to: '/admin/mutual-funds', label: 'Mutual Funds', icon: TrendingUp },
  { to: '/admin/transactions', label: 'Transactions', icon: Receipt },
  { to: '/admin/stocks', label: 'Stocks', icon: BarChart3 },
  { to: '/admin/notifications', label: 'Notifications', icon: Bell },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/bot-management', label: 'Bot Management', icon: Bot },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { data, logout } = useAdminStore();


  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (!confirmed) return;

    try {
      await adminApi.post(LOGOUT, {}, { withCredentials: true });
      logout();
      toast.success('Logged out successfully');
      navigate({ to: '/admin/authentication', replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Failed to logout. Please try again.');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      toast.info(`Searching for: ${searchQuery}`);
    }
  };

  const getInitials = (): string => {
    if (!data?.fullName) return 'AD';

    return data.fullName
      .trim()
      .split(' ')
      .filter(Boolean)
      .map((word) => word[0])
      .join('')
      .toUpperCase() 
      .slice(0, 2);
  };

  const isActiveRoute = (path: string): boolean => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#111111] border-r border-neutral-800 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Logo Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800">
          <h1 className="text-2xl font-black tracking-tighter select-none">
            <span className="text-white">three</span>
            <span className="text-teal-green">M</span>
          </h1>
          <button
            onClick={closeSidebar}
            className="lg:hidden p-1 hover:bg-white/5 rounded transition"
            aria-label="Close sidebar"
          >
            <X size={20} className="text-gray-400 hover:text-white" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 h-[calc(100vh-180px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActiveRoute(item.to);

            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${active
                  ? 'bg-teal-green/10 text-teal-green border border-teal-green/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Icon size={18} className="shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-800 bg-[#111111]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64">
        {/* Top Header */}
        <header className="bg-[#111111] border-b border-neutral-800 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30 backdrop-blur-sm">
          <div className="flex items-center gap-3 flex-1">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition"
              aria-label="Open sidebar"
            >
              <Menu size={20} className="text-gray-400 hover:text-white" />
            </button>

            {/* Global Search */}
            <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users, transactions, funds..."
                className="w-full pl-10 pr-4 py-2 bg-[#1a1a1a] border border-neutral-700 rounded-lg text-sm placeholder-gray-500 text-white focus:outline-none focus:border-teal-green/60 focus:ring-2 focus:ring-teal-green/20 transition"
              />
            </form>
          </div>

          <div className="flex items-center gap-4">

            <button
              className="relative p-2 hover:bg-white/5 rounded-lg transition"
              aria-label="Notifications"
            >
              <Bell size={20} className="text-gray-400 hover:text-white" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </button>

            <div className="relative group">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-green to-cyan-500 flex items-center justify-center text-xs font-bold shadow-lg ring-2 ring-neutral-800 overflow-hidden">
                {data?.profile ? (
                  <img
                    src={data.profile}
                    alt={data.fullName || 'Admin'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-black">{getInitials()}</span>
                )}
              </div>

              {data?.fullName && (
                <div className="absolute top-full mt-2 right-0 bg-neutral-900 border border-neutral-800 text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
                  <div className="text-white font-medium">{data.fullName}</div>
                  {data.email && (
                    <div className="text-gray-500 text-[10px] mt-0.5">{data.email}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 sm:p-6 pb-10 min-h-[calc(100vh-73px)]">
          {children}
        </main>
      </div>
    </div>
  );
}