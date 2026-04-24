export type PortfolioTab = 'all' | 'stocks' | 'mf' | 'history' | 'pending';

export const PORTFOLIO_TABS: { id: PortfolioTab; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'stocks', label: 'Stocks' },
    { id: 'mf', label: 'Mutual Funds' },
    { id: 'history', label: 'History' },
    { id: 'pending', label: 'Pending Orders' },
];


export const PORTFOLIO_LIMIT = 20;

export const TABLE_HEADERS = {
    stocks: ['Symbol', 'Qty & Avg Paid', 'Cur. Value', 'P&L', 'LTP', ''],
    mf: ['Scheme', 'Invested', 'Cur. Value', 'P&L', 'NAV', ''],
    history: ['Trade', 'Quantity', 'Price', 'Value', 'Date', ''],
    all: ['Instrument', 'Invested/Qty', 'Cur. Value', 'P&L', 'NAV / LTP', ''],
};
