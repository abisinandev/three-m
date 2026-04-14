'use client';

import { useMemo, useState } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import ApexChart from 'react-apexcharts';
import type { FundDetails } from '../types/MutaulFundType';
import { buildChartData, calculateUnitPrice } from '../helper/FundDetialsHelper';
import { getMutualFundDetails } from '@shared/services/feature/mutual-fund/MutualFundApisUserSide';
import { StartSipModal, type SipData } from '../components/mutual-fund/StartSipModal';
import { useStartSip } from '../hooks/useStartSip';
import { InvestModal } from '../components/mutual-fund/InvestModal';
import { ConfirmModal } from '../components/mutual-fund/ConfirmModal';
import { SuccessModal } from '../components/mutual-fund/SuccessModal';
import { useInvestMutualFund } from '../hooks/useInvestMutualFund';
import PremiumPaymentModal from '@/shared/components/modals/premium-payment/PremiumPaymentModal';
import { toast } from 'sonner';
import { useUserStore } from '@stores/user/UserStore';

const PAYMENT_METHOD = 'WALLET' as const;
const INVESTMENT_TYPE = 'ONE_TIME' as const;

const MutualFundDetailsPage = () => {
  const { schemeCode } = useParams({ from: '/user/mutual-funds/$schemeCode' });
  const [activePeriod, setActivePeriod] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [investment, setInvestment] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const { data, isLoading, error } = useQuery<FundDetails>({
    queryKey: ['fund-details', schemeCode, activePeriod],
    queryFn: async () => await getMutualFundDetails(schemeCode, activePeriod),
    staleTime: 60000,
  });

  const latestNav = data?.navHistory?.[0]?.nav ?? 0;

  const units = useMemo(
    () => (investment > 0 && latestNav > 0 ? calculateUnitPrice(investment, latestNav) : 0),
    [investment, latestNav]
  );

  const { mutate: invest, isPending: isSubmitting } = useInvestMutualFund(
    () => {
      setShowConfirmModal(false);
      setShowInvestModal(false);
      setShowSuccessModal(true);
      setInvestment(0);
      setErrorMsg('');
    },
    (msg) => {
      alert(msg);
    }
  );

  const { mutate: startSipMutate, isPending: isSipSubmitting } = useStartSip(
    (result) => {
      const data = result?.data;
      if (data?.upgrade) {
        toast.warning(data.message || "Upgrade to Premium to use this feature");
        setIsPremiumModalOpen(true);
        setShowSipModal(false);
      } else {
        setShowSipModal(false);
        setShowSuccessModal(true);
        setErrorMsg('');
      }
    },
    (msg) => {
      alert(msg);
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
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-red-400 flex items-center justify-center text-sm">
        Failed to load fund details
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-24 md:pb-8 relative">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 text-sm">
        <div className="bg-gradient-to-br from-[#121212] to-[#0a0a0a] border border-[#1e1e1e] rounded-xl p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <img
                src={data.logo}
                alt={data.schemeName}
                className="w-14 h-14 rounded-xl object-cover border border-[#2a2a2a] shadow"
              />
              <div className="space-y-1">
                <h1 className="text-xl font-semibold leading-tight">{data.schemeName}</h1>
                <div className="text-xs text-gray-400 space-y-0.5">
                  <div>AMC: {data.amc}</div>
                  <div>
                    {data.category} • {data.subCategory}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2.5 py-0.5 text-[10px] font-medium rounded-full bg-yellow-950/60 text-yellow-300 border border-yellow-900/50">
                    {data.risk}
                  </span>
                  <span className="px-2.5 py-0.5 text-[10px] font-medium rounded-full bg-green-950/60 text-green-300 border border-green-900/50">
                    {data.status}
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="p-2 rounded-full hover:bg-[#1a1a1a] transition-colors"
              aria-label="Add to favorites"
            >
              <Star className="h-6 w-6 text-green-500 hover:text-green-400" />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8 space-y-5">
            <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#222] text-sm">
                <h2 className="font-medium">NAV Trend</h2>
                <div className="flex gap-1.5">
                  {periods.map((p) => (
                    <button
                      key={p}
                      onClick={() => setActivePeriod(p)}
                      className={`px-3 py-1 text-xs rounded-md transition-colors ${p === activePeriod
                        ? 'bg-green-600 text-white'
                        : 'text-gray-400 hover:bg-[#1a1a1a]'
                        }`}
                    >
                      {p === 'DAILY' ? '1D' : p === 'WEEKLY' ? '1W' : p === 'MONTHLY' ? '1M' : '1Y'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-2">
                <ApexChart
                  type="area"
                  height={240}
                  options={{
                    chart: {
                      toolbar: { show: false },
                      zoom: { enabled: false },
                      fontFamily: 'system-ui, sans-serif',
                    },
                    colors: ['#16a34a'],
                    stroke: { curve: 'smooth', width: 2 },
                    fill: {
                      type: 'gradient',
                      gradient: {
                        shadeIntensity: 0.4,
                        opacityFrom: 0.45,
                        opacityTo: 0.08,
                        stops: [0, 90, 100],
                      },
                    },
                    grid: {
                      borderColor: '#1f2937',
                      strokeDashArray: 3,
                      padding: {
                        top: 0,
                        right: 10,
                        bottom: 0,
                        left: 10,
                      },
                    },
                    xaxis: {
                      categories: chartData.map(d => d.date),
                      labels: {
                        style: { colors: '#6b7280', fontSize: '10px' },
                        rotate: -45,
                        rotateAlways: false,
                        trim: true,
                      },
                      tickAmount: 6,
                      axisBorder: { show: false },
                      axisTicks: { show: false },
                    },
                    yaxis: {
                      show: true,
                      showAlways: true,
                      tickAmount: 5,
                      labels: {
                        formatter: (val: number) => `₹${Math.round(val)}`,
                        style: {
                          colors: '#9ca3af',
                          fontSize: '11px',
                          fontWeight: 500,
                        },
                        offsetX: -5,
                      },
                    },
                    tooltip: {
                      enabled: true,
                      theme: 'dark',
                      style: { fontSize: '12px' },
                      x: {
                        show: true,
                        format: 'dd MMM yyyy',
                      },
                      y: {
                        formatter: (val: number) => `₹${val.toFixed(2)}`,
                      },
                      marker: { show: true },
                    },
                    dataLabels: { enabled: false },
                    legend: { show: false },
                  }}
                  series={[{ name: 'NAV', data: chartData.map(d => d.nav) }]}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#111] border border-[#222] rounded-xl p-4 text-center">
                <p className="text-2xl font-bold">₹{latestNav.toFixed(2)}</p>
                <p className="text-xs text-gray-400 mt-1">Current NAV</p>
              </div>
              <div className="bg-[#111] border border-[#222] rounded-xl p-4 text-center">
                <p className={`text-2xl font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {isPositive ? '+' : ''}{periodReturn.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-400 mt-1">{activePeriod} RETURN</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-[#111] border border-[#222] rounded-xl p-4 text-xs">
              <h3 className="text-sm font-medium mb-3">Portfolio Allocation</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-gray-400">Equity</span><span className="text-green-400">92.4%</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Debt</span><span className="text-blue-400">4.1%</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Cash</span><span className="text-amber-400">3.5%</span></div>
              </div>
            </div>

            <div className="bg-[#111] border border-[#222] rounded-xl p-4 text-xs">
              <h3 className="text-sm font-medium mb-3">Recent NAV History</h3>
              <div className="space-y-2">
                {data.navHistory.slice(0, 5).map((item, i) => (
                  <div key={i} className="flex justify-between py-1.5 border-b border-[#222] last:border-0">
                    <span className="text-gray-400">
                      {new Date(item.navDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                    <span>₹{item.nav.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Invest Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#111] border-t border-[#222] p-3 z-40 md:static md:bg-transparent md:border-none md:p-0">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setShowInvestModal(true)}
              className="flex-1 bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-medium py-3.5 rounded-xl transition-all shadow-lg shadow-green-900/30"
            >
              One-time Investment
            </button>
            <button
              onClick={() => {
                const { user } = useUserStore.getState();
                if (!user?.isSubscribed) {
                  toast.warning("Upgrade to Premium to use SIP investment feature");
                  setIsPremiumModalOpen(true);
                } else {
                  setShowSipModal(true);
                }
              }}
              className="flex-1 bg-transparent border border-green-600 text-green-400 hover:bg-green-950/50 font-medium py-3.5 rounded-xl transition-all"
            >
              Start SIP
            </button>
          </div>
        </div>
      </div>

      {/* Invest Modal */}
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

      {/* Start SIP Modal */}
      {showSipModal && data && (
        <StartSipModal
          data={data}
          onClose={() => setShowSipModal(false)}
          onProceed={handleSipProceed}
          isSubmitting={isSipSubmitting}
        />
      )}

      {/* Confirm Modal */}
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

      {/* Success Modal */}
      {showSuccessModal && data && (
        <SuccessModal
          data={data}
          investment={investment}
          onClose={() => setShowSuccessModal(false)}
        />
      )}

      <PremiumPaymentModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
      />
    </div>
  );
};

export default MutualFundDetailsPage;