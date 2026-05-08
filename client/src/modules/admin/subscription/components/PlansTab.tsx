import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import {
    Lock, Info, AlertTriangle, Save, RefreshCw, CheckCircle2,
    TrendingUp, LineChart, Cpu, BarChart3, Zap
} from "lucide-react";
import subscriptionService, { type Plan } from "@/shared/services/subscription/subscription-service";

const FEATURE_SECTIONS = [
    {
        id: "investing",
        label: "Investing",
        icon: TrendingUp,
        features: [
            { id: "PORTFOLIO_BASIC", label: "Portfolio Basic", tier: "FREE", critical: false },
            { id: "MF_ONE_TIME", label: "Mutual Funds One-Time", tier: "FREE", critical: false },
            { id: "SIP_AUTOMATION", label: "SIP Automation", tier: "PREMIUM", critical: false },
            { id: "MARKET_NEWS", label: "Market News", tier: "FREE", critical: false }
        ]
    },
    {
        id: "trading",
        label: "Trading",
        icon: LineChart,
        features: [
            { id: "STOCK_TRADING", label: "Stock Trading", tier: "PREMIUM", critical: false },
            { id: "ALGO_TRADING", label: "Algo Trading", tier: "PREMIUM", critical: true },
            { id: "TRADE_EXECUTION_BOT", label: "Execution Bot", tier: "PREMIUM", critical: false }
        ]
    },
    {
        id: "ai",
        label: "AI Features",
        icon: Cpu,
        features: [
            { id: "CHATBOT_BASIC", label: "Basic Chatbot", tier: "FREE", critical: false },
            { id: "AI_CHAT_ADVANCED", label: "Advanced AI Chat", tier: "PREMIUM", critical: false }
        ]
    },
    {
        id: "analytics",
        label: "Analytics",
        icon: BarChart3,
        features: [
            { id: "EXPENSE_TRACKING", label: "Expense Tracking", tier: "FREE", critical: false },
            { id: "PORTFOLIO_ANALYTICS", label: "Portfolio Analytics", tier: "PREMIUM", critical: false }
        ]
    }
];

const FreePlanCard = ({ plan }: { plan?: Plan }) => {
    return (
        <div className="bg-[#111] border border-neutral-800/60 rounded-xl p-5 flex flex-col h-full shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400">
                        <Zap className="w-4 h-4" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white tracking-wide">FREE</h2>
                        <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-medium">Default Tier</span>
                    </div>
                </div>
                <Lock className="w-3.5 h-3.5 text-neutral-600" />
            </div>

            <div className="flex items-baseline gap-1 mb-6">
                <span className="text-2xl font-bold text-white">₹0</span>
                <span className="text-[10px] text-neutral-500 font-medium">/ lifetime</span>
            </div>

            <div className="space-y-4 flex-1">
                {FEATURE_SECTIONS.map((section) => {
                    const tierFeatures = section.features.filter(f => f.tier === "FREE");
                    if (tierFeatures.length === 0) return null;
                    return (
                        <div key={section.id}>
                            <h4 className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                <section.icon className="w-3 h-3" />
                                {section.label}
                            </h4>
                            <div className="space-y-1.5 pl-1">
                                {tierFeatures.map(f => (
                                    <div key={f.id} className="flex items-center justify-between text-[11px] text-neutral-400">
                                        <span>{f.label}</span>
                                        <CheckCircle2 className="w-3 h-3 text-neutral-700" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-800/50 flex gap-2 items-start">
                <Info className="w-3.5 h-3.5 text-neutral-600 mt-0.5 shrink-0" />
                <p className="text-[10px] text-neutral-500 leading-tight">
                    Free plan features are hardcoded and cannot be deactivated from the admin panel.
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
                features: [...(plan.features || [])],
                isActive: plan.isActive
            });
        }
    }, [plan]);

    const mutation = useMutation({
        mutationFn: (data: Partial<Plan>) => subscriptionService.updatePlan("PREMIUM", data),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ["admin-plans"] });
            setSavedSuccessfully(true);
            toast.success(response?.message || "Plan updated successfully");
            setTimeout(() => setSavedSuccessfully(false), 3000);
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            toast.error(error?.response?.data?.message || "Failed to update plan");
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

    const handleSave = () => mutation.mutate(draft);

    return (
        <div className="bg-[#111] border border-emerald-500/30 rounded-xl p-5 flex flex-col h-full shadow-lg relative group/card transition-colors hover:border-emerald-500/50">
            {hasChanges && (
                <div className="absolute -top-2.5 -right-2.5 flex items-center gap-1.5 px-2 py-0.5 bg-amber-500 border border-amber-400 rounded text-black shadow-sm animate-pulse">
                    <span className="text-[9px] font-bold uppercase tracking-widest">Unsaved</span>
                </div>
            )}

            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <Zap className="w-4 h-4 fill-emerald-500/50" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white tracking-wide">PREMIUM</h2>
                        <span className="text-[10px] text-emerald-500 uppercase tracking-widest font-medium">Pro Features</span>
                    </div>
                </div>
                <div className="flex items-center justify-center cursor-pointer" onClick={() => setDraft({ ...draft, isActive: !draft.isActive })}>
                    <div className={`w-8 h-4 rounded-full relative transition-colors duration-200 ${draft.isActive ? "bg-emerald-500" : "bg-neutral-700"}`}>
                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all duration-200 ${draft.isActive ? "right-0.5" : "left-0.5"}`} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6 bg-[#161616] border border-neutral-800/60 p-3 rounded-lg">
                <div>
                    <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest mb-1 block">Price (₹)</label>
                    <input
                        type="number"
                        value={draft.price ?? 0}
                        onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
                        className="w-full bg-[#1A1A1A] border border-neutral-800 rounded py-1 px-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-500/50"
                    />
                </div>
                <div>
                    <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest mb-1 block">Days</label>
                    <input
                        type="number"
                        value={draft.durationInDays ?? 0}
                        onChange={(e) => setDraft({ ...draft, durationInDays: Number(e.target.value) })}
                        className="w-full bg-[#1A1A1A] border border-neutral-800 rounded py-1 px-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-500/50"
                    />
                </div>
            </div>

            <div className="space-y-4 flex-1">
                {FEATURE_SECTIONS.map((section) => {
                    const tierFeatures = section.features.filter(f => f.tier === "PREMIUM");
                    if (tierFeatures.length === 0) return null;
                    return (
                        <div key={section.id}>
                            <h4 className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                <section.icon className="w-3 h-3" />
                                {section.label}
                            </h4>
                            <div className="space-y-1 pl-1">
                                {tierFeatures.map(f => {
                                    const isEnabled = draft.features?.includes(f.id);
                                    return (
                                        <div key={f.id} onClick={() => toggleFeature(f.id)} className="flex items-center justify-between text-[11px] py-1 cursor-pointer group/feat">
                                            <div className="flex items-center gap-1.5">
                                                <span className={isEnabled ? "text-neutral-200" : "text-neutral-600"}>{f.label}</span>
                                                {f.critical && <AlertTriangle className={`w-3 h-3 ${isEnabled ? "text-amber-500/60" : "text-neutral-700"}`} />}
                                            </div>
                                            <div className={`w-6 h-3 rounded-full relative transition-colors duration-200 ${isEnabled ? "bg-emerald-500/80" : "bg-neutral-800"}`}>
                                                <div className={`absolute top-0.5 w-2 h-2 bg-white rounded-full transition-all duration-200 ${isEnabled ? "right-0.5" : "left-0.5"}`} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-800/50 flex justify-end">
                <button
                    disabled={!hasChanges || mutation.isPending}
                    onClick={handleSave}
                    className={`px-4 py-1.5 rounded text-[11px] font-bold flex items-center gap-1.5 transition-all ${!hasChanges
                        ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                        : savedSuccessfully
                            ? "bg-emerald-500 text-white"
                            : "bg-white text-black hover:bg-neutral-200 active:scale-95"
                        }`}
                >
                    {mutation.isPending ? <RefreshCw className="w-3 h-3 animate-spin" /> : savedSuccessfully ? <CheckCircle2 className="w-3 h-3" /> : <Save className="w-3 h-3" />}
                    {savedSuccessfully ? "Saved" : "Save Changes"}
                </button>
            </div>
        </div>
    );
};

export const PlansTab = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["admin-plans"],
        queryFn: () => subscriptionService.getPlans({}),
    });

    const freePlan = data?.plans.find(p => p.code === "FREE");
    const premiumPlan = data?.plans.find(p => p.code === "PREMIUM");

    if (isLoading) return <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">{[1, 2].map(i => <div key={i} className="h-[400px] bg-neutral-900/50 rounded-xl animate-pulse border border-neutral-800" />)}</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <FreePlanCard plan={freePlan} />
            <PremiumPlanCard plan={premiumPlan} />
        </div>
    );
};

export default PlansTab;

