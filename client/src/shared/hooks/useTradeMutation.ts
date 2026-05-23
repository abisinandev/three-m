import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StockApiService } from "@shared/services/stock/stock-api";
import type { BuyOrderRequest, SellOrderRequest, LimitBuyOrderRequest, LimitSellOrderRequest, OrderResponse } from "@shared/types/stock/stock.types";
import { toast } from "sonner";
import { usePremiumModalStore } from "@stores/user/PremiumModalStore";

export const useTradeMutation = () => {
  const queryClient = useQueryClient();
  const { onOpen: openPremiumModal } = usePremiumModalStore();

  const invalidateTradeQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["userWallet"] });
    queryClient.invalidateQueries({ queryKey: ["portfolio"] });
  };

  const handleTradeError = (error: unknown, defaultMessage: string) => {
    const apiError = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
    if (apiError.response?.status === 402) {
      openPremiumModal();
      return;
    }
    const errorMessage = apiError.response?.data?.message || apiError.message || defaultMessage;
    toast.error(errorMessage);
  };

  const buyMutation = useMutation<OrderResponse, Error, BuyOrderRequest>({
    mutationFn: (data) => StockApiService.buyOrder(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || "Buy order executed successfully");
        invalidateTradeQueries();
      } else {
        toast.error(response.message || "Failed to execute buy order");
      }
    },
    onError: (error: unknown) => handleTradeError(error, "An error occurred during the trade"),
  });

  const sellMutation = useMutation<OrderResponse, Error, SellOrderRequest>({
    mutationFn: (data) => StockApiService.sellOrder(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || "Sell order executed successfully");
        invalidateTradeQueries();
      } else {
        toast.error(response.message || "Failed to execute sell order");
      }
    },
    onError: (error: unknown) => handleTradeError(error, "An error occurred during the trade"),
  });

  const limitBuyMutation = useMutation<OrderResponse, Error, LimitBuyOrderRequest>({
    mutationFn: (data) => StockApiService.limitBuyOrder(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || "Limit order placed successfully");
        invalidateTradeQueries();
      } else {
        toast.error(response.message || "Failed to place limit order");
      }
    },
    onError: (error: unknown) => handleTradeError(error, "An error occurred placing limit order"),
  });

  const limitSellMutation = useMutation<OrderResponse, Error, LimitSellOrderRequest>({
    mutationFn: (data) => StockApiService.limitSellOrder(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || "Limit sell order placed successfully");
        invalidateTradeQueries();
      } else {
        toast.error(response.message || "Failed to place limit sell order");
      }
    },
    onError: (error: unknown) => handleTradeError(error, "An error occurred placing limit sell order"),
  });

  return {
    buy: buyMutation.mutateAsync,
    sell: sellMutation.mutateAsync,
    limitBuy: limitBuyMutation.mutateAsync,
    limitSell: limitSellMutation.mutateAsync,
    isBuying: buyMutation.isPending,
    isSelling: sellMutation.isPending,
    isLimitBuying: limitBuyMutation.isPending,
    isLimitSelling: limitSellMutation.isPending,
    isTrading: buyMutation.isPending || sellMutation.isPending || limitBuyMutation.isPending || limitSellMutation.isPending,
  };
};
