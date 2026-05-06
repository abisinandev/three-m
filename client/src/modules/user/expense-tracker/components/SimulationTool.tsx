'use client';
import { useState } from 'react';
import { Info, Calculator, ChevronDown, ChevronUp } from 'lucide-react';
import { simulateBudget } from '../../../../shared/services/expense-tracker/expense-service';
import { SimulationResultView } from './SimulationResult';
import { toast } from 'sonner';
import type { SimulationResult } from '../types/expense.types';

interface SimulationToolProps {
    month: string;
}

interface SliderRowProps {
    label: string;
    sublabel: string;
    value: number;
    min: number;
    max: number;
    step: number;
    accentColor: string;
    displayValue: string;
    valueColor: string;
    onChange: (v: number) => void;
}

const SliderRow = ({ label, sublabel, value, min, max, step, accentColor, displayValue, valueColor, onChange }: SliderRowProps) => (
    <div className="py-3">
        <div className="flex items-center justify-between mb-2">
            <div>
                <p className="text-[10px] font-bold text-[#e8eaed] m-0">{label}</p>
                <p className="text-[9px] text-[#5a5f6e] m-0 mt-0.5">{sublabel}</p>
            </div>
            <span className={`text-[12px] font-extrabold tabular-nums ${valueColor}`}>{displayValue}</span>
        </div>
        <input
            type="range"
            min={min} max={max} step={step}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            style={{ accentColor }}
            className="w-full cursor-pointer h-1"
        />
        <div className="flex justify-between text-[8px] text-[#3a3d45] mt-1">
            <span>₹0</span>
            <span>₹{max.toLocaleString('en-IN')}</span>
        </div>
    </div>
);

export const SimulationTool = ({ month }: SimulationToolProps) => {
    const [incomeAdj, setIncomeAdj] = useState(0);
    const [needsAdj, setNeedsAdj] = useState(0);
    const [wantsAdj, setWantsAdj] = useState(0);
    const [isSimulating, setIsSimulating] = useState(false);
    const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
    const [collapsed, setCollapsed] = useState(false);

    const hasAdjustments = incomeAdj !== 0 || needsAdj !== 0 || wantsAdj !== 0;

    const handleSimulate = async () => {
        setIsSimulating(true);
        try {
            const adjustments: any[] = [];
            if (incomeAdj !== 0) adjustments.push({ type: 'INCOME', amount: incomeAdj });
            if (needsAdj !== 0) adjustments.push({ type: 'CATEGORY', categoryType: 'NEED', amount: -needsAdj });
            if (wantsAdj !== 0) adjustments.push({ type: 'CATEGORY', categoryType: 'WANT', amount: -wantsAdj });

            if (adjustments.length === 0) {
                setSimulationResult(null);
                toast.info('Move at least one slider to simulate.');
                return;
            }

            const res = await simulateBudget({ month, adjustments });
            setSimulationResult(res);
        } catch {
            toast.error('Simulation failed');
        } finally {
            setIsSimulating(false);
        }
    };

    const handleReset = () => {
        setIncomeAdj(0);
        setNeedsAdj(0);
        setWantsAdj(0);
        setSimulationResult(null);
    };

    return (
        <div className="bg-[#111214] border border-[#1e2025] rounded-lg overflow-hidden">

            {/* Header — clickable to collapse */}
            <button
                onClick={() => setCollapsed(c => !c)}
                className="w-full flex items-center justify-between px-4 py-3 cursor-pointer bg-transparent border-none text-left hover:bg-[#16181d] transition-colors"
            >
                <div className="flex items-center gap-2">
                    <Calculator size={13} color="#3B82F6" />
                    <span className="text-[11px] font-bold text-[#e8eaed] uppercase tracking-wider">Expense Simulator</span>
                    {hasAdjustments && !collapsed && (
                        <span className="text-[8px] font-extrabold bg-blue-500/15 text-[#3B82F6] px-1.5 py-0.5 rounded uppercase">Active</span>
                    )}
                </div>
                {collapsed
                    ? <ChevronDown size={13} color="#5a5f6e" />
                    : <ChevronUp size={13} color="#5a5f6e" />
                }
            </button>

            {!collapsed && (
                <div className="px-4 pb-4">

                    {/* All 3 sliders in one unified block */}
                    <div className="bg-[#0b0c0e] border border-[#1e2025] rounded-lg px-4 divide-y divide-[#1a1c22]">
                        <SliderRow
                            label="Income Boost"
                            sublabel="Add extra monthly income"
                            value={incomeAdj}
                            min={0} max={100000} step={1000}
                            accentColor="#3B82F6"
                            displayValue={incomeAdj > 0 ? `+₹${incomeAdj.toLocaleString('en-IN')}` : '—'}
                            valueColor={incomeAdj > 0 ? 'text-[#3B82F6]' : 'text-[#3a3d45]'}
                            onChange={setIncomeAdj}
                        />
                        <SliderRow
                            label="Needs Reduction"
                            sublabel="Cut essential spending"
                            value={needsAdj}
                            min={0} max={20000} step={500}
                            accentColor="#00C853"
                            displayValue={needsAdj > 0 ? `-₹${needsAdj.toLocaleString('en-IN')}` : '—'}
                            valueColor={needsAdj > 0 ? 'text-[#00C853]' : 'text-[#3a3d45]'}
                            onChange={setNeedsAdj}
                        />
                        <SliderRow
                            label="Wants Reduction"
                            sublabel="Cut discretionary spending"
                            value={wantsAdj}
                            min={0} max={20000} step={500}
                            accentColor="#f59e0b"
                            displayValue={wantsAdj > 0 ? `-₹${wantsAdj.toLocaleString('en-IN')}` : '—'}
                            valueColor={wantsAdj > 0 ? 'text-[#f59e0b]' : 'text-[#3a3d45]'}
                            onChange={setWantsAdj}
                        />
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2 mt-3">
                        <button
                            onClick={handleReset}
                            className="bg-transparent border border-[#1e2025] rounded-md text-[#5a5f6e] text-[10px] font-bold py-2 cursor-pointer hover:border-[#2a2d35] hover:text-[#e8eaed] transition-all"
                        >
                            RESET
                        </button>
                        <button
                            onClick={handleSimulate}
                            disabled={isSimulating || !hasAdjustments}
                            className="bg-[#e8eaed] border-none rounded-md text-[#0b0c0e] text-[10px] font-extrabold py-2 cursor-pointer flex items-center justify-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            {isSimulating ? 'RUNNING...' : 'SIMULATE'}
                        </button>
                    </div>

                    {/* Hint */}
                    <div className="flex gap-2 mt-3 py-2 px-2.5 bg-blue-500/5 rounded-md border border-blue-500/10">
                        <Info size={11} color="#3B82F6" className="mt-0.5 shrink-0" />
                        <p className="text-[9px] text-[#5a5f6e] m-0 leading-[1.4]">
                            Read-only — your real data is never changed.
                        </p>
                    </div>

                    {/* Result — rendered here, fully isolated */}
                    {simulationResult && (
                        <div className="mt-3">
                            <SimulationResultView result={simulationResult} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
