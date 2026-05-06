import type { FundDetails } from '../../types/details.types';
import { X, Loader2, Info } from 'lucide-react';
import { useState } from 'react';

interface StartSipModalProps {
    data: FundDetails;
    onClose: () => void;
    onProceed: (sipData: SipData) => void;
    isSubmitting?: boolean;
}

export interface SipData {
    amount: number;
    frequency: "DAILY" | 'WEEKLY' | "MONTHLY" | "YEARLY";
    startDate: string;
    totalInstallments: number;
}

export const StartSipModal = ({
    data,
    onClose,
    onProceed,
    isSubmitting = false
}: StartSipModalProps) => {
    const [amount, setAmount] = useState<number>(0);
    const [frequency, setFrequency] = useState<'MONTHLY' | 'WEEKLY' | "DAILY" | "YEARLY">('WEEKLY');
    const [startDate, setStartDate] = useState<string>('');
    const [duration, setDuration] = useState<number>(12);
    const [errorMsg, setErrorMsg] = useState<string>('');

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        setAmount(val);
        if (val < 500 && val > 0) setErrorMsg('Minimum SIP Amount is ₹500');
        else if (val <= 0) setErrorMsg('Enter a valid amount');
        else setErrorMsg('');
    };

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = new Date(e.target.value);
        const day = selectedDate.getDate();
        if (day > 28) {
            setErrorMsg('Select a date between 1-28');
        } else {
            setErrorMsg('');
        }
        setStartDate(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || amount < 500) {
            setErrorMsg('Invalid amount');
            return;
        }
        if (!startDate) {
            setErrorMsg('Select start date');
            return;
        }

        const selectedDate = new Date(startDate);
        if (selectedDate.getDate() > 28) {
            setErrorMsg('Select a date between 1-28');
            return;
        }

        onProceed({
            amount,
            frequency,
            startDate,
            totalInstallments: duration
        });
    };

    const today = new Date().toISOString().split('T')[0];
    const isValid = amount >= 500 && startDate && !errorMsg;

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-black/80"
                onClick={onClose}
            />

            <div className="relative bg-[#0b0c0e] text-[#e8eaed] rounded-2xl shadow-2xl w-full max-w-[360px] overflow-hidden border border-[#1e2025]">

                <div className="px-5 py-4 flex items-center justify-between bg-[#2962ff]">
                    <div className="flex items-center gap-3">
                        <span className="text-[12px] font-black text-black uppercase tracking-widest">
                            Start SIP
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-black/60 hover:text-black transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-5 space-y-5">

                        <div className="bg-[#111214] border border-[#1e2025] rounded-xl p-3">
                            <p className="text-[9px] text-[#5a5f6e] font-bold uppercase tracking-wider mb-1.5">Fund Name</p>
                            <p className="text-[11px] text-white font-bold leading-tight line-clamp-2">{data.schemeName}</p>
                        </div>

                        <div>
                            <label className="block text-[10px] text-[#5a5f6e] font-bold uppercase tracking-wider mb-2.5">SIP Amount</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5f6e] font-bold text-[12px]">₹</span>
                                <input
                                    type="number"
                                    value={amount || ''}
                                    onChange={handleAmountChange}
                                    className={`w-full bg-[#111214] border rounded-xl py-2.5 pl-8 pr-3 text-[13px] text-white focus:outline-none font-black transition-all ${errorMsg ? 'border-red-500/50 focus:border-red-500' : 'border-[#1e2025] focus:border-[#2962ff]'}`}
                                    placeholder="500"
                                />
                            </div>
                            {errorMsg && (
                                <p className="text-[9px] text-red-500 mt-1.5 font-bold uppercase tracking-tight">{errorMsg}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] text-[#5a5f6e] font-bold uppercase tracking-wider mb-2">
                                    Frequency
                                </label>
                                <select
                                    value={frequency}
                                    onChange={(e) => setFrequency(e.target.value as SipData["frequency"])}
                                    className="w-full bg-[#111214] border border-[#1e2025] rounded-xl px-3 py-2.5 text-[11px] text-white focus:outline-none focus:border-[#2962ff] font-bold appearance-none cursor-pointer"
                                >
                                    <option value="DAILY">Daily</option>
                                    <option value="WEEKLY">Weekly</option>
                                    <option value="MONTHLY">Monthly</option>
                                    <option value="YEARLY">Yearly</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] text-[#5a5f6e] font-bold uppercase tracking-wider mb-2">
                                    Duration
                                </label>
                                <select
                                    value={duration}
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                    className="w-full bg-[#111214] border border-[#1e2025] rounded-xl px-3 py-2.5 text-[11px] text-white focus:outline-none focus:border-[#2962ff] font-bold appearance-none cursor-pointer"
                                >
                                    <option value={6}>6 Months</option>
                                    <option value={12}>12 Months</option>
                                    <option value={24}>24 Months</option>
                                    <option value={36}>36 Months</option>
                                    <option value={60}>5 Years</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] text-[#5a5f6e] font-bold uppercase tracking-wider mb-2">
                                Start Date
                            </label>
                            <input
                                type="date"
                                min={today}
                                value={startDate}
                                onChange={handleStartDateChange}
                                className="w-full bg-[#111214] border border-[#1e2025] rounded-xl px-3 py-2.5 text-[11px] text-white focus:outline-none focus:border-[#2962ff] font-bold [color-scheme:dark]"
                            />
                            <p className="text-[9px] text-[#5a5f6e] mt-1.5 font-bold uppercase tracking-tight">Preferred: 1st to 28th</p>
                        </div>

                    </div>

                    {/* Footer */}
                    <div className="px-5 py-4 bg-[#111214] flex items-center justify-between border-t border-[#1e2025]">
                        <div className="flex flex-col">
                            <span className="text-[9px] text-[#5a5f6e] font-bold uppercase tracking-wider">Est. Total</span>
                            <span className="text-[14px] font-black text-white">
                                ₹{(amount * duration).toLocaleString()}
                            </span>
                        </div>

                        <button
                            type="submit"
                            disabled={!isValid || isSubmitting}
                            className="px-8 py-3.5 bg-[#2962ff] hover:bg-[#3d72ff] active:scale-[0.98] transition-all text-white text-[11px] font-black uppercase tracking-[0.15em] rounded-xl shadow-lg shadow-blue-500/10 disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100 min-w-[140px]"
                        >
                            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : "START SIP"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
