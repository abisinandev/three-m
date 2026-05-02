import { DollarSign } from "lucide-react";
import { FeaturePoint } from "./FeaturePoint";
import { BudgetBreakdown } from "./BudgetBreakdown";

export const ManageMoneyPillar: React.FC = () => {
  return (
    <div className="mb-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-teal-green/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-teal-green" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-cool-white uppercase">
              Manage Money
            </h3>
          </div>
          <h4 className="text-base sm:text-lg font-medium text-cool-white/90">
            Track Every Rupee. Spend Intelligently.
          </h4>
          <p className="text-sm text-cool-white/70 leading-relaxed max-w-xl">
            Take control of your cash flow. Our comprehensive expense tracking system helps you categorize spending, while our AI provides intelligent suggestions to optimize your budget and teaches you core financial principles.
          </p>
          <div className="space-y-2 sm:space-y-3">
            <FeaturePoint text="High-performance expense tracking dashboard" />
            <FeaturePoint text="Intelligent AI-driven spending suggestions" />
            <FeaturePoint text="Interactive financial learning resources" />
          </div>
        </div>

        <BudgetBreakdown />
      </div>
    </div>
  );
};