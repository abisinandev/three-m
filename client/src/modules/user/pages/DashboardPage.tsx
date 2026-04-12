import { PremiumUpgradeCard, VerificationAlertCard } from '@shared/components/cards/AlertCard';
import { useUserStore } from '@stores/user/UserStore';
import { Wallet, TrendingDown, ArrowUpRight, ArrowDownRight, Bot, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import PremiumPaymentModal from '@shared/components/modals/PremiumPaymentModal';

const DashboardPage = () => {
  const { user } = useUserStore.getState();
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  return (
    <div className="space-y-5 pb-10">
      {!user?.isVerified && <VerificationAlertCard />}
      {user?.isVerified && <PremiumUpgradeCard onUpgrade={() => setIsPremiumModalOpen(true)} />}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Wallet, label: 'Wallet Balance', value: '₹1,24,500', change: '+12.5%', positive: true },
          { icon: TrendingDown, label: 'Monthly Spend', value: '₹45,200', change: '-8.2%', positive: false },
          { icon: BarChart3, label: 'Investments', value: '₹2,85,750', change: '+15.3%', positive: true },
          { icon: Bot, label: 'Algo Active', value: '5 strategies', change: 'Running', positive: true },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-[#0f0f0f] rounded-lg border border-[#1f1f1f] p-4 hover:border-[#2a2a2a] transition"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-1.5 rounded ${stat.positive ? 'bg-[#22C55E]/10' : 'bg-red-500/10'}`}>
                <stat.icon className={`w-4 h-4 ${stat.positive ? 'text-[#22C55E]' : 'text-red-400'}`} />
              </div>
              {stat.positive ? (
                <ArrowUpRight className="w-3.5 h-3.5 text-[#22C55E]" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 text-red-400" />
              )}
            </div>
            <p className="text-xs text-gray-400">{stat.label}</p>
            <p className="text-base font-semibold text-white mt-0.5">{stat.value}</p>
            <p className={`text-xs mt-1 ${stat.positive ? 'text-[#22C55E]' : 'text-red-400'}`}>
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-[#0f0f0f] rounded-lg border border-[#1f1f1f] p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-white">Expense Breakdown</h3>
            <span className="text-xs text-gray-500">This Month</span>
          </div>
          <div className="relative w-40 h-40 mx-auto">
            <div className="absolute inset-0 rounded-full bg-gradient-conic from-[#22C55E] via-blue-500 to-purple-500 p-1.5">
              <div className="w-full h-full rounded-full bg-[#0f0f0f] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">68%</p>
                  <p className="text-[10px] text-gray-500">of budget</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-5 text-xs">
            {['Food', 'Transport', 'Shopping'].map((cat, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-[#22C55E]' : i === 1 ? 'bg-blue-500' : 'bg-purple-500'}`} />
                <span className="text-gray-400">{cat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0f0f0f] rounded-lg border border-[#1f1f1f] p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-white">Portfolio Growth</h3>
            <span className="text-xs text-gray-500">6M</span>
          </div>
          <div className="h-32 flex items-end justify-between gap-1.5">
            {[240, 255, 268, 272, 292, 310].map((h, i) => (
              <div key={i} className="flex-1">
                <div
                  className="w-full bg-gradient-to-t from-[#22C55E] to-[#22C55E]/20 rounded-t"
                  style={{ height: `${(h / 320) * 100}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 text-xs text-gray-500">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-[#0f0f0f] rounded-lg border border-[#1f1f1f] p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Active SIPs</h3>
          <div className="space-y-3">
            {['HDFC Top 100', 'SBI Small Cap', 'Axis Bluechip'].map((fund, i) => (
              <div key={i} className="flex justify-between text-xs">
                <span className="text-gray-300">{fund}</span>
                <span className="text-[#22C55E] font-medium">+12.5%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0f0f0f] rounded-lg border border-[#1f1f1f] p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Recent Algo Trades</h3>
          <div className="space-y-3 text-xs">
            {['RELIANCE → +₹2,450', 'TCS → -₹1,200', 'INFY → +₹3,760'].map((t, i) => (
              <div key={i} className="flex justify-between">
                <span className="text-gray-300">{t.split(' → ')[0]}</span>
                <span className={t.includes('+') ? 'text-[#22C55E]' : 'text-red-400'}>{t.split(' → ')[1]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-gradient-to-r from-[#0f0f0f] via-[#111111] to-[#0f0f0f] rounded-xl border border-[#22C55E]/20 p-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#22C55E]/10 px-3 py-1 rounded-full text-[#22C55E] text-xs font-medium mb-3">
            <Bot className="w-3.5 h-3.5" />
            Upgrade to Premium
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Unlock AI-Powered Trading</h2>
          <p className="text-xs text-gray-400 mb-5">
            Auto-trade, smart insights, zero ads — just ₹499/month
          </p>
          <button
            onClick={() => setIsPremiumModalOpen(true)}
            className="bg-[#22C55E] hover:bg-[#1ea853] text-black font-semibold text-sm px-8 py-2.5 rounded-lg transition"
          >
            Go Premium Now
          </button>
        </div>
      </div>

      <PremiumPaymentModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
      />
    </div>
  );
};

export default DashboardPage;