import { Bot } from "lucide-react";
import { FeaturePoint } from "./FeaturePoint";
import { AIInterface } from "./AIInterface";

export const MakeMoneyPillar: React.FC = () => {
  return (
    <div>
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-teal-green/20 rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6 text-teal-green" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-cool-white uppercase">
              Make Money
            </h3>
          </div>
          <h4 className="text-base sm:text-lg font-medium text-cool-white/90">
            You Earn It. We Empower It.
          </h4>
          <p className="text-sm text-cool-white/70 leading-relaxed max-w-xl">
            Building your initial capital requires dedication—whether through a career, business, or side hustle. Once you've made your money, Three-M provides the robust infrastructure needed to securely onboard and deploy your hard-earned funds.
          </p>
          <div className="space-y-2 sm:space-y-3">
            <FeaturePoint text="Seamless onboarding for your capital" />
            <FeaturePoint text="Secure Stripe-powered wallet infrastructure" />
            <FeaturePoint text="Bank-level security for fund deposits" />
          </div>
        </div>

        {/* Right Content */}
        <AIInterface />
      </div>
    </div>
  );
};
