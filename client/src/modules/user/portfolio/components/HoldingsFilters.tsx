import { Search, Filter } from 'lucide-react';
import { PORTFOLIO_TABS, type PortfolioTab } from '../constants/portfolio.constants';

interface HoldingsFiltersProps {
    activeTab: PortfolioTab;
    setActiveTab: (tab: PortfolioTab) => void;
    search: string;
    setSearch: (search: string) => void;
    status: string | null;
    setStatus: (status: string | null) => void;
    setPage: (page: number) => void;
}

export const HoldingsFilters = ({
    activeTab,
    setActiveTab,
    search,
    setSearch,
    status,
    setStatus,
    setPage,
}: HoldingsFiltersProps) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            <div style={{ display: 'flex', borderBottom: '1px solid #1e2025', gap: 0 }}>
                {PORTFOLIO_TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); setPage(1); }}
                        style={{
                            padding: '8px 16px',
                            fontSize: 12,
                            fontWeight: activeTab === tab.id ? 600 : 400,
                            color: activeTab === tab.id ? '#e8eaed' : '#5a5f6e',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === tab.id ? '2px solid #00C853' : '2px solid transparent',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                            marginBottom: -1,
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search
                        size={12}
                        color="#5a5f6e"
                        style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}
                    />
                    <input
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Search holdings..."
                        style={{
                            width: '100%',
                            background: '#111214',
                            border: '1px solid #1e2025',
                            borderRadius: 6,
                            padding: '7px 10px 7px 28px',
                            fontSize: 12,
                            color: '#e8eaed',
                            outline: 'none',
                            boxSizing: 'border-box',
                        }}
                    />
                </div>
                <div style={{ position: 'relative' }}>
                    <Filter
                        size={12}
                        color="#5a5f6e"
                        style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}
                    />
                    <select
                        value={status || ''}
                        onChange={e => { setStatus(e.target.value || null); setPage(1); }}
                        style={{
                            background: '#111214',
                            border: '1px solid #1e2025',
                            borderRadius: 6,
                            padding: '7px 10px 7px 28px',
                            fontSize: 12,
                            color: '#e8eaed',
                            outline: 'none',
                            cursor: 'pointer',
                            appearance: 'none',
                            minWidth: 130,
                        }}
                    >
                        <option value="" style={{ background: '#111214' }}>All Status</option>
                        <option value="ALLOTTED" style={{ background: '#111214' }}>Allotted</option>
                        <option value="INITIATED" style={{ background: '#111214' }}>Initiated</option>
                        <option value="REDEEMED" style={{ background: '#111214' }}>Redeemed</option>
                        <option value="FAILED" style={{ background: '#111214' }}>Failed</option>
                    </select>
                </div>
            </div>
        </div>
    );
};
