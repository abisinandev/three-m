import React from 'react';
import type { StockDashboardTabsProps } from '../../types/stock-dashboard.types';

const StockDashboardTabs: React.FC<StockDashboardTabsProps> = ({ activeTab, setActiveTab, tabs }) => {
  return (
    <div className="flex items-center gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as any)}
          style={{
            padding: '8px 16px',
            fontSize: 12,
            fontWeight: activeTab === tab.id ? 600 : 400,
            color: activeTab === tab.id ? '#00C853' : '#5a5f6e',
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
  );
};

export default StockDashboardTabs;
