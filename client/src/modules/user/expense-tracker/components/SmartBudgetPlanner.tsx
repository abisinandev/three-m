'use client';

import { useState, useEffect } from 'react';
import { Trash2, CheckCircle2, AlertTriangle, XCircle, ShieldCheck } from 'lucide-react';
import type { ExpenseTrackerData, BudgetPlanResponse } from '../types/expense.types';
import { useMutation } from '@tanstack/react-query';

type Step = 0 | 1 | 2 | 3 | 4;

interface BudgetItem {
    id: string;
    label: string;
    amount: number;
}

interface SmartBudgetPlannerProps {
    dashboardData?: ExpenseTrackerData;
    budgetPlanMutation: ReturnType<typeof useMutation<BudgetPlanResponse, unknown, { income: number; needsTotal: number; wantsTotal: number; savingsTotal: number; month: string }>>;
    month: string;
}

const STEP_QUESTIONS = [
    { label: 'Income', q: 'What is your monthly income?' },
    { label: 'Needs', q: 'What are your essential monthly expenses?' },
    { label: 'Wants', q: 'What are your lifestyle or discretionary expenses?' },
    { label: 'Savings', q: 'How much do you save or invest monthly?' },
    { label: 'Analysis', q: 'Budget Planning Analysis' },
];

const PRESETS = {
    NEEDS: ['Rent', 'Groceries', 'Utilities', 'EMI', 'Transport'],
    WANTS: ['Entertainment', 'Shopping', 'Dining', 'Subscriptions', 'Travel'],
    SAVINGS: ['Savings', 'SIP', 'Stocks', 'Emergency Fund']
};

const generateId = () => Math.random().toString(36).slice(2, 9);

export const SmartBudgetPlanner = ({ dashboardData, budgetPlanMutation, month }: SmartBudgetPlannerProps) => {
    const [step, setStep] = useState<Step>(0);
    const [income, setIncome] = useState(dashboardData?.income || 0);
    const [needs, setNeeds] = useState<BudgetItem[]>([]);
    const [wants, setWants] = useState<BudgetItem[]>([]);
    const [savings, setSavings] = useState<BudgetItem[]>([]);

    useEffect(() => {
        if (dashboardData?.income && income === 0) setIncome(dashboardData.income);
    }, [dashboardData, income]);

    const needsTotal = needs.reduce((sum, item) => sum + item.amount, 0);
    const wantsTotal = wants.reduce((sum, item) => sum + item.amount, 0);
    const savingsTotal = savings.reduce((sum, item) => sum + item.amount, 0);

    const onGenerateAnalysis = () => {
        setStep(4);
        budgetPlanMutation.mutate({ income, needsTotal, wantsTotal, savingsTotal, month });
    };

    const nextStep = () => {
        if (step === 3) onGenerateAnalysis();
        else setStep(s => (s + 1) as Step);
    };

    const prevStep = () => {
        if (step > 0) setStep(s => (s - 1) as Step);
    };

    const renderList = (items: BudgetItem[], setItems: React.Dispatch<React.SetStateAction<BudgetItem[]>>, presets: string[], total: number) => {
        return (
            <div className="w-full max-w-md flex flex-col animate-in fade-in duration-300">
                <p className="text-[12px] text-[#e8eaed] mb-4 font-medium text-center">{STEP_QUESTIONS[step].q}</p>
                
                <div className="flex flex-wrap gap-2 justify-center mb-5">
                    {presets.map(p => (
                        <button 
                            key={p} 
                            onClick={() => {
                                if (!items.find(i => i.label === p)) {
                                    setItems([...items, { id: generateId(), label: p, amount: 0 }]);
                                }
                            }} 
                            className="text-[10px] bg-[#1e2025] hover:bg-[#2a2d35] text-[#a0a5b5] hover:text-[#e8eaed] px-3 py-1.5 rounded transition-all"
                        >
                            + {p}
                        </button>
                    ))}
                </div>

                <div className="space-y-2 mb-4 max-h-[200px] overflow-y-auto custom-scrollbar pr-1">
                    {items.map(item => (
                        <div key={item.id} className="flex gap-2">
                            <input
                                type="text"
                                value={item.label}
                                onChange={e => setItems(items.map(i => i.id === item.id ? { ...i, label: e.target.value } : i))}
                                className="flex-1 bg-[#0b0c0e] border border-[#1e2025] rounded-md text-[11px] text-white py-1.5 px-3 outline-none"
                                placeholder="Expense name"
                            />
                            <div className="relative">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] text-[#5a5f6e]">₹</span>
                                <input
                                    type="number"
                                    min={0}
                                    value={item.amount || ''}
                                    onChange={e => setItems(items.map(i => i.id === item.id ? { ...i, amount: parseFloat(e.target.value) || 0 } : i))}
                                    className="w-24 bg-[#0b0c0e] border border-[#1e2025] rounded-md text-[11px] text-white py-1.5 pl-6 pr-2 outline-none tabular-nums"
                                    placeholder="0"
                                />
                            </div>
                            <button 
                                onClick={() => setItems(items.filter(i => i.id !== item.id))}
                                className="p-1.5 text-[#5a5f6e] hover:text-rose-500 transition-colors"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <p className="text-[11px] text-[#5a5f6e] text-center italic py-6">No expenses added. Select a preset above to start.</p>
                    )}
                </div>

                <div className="flex items-center justify-between mt-2 pt-4 border-t border-[#1e2025]">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-[#5a5f6e] uppercase">Total</span>
                        <span className="text-[13px] text-[#e8eaed] font-bold tabular-nums">₹{total.toLocaleString()}</span>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={prevStep} className="text-[#a0a5b5] text-[11px] font-bold py-1.5 px-4 rounded-md hover:bg-[#1e2025] transition-all">Back</button>
                        <button onClick={nextStep} className="bg-[#00C853] text-[#0b0c0e] text-[11px] font-bold py-1.5 px-6 rounded-md hover:bg-[#00C853]/90 transition-all">Continue</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-[#111214] border border-[#1e2025] rounded-lg p-5 w-full transition-all duration-500">
            <h3 className="text-xs font-bold text-[#e8eaed] mb-8">BUDGET PLANNING</h3>
            
            <div className="flex flex-col items-center justify-center min-h-[160px] w-full">
                
                {step === 0 && (
                    <div className="w-full max-w-md flex flex-col items-center animate-in fade-in duration-300">
                        <p className="text-[12px] text-[#e8eaed] mb-4 font-medium">{STEP_QUESTIONS[0].q}</p>
                        <input 
                            type="number" 
                            min={0}
                            value={income || ''}
                            onChange={e => setIncome(parseFloat(e.target.value) || 0)}
                            className="w-full bg-[#0b0c0e] border border-[#1e2025] rounded-md text-[13px] text-white py-2.5 px-3 outline-none mb-4 text-center tabular-nums" 
                            placeholder="Enter amount"
                        />
                        <div className="w-full flex justify-end">
                            <button 
                                onClick={nextStep}
                                disabled={income <= 0}
                                className="bg-[#00C853] text-[#0b0c0e] text-[11px] font-bold py-2 px-8 rounded-md hover:bg-[#00C853]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                )}

                {step === 1 && renderList(needs, setNeeds, PRESETS.NEEDS, needsTotal)}
                {step === 2 && renderList(wants, setWants, PRESETS.WANTS, wantsTotal)}
                {step === 3 && renderList(savings, setSavings, PRESETS.SAVINGS, savingsTotal)}

                {step === 4 && (
                    <div className="w-full max-w-3xl animate-in fade-in slide-in-from-top-4 duration-500">
                        {budgetPlanMutation.isPending ? (
                            <div className="flex flex-col items-center justify-center py-10">
                                <div className="w-6 h-6 border-2 border-[#00C853]/20 border-t-[#00C853] rounded-full animate-spin mb-3"></div>
                                <p className="text-[11px] text-[#5a5f6e]">Analyzing finances...</p>
                            </div>
                        ) : budgetPlanMutation.data ? (
                            <div className="w-full">
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck size={16} style={{ color: budgetPlanMutation.data.health.color }} />
                                        <span className="text-[13px] font-bold" style={{ color: budgetPlanMutation.data.health.color }}>
                                            {budgetPlanMutation.data.health.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[10px] text-[#5a5f6e] uppercase">Health Score</span>
                                        <span className="text-[13px] font-bold text-[#e8eaed]">{budgetPlanMutation.data.health.score}/100</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                                    <div className="bg-[#0b0c0e] border border-[#1e2025] rounded p-3 text-center">
                                        <p className="text-[10px] text-[#5a5f6e] uppercase mb-1">Income</p>
                                        <p className="text-[14px] font-bold text-[#3B82F6] tabular-nums">₹{Number(income).toLocaleString()}</p>
                                    </div>
                                    <div className="bg-[#0b0c0e] border border-[#1e2025] rounded p-3 text-center">
                                        <p className="text-[10px] text-[#5a5f6e] uppercase mb-1">Planned</p>
                                        <p className="text-[14px] font-bold text-[#F43F5E] tabular-nums">₹{Number(budgetPlanMutation.data.allocation.totalSpent).toLocaleString()}</p>
                                    </div>
                                    <div className="bg-[#0b0c0e] border border-[#1e2025] rounded p-3 text-center">
                                        <p className="text-[10px] text-[#5a5f6e] uppercase mb-1">Remaining</p>
                                        <p className="text-[14px] font-bold text-[#00C853] tabular-nums">₹{Number(budgetPlanMutation.data.allocation.remaining).toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="bg-[#0b0c0e] border border-[#1e2025] rounded p-4 mb-5">
                                    <p className="text-[11px] font-semibold text-[#e8eaed] mb-4">50-30-20 Rule Breakdown</p>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Needs', actual: income > 0 ? (needsTotal/income)*100 : 0, target: 50, color: '#F43F5E' },
                                            { label: 'Wants', actual: income > 0 ? (wantsTotal/income)*100 : 0, target: 30, color: '#f59e0b' },
                                            { label: 'Savings', actual: income > 0 ? (savingsTotal/income)*100 : 0, target: 20, color: '#00C853' }
                                        ].map(item => (
                                            <div key={item.label}>
                                                <div className="flex justify-between text-[10px] mb-1.5">
                                                    <span className="text-[#a0a5b5]">{item.label}</span>
                                                    <span className="text-[#5a5f6e]">{item.actual.toFixed(1)}% / {item.target}%</span>
                                                </div>
                                                <div className="h-1.5 bg-[#1e2025] rounded-full overflow-hidden">
                                                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, item.actual)}%`, backgroundColor: item.color }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-[11px] font-semibold text-[#e8eaed] mb-3">Insights & Recommendations</p>
                                    {budgetPlanMutation.data.insights.map((ins, i) => (
                                        <div key={i} className="flex gap-2.5 items-start bg-[#0b0c0e] border border-[#1e2025] rounded p-3">
                                            {ins.type === 'success' ? <CheckCircle2 size={14} className="text-[#00C853] mt-0.5 shrink-0" /> : 
                                            ins.type === 'critical' ? <XCircle size={14} className="text-[#F43F5E] mt-0.5 shrink-0" /> : 
                                            <AlertTriangle size={14} className="text-[#f59e0b] mt-0.5 shrink-0" />}
                                            <div>
                                                <p className="text-[11px] font-semibold text-[#e8eaed]">{ins.title}</p>
                                                <p className="text-[10px] text-[#a0a5b5] mt-1 leading-relaxed">{ins.message}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-end mt-6 pt-4 border-t border-[#1e2025]">
                                    <button onClick={() => { setStep(0); setNeeds([]); setWants([]); setSavings([]); }} className="text-[#a0a5b5] text-[10px] font-bold py-1.5 px-4 rounded border border-[#1e2025] hover:bg-[#1e2025] hover:text-[#e8eaed] transition-all">START NEW PLAN</button>
                                </div>
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    );
};
