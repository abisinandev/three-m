import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { ROUTES } from '@shared/constants/routes';

interface WalletBalanceBarProps {
    balance: number;
    canTransact: boolean;
}

const fmt = (v: number | string | undefined | null, digits = 2) => {
    if (v === undefined || v === null || isNaN(Number(v))) return '0.00';
    return Number(v).toLocaleString('en-IN', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    });
};

export const WalletBalanceBar: React.FC<WalletBalanceBarProps> = ({ balance, canTransact }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-[#111214] border border-[#1e2025] rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
            <div className="flex flex-col gap-1">
                <p className="text-[10px] font-bold text-[#5a5f6e] uppercase tracking-[0.1em]">Available Margin</p>
                <div className="flex items-baseline gap-1.5">
                    <span className="text-[20px] font-medium text-[#5a5f6e]">₹</span>
                    <span className="text-[32px] font-bold text-[#e8eaed] tracking-tighter leading-none">
                        {fmt(balance, 2)}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    disabled={!canTransact}
                    onClick={() => navigate({ to: ROUTES.USER.WALLET.ADD })}
                    className={`px-6 py-2.5 rounded-md text-[12px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg ${canTransact
                        ? 'bg-green-600 text-white hover:bg-green-700 active:scale-[0.98]'
                        : 'bg-[#1e2025] text-[#5a5f6e] cursor-not-allowed border border-[#2a2d35]'
                        }`}
                >
                    <ArrowUpRight size={14} />
                    Add Funds
                </button>
            </div>
        </div>
    );
};
