import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, LayoutGrid, Activity, CreditCard, Users, User } from "lucide-react";
import subscriptionService from "@lib/services/admin/subscriptionService";
import { Pagination } from "@shared/components/pagination/Pagination";

const SubscriptionsPage = () => {
    const [activeTab, setActiveTab] = useState<"overview" | "plans" | "subscriptions">("overview");

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-neutral-300 p-4 font-sans selection:bg-emerald-500/30">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-lg font-semibold text-white tracking-tight">Subscription Management</h1>
                    <p className="text-[10px] text-neutral-500 mt-0.5">Monitor your service plans and user memberships</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 p-1 bg-neutral-900/50 rounded-lg w-fit mb-6 border border-neutral-800/50">
                {(["overview", "plans", "subscriptions"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-1.5 text-[11px] font-medium rounded-md capitalize transition-all duration-200 ${
                            activeTab === tab 
                                ? "bg-neutral-800 text-white shadow-sm" 
                                : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/30"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                {activeTab === "overview" && <OverviewTab />}
                {activeTab === "plans" && <PlansTab />}
                {activeTab === "subscriptions" && <SubscriptionsTab />}
            </div>
        </div>
    );
};

// --- SUBSIDIARY COMPONENTS ---

const OverviewTab = () => {
    const { data: stats, isLoading } = useQuery({
        queryKey: ["admin-subscription-stats"],
        queryFn: subscriptionService.getOverviewStats,
    });

    if (isLoading) return <div className="grid grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-24 bg-neutral-900/50 rounded-xl animate-pulse" />)}</div>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Active Revenue", value: `$${stats?.totalRevenue.toLocaleString() || "0"}`, sub: "Value of active commitments", icon: CreditCard, color: "text-emerald-400" },
                    { label: "Total Subs", value: stats?.totalSubscriptions.toLocaleString() || "0", sub: "Lifetime count", icon: Users, color: "text-blue-400" },
                    { label: "Active Now", value: stats?.activeSubscriptions.toLocaleString() || "0", sub: "Currently subscribed", icon: Activity, color: "text-amber-400" },
                    { label: "Plan Tiers", value: `${stats?.subscriptionPlans.length || 0}`, sub: "Available options", icon: LayoutGrid, color: "text-purple-400" },
                ].map((stat, i) => (
                    <div key={i} className="bg-[#111111] border border-neutral-800/50 p-4 rounded-xl hover:border-neutral-700/50 transition-colors group">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider">{stat.label}</span>
                            <stat.icon className={`w-4 h-4 ${stat.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                        </div>
                        <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-[9px] text-neutral-500 font-medium">{stat.sub}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#111111] border border-neutral-800/50 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-[12px] font-semibold text-white">Recent Memberships</h3>
                    </div>
                    <div className="space-y-4">
                        {stats?.recentSubscribers.map((sub, i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b border-neutral-800 last:border-0 group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-[10px] font-bold text-neutral-400 group-hover:bg-neutral-700 transition-colors">
                                        {sub.userName[0]}
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-medium text-white">{sub.userName}</div>
                                        <div className="text-[9px] text-neutral-500">{sub.planCode} • {new Date(sub.createdAt).toLocaleDateString()}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[11px] font-medium text-emerald-400">${sub.amount}</div>
                                    <div className="text-[9px] text-neutral-600">{sub.userEmail}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[#111111] border border-neutral-800/50 rounded-xl p-5">
                    <h3 className="text-[12px] font-semibold text-white mb-5">Plan Adoption</h3>
                    <div className="space-y-5">
                        {stats?.subscriptionPlans.map((plan, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex items-center justify-between text-[10px]">
                                    <span className="font-medium text-neutral-300">{plan.code}</span>
                                    <span className="text-neutral-500">{plan.count} ({plan.percentage.toFixed(1)}%)</span>
                                </div>
                                <div className="h-1.5 w-full bg-neutral-800/50 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${plan.percentage}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const PlansTab = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<boolean | undefined>(undefined);

    const { data, isLoading } = useQuery({
        queryKey: ["admin-plans", page, search, statusFilter],
        queryFn: () => subscriptionService.getPlans({ page, limit: 10, search, isActive: statusFilter }),
    });

    return (
        <div className="bg-[#111111] border border-neutral-800/50 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-neutral-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative max-w-xs w-full">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
                    <input
                        type="text"
                        placeholder="Search plans..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#1A1A1A] border border-neutral-800 rounded-md py-1.5 pl-8 pr-3 text-[11px] text-white focus:outline-none focus:border-emerald-500/50 transition-all font-sans"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <select 
                        value={statusFilter === undefined ? "" : String(statusFilter)}
                        onChange={(e) => setStatusFilter(e.target.value === "" ? undefined : e.target.value === "true")}
                        className="bg-[#1A1A1A] border border-neutral-800 rounded-md py-1.5 px-3 text-[11px] text-neutral-400 focus:outline-none"
                    >
                        <option value="">All Status</option>
                        <option value="true">Active Only</option>
                        <option value="false">Inactive Only</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-neutral-900/30 text-[10px] text-neutral-500 uppercase tracking-widest font-semibold border-b border-neutral-800/50">
                            <th className="px-6 py-4">Plan Code</th>
                            <th className="px-6 py-4">Pricing</th>
                            <th className="px-6 py-4">Duration</th>
                            <th className="px-6 py-4 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/30 text-[11px]">
                        {isLoading ? [1,2,3,4,5].map(i => <tr key={i}><td colSpan={4} className="px-6 py-4"><div className="h-4 bg-neutral-800/50 animate-pulse rounded" /></td></tr>) :
                        data?.plans.map((plan) => (
                            <tr key={plan.id} className="group hover:bg-neutral-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-white tracking-wide uppercase">{plan.code}</div>
                                    <div className="text-[9px] text-neutral-500 truncate max-w-[200px]">{plan.features.join(' • ')}</div>
                                </td>
                                <td className="px-6 py-4 text-emerald-400 font-medium">${plan.price.toFixed(2)}</td>
                                <td className="px-6 py-4 text-neutral-400">{plan.durationInDays} Days</td>
                                <td className="px-6 py-4 text-right">
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium ${plan.isActive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>
                                        {plan.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {data && <Pagination page={page} limit={10} total={data.totalCount} onPageChange={setPage} />}
        </div>
    );
};

const SubscriptionsTab = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");

    const { data, isLoading } = useQuery({
        queryKey: ["admin-user-subscriptions", page, search, status],
        queryFn: () => subscriptionService.getUserSubscriptions({ page, limit: 10, search, status }),
    });

    return (
        <div className="bg-[#111111] border border-neutral-800/50 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-neutral-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative max-w-xs w-full">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
                    <input
                        type="text"
                        placeholder="Search users or plans..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#1A1A1A] border border-neutral-800 rounded-md py-1.5 pl-8 pr-3 text-[11px] text-white focus:outline-none focus:border-emerald-500/50 transition-all font-sans"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <select 
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="bg-[#1A1A1A] border border-neutral-800 rounded-md py-1.5 px-3 text-[11px] text-neutral-400 focus:outline-none font-sans"
                    >
                        <option value="">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="EXPIRED">Expired</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-sans">
                    <thead>
                        <tr className="bg-neutral-900/30 text-[10px] text-neutral-500 uppercase tracking-widest font-semibold border-b border-neutral-800/50">
                            <th className="px-6 py-4">Member</th>
                            <th className="px-6 py-4">Plan Tier</th>
                            <th className="px-6 py-4">Membership Cycle</th>
                            <th className="px-6 py-4 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/30 text-[11px]">
                        {isLoading ? [1,2,3,4,5].map(i => <tr key={i}><td colSpan={4} className="px-6 py-4"><div className="h-4 bg-neutral-800/50 animate-pulse rounded" /></td></tr>) :
                        data?.subscriptions.map((sub) => (
                            <tr key={sub.id} className="group hover:bg-neutral-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700"><User className="w-3 h-3 text-neutral-500" /></div>
                                        <div>
                                            <div className="text-white font-medium">{sub.userName}</div>
                                            <div className="text-[9px] text-neutral-500">{sub.userEmail}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-bold text-emerald-400 uppercase tracking-wider">{sub.planCode}</td>
                                <td className="px-6 py-4 text-neutral-400">
                                    {new Date(sub.startDate).toLocaleDateString()} — {new Date(sub.endDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium ${
                                        sub.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-500" : 
                                        sub.status === "EXPIRED" ? "bg-amber-500/10 text-amber-500" : "bg-red-500/10 text-red-500"
                                    }`}>
                                        {sub.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {data && <Pagination page={page} limit={10} total={data.totalCount} onPageChange={setPage} />}
        </div>
    );
};

export default SubscriptionsPage;
