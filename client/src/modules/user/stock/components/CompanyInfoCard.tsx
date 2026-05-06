interface CompanyInfoCardProps {
  sector: string;
  isTradable: boolean;
}

export const CompanyInfoCard = ({ sector, isTradable }: CompanyInfoCardProps) => {
  return (
    <div className="bg-[#111214] border border-[#1e2025] rounded-lg p-5 space-y-4">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-[#5a5f6e] font-bold uppercase tracking-widest">
            Sector
          </span>
          <span className="text-[10px] font-bold text-[#e8eaed]">
            {sector || "N/A"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-[#5a5f6e] font-bold uppercase tracking-widest">
            Tradable
          </span>
          <span
            className={`text-[10px] font-bold ${
              isTradable ? "text-[#00C853]" : "text-[#FF1744]"
            }`}
          >
            {isTradable ? "YES" : "STRICTED"}
          </span>
        </div>
      </div>
    </div>
  );
};
