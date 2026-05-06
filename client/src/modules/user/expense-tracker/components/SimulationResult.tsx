'use client';
import { TrendingUp, ArrowRight, Minus } from 'lucide-react';
import type { SimulationResult } from '../types/expense.types';
import { formatCurrency } from '../helpers/expense-helpers';

interface SimulationResultProps {
    result: SimulationResult;
}

export const SimulationResultView = ({ result }: SimulationResultProps) => {
    const { original, simulated, impact } = result;

    const ComparisonRow = ({ label, from, to }: { label: string, from: number, to: number }) => {
        const diff = to - from;
        const textClass = diff > 0 ? 'text-[#00C853]' : diff < 0 ? 'text-[#F43F5E]' : 'text-[#5a5f6e]';
        
        return (
            <div className="flex justify-between items-center py-2.5 border-b border-[#1e2025]">
                <div>
                    <p className="text-[9px] font-bold text-[#5a5f6e] uppercase m-0">{label}</p>
                    <p className="text-[13px] font-bold text-[#e8eaed] m-0">{formatCurrency(to)}</p>
                </div>
                <div className="text-right">
                    <p className="text-[8px] font-bold text-[#5a5f6e] m-0 mb-0.5">IMPACT</p>
                    <p className={`text-[10px] font-extrabold m-0 ${textClass}`}>
                        {diff > 0 ? '+' : ''}{formatCurrency(diff)}
                    </p>
                </div>
            </div>
        );
    };


    return (
        <div className="bg-[#111214] border border-[#1e2025] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={14} color="#00C853" />
                <h3 className="text-[11px] font-bold text-[#e8eaed] uppercase m-0">Simulation Result</h3>
            </div>

            <div className="flex flex-col">
                <ComparisonRow label="Resulting Balance" from={original.currentMonthBalance} to={simulated.currentMonthBalance} />
                <ComparisonRow label="Budget Health Index" from={original.healthScore || 0} to={simulated.healthScore || 0} />
                <ComparisonRow label="Net Savings Output" from={original.totalSavings || 0} to={simulated.totalSavings || 0} />
                <ComparisonRow label="Total Monthly Spent" from={original.totalSpent} to={simulated.totalSpent} />
            </div>

            <div className={`mt-4 p-3 rounded-lg text-center ${impact.isBetter ? 'bg-[#00C853]/5 border border-[#00C853]/15' : 'bg-rose-500/5 border border-rose-500/15'}`}>
                <p className={`text-[10px] font-extrabold uppercase m-0 ${impact.isBetter ? 'text-[#00C853]' : 'text-[#F43F5E]'}`}>
                    {impact.isBetter ? '✅ FINANCIAL IMPROVEMENT' : '⚠️ NEGATIVE IMPACT'}
                </p>
                <p className="text-[11px] font-semibold text-[#e8eaed] mt-1 m-0">
                    {impact.savingsChange > 0 
                        ? `You could save an additional ${formatCurrency(impact.savingsChange)} this month.`
                        : impact.savingsChange < 0 
                        ? `Simulation shows a reduction in savings by ${formatCurrency(Math.abs(impact.savingsChange))}.`
                        : "Your savings remain unaffected by these adjustments."
                    }
                </p>
            </div>
        </div>
    );

};
