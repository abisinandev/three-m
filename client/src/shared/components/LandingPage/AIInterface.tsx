import { Lightbulb } from "lucide-react";

export const AIInterface: React.FC = () => {
  return (
    <div className="rounded-2xl p-8 border border-cool-white/20 animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-teal-green rounded-full flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-deep-charcoal" />
          </div>
          <span className="font-semibold">AI Financial Assistant</span>
        </div>
        <div className="flex justify-end mb-4">
          <div className="bg-deep-charcoal p-3 rounded-lg max-w-xs">
            <p className="text-sm">
              Should I invest more in tech stocks given the current market conditions?
            </p>
          </div>
        </div>
        <div className="flex justify-start mb-4">
          <div className="bg-teal-green/10 border border-teal-green/30 p-4 rounded-lg max-w-sm">
            <p className="text-sm text-cool-white/90 mb-2">
              Based on your risk profile and current portfolio allocation, I recommend:
            </p>
            <ul className="text-xs text-cool-white/80 space-y-1">
              <li>• Reduce tech exposure by 5%</li>
              <li>• Increase healthcare & utilities</li>
              <li>• Expected risk reduction: 12%</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border border-gray-700 p-4 rounded-lg">
        <h6 className="text-sm font-semibold mb-3 text-teal-green">
          Active Trading Algorithm
        </h6>
        <div className="space-y-2 text-xs font-mono">
          <div className="flex justify-between">
            <span className="text-cool-white/60">IF Price &lt; MovingAvg(20)</span>
            <span className="text-teal-green">→ BUY</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cool-white/60">IF RSI &gt; 70</span>
            <span className="text-red-400">→ SELL</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cool-white/60">Stop Loss:</span>
            <span className="text-electric-orange">-5%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
