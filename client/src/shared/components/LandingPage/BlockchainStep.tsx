
interface BlockchainStepProps {
  number: string;
  label: string;
  value: string;
}

export const BlockchainStep: React.FC<BlockchainStepProps> = ({ number, label, value }) => (
  <div className="flex-shrink-0 bg-teal-green/20 border-2 border-teal-green rounded-lg p-4 min-w-[120px] hover:bg-teal-green/30 transition-colors duration-200">
    <div className="text-center">
      <div className="w-8 h-8 bg-teal-green rounded mx-auto mb-2 flex items-center justify-center">
        <span className="text-deep-charcoal font-bold text-sm">{number}</span>
      </div>
      <p className="text-xs text-cool-white/80">{label}</p>
      <p className="text-xs text-teal-green font-medium">{value}</p>
    </div>
  </div>
);