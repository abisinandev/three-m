import { TrendingUp } from "lucide-react";
import { SIPGrowthChart } from "./SIPGrowthChart";
import { FeaturePoint } from "./FeaturePoint";

export const MultiplyMoneyPillar: React.FC = () => {
  return (
    <div className="mb-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <SIPGrowthChart />

        {/* Right Content */}
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-teal-green/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-teal-green" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-cool-white uppercase">
              Multiply Money
            </h3>
          </div>
          <h4 className="text-base sm:text-lg font-medium text-cool-white/90">
            Grow Your Wealth Across Multiple Assets.
          </h4>
          <p className="text-sm text-cool-white/70 leading-relaxed max-w-xl">
            Leverage compounding by investing in top mutual funds via automated SIPs. Actively manage your portfolio with traditional stock trading or utilize advanced algorithmic trading to maximize your returns.
          </p>
          <div className="space-y-2 sm:space-y-3">
            <FeaturePoint text="Mutual funds and automated SIP execution" />
            <FeaturePoint text="Manual stock trading and Algo trading" />
            <FeaturePoint text="Advanced portfolio management and analytics" />
          </div>
        </div>
      </div>
    </div>
  );
};
