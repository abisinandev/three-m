export const StatRow = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between items-center border-b border-[#1e2025] pb-2 last:border-0 last:pb-0">
    <span className="text-[10px] text-[#5a5f6e] font-bold uppercase tracking-tight">{label}</span>
    <span className="text-[11px] font-bold text-[#e8eaed]">{value}</span>
  </div>
);
