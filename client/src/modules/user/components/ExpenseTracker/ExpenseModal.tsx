'use client';
import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useAddExpenseMutation } from '@modules/user/hooks/useExpenseMutations';
import { toast } from 'sonner';

interface ExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ExpenseModal = ({ isOpen, onClose }: ExpenseModalProps) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<'NEED' | 'WANT' | 'SAVING' | ''>('');
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
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose} 
            />
            
            <div className="relative w-full max-w-[420px] bg-[#0b0c0e] border border-[#1e2025] rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                {/* Header */}
                <div className="flex justify-between items-center py-4 px-5 border-b border-[#1e2025]">
                    <h2 className="text-[13px] font-bold text-[#e8eaed] tracking-[0.02em] m-0">RECORD TRANSACTION</h2>
                    <button onClick={onClose} className="bg-transparent border-none text-[#5a5f6e] cursor-pointer p-1 hover:text-[#e8eaed] transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-[#5a5f6e] uppercase tracking-[0.06em] mb-1.5 block">Description</label>
                        <input 
                            className="w-full bg-[#111214] border border-[#1e2025] rounded-md py-2.5 px-3 text-xs text-[#e8eaed] outline-none box-border focus:border-[#3B82F6] transition-colors"
                            placeholder="e.g. Monthly Rent"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] font-bold text-[#5a5f6e] uppercase tracking-[0.06em] mb-1.5 block">Amount (₹)</label>
                            <input 
                                className="w-full bg-[#111214] border border-[#1e2025] rounded-md py-2.5 px-3 text-xs text-[#e8eaed] outline-none box-border focus:border-[#3B82F6] transition-colors"
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                        <div>

                            <label className="text-[10px] font-bold text-[#5a5f6e] uppercase tracking-[0.06em] mb-1.5 block">Category</label>
                            <select 
                                className="w-full bg-[#111214] border border-[#1e2025] rounded-md py-2.5 px-3 text-xs text-[#e8eaed] outline-none box-border focus:border-[#3B82F6] transition-colors appearance-none cursor-pointer"
                                value={category}
                                onChange={(e) => setCategory(e.target.value as any)}
                            >
                                <option value="" disabled>Select</option>
                                <option value="NEED">🔹 Needs</option>
                                <option value="WANT">🔸 Wants</option>
                                <option value="SAVING">💸 Savings</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-[#5a5f6e] uppercase tracking-[0.06em] mb-1.5 block">Date</label>
                        <input 
                            className="w-full bg-[#111214] border border-[#1e2025] rounded-md py-2.5 px-3 text-xs text-[#e8eaed] outline-none box-border focus:border-[#3B82F6] transition-colors"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    <div className="mt-2">
                        <button
                            onClick={handleAddExpense}
                            disabled={isAddingExpense}
                            className="w-full py-3 bg-[#e8eaed] border-none rounded-md text-[#0b0c0e] text-[11px] font-extrabold uppercase tracking-[0.1em] cursor-pointer transition-all duration-150 flex items-center justify-center gap-2 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isAddingExpense ? <Loader2 size={14} className="animate-spin" /> : 'Confirm Transaction'}
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );
};
