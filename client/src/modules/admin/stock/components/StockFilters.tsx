import React from 'react';
import { Search } from 'lucide-react';
import { EXCHANGE_OPTIONS, STATUS_OPTIONS, VISIBILITY_OPTIONS } from '../constants/stock-management.constants';

interface StockFiltersProps {
    onSearchChange: (search: string) => void;
    exchange: string;
    onExchangeChange: (val: string) => void;
    tradable: string;
    onTradableChange: (val: string) => void;
    visible: string;
    onVisibleChange: (val: string) => void;
}

export const StockFilters: React.FC<StockFiltersProps> = ({
    onSearchChange,
    exchange,
    onExchangeChange,
    tradable,
    onTradableChange,
    visible,
    onVisibleChange
}) => {
    return (
        <div 
            style={{ 
                background: '#111214', 
                border: '1px solid #1e2025', 
                borderRadius: 8, 
                padding: '12px 16px',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 12
            }}
        >
            <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5f6e] w-3.5 h-3.5" />
                <input 
                    type="text" 
                    placeholder="Search by Symbol or Name..." 
                    onChange={(e) => onSearchChange(e.target.value)}
                    style={{
                        width: '100%',
                        background: '#0b0c0e',
                        border: '1px solid #1e2025',
                        borderRadius: 6,
                        padding: '7px 10px 7px 32px',
                        fontSize: 12,
                        color: '#e8eaed',
                        outline: 'none',
                    }}
                />
            </div>

            <FilterSelect 
                label="Exchange" 
                value={exchange} 
                onChange={onExchangeChange}
                options={EXCHANGE_OPTIONS}
            />

            <FilterSelect 
                label="Tradable" 
                value={tradable} 
                onChange={onTradableChange}
                options={STATUS_OPTIONS}
            />

            <FilterSelect 
                label="Visibility" 
                value={visible} 
                onChange={onVisibleChange}
                options={VISIBILITY_OPTIONS}
            />
        </div>
    );
};

const FilterSelect = ({ label, value, onChange, options }: { label: string, value: string, onChange: (v: string) => void, options: { label: string, value: string }[] }) => (
    <div className="flex items-center gap-2">
        <span style={{ fontSize: 10, color: '#5a5f6e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}:</span>
        <select 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
                background: '#0b0c0e',
                border: '1px solid #1e2025',
                borderRadius: 4,
                padding: '4px 8px',
                fontSize: 11,
                color: '#e8eaed',
                outline: 'none',
                cursor: 'pointer'
            }}
        >
            {options.map(opt => (
                <option key={opt.value} value={opt.value} style={{ background: '#111214' }}>{opt.label}</option>
            ))}
        </select>
    </div>
);
