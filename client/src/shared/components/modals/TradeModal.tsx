import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: string;
  name: string;
  currentPrice: number;
  initialType?: 'buy' | 'sell';
  onConfirm: (data: TradeData) => void;
  isLoading?: boolean;
  availableQuantity?: number;
  balance?: number;
}

export interface TradeData {
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  total: number;
  orderType: 'MARKET_ORDER' | 'LIMIT_ORDER';
  stopLoss?: number;
  takeProfit?: number;
}

const orderModes: { value: 'MARKET_ORDER' | 'LIMIT_ORDER'; label: string }[] = [
  { value: 'MARKET_ORDER', label: 'Market' },
  { value: 'LIMIT_ORDER', label: 'Limit' },
];

const TradeModal: React.FC<TradeModalProps> = ({
  isOpen,
  onClose,
  symbol,
  currentPrice,
  initialType = 'buy',
  onConfirm,
  isLoading = false,
  availableQuantity,
  balance = 0,
}) => {
  const [type, setType] = useState<'buy' | 'sell'>(initialType);
  const [quantity, setQuantity] = useState<string>('');
  const [orderType, setOrderType] = useState<'MARKET_ORDER' | 'LIMIT_ORDER'>('MARKET_ORDER');
  const [limitPrice, setLimitPrice] = useState<string>('');
  const [stopLoss, setStopLoss] = useState<string>('');
  const [takeProfit, setTakeProfit] = useState<string>('');
  useEffect(() => {
    if (isOpen) {
      setType(initialType);
      setQuantity('');
      setOrderType('MARKET_ORDER');
      setLimitPrice(currentPrice.toString());
      setStopLoss('');
      setTakeProfit('');
    }
  }, [isOpen, symbol, currentPrice, initialType]);

  if (!isOpen) return null;

  const qty = parseFloat(quantity) || 0;
  const executionPrice = orderType === 'MARKET_ORDER' ? currentPrice : (parseFloat(limitPrice) || 0);
  const total = qty * executionPrice;
  const isInsufficientFunds = type === 'buy' && total > balance;
  const isInsufficientShares = type === 'sell' && availableQuantity !== undefined && qty > availableQuantity;
  const isValid = qty > 0 && (orderType === 'MARKET_ORDER' || parseFloat(limitPrice) > 0) && !isInsufficientFunds && !isInsufficientShares;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    onConfirm({
      symbol,
      type,
      quantity: qty,
      price: executionPrice,
      total,
      orderType,
      stopLoss: type === 'buy' && stopLoss ? parseFloat(stopLoss) : undefined,
      takeProfit: type === 'buy' && takeProfit ? parseFloat(takeProfit) : undefined,
    });
  };

  const isBuy = type === 'buy';
  const themeBg = isBuy ? 'bg-[#00C853]' : 'bg-[#FF1744]';
  const textColor = isBuy ? 'text-[#00C853]' : 'text-[#FF1744]';
  const borderColor = isBuy ? 'border-[#00C853]' : 'border-[#FF1744]';

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/80"
        onClick={onClose}
      />

      <div className="relative bg-[#0b0c0e] text-[#e8eaed] rounded-2xl shadow-2xl w-full max-w-[360px] overflow-hidden border border-[#1e2025]">

        <div className={`px-5 py-4 flex items-center justify-between ${themeBg}`}>
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-black text-black uppercase tracking-widest">
              {type} {symbol}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-black/60 hover:text-black transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="px-5 py-3 bg-[#111214] border-b border-[#1e2025] flex justify-between items-center">
            <div className="flex gap-4">
              <div className="flex flex-col">
                <span className="text-[9px] text-[#5a5f6e] font-bold uppercase tracking-wider">Exchange</span>
                <span className="text-[11px] font-bold text-white uppercase">NSE</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-[#5a5f6e] font-bold uppercase tracking-wider">LTP</span>
                <span className="text-[11px] font-bold text-white">₹{currentPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-[#5a5f6e] font-bold uppercase tracking-wider">Balance</span>
              <span className="text-[11px] font-bold text-[#00C853]">₹{balance.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="p-5 space-y-5">

            <div>
              <label className="block text-[10px] text-[#5a5f6e] font-bold uppercase tracking-wider mb-2.5">Order Type</label>
              <div className="grid grid-cols-2 gap-2">
                {orderModes.map((mode) => (
                  <button
                    key={mode.value}
                    type="button"
                    onClick={() => setOrderType(mode.value)}
                    className={`py-2 px-3 text-[10px] font-black border transition-all rounded-xl ${orderType === mode.value
                        ? `${borderColor} ${textColor} bg-[#111214]`
                        : 'border-[#1e2025] text-[#5a5f6e] hover:border-[#333]'
                      }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-[10px] text-[#5a5f6e] font-bold uppercase tracking-wider">Quantity</label>
                  {type === 'sell' && availableQuantity !== undefined && (
                    <span
                      className="text-[9px] text-[#00C853] font-bold cursor-pointer hover:underline"
                      onClick={() => setQuantity(availableQuantity.toString())}
                    >
                      Max: {availableQuantity}
                    </span>
                  )}
                </div>
                <input
                  type="number"
                  placeholder="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className={`w-full bg-[#111214] border rounded-xl px-3 py-2.5 text-[12px] text-white focus:outline-none font-bold placeholder:text-[#333] transition-all ${isInsufficientShares ? 'border-red-500/50 focus:border-red-500' : 'border-[#1e2025] focus:border-[#00C853]'}`}
                  required
                />
                {isInsufficientShares && (
                  <p className="text-[9px] text-red-500 mt-1 font-medium">Qty exceeds available holding.</p>
                )}
              </div>
              <div>
                <label className="block text-[10px] text-[#5a5f6e] font-bold uppercase tracking-wider mb-2">Price</label>
                <input
                  type="number"
                  placeholder="0.00"
                  disabled={orderType === 'MARKET_ORDER'}
                  value={orderType === 'MARKET_ORDER' ? currentPrice : limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  className={`w-full bg-[#111214] border border-[#1e2025] rounded-xl px-3 py-2.5 text-[12px] font-bold focus:outline-none focus:border-[#00C853] text-white disabled:opacity-40 disabled:cursor-not-allowed`}
                />
              </div>
            </div>

            {type === 'buy' && (
              <div className="pt-4 border-t border-[#1e2025]">
                <label className="block text-[10px] text-[#5a5f6e] font-bold uppercase tracking-wider mb-3">Risk Management</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] text-[#5a5f6e] font-bold mb-1.5 uppercase">Stop Loss</label>
                    <input
                      type="number"
                      placeholder="SL Price"
                      value={stopLoss}
                      onChange={(e) => setStopLoss(e.target.value)}
                      className="w-full bg-[#111214] border border-[#1e2025] rounded-xl px-3 py-2 text-[11px] text-white focus:outline-none focus:border-red-500/50 placeholder:text-[#333]"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-[#5a5f6e] font-bold mb-1.5 uppercase">Take Profit</label>
                    <input
                      type="number"
                      placeholder="TP Price"
                      value={takeProfit}
                      onChange={(e) => setTakeProfit(e.target.value)}
                      className="w-full bg-[#111214] border border-[#1e2025] rounded-xl px-3 py-2 text-[11px] text-white focus:outline-none focus:border-green-500/50 placeholder:text-[#333]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="px-5 py-4 bg-[#111214] flex items-center justify-between border-t border-[#1e2025]">
            <div className="flex flex-col">
              <span className="text-[10px] text-[#5a5f6e] font-bold uppercase tracking-wider">
                {type === 'buy' ? 'Required' : 'Receivable'}
              </span>
              <span className={`text-[15px] font-black ${isInsufficientFunds ? 'text-red-500' : 'text-white'}`}>
                ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <button
              type="submit"
              disabled={!isValid || isLoading}
              className={`px-8 py-3 rounded-xl text-[11px] font-black text-black uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2 ${themeBg} hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed`}
            >
              {isLoading ? <Loader2 size={14} className="animate-spin" /> : type}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TradeModal;
