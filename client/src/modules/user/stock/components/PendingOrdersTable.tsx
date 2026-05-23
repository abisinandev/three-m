import React from "react";
import { usePendingOrders, useCancelLimitOrder } from "@shared/hooks/usePendingOrders";
import { Loader2, XCircle, Clock } from "lucide-react";

interface PendingOrdersTableProps {
  symbol?: string;
}

const PendingOrdersTable: React.FC<PendingOrdersTableProps> = ({ symbol }) => {
  const { data: pendingOrders, isLoading } = usePendingOrders(symbol);
  const cancelMutation = useCancelLimitOrder();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-[#2962ff]" />
      </div>
    );
  }

  if (!pendingOrders || pendingOrders.length === 0) {
    return (
      <div className="bg-[#111214] border border-[#1e2025] rounded-lg p-12 text-center">
        <Clock className="w-8 h-8 text-[#5a5f6e] mx-auto mb-3 opacity-20" />
        <p className="text-sm text-[#5a5f6e]">No pending limit orders found</p>
        <p className="text-[10px] text-[#3c4043] mt-1">Orders will appear here until price conditions are met</p>
      </div>
    );
  }

  const handleCancel = (orderId: string, orderSymbol: string) => {
    cancelMutation.mutate({ symbol: orderSymbol, orderId });
  };

  return (
    <div className="bg-[#111214] border border-[#1e2025] rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-[#1e2025] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#2962ff]" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#e8eaed]">
            Pending Limit Orders
          </h3>
        </div>
        <span className="text-[10px] text-[#5f6368] bg-[#1e2025] px-2 py-0.5 rounded uppercase font-bold">
          {pendingOrders.length} {pendingOrders.length === 1 ? 'Order' : 'Orders'}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0b0c0e]/50 border-b border-[#1e2025]">
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#5f6368]">Symbol</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#5f6368]">Side</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#5f6368] text-right">Qty</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#5f6368] text-right">Price</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#5f6368] text-right">Total (Est.)</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#5f6368]">Trigger Condition</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#5f6368] text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e2025]">
            {pendingOrders.map((order) => (
              <tr key={order.id} className="hover:bg-[#1e2025]/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="text-xs font-bold text-[#e8eaed]">{order.symbol}</div>
                  <div className="text-[9px] text-[#5f6368] mt-0.5">Limit Order</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-black ${
                    order.side === "BUY" ? "bg-[#1b5e20]/20 text-[#4caf50]" : "bg-[#b71c1c]/20 text-[#f44336]"
                  }`}>
                    {order.side}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-right font-medium text-[#e8eaed]">{order.quantity || 0}</td>
                <td className="px-4 py-3 text-xs text-right font-medium text-[#e8eaed]">₹{(order.limitPrice || order.price || 0).toLocaleString()}</td>
                <td className="px-4 py-3 text-xs text-right font-bold text-[#9aa0a6]">₹{((order.limitPrice || order.price || 0) * (order.quantity || 0)).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${order.side === 'BUY' ? 'bg-[#4caf50]' : 'bg-[#f44336]'}`} />
                    <span className="text-[10px] text-[#9aa0a6] font-medium">
                      Execute when price goes {order.side === "BUY" ? "below" : "above"} ₹{order.limitPrice || order.price || 0}
                    </span>
                  </div>
                </td>


                <td className="px-4 py-3">
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleCancel(order.id, order.symbol)}
                      disabled={cancelMutation.isPending}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#b71c1c]/10 text-[#f44336] hover:bg-[#b71c1c]/20 transition-all text-[10px] font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed group border border-[#b71c1c]/20"
                    >
                      {cancelMutation.isPending && cancelMutation.variables?.orderId === order.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <XCircle className="w-3 h-3 group-hover:scale-110 transition-transform" />
                      )}
                      Cancel Order
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

};

export default PendingOrdersTable;
