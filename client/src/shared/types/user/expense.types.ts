export interface ExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export type ExpenseCategory = 'NEED' | 'WANT' | 'SAVING' | '';

export interface ChartDataItem {
    name: string;
    value: number;
    color: string;
}

export interface BudgetPatternProps {
    finalChartData: ChartDataItem[];
    activeChartData: ChartDataItem[];
    filteredSpent: number;
    totalIncome: number;
    needsTarget: number;
    wantsTarget: number;
    savingsTarget: number;
    filteredNeeds: number;
    filteredWants: number;
    filteredSavings: number;
    unspentBalance: number;
}

export interface IncomeSource {
    source: string;
    amount: number;
}

export interface IncomeModalProps {
    isOpen: boolean;
    onClose: () => void;
    incomeSources: IncomeSource[];
}
