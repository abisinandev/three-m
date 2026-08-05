import { useState, useEffect } from "react";
import { Bot, ChevronRight, Zap } from "lucide-react";
import { toast } from "sonner";
import ConfirmModal from "@shared/components/modals/ConfirmModal";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useUserStore } from "@stores/user/UserStore";
import {
  getAlgoStrategies,
  saveAlgoStrategy,
  getActiveStrategyBySymbol,
  toggleAlgoStrategyStatus,
} from "@/shared/services/algo-trading/algo-trading-api";

import type { AlgoConsoleProps } from "@/shared/types/stock/stock.types";
import { usePremiumPlan } from "@/shared/services/admin/subscription/subscription-api";

export const AlgoConsole = ({ symbol, onPremiumModalOpen }: AlgoConsoleProps) => {
  const [algoStep, setAlgoStep] = useState<"idle" | "selecting" | "active">(
    "idle"
  );
  const [selectedStrategy, setSelectedStrategy] = useState("");
  const [showStopConfirm, setShowStopConfirm] = useState(false);

  const { data: strategies = [], isLoading: isLoadingStrategies } = useQuery({
    queryKey: ["algoStrategies"],
    queryFn: getAlgoStrategies,
  });

  const { data: activeStrategy, refetch: refetchActiveStrategy } = useQuery({
    queryKey: ["activeAlgoStrategy", symbol],
    queryFn: () => getActiveStrategyBySymbol(symbol),
    enabled: !!symbol,
  });

  useEffect(() => {
    if (activeStrategy) {
      setAlgoStep("active");
      setSelectedStrategy(activeStrategy.strategyName);
    }
  }, [activeStrategy]);

  useEffect(() => {
    if (strategies.length > 0 && !selectedStrategy) {
      setSelectedStrategy(strategies[0].name);
    }
  }, [strategies, selectedStrategy]);

  const saveAlgoMutation = useMutation({
    mutationFn: saveAlgoStrategy,
    onSuccess: () => {
      setAlgoStep("active");
      toast.success("Algo trading started successfully.");
    },
    onError: (error: { response?: { status: number } }) => {
      if (error.response?.status === 402) {
        onPremiumModalOpen();
        return;
      }
      console.error("Failed to save algo strategy:", error);
      toast.error("Failed to start algo trading. Please try again.");
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({
      strategyId,
      isActive,
    }: {
      strategyId: string;
      isActive: boolean;
    }) => toggleAlgoStrategyStatus(strategyId, isActive),
    onSuccess: () => {
      refetchActiveStrategy();
      setAlgoStep("idle");
      toast.info("Algo strategy stopped.");
    },
    onError: (error: { response?: { status: number } }) => {
      if (error.response?.status === 402) {
        onPremiumModalOpen();
        return;
      }
      console.error("Failed to toggle strategy status:", error);
      toast.error("An error occurred while stopping the strategy.");
    },
  });

  const handleAlgoStart = async () => {
    if (!selectedStrategy || !symbol) return;

    const strategy = strategies.find((s) => s.name === selectedStrategy);
    const config: Record<string, string | number | boolean> = {};
    strategy?.configSchema.forEach((field) => {
      config[field.key] = field.default;
    });

    saveAlgoMutation.mutate({
      symbol,
      strategyName: selectedStrategy,
      config,
    });
  };

  const handleAlgoStop = () => {
    if (activeStrategy?._id) {
      toggleStatusMutation.mutate(
        { strategyId: activeStrategy._id, isActive: false },
        {
          onSuccess: () => setShowStopConfirm(false),
          onError: () => setShowStopConfirm(false),
        }
      );
    } else {
      setAlgoStep("idle");
      setShowStopConfirm(false);
    }
  };

  const user = useUserStore((state) => state.user);

  const { data: plan } = usePremiumPlan();

  const handleSetupClick = () => {
    if (!user?.isVerified) {
      toast.error("Complete your KYC to enable algorithmic trading.");
      return;
    }
    if (!user?.isSubscribed) {
      const algoTradingInPremium = plan?.isActive !== false && plan?.features?.includes("ALGO_TRADING");
      if (algoTradingInPremium) {
        toast.warning("Upgrade to Premium to unlock algorithmic trading.");
        onPremiumModalOpen();
        return;
      }
    }
    setAlgoStep("selecting");
  };

  return (
    <div className="bg-[#111214] border border-[#1e2025] rounded-lg p-5 flex flex-col relative overflow-hidden">
      <div
        className={`absolute top-0 right-0 w-24 h-24 blur-[60px] opacity-20 ${algoStep === "active" ? "bg-[#00C853]" : "bg-[#2962ff]"
          }`}
      ></div>

      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-[#5a5f6e]" />
          <span className="text-[11px] font-bold text-[#5a5f6e] uppercase tracking-[0.08em]">
            Algo Console
          </span>
        </div>
        {algoStep === "active" && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#00C853]/10 border border-[#00C853]/20">
            <span className="w-1 h-1 rounded-full bg-[#00C853] animate-pulse"></span>
            <span className="text-[9px] font-bold text-[#00C853] uppercase tracking-tighter">
              Live
            </span>
          </div>
        )}
      </div>

      <div className="relative z-10 space-y-5">
        {algoStep === "idle" && (
          <div className="space-y-4">
            <p className="text-[11px] text-[#5a5f6e] leading-relaxed">
              Deploy automated strategies for {symbol}. Our cloud engine scans live
              data and executes jobs via a reliable queue system.
            </p>
            <button
              onClick={handleSetupClick}
              className={`w-full py-2 bg-[#1e2025] hover:bg-[#272b33] text-[#e8eaed] text-[11px] font-bold rounded transition-all uppercase tracking-widest border border-[#272b33] flex items-center justify-center gap-2 group ${!user?.isVerified ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
            >
              Setup Algo
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        )}

        {algoStep === "selecting" && (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="relative">
                <select
                  value={selectedStrategy}
                  onChange={(e) => setSelectedStrategy(e.target.value)}
                  className="w-full bg-[#0b0c0e] border border-[#1e2025] rounded px-3 py-2 text-[11px] text-[#e8eaed] focus:outline-none focus:border-[#00C853]/50 appearance-none cursor-pointer font-bold uppercase tracking-tight"
                >
                  {isLoadingStrategies ? (
                    <option>Loading...</option>
                  ) : (
                    strategies.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.displayName}
                      </option>
                    ))
                  )}
                </select>
                <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#5a5f6e] rotate-90 pointer-events-none" />
              </div>
              <div className="p-3 bg-[#0b0c0e] border border-[#1e2025] rounded">
                <p className="text-[10px] text-[#5a5f6e] leading-relaxed italic">
                  {strategies.find((s) => s.name === selectedStrategy)
                    ?.displayName || "Select a strategy"}{" "}
                  - Ready to monitor ticks.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setAlgoStep("idle")}
                className="flex-1 py-2 text-[11px] font-bold text-[#5a5f6e] hover:text-[#e8eaed] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAlgoStart}
                disabled={saveAlgoMutation.isPending}
                className="flex-[2] py-2 bg-[#00C853] text-white text-[11px] font-bold rounded hover:bg-[#00e676] active:scale-[0.98] transition-all uppercase tracking-wider"
              >
                {saveAlgoMutation.isPending ? "Starting..." : "Confirm"}
              </button>
            </div>
          </div>
        )}

        {algoStep === "active" && (
          <div className="space-y-4">
            <div className="p-4 bg-[#0b0c0e] border border-[#00C853]/20 rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-[#00C853]" />
                <span className="text-[11px] font-bold text-[#e8eaed] uppercase tracking-wide">
                  {
                    strategies.find((s) => s.name === selectedStrategy)
                      ?.displayName
                  }
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[9px] text-[#5a5f6e] uppercase tracking-widest font-bold">
                    Status
                  </span>
                  <p className="text-[10px] font-bold text-[#00C853]">RUNNING</p>
                </div>
                {/* <div className="space-y-1 text-right">
                  <span className="text-[9px] text-[#5a5f6e] uppercase tracking-widest font-bold">
                    Runtime
                  </span>
                  <p className="text-[10px] font-bold text-[#e8eaed]">
                    Cloud Engine
                  </p>
                </div> */}
              </div>
            </div>
            <button
              onClick={() => setShowStopConfirm(true)}
              disabled={toggleStatusMutation.isPending}
              className="w-full py-2 bg-[#FF1744]/10 text-[#FF1744] border border-[#FF1744]/20 hover:bg-[#FF1744]/20 text-[11px] font-bold rounded transition-colors uppercase tracking-widest"
            >
              {toggleStatusMutation.isPending
                ? "Stopping..."
                : "Terminate Strategy"}
            </button>

            <ConfirmModal
              isOpen={showStopConfirm}
              onClose={() => setShowStopConfirm(false)}
              onConfirm={handleAlgoStop}
              title="Terminate Strategy"
              message={`Stop the active "${strategies.find((s) => s.name === selectedStrategy)?.displayName ?? selectedStrategy}" strategy on ${symbol}? Running positions will no longer be managed automatically.`}
              confirmText="Terminate"
              cancelText="Keep Running"
              variant="destructive"
              loading={toggleStatusMutation.isPending}
            />
          </div>
        )}
      </div>
    </div>
  );
};

