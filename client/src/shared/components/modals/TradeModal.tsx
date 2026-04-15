import React, { useState, useEffect } from 'react';
import { X, Loader2, Info } from 'lucide-react';

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

const TradeModal: React.FC<TradeModalProps> = ({
  isOpen,
  onClose,
  symbol,
  currentPrice,
  initialType = 'buy',
  onConfirm,
  isLoading = false,
  availableQuantity,
}) => {
  const [type, setType] = useState<'buy' | 'sell'>(initialType);
  const [quantity, setQuantity] = useState<string>('');
  const [orderType, setOrderType] = useState<'MARKET_ORDER' | 'LIMIT_ORDER'>('MARKET_ORDER');
  const [limitPrice, setLimitPrice] = useState<string>('');
  const [stopLoss, setStopLoss] = useState<string>('');
  const [takeProfit, setTakeProfit] = useState<string>('');
  
  const balance = 100000;

  useEffect(() => {
    if (isOpen) {
      setType(initialType);
      setQuantity('');
      setOrderType('MARKET_ORDER');
      setLimitPrice(currentPrice.toString());
      setStopLoss('');
      setTakeProfit('');
    }
  }, [isOpen, symbol, initialType]);

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
      stopLoss: stopLoss ? parseFloat(stopLoss) : undefined,
      takeProfit: takeProfit ? parseFloat(takeProfit) : undefined,
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

      <div className="relative bg-[#0f0f0f] text-gray-100 rounded-[10px] shadow-2xl w-full max-w-md overflow-hidden font-inter border border-[#1f1f1f]">
        
        <div className={`${themeBg} px-5 py-3 flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-sm tracking-wide">
              {type.toUpperCase()} {symbol} <span className="font-normal opacity-80">x {quantity || '0'} Qty</span>
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          
          <div className="px-5 py-3 border-b border-[#1f1f1f] bg-[#161616] flex justify-between items-center text-[11px] font-medium text-gray-400">
            <div className="flex gap-4">
              <span>EXCHANGE: <span className="text-gray-100 uppercase">NSE</span></span>
              <span>LTP: <span className="text-gray-100">₹{currentPrice.toLocaleString('en-IN')}</span></span>
            </div>
            <div className={`flex items-center gap-1 ${textColor}`}>
              <Info size={10} />
              Balance: ₹{balance.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="p-5 space-y-6">
            
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <label className="block text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-2">Order Type</label>
                <div className="flex gap-2">
                  {[
                    { label: 'MARKET', value: 'MARKET_ORDER' },
                    { label: 'LIMIT', value: 'LIMIT_ORDER' }
                  ].map((mode) => (
                    <button
                      key={mode.value}
                      type="button"
                      onClick={() => setOrderType(mode.value as any)}
                      className={`flex-1 py-1.5 px-3 text-xs font-bold border transition-all rounded-[4px] ${
                        orderType === mode.value 
                          ? `${borderColor} ${textColor} bg-white/5` 
                          : 'border-[#2a2a2a] text-gray-500 hover:border-[#444]'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-[11px] text-gray-500 font-bold uppercase tracking-wider">Qty</label>
                  {type === 'sell' && availableQuantity !== undefined && (
                    <span 
                      className="text-[10px] text-gray-400 font-bold cursor-pointer hover:text-white transition-colors border-b border-gray-400 border-dashed"
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
                  className={`w-full bg-[#1a1a1a] border rounded-[4px] px-3 py-2 text-sm text-white focus:outline-none font-medium placeholder:text-gray-600 ${isInsufficientShares ? 'border-red-500 focus:border-red-500' : 'border-[#2a2a2a] focus:border-blue-500'}`}
                  required
                />
                {isInsufficientShares && (
                  <p className="text-[9px] text-red-500 mt-1 font-medium">Qty exceeds available holding.</p>
                )}
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-2">Price</label>
                <input
                  type="number"
                  placeholder="0.00"
                  disabled={orderType === 'MARKET_ORDER'}
                  value={orderType === 'MARKET_ORDER' ? currentPrice : limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  className={`w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-[4px] px-3 py-2 text-sm font-medium focus:outline-none focus:border-blue-500 text-white disabled:bg-[#0a0a0a] disabled:text-gray-600 disabled:border-[#1a1a1a]`}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-[#1f1f1f]">
                 <label className="block text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-3">Risk Management (Optional)</label>
                 <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1">Stop Loss</label>
                    <input
                      type="number"
                      placeholder="SL Price"
                      value={stopLoss}
                      onChange={(e) => setStopLoss(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-[4px] px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 placeholder:text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1">Take Profit</label>
                    <input
                      type="number"
                      placeholder="TP Price"
                      value={takeProfit}
                      onChange={(e) => setTakeProfit(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-[4px] px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 placeholder:text-gray-600"
                    />
                  </div>
                </div>
            </div>
          </div>

          <div className="px-5 py-4 bg-[#161616] flex items-center justify-between border-t border-[#1f1f1f]">
            <div className="space-y-0.5">
              {type === 'buy' ? (
                <>
                  <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tight">Margin required:</p>
                  <p className={`text-sm font-bold ${isInsufficientFunds ? 'text-red-500' : 'text-gray-100'}`}>
                    ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tight">Available Qty:</p>
                  <p className={`text-sm font-bold ${isInsufficientShares ? 'text-red-500' : 'text-gray-100'}`}>
                    {availableQuantity ?? 0}
                  </p>
                </>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-xs font-bold text-gray-500 hover:text-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid || isLoading}
                className={`px-8 py-2 min-w-[120px] rounded-[4px] text-xs font-bold text-white shadow-sm transition-all flex items-center justify-center gap-2 ${themeBg} hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed`}
              >
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : type.toUpperCase()}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TradeModal;
