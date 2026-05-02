import { PricingCard } from "./PricingCard";

export const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-deep-charcoal to-[#0a0a0a] overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-teal-green/5 blur-3xl -z-10" />

        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-cool-white">
            Unlock Your <span className="text-teal-green">Full Potential</span>
          </h2>
          <p className="text-sm sm:text-base text-cool-white/70 max-w-2xl mx-auto">
            Choose the plan that accelerates your wealth journey.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid gap-8 sm:grid-cols-2">
          {/* Free Plan */}
          <PricingCard
            title="Basic"
            price="₹0"
            period="/forever"
            description="Perfect for getting started"
            features={[
              "Expense Tracking & Budgeting",
              "Basic Portfolio Management",
              "Real-time Market News",
              "One-Time Mutual Fund Investments",
              "Basic AI Financial Chatbot",
            ]}
            buttonText="Start Free"
            buttonStyle="bg-cool-white/10 border border-cool-white/20 text-cool-white hover:bg-teal-green/20 hover:border-teal-green/40 hover:text-teal-green transition-all duration-300"
          />

          {/* Premium Plan - Popular */}
          <div className="relative group">
            {/* Popular Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
              <div className="bg-teal-green text-deep-charcoal px-3 py-1 rounded-full text-xs font-bold shadow-sm animate-pulse">
                PREMIUM
              </div>
            </div>

            <PricingCard
              title="Go Premium"
              price="₹999"
              period="/month"
              description="Unlock advanced portfolio analytics"
              features={[
                "SIP Automation Engine",
                "Advanced Stock Trading",
                "Algo Trading Controls",
                "Automated Trade Execution Bot",
                "Advanced AI Chat Assistant",
                "Deep Portfolio Analytics (XIRR)",
              ]}
              buttonText="Go Premium"
              buttonStyle="bg-teal-green text-deep-charcoal font-bold hover:bg-teal-green/90 transition-all duration-300"
              popular
            />
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <p className="text-xs text-cool-white/50">
            <span className="text-teal-green font-semibold">Secure payments via Stripe</span> • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};