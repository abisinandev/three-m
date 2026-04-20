import React from 'react';
import { Smartphone, CreditCard, Building2, ChevronRight, AlertTriangle } from "lucide-react";

interface AddFundsFormProps {
    amount: number | "";
    error: string | null;
    onAmountChange: (value: number | "") => void;
    quickAmounts: number[];
}

export const AddFundsForm: React.FC<AddFundsFormProps> = ({
    amount,
    error,
    onAmountChange,
    quickAmounts,
}) => {
    return (
        <div className="bg-[#111214] rounded-lg border border-[#1e2025] p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-[11px] font-bold text-[#5a5f6e] uppercase tracking-wider">
                    Value Entry
                </h2>
                <span className="text-[10px] text-[#5a5f6e] font-medium">Limit: ₹1,00,000</span>
            </div>

            <div className="relative mb-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[20px] font-medium text-[#5a5f6e]">
                    ₹
                </span>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) =>
                        onAmountChange(
                            e.target.value ? Number(e.target.value) : ""
                        )
                    }
                    placeholder="Amount in INR"
                    className={`w-full bg-[#0b0c0e] border rounded-md pl-10 pr-4 py-3.5 text-[24px] font-bold tracking-tighter
                        focus:outline-none transition-all placeholder:text-[#1e2025]
                        ${error ? "border-red-500/50" : "border-[#1e2025] focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"}
                    `}
                />
            </div>

            {error && (
                <p className="text-[11px] text-red-400 font-medium mt-2 flex items-center gap-1.5">
                    <AlertTriangle size={12} /> {error}
                </p>
            )}

            <div className="flex flex-wrap gap-1.5 mt-5">
                {quickAmounts.map((amt) => (
                    <button
                        key={amt}
                        onClick={() => onAmountChange(amt)}
                        className={`px-3 py-1.5 rounded text-[11px] font-bold transition-all border
                            ${amount === amt
                                ? "bg-emerald-500/10 text-[#00C853] border-emerald-500/20"
                                : "bg-[#0b0c0e] border-[#1e2025] hover:border-[#2a2d35] text-[#5a5f6e] hover:text-[#e8eaed]"
                            }`}
                    >
                        +₹{amt.toLocaleString("en-IN")}
                    </button>
                ))}
            </div>
        </div>
    );
};

export const PaymentOption: React.FC<{
    icon: React.ReactNode;
    title: string;
    subtitle: string;
}> = ({ icon, title, subtitle }) => (
    <div className="flex items-center gap-3 px-3 py-2.5 bg-[#0b0c0e] border border-[#1e2025] rounded-md transition-all hover:border-[#2a2d35]">
        <div className="p-2 rounded bg-neutral-800/40 text-[#5a5f6e]">
            {icon}
        </div>
        <div className="flex-1 text-left">
            <div className="text-[12px] font-bold text-[#e8eaed] leading-none tracking-tight">{title}</div>
            <div className="text-[10px] text-[#5a5f6e] mt-1 uppercase tracking-wider">{subtitle}</div>
        </div>
        <ChevronRight size={14} className="text-[#1e2025]" />
    </div>
);

export const SupportedGateways: React.FC = () => (
    <div className="bg-[#111214] rounded-lg border border-[#1e2025] p-5 space-y-4">
        <h2 className="text-[11px] font-bold text-[#5a5f6e] uppercase tracking-wider">
            Supported Gateways
        </h2>
        <div className="space-y-2">
            <PaymentOption icon={<Smartphone size={14} />} title="UPI" subtitle="GPay, PhonePe, BHIM" />
            <PaymentOption icon={<CreditCard size={14} />} title="Cards" subtitle="Visa, Mastercard, RuPay" />
            <PaymentOption icon={<Building2 size={14} />} title="NetBanking" subtitle="All major Indian banks" />
        </div>
    </div>
);
