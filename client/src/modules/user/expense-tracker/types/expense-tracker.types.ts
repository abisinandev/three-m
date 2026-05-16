export type Category = 'NEED' | 'WANT' | 'SAVING' | 'INVESTMENT';

export type InvestmentType = 'SIP' | 'LUMPSUM' | 'STOCKS';

export type TransactionType = 'expense' | 'investment' | 'income';

export interface BaseTransaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    type: TransactionType;
}

export interface ExpenseTransaction extends BaseTransaction {
    type: 'expense';
    category: Category;
}

export interface InvestmentTransaction extends BaseTransaction {
    type: 'investment';
    category: 'INVESTMENT';
    investmentType: InvestmentType;
}

export type Transaction = ExpenseTransaction | InvestmentTransaction;
