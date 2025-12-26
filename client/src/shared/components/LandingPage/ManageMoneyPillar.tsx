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
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-cool-white">
              MANAGE MONEY
            </h3>
          </div>
          <h4 className="text-base sm:text-xl font-semibold text-teal-green">
            Stop Guessing, Start Growing. Intelligent Expense Management.
          </h4>
          <p className="text-sm sm:text-base text-cool-white/80 leading-relaxed max-w-xl">
            Our AI-powered expense tracking follows the proven 50/30/20 rule, automatically categorizing your spending and alerting you before you exceed limits.
          </p>
          <div className="space-y-2 sm:space-y-3">
            <FeaturePoint text="Smart Blocking System prevents overspending" />
            <FeaturePoint text="AI Bill Predictor forecasts upcoming expenses" />
            <FeaturePoint text="Comparative Analytics show spending trends" />
          </div>
        </div>

        <BudgetBreakdown />
      </div>
    </div>
  );
};