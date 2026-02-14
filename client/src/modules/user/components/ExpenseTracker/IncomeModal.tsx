import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { useAddIncomeMutation } from '@modules/user/hooks/useExpenseMutations';
import { toast } from 'sonner';
import { formatCurrency } from '@modules/user/helpers/expenseHelpers';

interface IncomeModalProps {
    isOpen: boolean;
    onClose: () => void;
    incomeSources: any[];
}

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
                toast.success("Income source added");
            }
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#111] border border-neutral-800 w-full max-w-md rounded-2xl p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="bg-blue-500/10 p-1.5 rounded text-blue-500"><Plus size={18} /></span> Add Income Source
                    </h2>
                    <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5 block">Source Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Freelance, Salary"
                            className="w-full bg-[#1a1a1a] text-sm text-white px-4 py-3 rounded-xl border border-neutral-800 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder-neutral-600"
                            value={newSourceName}
                            onChange={e => setNewSourceName(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5 block">Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-sans">₹</span>
                            <input
                                type="number"
                                placeholder="0.00"
                                className="w-full bg-[#1a1a1a] text-sm text-white pl-8 pr-4 py-3 rounded-xl border border-neutral-800 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-mono"
                                value={newSourceAmount}
                                onChange={e => setNewSourceAmount(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleAddIncomeSource}
                        disabled={isAddingIncome}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isAddingIncome ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : 'Add Income Source'}
                    </button>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-800">
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-3">Current Sources</p>
                    <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                        {incomeSources.length === 0 ? (
                            <p className="text-xs text-neutral-600 italic">No income sources added yet.</p>
                        ) : (
                            incomeSources.map((source: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between text-xs bg-[#1a1a1a] p-2.5 rounded-lg border border-neutral-800">
                                    <span className="text-neutral-300 font-medium">{source.source}</span>
                                    <span className="font-mono text-neutral-400">{formatCurrency(source.amount)}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};
