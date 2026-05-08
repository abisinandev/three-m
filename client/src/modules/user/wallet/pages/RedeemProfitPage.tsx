import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { ROUTES } from '@shared/constants/routes';
import { useRedeem } from '../../portfolio/hooks/useRedeem';
import { RedeemCard } from '../../portfolio/components/RedeemCard';
import { RedeemModal } from '../../portfolio/components/RedeemModal';

const RedeemProfitPage = () => {
    const navigate = useNavigate();
    const {
        investments,
        loading,
        selectedFund,
        isModalOpen,
        redeemType,
        redeemAmount,
        redeemUnits,
        redeemMode,
        confirmStep,
        estimatedRedeemValue,
        isValidRedemption,
        openRedeemModal,
        closeRedeemModal,
        setRedeemType,
        setRedeemAmount,
        setRedeemUnits,
        setRedeemMode,
        handleRedeemConfirm,
    } = useRedeem();

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans selection:bg-green-500/30">

            <div className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800/60 px-6 py-3.5 flex items-center gap-4">
                <button
                    onClick={() => navigate({ to: ROUTES.USER.PORTFOLIO.ROOT })}
                    className="p-2 -ml-2 rounded-lg text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800/50 transition-all active:scale-95"
                >
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h1 className="text-base font-bold tracking-tight text-neutral-100">Redeem Holdings</h1>
                    <p className="text-[11px] text-neutral-500 mt-0.5 font-medium uppercase tracking-tight">Release your paper profits</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-3 text-neutral-600">
                        <div className="w-5 h-5 border-2 border-neutral-700 border-t-neutral-400 rounded-full animate-spin" />
                        <span className="text-xs font-semibold tracking-wide">Refreshing holdings…</span>
                    </div>
                ) : investments.length === 0 ? (
                    <div className="text-center py-32 bg-neutral-900/20 border border-dashed border-neutral-800 rounded-xl">
                        <p className="text-neutral-500 text-[12px] font-medium tracking-wide">No active investments found to redeem.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {investments.map((fund) => (
                            <RedeemCard 
                                key={fund.schemeCode}
                                fund={fund}
                                onRedeem={openRedeemModal}
                            />
                        ))}
                    </div>
                )}
            </div>

            {isModalOpen && selectedFund && (
                <RedeemModal 
                    fund={selectedFund}
                    onClose={closeRedeemModal}
                    redeemType={redeemType}
                    setRedeemType={setRedeemType}
                    redeemMode={redeemMode}
                    setRedeemMode={setRedeemMode}
                    redeemAmount={redeemAmount}
                    setRedeemAmount={setRedeemAmount}
                    redeemUnits={redeemUnits}
                    setRedeemUnits={setRedeemUnits}
                    confirmStep={confirmStep}
                    onConfirm={handleRedeemConfirm}
                    estimatedValue={estimatedRedeemValue}
                    isValid={isValidRedemption}
                />
            )}
        </div>
    );
};

export default RedeemProfitPage;
