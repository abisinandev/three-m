import React from 'react';
import { X, CheckCircle2, Sparkles, Zap, Shield, Crown } from 'lucide-react';

interface PremiumPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PremiumPaymentModal: React.FC<PremiumPaymentModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const benefits = [
    { icon: Zap, text: 'Ultra-low latency algorithmic trading' },
    { icon: Shield, text: 'Advanced risk management & stop-loss' },
    { icon: CheckCircle2, text: 'Priority access to new strategies' },
    { icon: Sparkles, text: 'Real-time market insights & alerts' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0b0c0e]/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-[#111214] border border-[#1e2025] rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Glow accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-[#00C853] to-transparent opacity-50"></div>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#5a5f6e] hover:text-[#e8eaed] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-14 h-14 bg-[#00C853]/10 border border-[#00C853]/20 rounded-2xl flex items-center justify-center">
              <Crown className="w-7 h-7 text-[#00C853]" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-[#e8eaed]">Upgrade to Premium</h2>
              <p className="text-sm text-[#5a5f6e]">Supercharge your trading with professional tools.</p>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 gap-4">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-[#0b0c0e] border border-[#1e2025] rounded-xl group hover:border-[#00C853]/30 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#1e2025] flex items-center justify-center text-[#5a5f6e] group-hover:text-[#00C853] transition-colors">
                  <benefit.icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-[#e8eaed]">{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* Pricing & CTA */}
          <div className="space-y-4 pt-4 border-t border-[#1e2025]">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-lg font-bold text-[#e8eaed]">₹499 / Month</p>
                <p className="text-[10px] text-[#5a5f6e] uppercase tracking-widest font-bold font-sans">Everything included</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-[#00C853]">7-Day Free Trial</p>
                <p className="text-[10px] text-[#5a5f6e]">Cancel anytime</p>
              </div>
            </div>

            <button
              onClick={() => {
                // For actual integration, this would redirect to stripe or handle checkout
                alert("This would normally redirect to the payment gateway.");
              }}
              className="w-full py-4 bg-[#00C853] hover:bg-[#00e676] text-[#0b0c0e] text-sm font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-[#00C853]/10"
            >
              Get Premium Now
            </button>
            <p className="text-[10px] text-center text-[#5a5f6e]">
              By upgrading, you agree to our Terms of Service. Secure payments by Stripe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPaymentModal;
