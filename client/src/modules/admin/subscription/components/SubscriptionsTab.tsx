import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, User } from "lucide-react";
import subscriptionService from "@/shared/services/subscription/subscription-service";
import { Pagination } from "@/shared/components/pagination/Pagination";

export const SubscriptionsTab = () => {
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
                                                <div className="text-white font-medium">{sub.fullName}</div>
                                                <div className="text-[9px] text-neutral-500">{sub.email}</div>
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

export default SubscriptionsTab;

