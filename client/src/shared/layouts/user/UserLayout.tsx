import { Outlet, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import api from '@lib/axiosUser';
import { useUserStore } from '@stores/user/UserStore';
import { Wallet, ChevronDown, LogOut, User, Menu, Bell } from 'lucide-react';
import { Footer } from '@shared/components/LandingPage/Footer';
import { LOGOUT } from '@shared/constants/userContants';
import ConfirmModal from '@shared/components/modals/ConfirmModal';
import { NotificationDropdown } from '@modules/user/notifications/components/NotificationDropdown';
import { useProfileQuery } from '@shared/services/user/ProfileApi';
import AiAssistantPanel from '@shared/components/ai-chatbot/AiChatbot';
import { ROUTES } from '@shared/constants/routes';
import PremiumPaymentModal from '@shared/components/modals/premium-payment/PremiumPaymentModal';
import { usePremiumModalStore } from '@stores/user/PremiumModalStore';

const UserLayout = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { user, logout, setUser } = useUserStore();
    const { isOpen: isPremiumModalOpen, onClose: closePremiumModal } = usePremiumModalStore();
    const navigate = useNavigate();

    const { data } = useProfileQuery()
    useEffect(() => {
        if (data) {
            setUser(data);
        }
    }, []);

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
                        {([
                            { to: ROUTES.USER.HOME, label: 'Dashboard' },
                            { to: ROUTES.USER.EXPENSE_TRACKER, label: 'Expense tracker' },
                            { to: ROUTES.USER.WALLET.ROOT, label: 'Wallet' },
                            { to: ROUTES.USER.MUTUAL_FUNDS.ROOT, label: 'Mutual Funds' },
                            { to: ROUTES.USER.TRADING, label: 'Stocks' },
                            { to: ROUTES.USER.PORTFOLIO.ROOT, label: 'Portfolio' },
                            { to: ROUTES.USER.MARKET_NEWS, label: "News" },
                            // { to: ROUTES.USER.AI_BOT, label: "AI bot" }
                        ] as any[]).map((item) => (
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
                            <span>₹1,24,500</span>
                        </div>

                        <NotificationDropdown />

                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-[#1a1a1a] transition text-xs font-medium tracking-wide border border-transparent hover:border-[#333]"
                            >
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#22C55E] to-[#16a34a] flex items-center justify-center text-xs font-bold text-black">
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

                        <button className="lg:hidden">
                            <Menu size={20} className="text-gray-400" />
                        </button>
                    </div>
                </div>
            </header>

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