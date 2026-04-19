import type { FundDetails } from '@modules/user/types/mutual-fund/details.types';
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
    const themeBg = 'bg-[#2962ff]';

    const isValid = amount >= 500 && startDate && !errorMsg;

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <div 
                className="fixed inset-0 bg-black/80"
                onClick={onClose}
            />

            <div className="relative bg-[#0f0f0f] text-gray-100 rounded-[10px] shadow-2xl w-full max-w-md overflow-hidden font-sans border border-[#1f1f1f]">
                
                {/* Header Banner */}
                <div className={`${themeBg} px-5 py-3 flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-sm tracking-wide">
                            START SIP IN {data.schemeName.toUpperCase()} 
                        </span>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-white/80 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-5 space-y-6">
                        
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <label className="block text-[11px] text-gray-500 font-bold uppercase tracking-wider">SIP Amount (₹)</label>
                            </div>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                                <input
                                    type="number"
                                    value={amount || ''}
                                    onChange={handleAmountChange}
                                    className={`w-full bg-[#1a1a1a] border rounded-[4px] py-2 pl-8 pr-3 text-sm text-white focus:outline-none font-medium placeholder:text-gray-600 ${errorMsg ? 'border-red-500 focus:border-red-500' : 'border-[#2a2a2a] focus:border-[#2962ff]'}`}
                                    placeholder="500"
                                />
                            </div>
                            {errorMsg && (
                                <p className="text-[10px] text-red-500 mt-1.5 font-medium">{errorMsg}</p>
                            )}
                            {!errorMsg && (
                                <p className="text-[10px] text-gray-500 mt-1.5 font-medium">Minimum investment: ₹500</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-2">
                                    Frequency
                                </label>
                                <select
                                    value={frequency}
                                    onChange={(e) => setFrequency(e.target.value as SipData["frequency"])}
                                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-[4px] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#2962ff] font-medium appearance-none"
                                >
                                    <option value="DAILY">Daily</option>
                                    <option value="WEEKLY">Weekly</option>
                                    <option value="MONTHLY">Monthly</option>
                                    <option value="YEARLY">Yearly</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-2">
                                    Duration
                                </label>
                                <select
                                    value={duration}
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-[4px] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#2962ff] font-medium appearance-none"
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
                            <label className="block text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-2">
                                Start Date
                            </label>
                            <input
                                type="date"
                                min={today}
                                value={startDate}
                                onChange={handleStartDateChange}
                                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-[4px] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#2962ff] font-medium [color-scheme:dark]"
                            />
                            <p className="text-[10px] text-gray-500 mt-1.5 font-medium">Preferred date: 1st to 28th of the month</p>
                        </div>

                    </div>

                    {/* Footer */}
                    <div className="px-5 py-4 bg-[#161616] flex items-center justify-between border-t border-[#1f1f1f] mt-2">
                        <div className="space-y-0.5">
                            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tight">Est. Total Investment:</p>
                            <p className={`text-sm font-bold text-gray-100`}>
                                ₹{(amount * duration).toLocaleString()}
                            </p>
                        </div>
                        
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 text-xs font-bold text-gray-500 hover:text-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!isValid || isSubmitting}
                                className={`px-8 py-2 min-w-[120px] rounded-[4px] text-xs font-bold text-white shadow-sm transition-all flex items-center justify-center gap-2 ${themeBg} hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed`}
                            >
                                {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : "START SIP"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
