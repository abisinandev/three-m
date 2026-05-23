import { Outlet, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import api from '@/lib/axios-user';
import { useUserStore } from '@stores/user/UserStore';
import { Wallet, ChevronDown, LogOut, User, Menu, Bell, X } from 'lucide-react';
import { Footer } from '@shared/components/LandingPage/Footer';
import { LOGOUT } from '@shared/constants/userContants';
import ConfirmModal from '@shared/components/modals/ConfirmModal';
import { NotificationDropdown } from '@modules/user/notifications/components/NotificationDropdown';
import { useProfileQuery } from '@shared/services/user/profile-api';
import AiAssistantPanel from '@shared/components/ai-chatbot/AiChatbot';
import { ROUTES } from '@shared/constants/routes';
import PremiumPaymentModal from '@shared/components/modals/premium-payment/PremiumPaymentModal';
import { usePremiumModalStore } from '@stores/user/PremiumModalStore';
import type { UserType } from '@/shared/types/user/UserType';

const NAV_ITEMS = [
    { to: ROUTES.USER.HOME, label: 'Dashboard' },
    { to: ROUTES.USER.EXPENSE_TRACKER, label: 'Expense tracker' },
    { to: ROUTES.USER.WALLET.ROOT, label: 'Wallet' },
    { to: ROUTES.USER.MUTUAL_FUNDS.ROOT, label: 'Mutual Funds' },
    { to: ROUTES.USER.TRADING, label: 'Stocks' },
    { to: ROUTES.USER.PORTFOLIO.ROOT, label: 'Portfolio' },
    { to: ROUTES.USER.MARKET_NEWS, label: "News" },
];

const UserLayout = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { user, logout, setUser } = useUserStore();
    const { isOpen: isPremiumModalOpen, onClose: closePremiumModal } = usePremiumModalStore();
    const navigate = useNavigate();

    const { data } = useProfileQuery();
    useEffect(() => {
        if (data) {
            const userData = ('data' in data ? data.data : data) as UserType;
            setUser(userData);
        }
    }, [data, setUser]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await api.post(LOGOUT, {}, { withCredentials: true });
            logout();
            useUserStore.persist.clearStorage();
            navigate({ to: ROUTES.AUTH.LOGIN, replace: true });
            toast.success('Logged out successfully');
        } catch (error) {
            console.log('Logout failed: ', error);
            toast.error('Logout failed. Please try again.');
        } finally {
            setLoggingOut(false);
            setShowLogoutModal(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-inter antialiased">
            <header className="bg-[#0f0f0f] border-b border-[#1f1f1f]">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between text-sm">

                    {/* Logo */}
                    <Link to={ROUTES.USER.HOME} className="flex items-center">
                        <h1 className="text-xl font-bold tracking-tighter">
                            <span className="text-white">three</span>
                            <span className="text-[#22C55E]">M</span>
                        </h1>
                    </Link>

                    <nav className="hidden lg:flex items-center gap-8 font-medium text-gray-400">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.to}
                                to={item.to}
                                className="relative py-1 text-xs tracking-wider transition-colors
                                data-[status=active]:text-white
                                data-[status=active]:after:absolute data-[status=active]:after:bottom-0 data-[status=active]:after:left-0 data-[status=active]:after:w-full data-[status=active]:after:h-0.5 data-[status=active]:after:bg-[#22C55E]
                                hover:text-gray-200"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">

                        <div className="hidden sm:flex items-center gap-2 bg-[#171717] px-3 py-1.5 rounded-full border border-[#2a2a2a] text-xs font-medium">
                            <Wallet className="w-3.5 h-3.5 text-[#22C55E]" />
                            <span>₹{user?.wallet?.balance?.toLocaleString() || '0'}</span>
                        </div>

                        <NotificationDropdown />

                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-[#1a1a1a] transition text-xs font-medium tracking-wide border border-transparent hover:border-[#333]"
                            >
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#22C55E] to-[#16a34a] flex items-center justify-center text-xs font-bold text-white">
                                    {user?.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
                                </div>
                                <span className="text-gray-300 hidden sm:block">
                                    {user?.userCode || user?.fullName?.split(' ')[0] || 'User'}
                                </span>
                                <ChevronDown size={14} className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-[#111] rounded-lg shadow-2xl border border-[#2a2a2a] overflow-hidden z-50">
                                    <div className="py-1">
                                        <Link
                                            to={ROUTES.USER.PROFILE}
                                            onClick={() => setIsDropdownOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-[#1a1a1a] transition"
                                        >
                                            <User size={16} />
                                            Profile
                                        </Link>
                                        <Link
                                            to={ROUTES.USER.HOME}
                                            onClick={() => setIsDropdownOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-[#1a1a1a] transition"
                                        >
                                            <Bell size={16} />
                                            Notifications
                                        </Link>
                                        <div className="h-px bg-[#2a2a2a]" />
                                        <button
                                            onClick={() => {
                                                setIsDropdownOpen(false);
                                                setShowLogoutModal(true);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/20 transition"
                                        >
                                            <LogOut size={16} />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button 
                            className="lg:hidden p-1"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={20} className="text-gray-400" /> : <Menu size={20} className="text-gray-400" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden border-t border-[#1f1f1f] bg-[#0f0f0f] animate-slide-down">
                        <nav className="flex flex-col px-4 py-2">
                            {NAV_ITEMS.map((item) => (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="py-3 border-b border-[#1f1f1f]/50 last:border-0 text-sm font-medium text-gray-400 hover:text-white transition-colors data-[status=active]:text-[#22C55E]"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
            </header>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[100] lg:hidden">
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
                    <div className="fixed inset-y-0 left-0 w-3/4 max-w-sm bg-[#0f0f0f] border-r border-[#1f1f1f] p-6 shadow-2xl flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-xl font-bold tracking-tighter">
                                <span className="text-white">three</span>
                                <span className="text-[#22C55E]">M</span>
                            </h1>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400">
                                <X size={20} />
                            </button>
                        </div>

                        <nav className="flex flex-col gap-4">
                            {([
                                { to: ROUTES.USER.HOME, label: 'Dashboard' },
                                { to: ROUTES.USER.EXPENSE_TRACKER, label: 'Expense tracker' },
                                { to: ROUTES.USER.WALLET.ROOT, label: 'Wallet' },
                                { to: ROUTES.USER.MUTUAL_FUNDS.ROOT, label: 'Mutual Funds' },
                                { to: ROUTES.USER.TRADING, label: 'Stocks' },
                                { to: ROUTES.USER.PORTFOLIO.ROOT, label: 'Portfolio' },
                                { to: ROUTES.USER.MARKET_NEWS, label: "News" },
                            ] as { to: string; label: string }[]).map((item) => (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-lg font-medium text-gray-400 hover:text-white transition-colors py-2 border-b border-[#1f1f1f]"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="mt-auto pt-6">
                            <div className="flex items-center gap-3 bg-[#171717] px-4 py-3 rounded-xl border border-[#2a2a2a] mb-4">
                                <Wallet className="w-5 h-5 text-[#22C55E]" />
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Balance</p>
                                    <p className="text-sm font-bold">₹{user?.wallet?.balance?.toLocaleString() || '0'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <main className="max-w-7xl mx-auto px-4 py-6">
                <Outlet />
            </main>
            <AiAssistantPanel />
            <Footer />

            <PremiumPaymentModal
                isOpen={isPremiumModalOpen}
                onClose={closePremiumModal}
            />

            <ConfirmModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogout}
                title="Logout"
                message="Are you sure you want to log out of your account?"
                confirmText="Yes, Logout"
                cancelText="Cancel"
                variant="destructive"
                loading={loggingOut}
            />
        </div>
    );
};

export default UserLayout;
