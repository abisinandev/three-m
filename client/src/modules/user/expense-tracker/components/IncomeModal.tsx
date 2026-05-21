'use client';
import { useState } from 'react';
import { X, Loader2, DollarSign } from 'lucide-react';
import { useAddIncomeMutation } from '../hooks/useExpenseMutations';
import { toast } from 'sonner';
import { formatCurrency } from '../../helpers/format';

import type { IncomeModalProps } from '@/shared/types/user/expense.types';

export const IncomeModal = ({ isOpen, onClose, incomeSources }: IncomeModalProps) => {
    const [newSourceName, setNewSourceName] = useState('');
    const [newSourceAmount, setNewSourceAmount] = useState('');

    const { mutate: addIncome, isPending: isAddingIncome } = useAddIncomeMutation();

    const handleAddIncomeSource = () => {
        if (!newSourceName || !newSourceAmount) {
            toast.error("Please fill all fields");
            return;
        }

        addIncome({
            source: newSourceName,
            amount: parseFloat(newSourceAmount)
        }, {
            onSuccess: () => {
                setNewSourceName('');
                setNewSourceAmount('');
                onClose();
                toast.success("Income source recorded");
            }
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/80"
                onClick={onClose}
            />

            <div className="relative w-full max-w-[360px] bg-[#0b0c0e] border border-[#1e2025] rounded-2xl overflow-hidden shadow-2xl">

                <div className="flex justify-between items-center px-5 py-4 border-b border-[#1e2025]">
                    <div className="flex items-center gap-3">
                        <span className="text-[12px] font-black text-[#e8eaed] uppercase tracking-widest">Add Income</span>
                    </div>
                    <button onClick={onClose} className="text-[#5a5f6e] hover:text-white transition-colors">
                        <X size={16} />
                    </button>
                </div>

                <div className="p-5 space-y-5">
                    <div>
                        <label className="text-[10px] font-bold text-[#5a5f6e] uppercase tracking-widest mb-2 block">Source Name</label>
                        <input
                            className="w-full bg-[#111214] border border-[#1e2025] rounded-xl py-2.5 px-3 text-[12px] text-white outline-none focus:border-[#00C853]/50 transition-all font-bold placeholder:text-[#333]"
                            placeholder="e.g. Primary Salary"
                            value={newSourceName}
                            onChange={(e) => setNewSourceName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-[#5a5f6e] uppercase tracking-widest mb-2 block">Amount (₹)</label>
                        <input
                            className="w-full bg-[#111214] border border-[#1e2025] rounded-xl py-2.5 px-3 text-[12px] text-white outline-none focus:border-[#00C853]/50 transition-all font-black placeholder:text-[#333]"
                            type="number"
                            placeholder="0.00"
                            value={newSourceAmount}
                            onChange={(e) => setNewSourceAmount(e.target.value)}
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            onClick={handleAddIncomeSource}
                            disabled={isAddingIncome}
                            className="w-full py-3.5 bg-[#00C853] hover:bg-[#00E676] text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-green-500/10 flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            {isAddingIncome ? <Loader2 size={14} className="animate-spin" /> : 'Confirm Income'}
                        </button>
                    </div>

                    <div className="pt-5 border-t border-[#1e2025]">
                        <p className="text-[9px] font-bold text-[#5a5f6e] uppercase tracking-widest mb-3">Current Monthly Sources</p>
                        <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1 custom-scrollbar">
                            {incomeSources.length === 0 ? (
                                <p className="text-[10px] text-[#3a3d45] font-bold uppercase italic">No income recorded.</p>
                            ) : (
                                incomeSources.map((source, i) => (
                                    <div key={i} className="flex justify-between items-center bg-[#111214] p-3 rounded-xl border border-[#1e2025]">
                                        <div className="flex items-center gap-2">
                                            <DollarSign size={12} className="text-[#00C853]" />
                                            <span className="text-[11px] font-bold text-[#e8eaed] uppercase tracking-tight">{source.source}</span>
                                        </div>
                                        <span className="text-[11px] font-black text-white">{formatCurrency(source.amount)}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
