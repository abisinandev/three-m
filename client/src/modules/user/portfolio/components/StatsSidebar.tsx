import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { IPortfolioProjectionResponse } from '@shared/types/portfolio.types';

interface PortfolioXirrCardProps {
    xirrValue: string | number;
}

export const PortfolioXirrCard = ({ xirrValue }: PortfolioXirrCardProps) => {
    const isPositive = Number(xirrValue) >= 0;
    return (
        <div style={{
            background: '#111214',
            border: '1px solid #1e2025',
            borderRadius: 8,
            padding: '14px 16px',
        }}>
            <p style={{ fontSize: 10, color: '#5a5f6e', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 4px' }}>
                Portfolio XIRR
            </p>
            <p style={{
                fontSize: 22,
                fontWeight: 700,
                color: isPositive ? '#00C853' : '#FF1744',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
            }}>
                {isPositive
                    ? <TrendingUp size={16} color="#00C853" />
                    : <TrendingDown size={16} color="#FF1744" />
                }
                {xirrValue}%
            </p>
            <p style={{ fontSize: 10, color: '#5a5f6e', margin: '4px 0 0' }}>Annualised return</p>
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
                <p style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0 }}>
                    10-Year Forecast
                </p>
                <span style={{
                    fontSize: 9, fontWeight: 700, color: '#00C853',
                    background: 'rgba(0,200,83,0.1)', border: '1px solid rgba(0,200,83,0.2)',
                    padding: '2px 6px', borderRadius: 3,
                }}>
                    12% CAGR
                </span>
            </div>

            {isLoading ? (
                <div style={{ fontSize: 11, color: '#5a5f6e', textAlign: 'center', padding: '12px 0' }}>Calculating…</div>
            ) : projectionData ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                        <p style={{ fontSize: 10, color: '#5a5f6e', margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Projected</p>
                        <p style={{ fontSize: 16, fontWeight: 700, color: '#e8eaed', margin: 0 }}>
                            ₹{projectionData.projectedValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </p>
                    </div>
                    <div>
                        <p style={{ fontSize: 10, color: '#5a5f6e', margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Growth</p>
                        <p style={{ fontSize: 16, fontWeight: 700, color: '#00C853', margin: 0 }}>
                            +₹{projectionData.projectedProfit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </p>
                    </div>
                    <p style={{ gridColumn: '1/-1', fontSize: 9, color: '#5a5f6e', margin: '8px 0 0', borderTop: '1px solid #1e2025', paddingTop: 8, lineHeight: 1.5 }}>
                        Based on current value and conservative 12% annual return over 10 years.
                    </p>
                </div>
            ) : (
                <div style={{ fontSize: 11, color: '#5a5f6e', textAlign: 'center', padding: '12px 0' }}>No data available</div>
            )}
        </div>
    );
};
