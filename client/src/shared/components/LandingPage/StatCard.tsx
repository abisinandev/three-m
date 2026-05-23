interface StatCardProps {
  label: string;
  value: string;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, color }) => (
  <div className="border border-gray-700 p-4 rounded-lg text-center hover:bg-card-dark/80 transition-colors duration-200">
    <p className="text-cool-white/60 text-sm">{label}</p>
    <p className={`${color} font-bold text-lg`}>{value}</p>
  </div>
);