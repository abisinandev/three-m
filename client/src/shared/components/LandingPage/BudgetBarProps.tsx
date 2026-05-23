
interface BudgetBarProps {
  label: string;
  current: string;
  total: string;
  percentage: number;
  color: string;
}

export const BudgetBar: React.FC<BudgetBarProps> = ({ label, current, total, percentage, color }) => (
  <div className="space-y-2 group">
    <div className="flex justify-between">
      <span className="text-cool-white/80 group-hover:text-cool-white transition-colors duration-200">
        {label}
      </span>
      <span
        className={`font-medium ${
          color === 'bg-electric-orange' ? 'text-electric-orange' : 'text-teal-green'
        } group-hover:brightness-110 transition-all duration-200`}
      >
        {current} / {total}
      </span>
    </div>
    <div className="w-full bg-deep-charcoal rounded-full h-3">
      <div
        className={`${color} h-3 rounded-full transition-all duration-500 group-hover:shadow-glow`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  </div>
);