'use client';
import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useAddExpenseMutation } from '../hooks/useExpenseMutations';
import { toast } from 'sonner';
import type { ExpenseCategory, ExpenseModalProps } from '@/shared/types/user/expense.types';

export const ExpenseModal = ({ isOpen, onClose }: ExpenseModalProps) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<ExpenseCategory>('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const { mutate: addExpense, isPending: isAddingExpense } = useAddExpenseMutation();

    const handleAddExpense = () => {
        if (!amount || !description || !category) {
            toast.error("Please fill all fields");
            return;
        }

        const expenseAmount = parseFloat(amount);
        addExpense({
            amount: expenseAmount,
            category: description,
            type: category as 'NEED' | 'WANT' | 'SAVING',
            description: description,
            date: date || undefined
        }, {
            onSuccess: () => {
                setAmount('');
                setDescription('');
                setCategory('');
                setDate(new Date().toISOString().split('T')[0]);
                onClose();
                toast.success("Transaction recorded");
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

                <div className="flex justify-between items-center py-4 px-5 border-b border-[#1e2025]">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-black text-[#e8eaed] uppercase tracking-widest">Record Expense</span>
                    </div>
                    <button onClick={onClose} className="text-[#5a5f6e] hover:text-white transition-colors">
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 space-y-5">
                    <div>
                        <label className="text-xs font-bold text-[#5a5f6e] uppercase tracking-widest mb-2 block">Description</label>
                        <input
                            className="w-full bg-[#111214] border border-[#1e2025] rounded-xl py-2.5 px-3 text-sm text-white outline-none focus:border-blue-500/50 transition-all font-bold placeholder:text-[#333]"
                            placeholder="e.g. Monthly Rent"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-[#5a5f6e] uppercase tracking-widest mb-2 block">Amount (₹)</label>
                            <input
                                className="w-full bg-[#111214] border border-[#1e2025] rounded-xl py-2.5 px-3 text-sm text-white outline-none focus:border-blue-500/50 transition-all font-black placeholder:text-[#333] tabular-nums"
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[#5a5f6e] uppercase tracking-widest mb-2 block">Category</label>
                            <select
                                className="w-full bg-[#111214] border border-[#1e2025] rounded-xl py-2.5 px-3 text-sm text-white outline-none focus:border-blue-500/50 transition-all font-bold appearance-none cursor-pointer"
                                value={category}
                                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                            >
                                <option value="" disabled>Select</option>
                                <option value="NEED">Needs</option>
                                <option value="WANT">Wants</option>
                                <option value="SAVING">Savings</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-[#5a5f6e] uppercase tracking-widest mb-2 block">Date</label>
                        <input
                            className="w-full bg-[#111214] border border-[#1e2025] rounded-xl py-2.5 px-3 text-sm text-white outline-none focus:border-blue-500/50 transition-all font-bold [color-scheme:dark]"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            onClick={handleAddExpense}
                            disabled={isAddingExpense}
                            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            {isAddingExpense ? <Loader2 size={14} className="animate-spin" /> : 'Confirm Transaction'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
