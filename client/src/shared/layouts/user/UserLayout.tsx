import { Outlet, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import api from '@lib/axiosUser';
import { useUserStore } from '@stores/user/UserStore';
import { Wallet, ChevronDown, LogOut, User, Menu, Bell } from 'lucide-react';
import { Footer } from '@shared/components/LandingPage/Footer';
import { LOGOUT } from '@shared/constants/userContants';
import ConfirmModal from '@shared/components/modals/ConfirmModal';
import { useProfileQuery } from '@shared/services/user/ProfileApi';

const UserLayout = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const { setUser } = useUserStore()
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { user, logout } = useUserStore();
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
            navigate({ to: '/auth/login', replace: true });
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
                    <Link to="/user/home" className="flex items-center">
                        <h1 className="text-xl font-bold tracking-tighter">
                            <span className="text-white">three</span>
                            <span className="text-[#22C55E]">M</span>
                        </h1>
                    </Link>

                    <nav className="hidden lg:flex items-center gap-8 font-medium text-gray-400">
                        {[
                            { to: '/user/home', label: 'Dashboard' },
                            { to: '/user/expenses', label: 'Expense tracker' },
                            { to: '/user/wallet', label: 'Wallet' },
                            { to: '/user/mutual-funds', label: 'Mutual Funds' },
                            // { to: '/user/sip', label: 'SIP' },
                            { to: '/user/algo', label: 'Algo trading' },
                            { to: '/user/portfolio', label: 'Portfolio' },
                            { to: '/user/news', label: "News" },
                            { to: '/user/ai-bot', label: "AI bot" }
                        ].map((item) => (
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
                        <button className="relative p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors group">
                            <Bell className="w-4.5 h-4.5 text-gray-400 group-hover:text-gray-200 transition" />

                            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#0f0f0f]">
                                3
                            </span>

                            <span className="absolute inset-0 rounded-lg ring-2 ring-transparent group-hover:ring-[#22C55E]/20 transition-all" />
                        </button>
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
                                            to="/user/profile"
                                            onClick={() => setIsDropdownOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-[#1a1a1a] transition"
                                        >
                                            <User size={16} />
                                            Profile
                                        </Link>
                                        <Link
                                            to="/user/home"
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

            <Footer />

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