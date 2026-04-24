'use client';
import { useState, useEffect } from 'react';
import { RefreshCcw, TrendingUp, TrendingDown, Info, Calculator } from 'lucide-react';
import { simulateBudget } from '../../services/expenseService';
import type { SimulationResult } from '../../types/expense-types';
import { toast } from 'sonner';

interface SimulationToolProps {
    month: string;
    onResult: (result: SimulationResult | null) => void;
}

export const SimulationTool = ({ month, onResult }: SimulationToolProps) => {
    const [incomeAdj, setIncomeAdj] = useState(0);
    const [needsAdj, setNeedsAdj] = useState(0);
    const [wantsAdj, setWantsAdj] = useState(0);
    const [isSimulating, setIsSimulating] = useState(false);

    const handleSimulate = async () => {
        setIsSimulating(true);
        try {
            const adjustments = [];
            if (incomeAdj !== 0) adjustments.push({ type: 'INCOME', amount: incomeAdj });
            if (needsAdj !== 0) adjustments.push({ type: 'CATEGORY', categoryType: 'NEED', amount: needsAdj });
            if (wantsAdj !== 0) adjustments.push({ type: 'CATEGORY', categoryType: 'WANT', amount: wantsAdj });

            if (adjustments.length === 0) {
                onResult(null);
                return;
            }

            const res = await simulateBudget({ month, adjustments });
            onResult(res);
            toast.success("Simulation calculated");
        } catch (error) {
            toast.error("Simulation failed");
        } finally {
            setIsSimulating(false);
        }
    };

    const handleReset = () => {
        setIncomeAdj(0);
        setNeedsAdj(0);
        setWantsAdj(0);
        onResult(null);
    };

    return (
        <div className="bg-[#111214] border border-[#1e2025] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
                <Calculator size={14} color="#3B82F6" />
                <h3 className="text-[11px] font-bold text-[#e8eaed] uppercase m-0">Expense Simulator</h3>
            </div>


            <div className="bg-[#0b0c0e] border border-[#1e2025] rounded-lg py-3 px-3.5 mb-3">
                <label className="flex justify-between text-[10px] font-bold text-[#5a5f6e] uppercase tracking-[0.08em] mb-2">
                    Income Adjustment
                    <span className={incomeAdj >= 0 ? 'text-[#00C853]' : 'text-[#F43F5E]'}>
                        {incomeAdj >= 0 ? '+' : ''}₹{Math.abs(incomeAdj)}
                    </span>
                </label>
                <input
                    type="range" min="-50000" max="50000" step="1000"
                    value={incomeAdj}
                    onChange={(e) => setIncomeAdj(parseInt(e.target.value))}
                    className="w-full cursor-pointer accent-[#3B82F6]"
                />
            </div>

            <div className="bg-[#0b0c0e] border border-[#1e2025] rounded-lg py-3 px-3.5 mb-3">
                <label className="flex justify-between text-[10px] font-bold text-[#5a5f6e] uppercase tracking-[0.08em] mb-2">
                    Needs Reduction
                    <span className={needsAdj <= 0 ? 'text-[#00C853]' : 'text-[#F43F5E]'}>
                        {needsAdj >= 0 ? '+' : ''}₹{Math.abs(needsAdj)}
                    </span>
                </label>
                <input
                    type="range" min="-20000" max="20000" step="500"
                    value={needsAdj}
                    onChange={(e) => setNeedsAdj(parseInt(e.target.value))}
                    className="w-full cursor-pointer accent-[#00C853]"
                />
            </div>

            <div className="bg-[#0b0c0e] border border-[#1e2025] rounded-lg py-3 px-3.5 mb-3">
                <label className="flex justify-between text-[10px] font-bold text-[#5a5f6e] uppercase tracking-[0.08em] mb-2">
                    Wants Reduction
                    <span className={wantsAdj <= 0 ? 'text-[#00C853]' : 'text-[#F43F5E]'}>
                        {wantsAdj >= 0 ? '+' : ''}₹{Math.abs(wantsAdj)}
                    </span>
                </label>
                <input
                    type="range" min="-20000" max="20000" step="500"
                    value={wantsAdj}
                    onChange={(e) => setWantsAdj(parseInt(e.target.value))}
                    className="w-full cursor-pointer accent-[#f59e0b]"
                />
            </div>


            <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                    onClick={handleReset}
                    className="bg-transparent border border-[#1e2025] rounded-md text-[#5a5f6e] text-[10px] font-bold py-2 cursor-pointer"
                >
                    RESET
                </button>
                <button
                    onClick={handleSimulate}
                    disabled={isSimulating}
                    className="bg-[#e8eaed] border-none rounded-md text-[#0b0c0e] text-[10px] font-extrabold py-2 cursor-pointer flex items-center justify-center gap-1"
                >
                    {isSimulating ? '...' : 'SIMULATE'}
                </button>
            </div>

            <div className="mt-4 flex gap-2 py-2 px-2.5 bg-blue-500/5 rounded-md border border-blue-500/10">
                <Info size={12} color="#3B82F6" className="mt-0.5 shrink-0" />
                <p className="text-[9px] text-[#5a5f6e] m-0 leading-[1.4]">
                    Try reducing "Wants" to see how it accelerates your savings target. Adjustments are read-only.
                </p>
            </div>

        </div>
    );
};
