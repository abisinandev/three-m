import type { FundDetails } from '@modules/user/types/MutaulFundType';
import { X, Calendar, RefreshCw, Clock } from 'lucide-react';
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
        if (val < 1000 && val > 0) setErrorMsg('Minimum SIP Amount is ₹1,000');
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

    const handleSubmit = () => {
        if (!amount || amount < 1000) {
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

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-b from-[#1a1a1a] to-[#111] px-6 py-4 flex items-center justify-between border-b border-[#222]">
                    <div className="flex items-center gap-3">
                        <img src={data.logo} alt={data.schemeName} className="w-10 h-10 rounded-lg border border-[#333]" />
                        <div>
                            <h3 className="font-semibold text-base">{data.schemeName}</h3>
                            <p className="text-xs text-gray-400 mt-0.5">Start SIP Investment</p>
                        </div>
                    </div>
                    <button onClick={onClose}>
                        <X size={22} className="text-gray-400 hover:text-white" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    <div>
                        <label className="block text-gray-300 mb-2 font-medium text-sm">SIP Amount (₹)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                            <input
                                type="number"
                                value={amount || ''}
                                onChange={handleAmountChange}
                                className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl py-3 pl-10 pr-4 text-white focus:border-green-600 focus:ring-1 focus:ring-green-600/30 text-sm"
                                placeholder="Min ₹1000"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-300 mb-2 font-medium text-sm flex items-center gap-2">
                                <RefreshCw size={14} className="text-gray-400" /> Frequency
                            </label>
                            <select
                                value={frequency}
                                onChange={(e) =>
                                    setFrequency(e.target.value as SipData["frequency"])
                                }
                                className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl py-3 px-4 text-white focus:border-green-600 focus:ring-1 focus:ring-green-600/30 text-sm appearance-none"
                            >
                                <option value="DAILY">Daily</option>
                                <option value="WEEKLY">Weekly</option>
                                <option value="MONTHLY">Monthly</option>
                                <option value="YEARLY">Yearly</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-2 font-medium text-sm flex items-center gap-2">
                                <Clock size={14} className="text-gray-400" /> Duration
                            </label>
                            <select
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                                className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl py-3 px-4 text-white focus:border-green-600 focus:ring-1 focus:ring-green-600/30 text-sm appearance-none"
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
                        <label className="block text-gray-300 mb-2 font-medium text-sm flex items-center gap-2">
                            <Calendar size={14} className="text-gray-400" /> SIP Start Date
                        </label>
                        <input
                            type="date"
                            min={today}
                            value={startDate}
                            onChange={handleStartDateChange}
                            className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl py-3 px-4 text-white focus:border-green-600 focus:ring-1 focus:ring-green-600/30 text-sm [color-scheme:dark]"
                        />
                        <p className="textxs text-gray-500 mt-1.5 ml-1">Preferred date: 1-28 of month</p>
                    </div>

                    {errorMsg && (
                        <div className="bg-red-950/20 border border-red-900/50 rounded-lg p-3 text-red-400 text-xs flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                            {errorMsg}
                        </div>
                    )}

                    <div className="bg-[#1a1a1a] border border-[#222] rounded-xl p-4 text-xs space-y-2">
                        <div className="flex justify-between items-center text-gray-400">
                            <span>Total Investment</span>
                            <span className="text-white font-medium">₹{(amount * duration).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-400">
                            <span>Installments</span>
                            <span className="text-white font-medium">{duration}</span>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-5 bg-[#0a0a0a] border-t border-[#1e1e1e]">
                    <button
                        onClick={handleSubmit}
                        disabled={!!errorMsg || amount < 1000 || !startDate || isSubmitting}
                        className="w-full bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-3.5 rounded-xl transition-all shadow-lg shadow-green-900/30 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? 'Processing...' : 'Start SIP'}
                    </button>
                </div>
            </div>
        </div>
    );
};
