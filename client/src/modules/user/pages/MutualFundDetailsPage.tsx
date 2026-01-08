import React from 'react';
import { Wallet, ChevronDown, Menu, Bell } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MutualFundDetailsPage = () => {
  // Mock performance data for the chart (growth over time)
  const performanceData = [
    { name: 'Jan 21', fund: 100, benchmark: 100 },
    { name: 'Jan 22', fund: 115, benchmark: 112 },
    { name: 'Jan 23', fund: 128, benchmark: 125 },
    { name: 'Jan 24', fund: 145, benchmark: 140 },
    { name: 'Jan 25', fund: 162, benchmark: 155 },
    { name: 'Jan 26', fund: 180, benchmark: 170 },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-inter antialiased">
      {/* Header - Matching your app theme */}
      <header className="bg-[#0f0f0f] border-b border-[#1f1f1f]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between text-sm">
          <div className="flex items-center">
            <h1 className="text-xl font-bold tracking-tighter">
              <span className="text-white">three</span>
              <span className="text-[#22C55E]">M</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-[#171717] px-3 py-1.5 rounded-full border border-[#2a2a2a] text-xs font-medium">
              <Wallet className="w-3.5 h-3.5 text-[#22C55E]" />
              <span>₹1,24,500</span>
            </div>
            <button className="relative p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors group">
              <Bell className="w-4.5 h-4.5 text-gray-400 group-hover:text-gray-200" />
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#0f0f0f]">3</span>
            </button>
            <button className="lg:hidden">
              <Menu size={20} className="text-gray-400" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Fund Header - Compact like Figma */}
        <div className="mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center text-xl font-bold">H</div>
            <div>
              <h1 className="text-xl font-bold">HDFC Top 100 Fund</h1>
              <p className="text-sm text-gray-400">Direct Plan • Large Cap Equity Returns</p>
            </div>
            <div className="ml-auto flex items-center gap-2 text-xs">
              <span className="text-gray-400">5 Star</span>
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold">5</div>
            </div>
          </div>
        </div>

        {/* Time Period Tabs - Compact */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['1D', '1W', '1M', '3M', '6M', '1Y', '3Y', '5Y', 'MAX'].map((period) => (
            <button
              key={period}
              className={`px-3 py-1.5 text-xs rounded-lg border ${period === '1Y' ? 'bg-[#22C55E] text-black border-[#22C55E]' : 'border-[#333] text-gray-400 hover:text-white'}`}
            >
              {period}
            </button>
          ))}
        </div>

        {/* Performance Chart - Smaller height */}
        <section className="mb-8">
          <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl p-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                <XAxis dataKey="name" stroke="#666" tick={{ fontSize: 10 }} />
                <YAxis stroke="#666" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333', fontSize: 12 }} />
                <Line type="monotone" dataKey="fund" stroke="#22C55E" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="benchmark" stroke="#666" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Period Returns Table - Compact */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Period Returns</h2>
          <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#171717] text-gray-400 text-xs">
                <tr>
                  <th className="px-4 py-2 text-left">Period</th>
                  <th className="px-4 py-2 text-right">Fund</th>
                  <th className="px-4 py-2 text-right">Benchmark</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-[#1f1f1f]">
                  <td className="px-4 py-2 text-gray-400">1 Month</td>
                  <td className="px-4 py-2 text-right text-green-400">+3.2%</td>
                  <td className="px-4 py-2 text-right text-green-400">+2.8%</td>
                </tr>
                <tr className="border-t border-[#1f1f1f]">
                  <td className="px-4 py-2 text-gray-400">3 Months</td>
                  <td className="px-4 py-2 text-right text-green-400">+6.5%</td>
                  <td className="px-4 py-2 text-right text-green-400">+7.1%</td>
                </tr>
                <tr className="border-t border-[#1f1f1f]">
                  <td className="px-4 py-2 text-gray-400">6 Months</td>
                  <td className="px-4 py-2 text-right text-green-400">+12.8%</td>
                  <td className="px-4 py-2 text-right text-green-400">+11.2%</td>
                </tr>
                <tr className="border-t border-[#1f1f1f]">
                  <td className="px-4 py-2 text-gray-400">1 Year</td>
                  <td className="px-4 py-2 text-right text-green-400">+20.2%</td>
                  <td className="px-4 py-2 text-right text-green-400">+18.5%</td>
                </tr>
                <tr className="border-t border-[#1f1f1f]">
                  <td className="px-4 py-2 text-gray-400">3 Years</td>
                  <td className="px-4 py-2 text-right text-green-400">+15.8%</td>
                  <td className="px-4 py-2 text-right text-green-400">+14.2%</td>
                </tr>
                <tr className="border-t border-[#1f1f1f]">
                  <td className="px-4 py-2 text-gray-400">5 Years</td>
                  <td className="px-4 py-2 text-right text-green-400">+13.5%</td>
                  <td className="px-4 py-2 text-right text-green-400">+12.8%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Top Holdings - Compact */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Top Holdings</h2>
          <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span>Reliance Industries</span>
              <span className="text-green-400">+1.2%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>HDFC Bank <span className="text-xs text-gray-500">(7.82% of AUM)</span></span>
              <span className="text-green-400">+0.8%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Infosys <span className="text-xs text-gray-500">(6.01% of AUM)</span></span>
              <span className="text-red-400">-0.3%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>TCS <span className="text-xs text-gray-500">(6.23% of AUM)</span></span>
              <span className="text-green-400">+0.5%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>ICICI Bank <span className="text-xs text-gray-500">(5.67% of AUM)</span></span>
              <span className="text-green-400">+1.1%</span>
            </div>
          </div>
        </section>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl p-4 text-center">
            <p className="text-2xl font-bold">1296.12</p>
            <p className="text-xs text-gray-400">NAV</p>
            <p className="text-xs text-green-400">+0.32%</p>
          </div>
          <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl p-4 text-center">
            <p className="text-2xl font-bold">40,617 Cr</p>
            <p className="text-xs text-gray-400">AUM</p>
          </div>
          <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl p-4 text-center">
            <p className="text-2xl font-bold">0.96%</p>
            <p className="text-xs text-gray-400">Expense Ratio</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center mb-8">
          <button className="bg-[#22C55E] hover:bg-[#16a34a] text-black font-bold py-3 px-10 rounded-xl transition text-base">
            Buy
          </button>
          <button className="bg-[#22C55E] hover:bg-[#16a34a] text-black font-bold py-3 px-10 rounded-xl transition text-base">
            SIP
          </button>
        </div>

        {/* Fund Manager - Bottom */}
        <div className="flex items-center justify-between bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-sm font-bold">H</div>
            <div>
              <p className="text-sm font-semibold">HDFC Top 100 Fund</p>
              <p className="text-xs text-gray-400">Direct Plan • Large Cap Equity Returns</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold">Fund Manager</p>
            <p className="text-sm text-gray-400">Rahul Baijal</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MutualFundDetailsPage;