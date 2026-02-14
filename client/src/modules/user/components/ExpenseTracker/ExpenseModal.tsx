import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { useAddExpenseMutation } from '@modules/user/hooks/useExpenseMutations';
import { toast } from 'sonner';

interface ExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ExpenseModal = ({ isOpen, onClose }: ExpenseModalProps) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<'NEED' | 'WANT' | ''>('');
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
            type: category as 'NEED' | 'WANT',
            description: description,
            date: date || undefined
        }, {
            onSuccess: () => {
                setAmount('');
                setDescription('');
                setCategory('');
                setDate(new Date().toISOString().split('T')[0]);
                onClose();
                toast.success("Expense added successfully");
            }
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#111] border border-neutral-800 w-full max-w-md rounded-2xl p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="bg-emerald-500/10 p-1.5 rounded text-emerald-500"><Plus size={18} /></span> Add Expense
                    </h2>
                    <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5 block">Description</label>
                        <input
                            type="text"
                            placeholder="What did you buy?"
                            className="w-full bg-[#1a1a1a] text-sm text-white px-4 py-3 rounded-xl border border-neutral-800 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder-neutral-600"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5 block">Amount</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-sans">₹</span>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    className="w-full bg-[#1a1a1a] text-sm text-white pl-8 pr-4 py-3 rounded-xl border border-neutral-800 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-mono"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5 block">Category</label>
                            <select
                                className="w-full bg-[#1a1a1a] text-sm text-white px-4 py-3 rounded-xl border border-neutral-800 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all appearance-none cursor-pointer"
                                value={category}
                                onChange={e => setCategory(e.target.value as any)}
                            >
                                <option value="" disabled>Select</option>
                                <option value="NEED">🔹 Needs</option>
                                <option value="WANT">🔸 Wants</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5 block">Date</label>
                        <input
                            type="date"
                            className="w-full bg-[#1a1a1a] text-sm text-white px-4 py-3 rounded-xl border border-neutral-800 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={handleAddExpense}
                        disabled={isAddingExpense}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isAddingExpense ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : 'Save Transaction'}
                    </button>
                </div>
            </div>
        </div>
    );
};
