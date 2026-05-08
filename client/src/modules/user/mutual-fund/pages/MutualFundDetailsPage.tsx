'use client';

import { useMemo, useState } from 'react';
import { Star, Loader2, ArrowUpRight, ArrowDownRight, TrendingUp, ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from '@tanstack/react-router';
import type { FundDetails } from '../types/details.types';
import { buildChartData, calculateUnitPrice } from '../helpers/fund-details.helper';
import { getMutualFundDetails } from '@/shared/services/mutual-fund/mutual-fund-apis-user-side';
import { StartSipModal, type SipData } from '../components/modals/StartSipModal';
import { useStartSip } from '../hooks/useStartSip';
import { InvestModal } from '../components/modals/InvestModal';
import { ConfirmModal } from '../components/modals/ConfirmModal';
import { SuccessModal } from '../components/modals/SuccessModal';
import MutualFundChart from '../components/details/MutualFundChart';
import PortfolioAllocation from '../components/details/PortfolioAllocation';
import NavHistoryList from '../components/details/NavHistoryList';
import { useInvestMutualFund } from '../hooks/useInvestMutualFund';
import { usePremiumModalStore } from '@stores/user/PremiumModalStore';
import { toast } from 'sonner';
import { useUserStore } from '@stores/user/UserStore';

const PAYMENT_METHOD = 'WALLET' as const;
const INVESTMENT_TYPE = 'ONE_TIME' as const;

const MutualFundDetailsPage = () => {
  const { schemeCode } = useParams({ from: '/user/mutual-funds/$schemeCode' });
  const navigate = useNavigate();
  const [activePeriod, setActivePeriod] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { onOpen: openPremiumModal } = usePremiumModalStore();
  const user = useUserStore((state) => state.user);
  const [investment, setInvestment] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const { data, isLoading, error } = useQuery<FundDetails>({
    queryKey: ['fund-details', schemeCode, activePeriod],
    queryFn: async () => await getMutualFundDetails(schemeCode, activePeriod),
    staleTime: 60000,
  });

  const latestNav = data?.nav ?? 0;

  const units = useMemo(
    () => (investment > 0 && latestNav > 0 ? calculateUnitPrice(investment, latestNav) : 0),
    [investment, latestNav]
  );

  const [successData, setSuccessData] = useState<{ amount?: number; units?: number } | null>(null);
 
   const { mutate: invest, isPending: isSubmitting } = useInvestMutualFund(
     (data: { data?: { amount?: number; units?: number } }) => {
       setSuccessData(data.data as { amount?: number; units?: number });
       setShowConfirmModal(false);
       setShowInvestModal(false);
       setShowSuccessModal(true);
       setErrorMsg('');
     },
     (msg) => {
       alert(msg);
     }
   );


  const { mutate: startSipMutate, isPending: isSipSubmitting } = useStartSip(
    (result) => {
        setShowSipModal(false);
        setShowSuccessModal(true);
        setErrorMsg('');
    },
    (msg, error: unknown) => {
      const err = error as { response?: { status?: number } };
      if (err?.response?.status === 402) {
        setShowSipModal(false);
        openPremiumModal();
      } else {
        alert(msg);
      }
    }
  );

  const [showSipModal, setShowSipModal] = useState(false);

  const handleSipProceed = (sipData: SipData) => {
    if (!data) return;
    setInvestment(sipData.amount);
    startSipMutate({
      schemeCode: data.schemeCode,
      amount: sipData.amount,
      frequency: sipData.frequency,
      startDate: sipData.startDate,
      totalInstallments: sipData.totalInstallments,
      paymentMethod: PAYMENT_METHOD,
    });
  };

  const handleProceedToConfirm = () => {
    setShowInvestModal(false);
    setShowConfirmModal(true);
  }

  const handleConfirmInvestment = () => {
    if (!data) return;

    invest({
      schemeCode: data.schemeCode,
      amount: investment,
      units: Number(units.toFixed(4)),
      paymentMethod: PAYMENT_METHOD,
      investmentType: INVESTMENT_TYPE,
    });
  };

  const chartData = useMemo(() => (data?.navHistory ? buildChartData(data.navHistory) : []), [data?.navHistory]);
  const periodReturn = data?.absoluteReturn ?? 0;
  const isPositive = periodReturn >= 0;
  const periods = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'] as const;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0c0e] text-[#e8eaed] flex items-center justify-center font-sans tracking-tight">
        <p className="text-[#5a5f6e] text-xs uppercase tracking-widest animate-pulse">
          Loading fund details...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0b0c0e] text-[#e8eaed] flex items-center justify-center font-sans tracking-tight">
        <p className="text-[#FF1744] text-xs uppercase tracking-widest">
          Error loading fund details for {schemeCode}.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0c0e] text-[#e8eaed] font-sans selection:bg-[#2962ff]/30">
      <div className="sticky top-0 z-40 bg-[#0b0c0e]/95 backdrop-blur-md border-b border-[#1f1f1f]">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate({ to: '/user/mutual-funds' })}
                className="p-2 -ml-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                title="Back to Mutual Funds"
              >
                <ArrowLeft size={20} />
              </button>
              <img
                src={data.logo}
                alt={data.schemeName}
                className="w-12 h-12 rounded-[4px] object-cover border border-[#2a2a2a]"
              />
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold tracking-tight text-white mb-1">
                    {data.schemeName}
                  </h1>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold tracking-wide">
                  <span className="text-[#aab0c0] uppercase">{data.amc}</span>
                  <span className="text-[#444cd2]">|</span>
                  <span className="text-gray-400">{data.category} • {data.subCategory}</span>
                  <span className="px-1.5 py-0.5 rounded-[4px] bg-[#2962ff]/10 text-[#2962ff] uppercase text-[10px] ml-2">
                    {data.risk} Risk
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <div className="flex items-end gap-3 mb-2">
                <span className="text-2xl font-bold text-white leading-none font-mono tracking-tight">
                  ₹{latestNav.toFixed(2)}
                </span>
                <div className={`flex items-baseline gap-1.5 ${isPositive ? 'text-[#00C853]' : 'text-[#FF1744]'}`}>
                  {isPositive ? <ArrowUpRight size={20} strokeWidth={2.5} /> : <ArrowDownRight size={20} strokeWidth={2.5} />}
                  <span className="text-base font-bold tracking-tighter">
                    {isPositive ? '+' : ''}{periodReturn.toFixed(1)}% <span className="text-xs font-medium ml-1">({activePeriod})</span>
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
			          <button
                  type="button"
                  className="p-1.5 rounded-md text-gray-500 hover:text-white hover:bg-white/5 transition-all outline-none"
                  title="Add to Watchlist"
                >
                  <Star size={16} />
                </button>
                <button
                  onClick={() => setShowInvestModal(true)}
                  className="px-6 py-[6px] bg-[#00C853] hover:bg-[#00B248] text-white font-bold text-xs uppercase tracking-wide rounded-[4px] transition-colors"
                >
                  One-time Invest
                </button>
                <button
                  onClick={() => {
                    if (!user?.isSubscribed) {
                      toast.warning("Upgrade to Premium to use SIP investment feature");
                      openPremiumModal();
                    } else {
                      setShowSipModal(true);
                    }
                  }}
                  className="px-6 py-[6px] bg-[#2962ff] hover:bg-[#2054e6] text-white font-bold text-xs uppercase tracking-wide rounded-[4px] transition-colors"
                >
                  Start SIP
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          
          <div className="col-span-12 lg:col-span-9 space-y-6">
            <MutualFundChart 
              chartData={chartData} 
              activePeriod={activePeriod} 
              setActivePeriod={setActivePeriod} 
              periods={periods} 
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#111214] border border-[#1e2025] rounded-lg p-4">
                <div className="text-[11px] text-[#6a7182] font-semibold uppercase tracking-wider mb-2">Fund Type</div>
                <div className="text-sm text-[#e8eaed] font-medium tracking-wide">{data.category} / {data.subCategory}</div>
              </div>
              <div className="bg-[#111214] border border-[#1e2025] rounded-lg p-4">
                <div className="text-[11px] text-[#6a7182] font-semibold uppercase tracking-wider mb-2">Fund Risk</div>
                <div className="text-sm text-[#e8eaed] font-medium tracking-wide">{data.risk}</div>
              </div>
              <div className="bg-[#111214] border border-[#1e2025] rounded-lg p-4">
                <div className="text-[11px] text-[#6a7182] font-semibold uppercase tracking-wider mb-2">Fund Status</div>
                <div className="text-sm tracking-wide text-[#00C853] font-medium">{data.status}</div>
              </div>
              <div className="bg-[#111214] border border-[#1e2025] rounded-lg p-4">
                <div className="text-[11px] text-[#6a7182] font-semibold uppercase tracking-wider mb-2">AUM</div>
                <div className="text-sm text-[#e8eaed] font-medium tracking-wide">₹{data.aum || 'N/A'}</div>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-3 space-y-6">
            <PortfolioAllocation />
            <NavHistoryList history={data.navHistory} />
          </div>

        </div>
      </div>

      {showInvestModal && data && (
        <InvestModal
          data={data}
          investment={investment}
          setInvestment={setInvestment}
          errorMsg={errorMsg}
          setErrorMsg={setErrorMsg}
          latestNav={latestNav}
          units={units}
          onClose={() => setShowInvestModal(false)}
          onProceed={handleProceedToConfirm}
        />
      )}

      {showSipModal && data && (
        <StartSipModal
          data={data}
          onClose={() => setShowSipModal(false)}
          onProceed={handleSipProceed}
          isSubmitting={isSipSubmitting}
        />
      )}

      {showConfirmModal && data && (
        <ConfirmModal
          data={data}
          investment={investment}
          units={units}
          latestNav={latestNav}
          isSubmitting={isSubmitting}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmInvestment}
        />
      )}

      {showSuccessModal && data && (
        <SuccessModal
          data={data}
          investment={investment}
          successData={successData}
          onClose={() => {
            setShowSuccessModal(false);
            setInvestment(0);
            setSuccessData(null);
          }}
        />
      )}


    </div>
  );
};

export default MutualFundDetailsPage;


