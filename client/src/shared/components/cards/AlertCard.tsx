import { AlertTriangle, Crown } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { ROUTES } from '@shared/constants/routes';

export function VerificationAlertCard() {
  return (
    <div className="w-full mb-6">
      <div className="relative overflow-hidden rounded-xl border border-amber-500/20 bg-amber-900/10 p-5 backdrop-blur-sm">
        {/* Left accent */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-amber-600" />

        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-500/15">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-sm font-semibold text-amber-300">
                Complete KYC Verification
              </h3>
              <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                Required
              </span>
            </div>

            <p className="mt-1.5 text-xs text-gray-300 leading-relaxed">
              Your account is partially active. Complete KYC to enable withdrawals, increase limits, and unlock all features.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <Link
                to={ROUTES.USER.PROFILE}
                className="rounded-lg bg-amber-500 px-5 py-2 text-xs font-bold text-black transition-all hover:bg-amber-400 hover:shadow-amber-400/20 active:scale-98 transition-all"
              >
                Verify Now
              </Link>
              <span className="text-[11px] text-amber-600 font-medium">
                Takes 2–3 minutes
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PremiumUpgradeCard({ onUpgrade }: { onUpgrade?: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 bg-[#111214] border border-amber-500/20 rounded-lg px-4 py-3 mb-5">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
          <Crown className="w-3.5 h-3.5 text-amber-500" />
        </div>
        <div>
          <p className="text-xs font-semibold text-[#e8eaed] leading-tight">Upgrade to Premium</p>
          <p className="text-[11px] text-[#5a5f6e] mt-0.5">Algo trading, AI insights, advanced analytics & more</p>
        </div>
      </div>
      <button
        onClick={onUpgrade}
        className="shrink-0 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 active:scale-95 transition-all text-black text-[11px] font-bold rounded whitespace-nowrap tracking-wide"
      >
        Go Premium
      </button>
    </div>
  );
}
