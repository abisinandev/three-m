import { TrendingUp, TrendingDown } from 'lucide-react';
import type { IPortfolioProjectionResponse } from '@shared/types/portfolio.types';

interface PortfolioXirrCardProps {
    xirrValue: string | number;
}

export const PortfolioXirrCard = ({ xirrValue }: PortfolioXirrCardProps) => {
    const isPositive = Number(xirrValue) >= 0;
    return (
        <div className="bg-[#111214] border border-[#1e2025] rounded-lg p-4">
            <p className="text-xs font-semibold text-[#5a5f6e] uppercase tracking-wider mb-1">
                Portfolio XIRR
            </p>
            <p className="text-2xl font-bold flex items-center gap-1.5 m-0 tabular-nums" style={{ color: isPositive ? '#00C853' : '#FF1744' }}>
                {isPositive
                    ? <TrendingUp size={18} color="#00C853" />
                    : <TrendingDown size={18} color="#FF1744" />
                }
                {xirrValue}%
            </p>
            <p className="text-xs text-[#5a5f6e] mt-1">Annualised return</p>
        </div>
    );
};

interface ForecastCardProps {
    projectionData?: IPortfolioProjectionResponse;
    isLoading: boolean;
}

export const PortfolioForecastCard = ({ projectionData, isLoading }: ForecastCardProps) => {
    return (
        <div style={{
            background: '#111214',
            border: '1px solid #1e2025',
            borderRadius: 8,
            padding: '14px 16px',
            position: 'relative',
            overflow: 'hidden',
        }}>
            <div style={{
                position: 'absolute', right: -16, top: -16, width: 80, height: 80,
                background: 'rgba(0,200,83,0.06)', borderRadius: '50%', filter: 'blur(20px)',
                pointerEvents: 'none',
            }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider m-0">
                    10-Year Forecast
                </p>
                <span className="text-xs font-bold text-[#00C853] bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                    12% CAGR
                </span>
            </div>

            {isLoading ? (
                <div className="text-xs text-[#5a5f6e] text-center py-3">Calculating…</div>
            ) : projectionData ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                        <p className="text-xs text-[#5a5f6e] uppercase tracking-wider mb-1">Projected</p>
                        <p className="text-lg font-bold text-[#e8eaed] m-0 tabular-nums">
                            ₹{projectionData.projectedValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-[#5a5f6e] uppercase tracking-wider mb-1">Growth</p>
                        <p className="text-lg font-bold text-[#00C853] m-0 tabular-nums">
                            +₹{projectionData.projectedProfit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </p>
                    </div>
                    <p className="col-span-2 text-xs text-[#5a5f6e] mt-2 border-t border-[#1e2025] pt-2 leading-relaxed">
                        Based on current value and conservative 12% annual return over 10 years.
                    </p>
                </div>
            ) : (
                <div className="text-xs text-[#5a5f6e] text-center py-3">No data available</div>
            )}
        </div>
    );
};
