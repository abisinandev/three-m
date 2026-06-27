import { useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { finnhubService } from "@/shared/services/external/finnhub.service";
import { StockChart } from "../components/StockChart";
import { socketService } from "@/socket/socket";
import TradeModal from "@shared/components/modals/TradeModal";
import type { TradeData } from "@shared/components/modals/TradeModal";
import { useTradeMutation } from "@shared/hooks/useTradeMutation";
import { FetchUserWallet } from "@/shared/services/user/fetch-user-wallet";
import { getStockHoldings } from "@/shared/services/portfolio/portfolio-api";
import { useUserStore } from "@stores/user/UserStore";

import { StockDetailHeader } from "../components/StockDetailHeader";
import { AlgoConsole } from "../components/AlgoConsole";
import { MarketStatCard } from "../components/MarketStatCard";
import { MarketDepthCard } from "../components/MarketDepthCard";
import { CompanyInfoCard } from "../components/CompanyInfoCard";
import PendingOrdersTable from "../components/PendingOrdersTable";
import { usePremiumModalStore } from "@stores/user/PremiumModalStore";
import { toast } from "sonner";

const StockDetailPage = () => {
  const user = useUserStore((state) => state.user);
  const { symbol } = useParams({ strict: false }) as { symbol: string };
  const [realtimePrice, setRealtimePrice] = useState<number | null>(null);

  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const { onOpen: openPremiumModal } = usePremiumModalStore();

  const { data: walletData } = useQuery({
    queryKey: ["user-wallet-data"],
    queryFn: FetchUserWallet,
  });

  const balance = walletData?.data?.data?.balance ?? 0;

  const {
    data: queryData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["stockDetails", symbol],
    queryFn: () => finnhubService.getStockDetails(symbol),
    enabled: !!symbol,
  });

  const { data: holdingsData } = useQuery({
    queryKey: ["portfolio", symbol],
    queryFn: () => getStockHoldings(1, 10, symbol),
    enabled: !!symbol,
  });

  const position = holdingsData?.data?.find(
    (inv) =>
      (inv.schemeCode === symbol || (inv as { symbol?: string }).symbol === symbol) &&
      (inv.investmentType?.toLowerCase() === "stock" ||
        inv.category?.toLowerCase() === "stock" ||
        !inv.investmentType)
  );

  // Real-time socket
  useEffect(() => {
    if (!symbol) return;

    const handleUpdate = (raw: unknown) => {
      const trade = raw as { symbol: string; price: number };
      if (trade.symbol === symbol) {
        setRealtimePrice(trade.price);
      }
    };

    socketService.connect();
    socketService.subscribeToSymbol(symbol);
    socketService.on("stock_update", handleUpdate);

    return () => {
      socketService.unsubscribeFromSymbol(symbol);
      socketService.off("stock_update", handleUpdate);
    };
  }, [symbol]);


  const responseData = queryData?.data;
  const stockInfo = responseData?.data;
  const apiPrice = responseData?.latestPrice;
  const currentPrice = realtimePrice ?? apiPrice;
  
  const prevClose = responseData?.previousClose ?? 0;
  const change = (realtimePrice !== null && realtimePrice !== undefined && prevClose > 0)
    ? (realtimePrice - prevClose)
    : (responseData?.change ?? 0);
  const changePercent = (realtimePrice !== null && realtimePrice !== undefined && prevClose > 0)
    ? ((realtimePrice - prevClose) / prevClose) * 100
    : (responseData?.changePercent ?? 0);
  const isPositive = change >= 0;

  const fmt = (v: number | string | undefined | null, digits = 2) => {
    if (v === undefined || v === null || isNaN(Number(v))) return "0.00";
    return Number(v).toLocaleString("en-IN", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
  };

  const { buy, sell, limitBuy, limitSell, isTrading } = useTradeMutation();

  const handleTradeClick = (type: "buy" | "sell") => {
    if (!user?.isVerified) {
      toast.error("Complete your KYC to enable trading features");
      return;
    }
    if (!user?.isSubscribed) {
      openPremiumModal();
      return;
    }
    setTradeType(type);
    setIsTradeModalOpen(true);
  };

  const handleTradeConfirm = async (tradeData: TradeData) => {
    try {
      if (tradeData.type === "buy") {
        if (tradeData.orderType === "LIMIT_ORDER") {

          await limitBuy({
            symbol: tradeData.symbol,
            quantity: tradeData.quantity,
            orderType: "LIMIT_ORDER",
            price: tradeData.price,
            stopLoss: tradeData.stopLoss,
            takeProfit: tradeData.takeProfit,
          });
        } else {
          await buy({
            symbol: tradeData.symbol,
            quantity: tradeData.quantity,
            orderType: tradeData.orderType as "MARKET_ORDER" | "LIMIT_ORDER",
            price: tradeData.price,
            stopLoss: tradeData.stopLoss,
            takeProfit: tradeData.takeProfit,
          });
        }
      } else {
        if (tradeData.orderType === "LIMIT_ORDER") {
          await limitSell({
            symbol: tradeData.symbol,
            quantity: tradeData.quantity,
            orderType: "LIMIT_ORDER",
            price: tradeData.price,
          });
        } else {
          await sell({
            symbol: tradeData.symbol,
            quantity: tradeData.quantity,
            orderType: tradeData.orderType as "MARKET_ORDER" | "LIMIT_ORDER",
            price: tradeData.price,
          });
        }

      }
      setIsTradeModalOpen(false);
    } catch (error) {
      console.error("Trade execution failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0c0e] text-[#e8eaed] flex items-center justify-center font-sans tracking-tight">
        <p className="text-[#5a5f6e] text-xs uppercase tracking-widest animate-pulse">
          Syncing market data...
        </p>
      </div>
    );
  }

  if (isError || !stockInfo) {
    return (
      <div className="min-h-screen bg-[#0b0c0e] text-[#e8eaed] flex items-center justify-center font-sans tracking-tight">
        <p className="text-[#FF1744] text-xs uppercase tracking-widest">
          Error loading data for {symbol}.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0c0e] text-[#e8eaed] font-sans selection:bg-[#2962ff]/30">
      <StockDetailHeader
        symbol={symbol}
        stockInfo={stockInfo}
        currentPrice={currentPrice ?? 0}
        change={change}
        changePercent={changePercent}
        isPositive={isPositive}
        onTradeClick={handleTradeClick}
        isVerified={user?.isVerified ?? false}
      />

      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-9 space-y-6">
            <div className="bg-[#111214] border border-[#1e2025] rounded-lg overflow-hidden flex flex-col h-[650px]">
              <StockChart symbol={symbol} position={position} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MarketStatCard
                label="Open"
                value={`₹${fmt(responseData?.open)}`}
              />
              <MarketStatCard
                label="High"
                value={`₹${fmt(responseData?.high)}`}
              />
              <MarketStatCard
                label="Low"
                value={`₹${fmt(responseData?.low)}`}
              />
              <MarketStatCard
                label="Prev Close"
                value={`₹${fmt(responseData?.previousClose)}`}
              />
            </div>

            <PendingOrdersTable symbol={symbol} />
          </div>

          <div className="col-span-12 lg:col-span-3 space-y-6">
            <AlgoConsole
              symbol={symbol}
              onPremiumModalOpen={openPremiumModal}
            />

            <MarketDepthCard
              volume={responseData?.volume}
              previousClose={responseData?.previousClose}
              sessionHigh={responseData?.high}
              sessionLow={responseData?.low}
            />

            <CompanyInfoCard
              sector={stockInfo.sector}
              isTradable={stockInfo.isTradable}
            />
          </div>
        </div>
      </div>

      {isTradeModalOpen && (
        <TradeModal
          key={symbol}
          isOpen={isTradeModalOpen}
          onClose={() => setIsTradeModalOpen(false)}
          symbol={symbol}
          name={stockInfo.name || symbol}
          currentPrice={currentPrice ?? 0}
          initialType={tradeType}
          isLoading={isTrading}
          onConfirm={handleTradeConfirm}
          availableQuantity={position?.units || position?.quantity}
          balance={balance}
        />
      )}
    </div>
  );
};

export default StockDetailPage;


