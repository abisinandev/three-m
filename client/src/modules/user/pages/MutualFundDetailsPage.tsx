'use client';

import { useMemo, useState } from 'react';
import { Star, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@lib/axiosUser';
import { useParams } from '@tanstack/react-router';
import ApexChart from 'react-apexcharts';

type NavHistory = {
  nav: number;
  navDate: string;
  interval: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
};

type FundDetails = {
  id: string;
  schemeCode: string;
  schemeName: string;
  amc: string;
  category: string;
  subCategory: string;
  risk: string;
  status: string;
  nav: number;
  navDate: string;
  logo: string;
  navHistory: NavHistory[];
};

type ChartPoint = { date: string; nav: number; };

function buildChartData(navHistory: NavHistory[]): ChartPoint[] {
  return [...navHistory]
    .sort((a, b) => new Date(a.navDate).getTime() - new Date(b.navDate).getTime())
    .map(n => ({
      date: new Date(n.navDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
      nav: n.nav,
    }));
}

function calculateReturn(history: NavHistory[]) {
  if (history.length < 2) return 0;
  const start = history[0].nav;
  const end = history[history.length - 1].nav;
  return ((end - start) / start) * 100;
}

const MutualFundDetailsPage = () => {
  const { schemeCode } = useParams({ from: '/user/mutual-funds/$schemeCode' });

  const [activePeriod, setActivePeriod] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'>('MONTHLY');

  const { data, isLoading, error } = useQuery<FundDetails>({
    queryKey: ['fund-details', schemeCode, activePeriod],
    queryFn: async () => {
      const res = await api.get(`/user/mutual-funds/${schemeCode}`, {
        params: { interval: activePeriod },
      });
      return res.data.data;
    },
    staleTime: 60000,
  });

  const chartData = useMemo(() => data?.navHistory ? buildChartData(data.navHistory) : [], [data?.navHistory]);
  const periodReturn = useMemo(() => data?.navHistory ? calculateReturn(data.navHistory) : 0, [data?.navHistory]);

  const periods = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'] as const;

  if (isLoading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><div className="animate-spin h-8 w-8 border-b-2 border-emerald-500" /></div>;
  if (error || !data) return <div className="min-h-screen bg-[#0a0a0a] text-red-400 flex items-center justify-center">Failed to load</div>;

  const isPositive = periodReturn >= 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-5 py-6 space-y-6 text-sm">

        {/* Header - compact */}
        <div className="bg-[#111] border border-[#222] rounded-xl p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={data.logo} alt="" className="w-12 h-12 rounded-lg" />
              <div>
                <h1 className="text-lg font-semibold">{data.schemeName}</h1>
                <p className="text-xs text-gray-400">{data.category} • {data.subCategory}</p>
                <div className="flex gap-2 mt-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-yellow-900/40 text-yellow-400 border border-yellow-800/30">
                    {data.risk}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-400 border border-emerald-800/30">
                    {data.status}
                  </span>
                </div>
              </div>
            </div>
            <Star className="text-emerald-500 h-5 w-5" />
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-5">

          {/* Main - Chart + Stats */}
          <div className="lg:col-span-8 space-y-5">

            {/* Chart Card */}
            <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#222]">
                <h2 className="text-base font-medium">NAV Trend</h2>
                <div className="flex gap-1.5">
                  {periods.map(p => (
                    <button
                      key={p}
                      onClick={() => setActivePeriod(p)}
                      className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
                        p === activePeriod
                          ? 'bg-emerald-600 text-white'
                          : 'text-gray-400 hover:bg-[#1a1a1a]'
                      }`}
                    >
                      {p.charAt(0) + p.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3">
                <ApexChart
                  type="area"
                  height={260}
                  options={{
                    chart: {
                      toolbar: { show: false },
                      zoom: { enabled: false },
                      fontFamily: 'system-ui, sans-serif',
                    },
                    colors: ['#10b981'],
                    stroke: { curve: 'smooth', width: 2.5 },
                    fill: {
                      type: 'gradient',
                      gradient: { opacityFrom: 0.55, opacityTo: 0.08, shadeIntensity: 0.4 },
                    },
                    grid: { borderColor: '#1f2937', strokeDashArray: 3 },
                    xaxis: {
                      categories: chartData.map(d => d.date),
                      labels: { style: { colors: '#6b7280', fontSize: '11px' } },
                      tickAmount: 6,
                    },
                    yaxis: {
                      labels: {
                        formatter: val => `₹${Math.round(val)}`,
                        style: { colors: '#6b7280', fontSize: '11px' },
                      },
                    },
                    tooltip: {
                      theme: 'dark',
                      x: { show: false },           // ← hide date in tooltip
                      y: { formatter: val => `₹${val.toFixed(2)}` },
                      marker: { show: true },
                      style: { fontSize: '13px' },
                    },
                  }}
                  series={[{ name: 'NAV', data: chartData.map(d => d.nav) }]}
                />
              </div>
            </div>

            {/* Stats - smaller */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#111] border border-[#222] rounded-lg p-3.5 text-center">
                <p className="text-xl font-bold">₹{data.nav.toFixed(2)}</p>
                <p className="text-xs text-gray-400 mt-0.5">NAV</p>
              </div>
              <div className="bg-[#111] border border-[#222] rounded-lg p-3.5 text-center">
                <p className={`text-xl font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isPositive ? '+' : ''}{periodReturn.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{activePeriod}</p>
              </div>
              <div className="bg-[#111] border border-[#222] rounded-lg p-3.5 text-center">
                <p className="text-xl font-bold">10,390 Cr</p>
                <p className="text-xs text-gray-400 mt-0.5">AUM</p>
              </div>
              <div className="bg-[#111] border border-[#222] rounded-lg p-3.5 text-center">
                <p className="text-xl font-bold">0.75%</p>
                <p className="text-xs text-gray-400 mt-0.5">Exp Ratio</p>
              </div>
            </div>
          </div>

          {/* Right side - compact */}
          <div className="lg:col-span-4 space-y-5">

            <div className="bg-[#111] border border-[#222] rounded-xl p-4 text-xs">
              <h3 className="text-sm font-medium mb-3">Asset Allocation</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-gray-300">Equity</span><span className="text-emerald-400">92.4%</span></div>
                <div className="flex justify-between"><span className="text-gray-300">Debt</span><span className="text-blue-400">4.1%</span></div>
                <div className="flex justify-between"><span className="text-gray-300">Cash</span><span className="text-amber-400">3.5%</span></div>
              </div>
            </div>

            <div className="bg-[#111] border border-[#222] rounded-xl p-4 text-xs">
              <h3 className="text-sm font-medium mb-3">Recent NAV</h3>
              <div className="space-y-2">
                {data.navHistory.slice(-5).reverse().map((item, i) => (
                  <div key={i} className="flex justify-between py-1 border-b border-[#222] last:border-0">
                    <span className="text-gray-300">
                      {new Date(item.navDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                    <span>₹{item.nav.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MutualFundDetailsPage;