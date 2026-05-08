'use client';
import { TrendingUp } from 'lucide-react';
import type { SimulationResult } from '../types/expense.types';
import { formatCurrency } from '../helpers/expense-helpers';

interface SimulationResultProps {
    result: SimulationResult;
}

const CurrencyRow = ({ label, from, to, invertColor }: { label: string; from: number; to: number; invertColor?: boolean }) => {
    const diff = to - from;
    const isPositive = invertColor ? diff < 0 : diff > 0;
    const textClass = diff === 0
        ? 'text-[#5a5f6e]'
        : isPositive ? 'text-[#00C853]' : 'text-[#F43F5E]';

    return (
        <div className="flex justify-between items-center py-2.5 border-b border-[#1e2025]">
            <div>
                <p className="text-[9px] font-bold text-[#5a5f6e] uppercase m-0">{label}</p>
                <p className="text-[13px] font-bold text-[#e8eaed] m-0">{formatCurrency(to)}</p>
            </div>
            <div className="text-right">
                <p className="text-[8px] font-bold text-[#5a5f6e] m-0 mb-0.5">CHANGE</p>
                <p className={`text-[10px] font-extrabold m-0 ${textClass}`}>
                    {diff === 0 ? '—' : `${diff > 0 ? '+' : ''}${formatCurrency(diff)}`}
                </p>
            </div>
        </div>
    );
};

const ScoreRow = ({ label, from, to }: { label: string; from: number; to: number }) => {
    const diff = to - from;
    const textClass = diff > 0 ? 'text-[#00C853]' : diff < 0 ? 'text-[#F43F5E]' : 'text-[#5a5f6e]';
    const barColor = to >= 80 ? '#00C853' : to >= 50 ? '#f59e0b' : '#F43F5E';

    return (
        <div className="py-2.5 border-b border-[#1e2025]">
            <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-2">
                    <p className="text-[9px] font-bold text-[#5a5f6e] uppercase m-0">{label}</p>
                    <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded ${to >= 80 ? 'bg-green-500/10 text-[#00C853]' : 'bg-rose-500/10 text-[#F43F5E]'}`}>
                        {to >= 80 ? 'OPTIMAL' : 'STRESS'}
                    </span>
                </div>
                <div className="text-right">
                    <p className="text-[8px] font-bold text-[#5a5f6e] m-0 mb-0.5">CHANGE</p>
                    <p className={`text-[10px] font-extrabold m-0 ${textClass}`}>
                        {diff === 0 ? '—' : `${diff > 0 ? '+' : ''}${diff} pts`}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-[#1e2025] rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, to)}%`, backgroundColor: barColor }}
                    />
                </div>
                <span className="text-[10px] font-extrabold text-[#e8eaed] tabular-nums">{to}/100</span>
            </div>
        </div>
    );
};

export const SimulationResultView = ({ result }: SimulationResultProps) => {
    const { original, simulated, impact } = result;

    return (
        <div className="bg-[#111214] border border-[#1e2025] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={14} color="#00C853" />
                <h3 className="text-[11px] font-bold text-[#e8eaed] uppercase m-0">Simulation Result</h3>
                <span className="text-[8px] font-extrabold bg-[#1e2025] text-[#5a5f6e] px-1.5 py-0.5 rounded uppercase ml-auto">Read-only</span>
            </div>

            <div className="flex flex-col">
                <CurrencyRow
                    label="Resulting Balance"
                    from={original.currentMonthBalance}
                    to={simulated.currentMonthBalance}
                />

                <ScoreRow
                    label="Budget Health Score"
                    from={original.healthScore || 0}
                    to={simulated.healthScore || 0}
                />

                <CurrencyRow
                    label="Net Savings Output"
                    from={Number(original.totalSavings) || 0}
                    to={Number(simulated.totalSavings) || 0}
                />

                <CurrencyRow
                    label="Total Monthly Spent"
                    from={original.totalSpent}
                    to={simulated.totalSpent}
                    invertColor
                />
            </div>

            <div className={`mt-4 p-3 rounded-lg ${impact.isBetter ? 'bg-[#00C853]/5 border border-[#00C853]/15' : 'bg-rose-500/5 border border-rose-500/15'}`}>
                <p className={`text-[10px] font-extrabold uppercase m-0 mb-1 ${impact.isBetter ? 'text-[#00C853]' : 'text-[#F43F5E]'}`}>
                    {impact.isBetter ? '✅ Financial Improvement' : '⚠️ Negative Impact'}
                </p>
                <p className="text-[10px] text-[#9ca3af] m-0 leading-[1.5]">
                    {impact.savingsChange > 0
                        ? `You could save an additional ${formatCurrency(impact.savingsChange)} this month.`
                        : impact.balanceChange > 0
                            ? `Your balance improves by ${formatCurrency(impact.balanceChange)} with these adjustments.`
                            : impact.savingsChange < 0
                                ? `Savings reduce by ${formatCurrency(Math.abs(impact.savingsChange))} under this scenario.`
                                : 'No change in savings — adjust income or reduce spending categories.'
                    }
                </p>
            </div>
        </div>
    );
};
