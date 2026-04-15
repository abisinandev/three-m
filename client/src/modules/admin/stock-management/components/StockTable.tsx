import React from 'react';
import type { Stock, StockStatusKey } from '../types/stock-management.types';

interface StockTableProps {
    stocks: Stock[];
    isLoading: boolean;
    isError: boolean;
    onStatusToggle: (symbol: string, statusKey: StockStatusKey, newValue: boolean) => void;
}

export const StockTable: React.FC<StockTableProps> = ({ stocks, isLoading, isError, onStatusToggle }) => {

    if (isLoading) {
        return (
            <div className="flex flex-col space-y-4 p-8">
                {[...Array(8)].map((_, i) => (
                    <div key={i} style={{ height: 32 }} className="animate-pulse bg-[#1e2025] rounded-md w-full"></div>
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-12 text-center">
                <p style={{ fontSize: 13, color: '#FF1744' }}>Failed to load stock data. Please check your connection.</p>
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr style={{ background: '#0b0c0e', borderBottom: '1px solid #1e2025' }}>
                        <th style={headerStyle}>Stock Asset</th>
                        <th style={headerStyle}>Exchange</th>
                        <th style={headerStyle}>Sector</th>
                        <th style={{ ...headerStyle, textAlign: 'center' }}>Tradable</th>
                        <th style={{ ...headerStyle, textAlign: 'center' }}>Tracked</th>
                        <th style={{ ...headerStyle, textAlign: 'center' }}>Visible</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#1e2025]">
                    {stocks.map((stock) => (
                        <tr key={stock.symbol} className="hover:bg-[#15171a] transition-colors group">
                            <td className="px-5 py-3">
                                <div className="flex items-center gap-3">
                                    {stock.logo ? (
                                        <img src={stock.logo} alt={stock.symbol} style={{ width: 28, height: 28 }} className="rounded-md border border-[#1e2025] bg-white object-contain" />
                                    ) : (
                                        <div style={{ width: 28, height: 28 }} className="rounded-md bg-[#1a1c20] border border-[#1e2025] flex items-center justify-center font-bold text-[10px] text-[#5a5f6e]">
                                            {stock.symbol.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: '#e8eaed' }}>{stock.symbol}</div>
                                        <div style={{ fontSize: 10, color: '#5a5f6e' }} className="max-w-[150px] truncate">{stock.name}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-5 py-3">
                                <span style={{ fontSize: 12, color: '#9ca3af' }}>{stock.exchange}</span>
                            </td>
                            <td className="px-5 py-3">
                                <span style={{ fontSize: 12, color: '#9ca3af' }}>{stock.sector || '—'}</span>
                            </td>
                            <StatusCell
                                status={stock.isTradable}
                                onToggle={(v) => onStatusToggle(stock.symbol, 'isTradable', v)}
                            />
                            <StatusCell
                                status={stock.isTracked}
                                onToggle={(v) => onStatusToggle(stock.symbol, 'isTracked', v)}
                            />
                            <StatusCell
                                status={stock.isVisible}
                                onToggle={(v) => onStatusToggle(stock.symbol, 'isVisible', v)}
                            />
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const headerStyle: React.CSSProperties = {
    fontSize: 10,
    fontWeight: 600,
    color: '#5a5f6e',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    padding: '10px 20px',
    textAlign: 'left'
};

const StatusCell = ({ status, onToggle }: { status: boolean, onToggle: (v: boolean) => void }) => (
    <td className="px-5 py-3 text-center">
        <select
            value={status.toString()}
            onChange={(e) => onToggle(e.target.value === 'true')}
            style={{
                background: status ? 'rgba(0, 200, 83, 0.05)' : 'rgba(255, 23, 68, 0.05)',
                border: `1px solid ${status ? 'rgba(0, 200, 83, 0.15)' : 'rgba(255, 23, 68, 0.15)'}`,
                color: status ? '#00C853' : '#FF1744',
                fontSize: 10,
                fontWeight: 700,
                borderRadius: 4,
                padding: '2px 8px',
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none',
                minWidth: 70,
                textAlign: 'center'
            }}
        >
            <option value="true" style={{ background: '#111214', color: '#00C853' }}>ACTIVE</option>
            <option value="false" style={{ background: '#111214', color: '#FF1744' }}>DISABLED</option>
        </select>
    </td>
);
