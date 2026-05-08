export const MarketStatCard = ({ label, value }: { label: string, value: string }) => (
  <div className="bg-[#111214] border border-[#1e2025] rounded-lg p-4">
    <p className="text-[10px] text-[#5a5f6e] font-bold uppercase tracking-widest mb-1">{label}</p>
    <p className="text-lg font-bold text-[#e8eaed] tracking-tight">{value}</p>
  </div>
);
