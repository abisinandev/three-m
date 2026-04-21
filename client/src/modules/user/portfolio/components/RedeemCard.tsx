import type { IRedeemedInvestment } from '@shared/types/portfolio.types';

interface RedeemCardProps {
    fund: IRedeemedInvestment;
    onRedeem: (fund: IRedeemedInvestment) => void;
}

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

export const RedeemCard = ({ fund, onRedeem }: RedeemCardProps) => {
    return (
        <div 
            className="flex items-center justify-between gap-6 px-5 py-4 bg-neutral-900/40 border border-neutral-800 rounded-lg transition-colors hover:border-neutral-700/50 group"
        >
            <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-md bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0">
                    {fund.logo ? (
                        <img src={fund.logo} className="w-5.5 h-5.5 object-contain" alt={fund.schemeName} />
                    ) : (
                        <span className="text-[10px] font-bold text-neutral-500 uppercase">
                            {fund.schemeName.slice(0, 2)}
                        </span>
                    )}
                </div>
                <div className="min-w-0">
                    <h3 className="text-[13px] font-semibold text-neutral-200 truncate leading-tight">
                        {fund.schemeName}
                    </h3>
                    <p className="text-[10px] text-neutral-500 mt-1 uppercase tracking-tight">
                        {fund.category} <span className="mx-1">•</span> {fund.totalUnits.toFixed(3)} units
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-8">
                <div className="text-right">
                    <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-0.5">Value</p>
                    <p className="text-[13px] font-bold text-neutral-200">{formatCurrency(fund.currentValue)}</p>
                </div>
                
                <div className="text-right min-w-[70px] hidden sm:block">
                    <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-0.5">Returns</p>
                    <p className={`text-[13px] font-bold ${fund.profit >= 0 ? 'text-green-500' : 'text-rose-500'}`}>
                        {fund.profit >= 0 ? '+' : ''}{fund.roi.toFixed(2)}%
                    </p>
                </div>

                <button
                    onClick={() => onRedeem(fund)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-[12px] font-bold rounded-md transition-all active:scale-[0.98] shadow-lg shadow-green-900/10"
                >
                    Redeem
                </button>
            </div>
        </div>
    );
};
