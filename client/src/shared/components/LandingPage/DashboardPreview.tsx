import type React from "react";
import { LineChart, Line, ResponsiveContainer, Tooltip, YAxis } from "recharts";

const chartData = [
  { blue: 2900, red: 3000, green: 2850 },
  { blue: 2910, red: 2990, green: 2870 },
  { blue: 2895, red: 2995, green: 2890 },
  { blue: 2920, red: 2980, green: 2900 },
  { blue: 2915, red: 2960, green: 2920 },
  { blue: 2930, red: 2970, green: 2910 },
  { blue: 2925, red: 2950, green: 2940 },
  { blue: 2940, red: 2960, green: 2930 },
  { blue: 2950, red: 2940, green: 2960 },
  { blue: 2935, red: 2950, green: 2980 },
  { blue: 2945, red: 2930, green: 2970 },
  { blue: 2960, red: 2910, green: 2990 },
  { blue: 2965, red: 2900, green: 3010 },
  { blue: 2955, red: 2910, green: 3000 },
  { blue: 2970, red: 2890, green: 3020 },
  { blue: 2980, red: 2880, green: 3040 },
  { blue: 2975, red: 2870, green: 3030 },
  { blue: 2990, red: 2850, green: 3050 },
  { blue: 2985, red: 2860, green: 3060 },
  { blue: 3000, red: 2840, green: 3080 },
  { blue: 2995, red: 2830, green: 3070 },
  { blue: 3010, red: 2810, green: 3090 },
  { blue: 3015, red: 2820, green: 3100 },
  { blue: 3005, red: 2800, green: 3110 },
  { blue: 3020, red: 2790, green: 3130 },
  { blue: 3030, red: 2780, green: 3150 },
  { blue: 3025, red: 2770, green: 3140 },
  { blue: 3040, red: 2750, green: 3160 },
  { blue: 3050, red: 2740, green: 3180 },
  { blue: 3045.20, red: 2730, green: 3170.50 }
];

export const DashboardPreview: React.FC = () => (
  <div className="relative group perspective-[1000px] w-full max-w-2xl mx-auto">
    <div className="relative transition-transform duration-700 group-hover:rotate-y-[4deg] group-hover:rotate-x-[2deg] group-hover:scale-[1.02]">
      <div className="absolute -inset-4 bg-teal-green/10 rounded-2xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />

      <div className="bg-[#121212] rounded-xl border border-cool-white/10 flex h-72 sm:h-80 overflow-hidden shadow-2xl">

        <div className="hidden sm:flex w-1/3 border-r border-cool-white/10 flex-col bg-[#1A1A1A]">
          <div className="px-3 py-2 border-b border-cool-white/10 text-[10px] text-cool-white/50 uppercase tracking-wider font-semibold">
            Marketwatch
          </div>
          <div className="flex-1 overflow-hidden flex flex-col text-xs">
            <div className="flex justify-between p-3 border-b border-cool-white/5 bg-cool-white/5 cursor-pointer">
              <span className="text-cool-white/90 font-medium">RELIANCE</span>
              <span className="text-teal-green">3045.20 <span className="text-[10px] ml-1 opacity-70">1.45%</span></span>
            </div>
            <div className="flex justify-between p-3 border-b border-cool-white/5 hover:bg-cool-white/5 cursor-pointer">
              <span className="text-cool-white/90">HDFCBANK</span>
              <span className="text-[#ef4444]">1432.10 <span className="text-[10px] ml-1 opacity-70">-0.21%</span></span>
            </div>
            <div className="flex justify-between p-3 border-b border-cool-white/5 hover:bg-cool-white/5 cursor-pointer">
              <span className="text-cool-white/90">INFY</span>
              <span className="text-teal-green">1425.60 <span className="text-[10px] ml-1 opacity-70">0.85%</span></span>
            </div>
            <div className="flex justify-between p-3 border-b border-cool-white/5 hover:bg-cool-white/5 cursor-pointer">
              <span className="text-cool-white/90">TCS</span>
              <span className="text-teal-green">3890.00 <span className="text-[10px] ml-1 opacity-70">0.12%</span></span>
            </div>
            <div className="flex justify-between p-3 border-b border-cool-white/5 hover:bg-cool-white/5 cursor-pointer">
              <span className="text-cool-white/90">ITC</span>
              <span className="text-[#ef4444]">428.50 <span className="text-[10px] ml-1 opacity-70">-1.05%</span></span>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-2/3 flex flex-col bg-[#0A0A0A]">
          <div className="px-4 py-3 border-b border-cool-white/10 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-cool-white">RELIANCE</h4>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cool-white/10 text-cool-white/60">NSE</span>
              </div>
              <div className="flex gap-2 text-[11px] mt-0.5 font-medium">
                <span className="text-cool-white/90">3045.20</span>
                <span className="text-teal-green">+43.50 (+1.45%)</span>
              </div>
            </div>
            <div className="flex gap-1.5">
              <div className="w-7 h-7 rounded bg-teal-green text-[#121212] flex items-center justify-center text-xs font-bold hover:brightness-110 cursor-pointer transition-all">B</div>
              <div className="w-7 h-7 rounded bg-[#ef4444] text-white flex items-center justify-center text-xs font-bold hover:brightness-110 cursor-pointer transition-all">S</div>
            </div>
          </div>

          <div className="flex-1 p-4 relative">
            {/* Chart interval selectors */}
            <div className="absolute top-2 left-4 z-10 flex gap-2 text-[10px] text-cool-white/50 font-medium">
              <span className="cursor-pointer hover:text-cool-white">1D</span>
              <span className="cursor-pointer hover:text-cool-white">1W</span>
              <span className="cursor-pointer text-teal-green border-b border-teal-green pb-0.5">1M</span>
              <span className="cursor-pointer hover:text-cool-white">1Y</span>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: '4px', fontSize: '11px', padding: '4px 8px' }}
                  itemStyle={{ fontWeight: 'bold', textTransform: 'capitalize' }}
                  labelStyle={{ display: 'none' }}
                  formatter={(value: number, name: string) => [`₹${value}`, name]}
                  cursor={{ stroke: '#444', strokeWidth: 1, strokeDasharray: '3 3' }}
                />
                <YAxis domain={['dataMin - 100', 'dataMax + 50']} hide />
                <Line type="linear" dataKey="blue" stroke="#3B82F6" strokeWidth={1.5} dot={false} isAnimationActive={true} />
                <Line type="linear" dataKey="red" stroke="#EF4444" strokeWidth={1.5} dot={false} isAnimationActive={true} />
                <Line type="linear" dataKey="green" stroke="#10B981" strokeWidth={1.5} dot={false} isAnimationActive={true} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  </div>
);