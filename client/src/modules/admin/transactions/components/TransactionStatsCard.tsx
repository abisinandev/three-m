import React from "react";
import { ArrowUpDown, CheckCircle, Clock, DollarSign, XCircle } from "lucide-react";

interface TransactionStatsProps {
    total: number;
    successfulTransactions: number;
    failedTransactions: number;
    pendingTransactions: number;
    totalAmount: number;
}

export const TransactionStatsCard: React.FC<TransactionStatsProps> = ({
    total,
    successfulTransactions,
    failedTransactions,
    pendingTransactions,
    totalAmount,
}) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <StatCard 
                title="TOTAL TRANSACTIONS" 
                value={total.toString()} 
                subtitle="All time ledger" 
                icon={<ArrowUpDown size={14} className="text-neutral-500" />} 
            />
            
            <StatCard 
                title="SUCCESSFUL" 
                value={successfulTransactions.toString()} 
                subtitle="Completed" 
                icon={<CheckCircle size={14} className="text-emerald-500" />} 
                valueClass="text-emerald-400"
            />
            
            <StatCard 
                title="FAILED" 
                value={failedTransactions.toString()} 
                subtitle="Unsuccessful" 
                icon={<XCircle size={14} className="text-red-500" />} 
                valueClass="text-red-400"
                alertIcon
            />
            
            <StatCard 
                title="PENDING" 
                value={pendingTransactions.toString()} 
                subtitle="Awaiting verify" 
                icon={<Clock size={14} className="text-amber-500" />} 
                valueClass="text-amber-400"
            />
            
            <StatCard 
                title="TOTAL VOLUME" 
                value={`₹${(totalAmount ?? 0).toLocaleString()}`} 
                subtitle="INR Volume" 
                icon={<DollarSign size={14} className="text-emerald-500" />} 
            />
        </div>
    );
};

interface StatCardProps {
    title: string;
    value: string;
    subtitle: string;
    icon: React.ReactNode;
    valueClass?: string;
    alertIcon?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ 
    title, 
    value, 
    subtitle, 
    icon, 
    valueClass = "text-white", 
    alertIcon = false 
}) => (
    <div className="bg-[#121214] rounded-lg p-3 flex flex-col justify-between border border-neutral-800/80 min-h-[90px] shadow-sm hover:border-neutral-700 transition-colors">
        <div className="flex justify-between items-start mb-1.5">
            <h3 className="text-[10px] font-medium text-neutral-500 tracking-wider uppercase">{title}</h3>
            <div className={`p-1 rounded-md ${alertIcon ? 'bg-red-500/10' : 'bg-neutral-800/40'}`}>{icon}</div>
        </div>
        <div className="flex items-end justify-between">
            <div>
                <div className={`text-lg font-bold mb-0.5 leading-none tracking-tight ${valueClass}`}>
                    {value}
                </div>
                <div className="text-[10px] text-neutral-500 font-medium">{subtitle}</div>
            </div>
        </div>
    </div>
);
