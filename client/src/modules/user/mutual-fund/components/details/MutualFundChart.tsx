import React from 'react';
import ApexChart from 'react-apexcharts';

interface MutualFundChartProps {
    chartData: { date: string; nav: number }[];
    activePeriod: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
    setActivePeriod: (period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY') => void;
    periods: readonly ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];
}

const MutualFundChart: React.FC<MutualFundChartProps> = ({
    chartData,
    activePeriod,
    setActivePeriod,
    periods,
}) => {
    return (
        <div className="bg-[#111214] border border-[#1e2025] rounded-lg overflow-hidden flex flex-col h-[550px]">
            <div className="flex items-center px-4 py-2 border-b border-[#1f1f1f] bg-[#0a0a0a] shrink-0">
                <span className="text-xs text-gray-500 mr-2 uppercase tracking-wide font-medium">Timeframe</span>
                {periods.map((p) => (
                    <button
                        key={p}
                        onClick={() => setActivePeriod(p)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${p === activePeriod
                                ? 'bg-[#2962ff] text-white'
                                : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
                            }`}
                    >
                        {p === 'DAILY' ? '1D' : p === 'WEEKLY' ? '1W' : p === 'MONTHLY' ? '1M' : '1Y'}
                    </button>
                ))}
            </div>

            <div className="relative w-full flex-grow bg-black rounded-b-xl align-middle mt-4">
                <ApexChart
                    type="area"
                    height="100%"
                    options={{
                        chart: {
                            background: 'transparent',
                            toolbar: { show: false },
                            zoom: { enabled: false },
                            animations: { enabled: false },
                            fontFamily: 'Inter, system-ui, sans-serif',
                        },
                        colors: ['#2962ff'],
                        stroke: { curve: 'straight', width: 1.5 },
                        fill: {
                            type: 'gradient',
                            gradient: {
                                shadeIntensity: 1,
                                opacityFrom: 0.3,
                                opacityTo: 0.0,
                                stops: [0, 100],
                            },
                        },
                        grid: {
                            show: true,
                            borderColor: '#1f2937',
                            strokeDashArray: 0,
                            position: 'back',
                            xaxis: { lines: { show: false } },
                            yaxis: { lines: { show: true } },
                            padding: { top: 10, right: 0, bottom: 0, left: 10 },
                        },
                        xaxis: {
                            categories: chartData.map(d => d.date),
                            labels: {
                                style: { colors: '#6b7280', fontSize: '10px', fontWeight: 500 },
                                rotate: 0,
                                hideOverlappingLabels: true,
                            },
                            tickAmount: 6,
                            axisBorder: { show: false },
                            axisTicks: { show: false },
                            crosshairs: {
                                show: true,
                                position: 'back',
                                stroke: { color: '#444', width: 1, dashArray: 4 }
                            },
                            tooltip: { enabled: false },
                        },
                        yaxis: {
                            show: true,
                            labels: {
                                formatter: (val: number) => `₹${val.toFixed(2)}`,
                                style: { colors: '#aab0c0', fontSize: '11px', fontWeight: 500 },
                                offsetX: -10,
                            },
                            axisBorder: { show: false },
                            axisTicks: { show: false },
                        },
                        tooltip: {
                            enabled: true,
                            theme: 'dark',
                            x: { format: 'dd MMM yyyy' },
                            y: { formatter: (val: number) => `₹${val.toFixed(2)}` },
                            marker: { show: false },
                            style: { fontSize: '11px' },
                        },
                        dataLabels: { enabled: false },
                        legend: { show: false },
                    }}
                    series={[{ name: 'NAV', data: chartData.map(d => d.nav) }]}
                />
            </div>
        </div>
    );
};

export default MutualFundChart;
