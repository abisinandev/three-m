import { ROUTES } from '@shared/constants/routes';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Info, ShieldCheck } from 'lucide-react';

const WithdrawPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="sticky top-0 z-10 border-b border-[#1f1f1f] bg-black/80 backdrop-blur px-5 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate({ to: ROUTES.USER.WALLET.ROOT })}
          className="p-2 hover:bg-white/10 rounded-xl transition-all mr-2 group/back"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-semibold">Withdraw</h1>
      </div>

      <div className="max-w-lg mx-auto pt-6 px-5 pb-12 space-y-6">
        <div className="bg-[#0f0f0f] rounded-2xl border border-[#1f1f1f] p-6">
          <h2 className="text-base font-medium mb-1">Easy withdrawal</h2>
          <p className="text-xs text-gray-500 mb-5">
            Transfer money directly to your bank account
          </p>

          <div className="text-xs text-gray-500 mb-4">
            Last updated: Dec 14, 2025
          </div>

          <div className="mb-6">
            <label className="text-xs text-gray-400 mb-2 block">
              Amount to withdraw
            </label>

            <div className="flex gap-3">
              <input
                type="number"
                placeholder="0.00"
                className="flex-1 bg-[#111] border border-[#333] rounded-xl px-4 py-3 text-xl font-semibold focus:outline-none focus:border-green-500 transition"
              />

              <button className="px-6 py-3 bg-gradient-to-r from-[#22C55E] to-[#16a34a] rounded-xl font-medium text-sm hover:from-[#1fa856] hover:to-[#15803d] transition">
                Withdraw
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-400">
              <Info size={13} />
              <span>Max: ₹10,00,000</span>
              <span className="mx-1.5">•</span>
              <span className="text-green-400">Regular (24–48 hrs)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-4 border-t border-[#1f1f1f]">
            <div>
              <div className="text-xs text-gray-400">Closing balance</div>
              <div className="text-lg font-medium mt-1">₹0.00</div>
              <div className="text-xs text-gray-500">after withdrawal</div>
            </div>

            <div>
              <div className="text-xs text-gray-400">Withdrawable amount</div>
              <div className="text-2xl font-semibold text-green-400 mt-1">
                ₹100.00
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0f0f0f] rounded-2xl border border-[#1f1f1f] p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck size={16} className="text-green-400" />
            <h3 className="text-sm font-semibold">Withdrawal policy</h3>
          </div>

          <ul className="space-y-3 text-xs text-gray-400 leading-relaxed">
            <li>• Minimum withdrawal amount is ₹100.</li>
            <li>• Maximum withdrawal limit per transaction is ₹10,00,000.</li>
            <li>• Withdrawals are processed within 24–48 hours on business days.</li>
            <li>• Funds can only be withdrawn to your verified bank account.</li>
            <li>• Failed or rejected withdrawals will be refunded to your wallet.</li>
          </ul>
        </div>

        <button
          onClick={() => navigate({ to: ROUTES.USER.WALLET.ROOT })}
          className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5 mx-auto"
        >
          <ArrowLeft size={14} />
          Go back
        </button>
      </div>
    </div>
  );
};

export default WithdrawPage;
