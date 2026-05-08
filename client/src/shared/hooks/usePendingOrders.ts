import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { StockApiService } from "@shared/services/stock/stock-api";
import { toast } from "sonner";

export const usePendingOrders = (symbol?: string) => {
  return useQuery({
    queryKey: ["pendingOrders", symbol],
    queryFn: async () => {
      const res = await StockApiService.getPendingOrders(symbol);
      return res.data ?? [];
    },
    refetchInterval: 30000,
  });
};

export const useCancelLimitOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ symbol, orderId }: { symbol: string; orderId: string }) =>
      StockApiService.cancelLimitOrder(symbol, orderId),
    onSuccess: (_, variables) => {
      toast.success("Limit order cancelled");
      queryClient.invalidateQueries({ queryKey: ["pendingOrders"] });
      queryClient.invalidateQueries({ queryKey: ["userWallet"] });
      queryClient.invalidateQueries({ queryKey: ["portfolio", variables.symbol] });
    },
    onError: (error: unknown) => {
      const msg = (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to cancel order";
      toast.error(msg);
    },
  });
};
