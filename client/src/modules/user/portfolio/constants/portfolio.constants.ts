export type PortfolioTab = 'all' | 'stocks' | 'mf' | 'history' | 'pending';

export const PORTFOLIO_TABS: { id: PortfolioTab; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'stocks', label: 'Stocks' },
    { id: 'mf', label: 'Mutual Funds' },
    { id: 'history', label: 'History' },
    // { id: 'pending', label: 'Pending Orders' },
];


export const PORTFOLIO_LIMIT = 10;

export const TABLE_HEADERS = {
    stocks: ['Symbol & Name', 'Qty & Avg Price', 'Cur. Value', 'P&L', 'LTP (Live)', ''],
    mf: ['Scheme & Fund', 'Invested / Units', 'Cur. Value', 'P&L / XIRR', 'NAV', ''],
    history: ['Trade & Symbol', 'Quantity', 'Price', 'Total Value', 'Date', ''],
    all: ['Instrument', 'Invested / Qty', 'Cur. Value', 'P&L', 'NAV / LTP', ''],
};
