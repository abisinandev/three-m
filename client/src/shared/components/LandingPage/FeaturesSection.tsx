import { MakeMoneyPillar } from "./MakeMoneyPillar";
import { ManageMoneyPillar } from "./ManageMoneyPillar";
import { MultiplyMoneyPillar } from "./MultiplyMoneyPillar";

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-deep-charcoal/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-cool-white tracking-tight">
            The Core of Three-M
          </h2>
          <p className="text-sm sm:text-base text-cool-white/70 leading-relaxed">
            Our platform is built on three fundamental pillars: You <span className="font-semibold text-cool-white">Make</span> the money through your hard work, we help you <span className="font-semibold text-cool-white">Manage</span> it intelligently with AI, and provide the tools to <span className="font-semibold text-cool-white">Multiply</span> it through advanced investing and trading.
          </p>
        </div>

        <div className="space-y-16">
          <ManageMoneyPillar   />
          <MultiplyMoneyPillar   />
          <MakeMoneyPillar   />
        </div>
      </div>
    </section>
  );
};