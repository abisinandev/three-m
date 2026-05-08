import type { AdminDashboardData } from "../types/dashboard.types";

interface RecentTransactionsProps {
    data: AdminDashboardData['recentTransactions'];
    formatCurrency: (val: number) => string;
}

export const RecentTransactions = ({ data, formatCurrency }: RecentTransactionsProps) => {
    return (
        <div className="lg:col-span-2 bg-[#0f0f0f] border border-[#1f1f1f] rounded-md p-4">
            <h3 className="text-[11px] font-semibold mb-4 text-gray-200 uppercase tracking-wider">Recent Transactions</h3>
            <div className="space-y-2">
                {data.length > 0 ? data.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-2.5 rounded bg-[#161616] border border-[#1f1f1f] hover:border-[#2a2a2a] transition-colors">
                        <div className="flex items-center gap-3">
                            <div>
                                <div className="text-[11px] font-semibold text-gray-200">#{tx.id.slice(-6).toUpperCase()}</div>
                                <div className="text-[9px] text-gray-500 mt-0.5">{tx.user} • {new Date(tx.time).toLocaleDateString()}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-[11px] font-bold text-gray-100">{formatCurrency(tx.amount)}</div>
                            <div className="text-[9px] text-gray-500 mt-0.5">{tx.type}</div>
                        </div>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ml-4 ${tx.status === 'SUCCESSFUL'
                                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                : tx.status === 'PENDING' || tx.status === 'PROCESSING'
                                    ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                            {tx.status}
                        </span>
                    </div>
                )) : (
                    <div className="text-[11px] text-gray-500 text-center py-4">No recent transactions</div>
                )}
            </div>
        </div>
    );
};
