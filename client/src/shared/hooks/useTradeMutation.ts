import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StockApiService } from "@shared/services/stock/stock-api";
import type { BuyOrderRequest, SellOrderRequest, OrderResponse } from "@shared/services/stock/stock-api";
import { toast } from "sonner";

export const useTradeMutation = () => {
  const queryClient = useQueryClient();

  const buyMutation = useMutation<OrderResponse, Error, BuyOrderRequest>({
    mutationFn: (data) => StockApiService.buyOrder(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || "Buy order executed successfully");
        // Invalidate relevant queries (e.g., wallet balance, portfolio)
        queryClient.invalidateQueries({ queryKey: ["userWallet"] });
        queryClient.invalidateQueries({ queryKey: ["userStocks"] });
      } else {
        toast.error(response.message || "Failed to execute buy order");
      }
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || "An error occurred during the trade";
      toast.error(errorMessage);
    },
  });

  const sellMutation = useMutation<OrderResponse, Error, SellOrderRequest>({
    mutationFn: (data) => StockApiService.sellOrder(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || "Sell order executed successfully");
        // Invalidate relevant queries (e.g., wallet balance, portfolio)
        queryClient.invalidateQueries({ queryKey: ["userWallet"] });
        queryClient.invalidateQueries({ queryKey: ["userStocks"] });
      } else {
        toast.error(response.message || "Failed to execute sell order");
      }
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || "An error occurred during the trade";
      toast.error(errorMessage);
    },
  });

  return {
    buy: buyMutation.mutateAsync,
    sell: sellMutation.mutateAsync,
    isBuying: buyMutation.isPending,
    isSelling: sellMutation.isPending,
    isTrading: buyMutation.isPending || sellMutation.isPending,
  };
};
