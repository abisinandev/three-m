import { AlertTriangle, Sparkles } from 'lucide-react';
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
    <div className="w-full mb-6">
      <div className="relative overflow-hidden rounded-xl border border-emerald-500/25 bg-emerald-900/10 p-5 backdrop-blur-sm">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-emerald-600" />

        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
            <Sparkles className="h-5 w-5 text-emerald-400" />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-sm font-semibold text-emerald-300">
                Upgrade to threeM Premium
              </h3>
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                Recommended
              </span>
            </div>

            <p className="mt-1.5 text-xs text-gray-300 leading-relaxed">
              Get AI-powered insights, zero brokerage on delivery, priority support, and advanced tools trusted by serious investors.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onUpgrade}
                className="rounded-lg bg-emerald-500 px-5 py-2 text-xs font-bold text-black transition-all hover:bg-emerald-400 hover:shadow-emerald-400/20 active:scale-98"
              >
                Go Premium — ₹499/mo
              </button>
              <span className="text-[11px] text-emerald-600 font-medium">
                Cancel anytime • 7-day free trial
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}