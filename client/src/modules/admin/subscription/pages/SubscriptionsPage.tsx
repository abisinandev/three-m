import { useState } from "react";
import OverviewTab from "../components/OverviewTab";
import PlansTab from "../components/PlansTab";
import SubscriptionsTab from "../components/SubscriptionsTab";

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

export default SubscriptionsPage;
