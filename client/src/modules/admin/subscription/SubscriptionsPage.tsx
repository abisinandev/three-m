import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Search, LayoutGrid, Activity, CreditCard, Users, User,
    Lock, Info, AlertTriangle, Save, RefreshCw, CheckCircle2,
    TrendingUp, LineChart, Cpu, BarChart3, ShieldCheck, Zap
} from "lucide-react";
import subscriptionService, { type Plan } from "@lib/services/admin/subscriptionService";
import { Pagination } from "@/shared/components/pagination/Pagination";

const FEATURE_SECTIONS = [
    {
        id: "investing",
        label: "Investing",
        icon: TrendingUp,
        features: [
            { id: "PORTFOLIO_BASIC", label: "Portfolio Basic", tier: "FREE" },
            { id: "MF_ONE_TIME", label: "Mutual Funds One-Time", tier: "FREE" },
            { id: "SIP_AUTOMATION", label: "SIP Automation", tier: "PREMIUM" },
            { id: "MARKET_NEWS", label: "Market News", tier: "FREE" }
        ]
    },
    {
        id: "trading",
        label: "Trading",
        icon: LineChart,
        features: [
            { id: "STOCK_TRADING", label: "Stock Trading", tier: "PREMIUM" },
            { id: "ALGO_TRADING", label: "Algo Trading", tier: "PREMIUM", critical: true },
            { id: "TRADE_EXECUTION_BOT", label: "Execution Bot", tier: "PREMIUM" }
        ]
    },
    {
        id: "ai",
        label: "AI Features",
        icon: Cpu,
        features: [
            { id: "CHATBOT_BASIC", label: "Basic Chatbot", tier: "FREE" },
            { id: "AI_CHAT_ADVANCED", label: "Advanced AI Chat", tier: "PREMIUM" }
        ]
    },
    {
        id: "analytics",
        label: "Analytics",
        icon: BarChart3,
        features: [
            { id: "EXPENSE_TRACKING", label: "Expense Tracking", tier: "FREE" },
            { id: "PORTFOLIO_ANALYTICS", label: "Portfolio Analytics", tier: "PREMIUM" }
        ]
    }
];

// --- MAIN PAGE COMPONENT ---

const SubscriptionsPage = () => {
    const [activeTab, setActiveTab] = useState<"overview" | "plans" | "subscriptions">("overview");

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-neutral-300 p-4 font-sans selection:bg-emerald-500/30">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-lg font-semibold text-white tracking-tight">Subscription Management</h1>
                    <p className="text-[10px] text-neutral-500 mt-0.5">Manage access tiers and monitor user memberships</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 p-1 bg-neutral-900/50 rounded-lg w-fit mb-6 border border-neutral-800/50">
                {(["overview", "plans", "subscriptions"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-1.5 text-[11px] font-medium rounded-md capitalize transition-all duration-200 ${activeTab === tab
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

    if (isLoading) return <div className="grid grid-cols-4 gap-4">{[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-neutral-900/50 rounded-xl animate-pulse" />)}</div>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Active Revenue", value: `₹${stats?.totalRevenue.toLocaleString() || "0"}`, sub: "Value of active commitments", icon: CreditCard, color: "text-emerald-400" },
                    { label: "Total Subs", value: stats?.totalSubscriptions.toLocaleString() || "0", sub: "Lifetime count", icon: Users, color: "text-blue-400" },
                    { label: "Active Now", value: stats?.activeSubscriptions.toLocaleString() || "0", sub: "Currently subscribed", icon: Activity, color: "text-amber-400" },
                    { label: "Plan Tiers", value: `${stats?.subscriptionPlans.length || 0}`, sub: "Available options", icon: LayoutGrid, color: "text-purple-400" },
                ].map((stat, i) => (
                    <div key={i} className="bg-[#111111] border border-neutral-800/50 p-4 rounded-xl hover:border-neutral-700/50 transition-colors group shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider font-sans">{stat.label}</span>
                            <stat.icon className={`w-4 h-4 ${stat.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                        </div>
                        <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-[9px] text-neutral-500 font-medium">{stat.sub}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#111111] border border-neutral-800/50 rounded-xl p-5 shadow-sm">
                    <h3 className="text-[12px] font-semibold text-white mb-5">Recent Memberships</h3>
                    <div className="space-y-4">
                        {stats?.recentSubscribers.map((sub, i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b border-neutral-800 last:border-0 group cursor-pointer transition-colors hover:bg-neutral-800/10 px-2 -mx-2 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-[10px] font-bold text-neutral-400 group-hover:border-emerald-500/30 transition-all">
                                        {sub.userName[0]}
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-medium text-white">{sub.userName}</div>
                                        <div className="text-[9px] text-neutral-500">{sub.planCode} • {new Date(sub.createdAt).toLocaleDateString()}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[11px] font-medium text-emerald-400">₹{sub.amount}</div>
                                    <div className="text-[9px] text-neutral-600">{sub.userEmail}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[#111111] border border-neutral-800/50 rounded-xl p-5 shadow-sm">
                    <h3 className="text-[12px] font-semibold text-white mb-5">Plan Adoption</h3>
                    <div className="space-y-5">
                        {stats?.subscriptionPlans.map((plan, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex items-center justify-between text-[10px]">
                                    <span className="font-medium text-neutral-300 uppercase tracking-wide">{plan.code}</span>
                                    <span className="text-neutral-500 font-mono">{plan.count} ({plan.percentage.toFixed(1)}%)</span>
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
    const { data, isLoading } = useQuery({
        queryKey: ["admin-plans"],
        queryFn: () => subscriptionService.getPlans({}),
    });

    const freePlan = data?.plans.find(p => p.code === "FREE");
    const premiumPlan = data?.plans.find(p => p.code === "PREMIUM");

    if (isLoading) return <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{[1, 2].map(i => <div key={i} className="h-[400px] bg-neutral-900/50 rounded-2xl animate-pulse border border-neutral-800" />)}</div>;

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-7xl mx-auto">
            <FreePlanCard plan={freePlan} />
            <PremiumPlanCard plan={premiumPlan} />
        </div>
    );
};

const FreePlanCard = ({ plan }: { plan?: Plan }) => {
    return (
        <div className="bg-[#111111] border border-neutral-800/50 rounded-2xl p-6 relative overflow-hidden group/card shadow-lg opacity-80">
            <div className="absolute top-4 right-4 flex items-center gap-2 px-2 py-1 bg-neutral-800/50 border border-neutral-700/50 rounded-md">
                <Lock className="w-3 h-3 text-neutral-500" />
                <span className="text-[9px] font-medium text-neutral-500 uppercase tracking-widest">Default Plan</span>
            </div>

            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-neutral-500">
                        <Zap className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight">FREE</h2>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white">₹0</span>
                    <span className="text-[11px] text-neutral-500 font-medium">/ lifetime</span>
                </div>
            </div>

            <div className="space-y-6 pointer-events-none opacity-50 grayscale">
                {FEATURE_SECTIONS.map((section) => {
                    const tierFeatures = section.features.filter(f => f.tier === "FREE");
                    if (tierFeatures.length === 0) return null;

                    return (
                        <div key={section.id} className="space-y-3">
                            <div className="flex items-center gap-2">
                                <section.icon className="w-3.5 h-3.5 text-neutral-500" />
                                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{section.label}</span>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                {tierFeatures.map(f => (
                                    <div key={f.id} className="flex items-center justify-between p-2 bg-neutral-900/30 rounded-lg border border-neutral-800/50">
                                        <span className="text-[11px] text-neutral-400">{f.label}</span>
                                        <div className="w-7 h-4 bg-neutral-800 rounded-full" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-10 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800/80 flex items-start gap-3">
                <Info className="w-4 h-4 text-neutral-600 mt-0.5" />
                <p className="text-[10px] text-neutral-500 leading-relaxed font-medium">
                    The FREE plan is the base tier for all new users. It cannot be edited or deactivated.
                </p>
            </div>
        </div>
    );
};

const PremiumPlanCard = ({ plan }: { plan?: Plan }) => {
    const queryClient = useQueryClient();
    const [draft, setDraft] = useState<Partial<Plan>>({});
    const [savedSuccessfully, setSavedSuccessfully] = useState(false);

    useEffect(() => {
        if (plan) {
            setDraft({
                price: plan.price,
                durationInDays: plan.durationInDays,
                features: [...plan.features],
                isActive: plan.isActive
            });
        }
    }, [plan]);

    const mutation = useMutation({
        mutationFn: (data: Partial<Plan>) => subscriptionService.updatePlan("PREMIUM", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-plans"] });
            setSavedSuccessfully(true);
            setTimeout(() => setSavedSuccessfully(false), 3000);
        },
        onError: (error: any) => {
            alert(error?.response?.data?.message || "Failed to update plan");
        }
    });

    const hasChanges = plan && (
        draft.price !== plan.price ||
        draft.durationInDays !== plan.durationInDays ||
        JSON.stringify(draft.features) !== JSON.stringify(plan.features) ||
        draft.isActive !== plan.isActive
    );

    const toggleFeature = (featureId: string) => {
        const currentFeatures = draft.features || [];
        if (currentFeatures.includes(featureId)) {
            setDraft({ ...draft, features: currentFeatures.filter(f => f !== featureId) });
        } else {
            setDraft({ ...draft, features: [...currentFeatures, featureId] });
        }
    };

    const handleReset = () => {
        if (plan) {
            setDraft({
                price: plan.price,
                durationInDays: plan.durationInDays,
                features: [...plan.features],
                isActive: plan.isActive
            });
        }
    };

    const handleSave = () => {
        mutation.mutate(draft);
    };

    return (
        <div className="bg-[#111111] border-2 border-emerald-500/20 rounded-2xl p-6 relative shadow-2xl shadow-emerald-500/5 group/card transition-all hover:border-emerald-500/40">
            <div className="absolute top-4 right-4 flex items-center gap-3">
                {hasChanges && (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-md animate-pulse">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                        <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">Unsaved Changes</span>
                    </div>
                )}
                <div className="flex items-center gap-2 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Premium Tier</span>
                </div>
            </div>

            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <Zap className="w-5 h-5 fill-emerald-500" />
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight">PREMIUM</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Monthly Price</label>
                        <div className="relative group">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-bold group-focus-within:text-emerald-500 transition-colors">₹</span>
                            <input
                                type="number"
                                value={draft.price ?? 0}
                                onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
                                className="w-full bg-[#1A1A1A] border border-neutral-800 rounded-xl py-2 pl-7 pr-3 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Duration (Days)</label>
                        <input
                            type="number"
                            value={draft.durationInDays ?? 0}
                            onChange={(e) => setDraft({ ...draft, durationInDays: Number(e.target.value) })}
                            className="w-full bg-[#1A1A1A] border border-neutral-800 rounded-xl py-2 px-3 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between p-3 bg-neutral-900/50 rounded-xl border border-neutral-800/80 mb-6 group cursor-pointer" onClick={() => setDraft({ ...draft, isActive: !draft.isActive })}>
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${draft.isActive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>
                            <Activity className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="text-[11px] font-bold text-white uppercase tracking-tight">Allow New Subscriptions</div>
                            <div className="text-[9px] text-neutral-500">Toggle public availability of this plan</div>
                        </div>
                    </div>
                    <button className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${draft.isActive ? "bg-emerald-500" : "bg-neutral-800"}`}>
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${draft.isActive ? "right-1" : "left-1"}`} />
                    </button>
                </div>

                {FEATURE_SECTIONS.map((section) => {
                    const tierFeatures = section.features.filter(f => f.tier === "PREMIUM");
                    if (tierFeatures.length === 0) return null;

                    return (
                        <div key={section.id} className="space-y-3">
                            <div className="flex items-center gap-2 px-1">
                                <section.icon className="w-3.5 h-3.5 text-neutral-400" />
                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{section.label}</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {tierFeatures.map(f => {
                                    const isEnabled = draft.features?.includes(f.id);
                                    return (
                                        <div
                                            key={f.id}
                                            onClick={() => toggleFeature(f.id)}
                                            className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer group/item hover:scale-[1.01] active:scale-[0.99] ${isEnabled ? "bg-neutral-800/50 border-neutral-700 shadow-sm" : "bg-transparent border-neutral-800/40 opacity-60"
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[11px] font-medium transition-colors ${isEnabled ? "text-neutral-200" : "text-neutral-500"}`}>{f.label}</span>
                                                {f.critical && (
                                                    <span title="Disabling this affects core trading operations">
                                                        <Info className="w-3 h-3 text-neutral-600 group-hover/item:text-amber-500 transition-colors" />
                                                    </span>
                                                )}
                                            </div>
                                            <button className={`w-8 h-4 rounded-full relative transition-colors duration-300 ${isEnabled ? "bg-emerald-500/80" : "bg-neutral-800"}`}>
                                                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all duration-300 ${isEnabled ? "right-0.5" : "left-0.5"}`} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {draft.features?.includes("ALGO_TRADING") === false && plan?.features.includes("ALGO_TRADING") && (
                <div className="mt-8 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-[10px] text-amber-500 leading-relaxed font-medium">
                        <span className="font-bold uppercase tracking-wider block mb-0.5">Critical Warning</span>
                        Disabling "Algo Trading" will prevent premium users from executing automated strategies instantly.
                    </p>
                </div>
            )}

            <div className="mt-10 flex items-center justify-between gap-4 pt-6 border-t border-neutral-800/50">
                <div className="flex items-center gap-2 group cursor-help">
                    <Info className="w-3.5 h-3.5 text-neutral-600" />
                    <span className="text-[9px] text-neutral-500 font-medium italic group-hover:text-neutral-400 transition-colors underline decoration-neutral-800 underline-offset-4">Changes affect all premium users instantly</span>
                </div>

                <div className="flex items-center gap-3">
                    {hasChanges && (
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 text-[11px] font-bold text-neutral-500 hover:text-white transition-colors flex items-center gap-2"
                        >
                            <RefreshCw className="w-3 h-3" />
                            Reset
                        </button>
                    )}
                    <button
                        disabled={!hasChanges || mutation.isPending}
                        onClick={handleSave}
                        className={`px-6 py-2 rounded-xl text-[11px] font-bold flex items-center gap-2 transition-all shadow-lg ${!hasChanges
                            ? "bg-neutral-800 text-neutral-600 grayscale cursor-not-allowed opacity-50"
                            : savedSuccessfully
                                ? "bg-emerald-500 text-white"
                                : "bg-white text-black hover:bg-neutral-100 active:scale-95 shadow-white/5"
                            }`}
                    >
                        {mutation.isPending ? <RefreshCw className="w-3 h-3 animate-spin" /> : savedSuccessfully ? <CheckCircle2 className="w-3 h-3" /> : <Save className="w-3 h-3" />}
                        {savedSuccessfully ? "Changes Saved" : mutation.isPending ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
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

    // Reset to first page when filters change
    useEffect(() => {
        setPage(1);
    }, [search, status]);

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
                        {isLoading ? [1, 2, 3, 4, 5].map(i => <tr key={i}><td colSpan={4} className="px-6 py-4"><div className="h-4 bg-neutral-800/50 animate-pulse rounded" /></td></tr>) :
                            data?.subscriptions.map((sub) => (
                                <tr key={sub.id} className="group hover:bg-neutral-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700 shadow-sm"><User className="w-3 h-3 text-neutral-500" /></div>
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
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium shadow-sm ${sub.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                                            sub.status === "EXPIRED" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                                                "bg-red-500/10 text-red-500 border border-red-500/20"
                                            }`}>
                                            {sub.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {!isLoading && data && data.totalCount > 10 && (
                <Pagination
                    page={page}
                    limit={10}
                    total={data.totalCount}
                    onPageChange={setPage}
                />
            )}
        </div>
    );
};

export default SubscriptionsPage;
