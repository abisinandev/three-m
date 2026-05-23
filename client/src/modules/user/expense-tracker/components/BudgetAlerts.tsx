'use client';
import { AlertTriangle, TrendingDown, ShieldAlert, X } from 'lucide-react';
import { useState } from 'react';
import { formatCurrency } from '../helpers/expense-helpers';

interface BudgetAlertsProps {
    totalIncome: number;
    filteredSpent: number;
    filteredNeeds: number;
    filteredWants: number;
    needsTarget: number;   // 50% of income
    wantsTarget: number;   // 30% of income
}

interface Alert {
    id: string;
    severity: 'critical' | 'warning' | 'caution';
    icon: React.ReactNode;
    title: string;
    message: string;
    extra?: string;
}

const SEVERITY_STYLES = {
    critical: {
        wrapper: 'bg-rose-500/[0.06] border-rose-500/25',
        icon: 'text-[#F43F5E]',
        title: 'text-[#F43F5E]',
        badge: 'bg-rose-500/15 text-[#F43F5E]',
        bar: 'bg-[#F43F5E]',
    },
    warning: {
        wrapper: 'bg-amber-500/[0.06] border-amber-500/25',
        icon: 'text-amber-400',
        title: 'text-amber-400',
        badge: 'bg-amber-500/15 text-amber-400',
        bar: 'bg-amber-400',
    },
    caution: {
        wrapper: 'bg-orange-500/[0.06] border-orange-500/25',
        icon: 'text-orange-400',
        title: 'text-orange-400',
        badge: 'bg-orange-500/15 text-orange-400',
        bar: 'bg-orange-400',
    },
};

export const BudgetAlerts = ({
    totalIncome,
    filteredSpent,
    filteredNeeds,
    filteredWants,
    needsTarget,
    wantsTarget,
}: BudgetAlertsProps) => {
    const [dismissed, setDismissed] = useState<Set<string>>(new Set());

    if (totalIncome === 0) return null;

    const needsPercent   = (filteredNeeds / totalIncome) * 100;
    const wantsPercent   = (filteredWants / totalIncome) * 100;
    const spentPercent   = (filteredSpent / totalIncome) * 100;
    const needsOverBy    = filteredNeeds - needsTarget;
    const wantsOverBy    = filteredWants - wantsTarget;
    const incomeOverBy   = filteredSpent - totalIncome;

    const alerts: Alert[] = [];

    // CRITICAL — Total spending exceeds income
    if (filteredSpent > totalIncome) {
        alerts.push({
            id: 'over-income',
            severity: 'critical',
            icon: <ShieldAlert size={15} />,
            title: 'Income Exceeded',
            message: `Your total expenses (${formatCurrency(filteredSpent)}) have surpassed your income (${formatCurrency(totalIncome)}) by ${formatCurrency(incomeOverBy)}.`,
            extra: `${spentPercent.toFixed(0)}% of income used`,
        });
    }

    // WARNING — Needs exceed 50% rule
    if (filteredNeeds > needsTarget) {
        alerts.push({
            id: 'over-needs',
            severity: 'warning',
            icon: <TrendingDown size={15} />,
            title: 'Needs Over 50% Limit',
            message: `Needs spending (${formatCurrency(filteredNeeds)}) exceeds your 50% budget target (${formatCurrency(needsTarget)}) by ${formatCurrency(needsOverBy)}.`,
            extra: `${needsPercent.toFixed(0)}% of income on needs`,
        });
    }

    // CAUTION — Wants exceed 30% rule
    if (filteredWants > wantsTarget) {
        alerts.push({
            id: 'over-wants',
            severity: 'caution',
            icon: <AlertTriangle size={15} />,
            title: 'Wants Over 30% Limit',
            message: `Wants spending (${formatCurrency(filteredWants)}) exceeds your 30% budget target (${formatCurrency(wantsTarget)}) by ${formatCurrency(wantsOverBy)}.`,
            extra: `${wantsPercent.toFixed(0)}% of income on wants`,
        });
    }

    const visible = alerts.filter(a => !dismissed.has(a.id));
    if (visible.length === 0) return null;

    return (
        <div className="flex flex-col gap-2">
            {visible.map(alert => {
                const s = SEVERITY_STYLES[alert.severity];
                return (
                    <div
                        key={alert.id}
                        className={`relative flex items-start gap-3 border rounded-lg px-4 py-3 overflow-hidden ${s.wrapper}`}
                    >
                        {/* Left accent bar */}
                        <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${s.bar}`} />

                        {/* Icon */}
                        <div className={`mt-0.5 shrink-0 ${s.icon}`}>
                            {alert.icon}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <p className={`text-[11px] font-extrabold m-0 uppercase tracking-wide ${s.title}`}>
                                    {alert.title}
                                </p>
                                {alert.extra && (
                                    <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase ${s.badge}`}>
                                        {alert.extra}
                                    </span>
                                )}
                            </div>
                            <p className="text-[10px] text-[#9ca3af] m-0 leading-[1.5]">
                                {alert.message}
                            </p>
                        </div>

                        {/* Dismiss */}
                        <button
                            onClick={() => setDismissed(prev => new Set(prev).add(alert.id))}
                            className="shrink-0 text-[#3a3d45] hover:text-[#e8eaed] transition-colors cursor-pointer bg-transparent border-none p-0 mt-0.5"
                            title="Dismiss"
                        >
                            <X size={13} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
};
