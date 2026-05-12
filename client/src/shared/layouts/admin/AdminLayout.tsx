import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  TrendingUp,
  Receipt,
  
  
  
  LogOut,
  Menu,
  X,
  Search,
  BadgeCheck,
  
  
  AlignHorizontalDistributeCenter,
  Cpu,
  CreditCard,
  Activity
} from 'lucide-react';
import adminApi from '@/lib/axios-admin';
import { LOGOUT } from '@shared/constants/adminConstants';
import { toast } from 'sonner';
import { useAdminStore } from '@stores/admin/useAdminStore';
import { ROUTES } from '@shared/constants/routes';
import ConfirmModal from '@shared/components/modals/ConfirmModal';

const navItems = [
  { to: ROUTES.ADMIN.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  // { to: ROUTES.ADMIN.INSTALLMENTS, label: 'Installments', icon: Receipt },
  { to: ROUTES.ADMIN.USERS_MANAGEMENT, label: 'Users', icon: Users },
  { to: ROUTES.ADMIN.KYC_MANAGEMENT.ROOT, label: 'KYC Verification', icon: BadgeCheck },
  { to: ROUTES.ADMIN.MUTUAL_FUNDS_MANAGEMENT.ROOT, label: 'Mutual Funds', icon: TrendingUp },
  { to: ROUTES.ADMIN.SIP_MANAGEMENT.ROOT, label: 'SIP Management', icon: DollarSign },
  { to: ROUTES.ADMIN.STOCK_MANAGEMENT, label: 'Stocks Management', icon: AlignHorizontalDistributeCenter },
  { to: ROUTES.ADMIN.ALGO_TRADING, label: 'Algo Trading', icon: Cpu },
  { to: ROUTES.ADMIN.SUBSCRIPTIONS, label: 'Subscriptions', icon: CreditCard },
  { to: ROUTES.ADMIN.TRANSACTIONS_MANAGEMENT, label: 'Transactions', icon: Receipt },
  { to: ROUTES.ADMIN.SYSTEM_LOGS, label: 'System Logs', icon: Activity },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { data, logout } = useAdminStore();

  const handleLogout = async () => {
    try {
      await adminApi.post(LOGOUT, {}, { withCredentials: true });
      logout();
      setIsLogoutModalOpen(false);
      toast.success('Logged out successfully');
      navigate({ to: ROUTES.ADMIN.AUTH.LOGIN, replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Failed to logout. Please try again.');
      setIsLogoutModalOpen(false);
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
    <div className="min-h-screen bg-black flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-neutral-900 border-r border-neutral-800 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-neutral-800">
          <h1 className="text-xl font-bold tracking-tight select-none">
            <span className="text-white">three</span>
            <span className="text-emerald-500">M</span>
          </h1>
          <button
            onClick={closeSidebar}
            className="lg:hidden p-1.5 hover:bg-neutral-800 rounded-md transition-colors"
            aria-label="Close sidebar"
          >
            <X size={18} className="text-neutral-400" />
          </button>
        </div>

        <nav className="px-3 py-4 space-y-1 overflow-y-auto h-[calc(100vh-140px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActiveRoute(item.to);

            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-colors ${active
                  ? 'text-emerald-500 bg-emerald-500/10'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                  }`}
              >
                <Icon size={18} className="shrink-0" strokeWidth={2} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 px-3 py-3 border-t border-neutral-800 bg-neutral-900">
          <div className="flex items-center gap-3 px-3 py-2.5 bg-neutral-800/50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-xs font-semibold text-white overflow-hidden flex-shrink-0">
              {data?.profile ? (
                <img
                  src={data.profile}
                  alt={data.fullName || 'Admin'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{getInitials()}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-white truncate">
                {data?.fullName || 'Admin User'}
              </p>
              <p className="text-[11px] text-neutral-500 truncate">
                Administrator
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64">
        <header className="bg-neutral-900 border-b border-neutral-800 px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-neutral-800 rounded-md transition-colors"
              aria-label="Open sidebar"
            >
              <Menu size={20} className="text-neutral-400" />
            </button>

            <div className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(e);
                  }
                }}
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-1.5 bg-neutral-800 border border-neutral-700 rounded-md text-[13px] placeholder-neutral-500 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-red-400 hover:bg-neutral-800 rounded-md transition-colors text-[13px] font-medium"
            >
              <LogOut size={16} strokeWidth={2} />
              Logout
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6 min-h-[calc(100vh-64px)] bg-black">
          {children}
        </main>
      </div>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Logout"
        message="Are you sure you want to logout? You will need to re-authenticate to access the admin panel."
        confirmText="Logout"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}