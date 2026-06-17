import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { ROUTES } from '@shared/constants/apiRoutes';
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
        <div className="min-h-screen bg-[#0b0c0e] text-[#e8eaed] font-sans pb-12">

            {/* Sticky Header */}
            <div className="sticky top-0 z-50 bg-[#0b0c0e]/90 backdrop-blur-xl border-b border-[#1e2025] px-6 py-3.5 flex items-center gap-4">
                <button
                    onClick={() => navigate({ to: ROUTES.USER.PORTFOLIO.ROOT })}
                    className="p-2 -ml-2 rounded-md text-[#5a5f6e] hover:text-[#e8eaed] hover:bg-[#111214] transition-all active:scale-95"
                >
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h1 className="text-2xl font-semibold text-[#e8eaed] tracking-tight m-0">
                        Redeem Holdings
                    </h1>
                    <p className="text-sm text-[#5a5f6e] mt-0.5 m-0">
                        Release your paper profits
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-[1400px] mx-auto px-6 py-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-3 text-[#5a5f6e]">
                        <div className="w-5 h-5 border-2 border-[#1e2025] border-t-[#9ca3af] rounded-full animate-spin" />
                        <span className="text-xs font-medium tracking-wide">Refreshing holdings…</span>
                    </div>
                ) : investments.length === 0 ? (
                    <div className="text-center py-32 bg-[#111214] border border-dashed border-[#1e2025] rounded-md">
                        <p className="text-sm text-[#5a5f6e] font-normal">No active investments found to redeem.</p>
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
