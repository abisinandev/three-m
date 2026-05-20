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
  const [limitPrice, setLimitPrice] = useState<string>(currentPrice.toString());
  const [stopLoss, setStopLoss] = useState<string>('');
  const [takeProfit, setTakeProfit] = useState<string>('');
  const [isSLEnabled, setIsSLEnabled] = useState(false);
  const [isTPEnabled, setIsTPEnabled] = useState(false);

  const qty = parseFloat(quantity) || 0;
  const executionPrice = orderType === 'MARKET_ORDER' ? currentPrice : (parseFloat(limitPrice) || currentPrice);

  const getTickSize = (price: number) => {
    if (price < 10) return 0.05;
    if (price < 100) return 0.1;
    if (price < 500) return 0.5;
    return 1.0;
  };

  const adjustStopLoss = (direction: 'up' | 'down') => {
    const currentVal = parseFloat(stopLoss);
    const tick = getTickSize(executionPrice);
    if (isNaN(currentVal)) {
      if (direction === 'down') {
        setStopLoss((executionPrice - tick).toFixed(2));
      } else {
        setStopLoss((executionPrice + tick).toFixed(2));
      }
    } else {
      if (direction === 'down') {
        setStopLoss(Math.max(0, currentVal - tick).toFixed(2));
      } else {
        setStopLoss((currentVal + tick).toFixed(2));
      }
    }
  };

  const adjustTakeProfit = (direction: 'up' | 'down') => {
    const currentVal = parseFloat(takeProfit);
    const tick = getTickSize(executionPrice);
    if (isNaN(currentVal)) {
      if (direction === 'down') {
        setTakeProfit((executionPrice - tick).toFixed(2));
      } else {
        setTakeProfit((executionPrice + tick).toFixed(2));
      }
    } else {
      if (direction === 'down') {
        setTakeProfit(Math.max(0, currentVal - tick).toFixed(2));
      } else {
        setTakeProfit((currentVal + tick).toFixed(2));
      }
    }
  };

  const isSLInvalid = type === 'buy' && isSLEnabled && stopLoss !== '' && parseFloat(stopLoss) >= executionPrice;
  const isTPInvalid = type === 'buy' && isTPEnabled && takeProfit !== '' && parseFloat(takeProfit) <= executionPrice;

  if (!isOpen) return null;

  const total = qty * executionPrice;
  const isInsufficientFunds = type === 'buy' && total > balance;
  const isInsufficientShares = type === 'sell' && availableQuantity !== undefined && qty > availableQuantity;
  const isValid = qty > 0 && 
    (orderType === 'MARKET_ORDER' || parseFloat(limitPrice) > 0) && 
    !isInsufficientFunds && 
    !isInsufficientShares &&
    !isSLInvalid &&
    !isTPInvalid;

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
      stopLoss: type === 'buy' && isSLEnabled && stopLoss ? parseFloat(stopLoss) : undefined,
      takeProfit: type === 'buy' && isTPEnabled && takeProfit ? parseFloat(takeProfit) : undefined,
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
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <input
                        type="checkbox"
                        id="sl-enable"
                        checked={isSLEnabled}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setIsSLEnabled(checked);
                          if (checked) {
                            const tick = getTickSize(executionPrice);
                            setStopLoss((executionPrice - tick).toFixed(2));
                          } else {
                            setStopLoss('');
                          }
                        }}
                        className="rounded bg-[#111214] border-[#1e2025] text-red-500 focus:ring-0 focus:ring-offset-0 cursor-pointer w-3.5 h-3.5"
                      />
                      <label htmlFor="sl-enable" className="text-[9px] text-[#5a5f6e] font-bold uppercase tracking-wider cursor-pointer select-none">
                        Stop Loss
                      </label>
                    </div>
                    <div 
                      onClick={() => {
                        if (!isSLEnabled) {
                          setIsSLEnabled(true);
                          const tick = getTickSize(executionPrice);
                          setStopLoss((executionPrice - tick).toFixed(2));
                        }
                      }}
                      className={`flex items-center bg-[#111214] border rounded-xl overflow-hidden transition-all ${!isSLEnabled ? 'opacity-45 cursor-pointer border-[#1e2025]' : isSLInvalid ? 'border-red-500' : 'border-[#1e2025] focus-within:border-red-500/50'}`}
                    >
                      <button
                        type="button"
                        disabled={!isSLEnabled}
                        onClick={(e) => { e.stopPropagation(); adjustStopLoss('down'); }}
                        className="px-3 py-2 text-[#5a5f6e] hover:text-white transition-colors border-r border-[#1e2025] font-black text-sm select-none disabled:pointer-events-none"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        disabled={!isSLEnabled}
                        placeholder={executionPrice.toFixed(2)}
                        value={stopLoss}
                        onChange={(e) => setStopLoss(e.target.value)}
                        className="w-full bg-transparent px-2 py-2 text-[11px] text-white focus:outline-none placeholder:text-[#333] text-center font-bold disabled:cursor-not-allowed"
                      />
                      <button
                        type="button"
                        disabled={!isSLEnabled}
                        onClick={(e) => { e.stopPropagation(); adjustStopLoss('up'); }}
                        className="px-3 py-2 text-[#5a5f6e] hover:text-white transition-colors border-l border-[#1e2025] font-black text-sm select-none disabled:pointer-events-none"
                      >
                        +
                      </button>
                    </div>
                    {isSLEnabled && isSLInvalid && (
                      <p className="text-[8px] text-red-500 mt-1 font-medium text-center">Must be &lt; {executionPrice.toFixed(2)}</p>
                    )}
                    {isSLEnabled && stopLoss && (
                      <p className="text-[8px] text-[#5a5f6e] mt-1 text-center font-semibold">
                        Est. Value: ₹{((qty > 0 ? qty : 1) * (parseFloat(stopLoss) || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <input
                        type="checkbox"
                        id="tp-enable"
                        checked={isTPEnabled}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setIsTPEnabled(checked);
                          if (checked) {
                            const tick = getTickSize(executionPrice);
                            setTakeProfit((executionPrice + tick).toFixed(2));
                          } else {
                            setTakeProfit('');
                          }
                        }}
                        className="rounded bg-[#111214] border-[#1e2025] text-green-500 focus:ring-0 focus:ring-offset-0 cursor-pointer w-3.5 h-3.5"
                      />
                      <label htmlFor="tp-enable" className="text-[9px] text-[#5a5f6e] font-bold uppercase tracking-wider cursor-pointer select-none">
                        Take Profit
                      </label>
                    </div>
                    <div 
                      onClick={() => {
                        if (!isTPEnabled) {
                          setIsTPEnabled(true);
                          const tick = getTickSize(executionPrice);
                          setTakeProfit((executionPrice + tick).toFixed(2));
                        }
                      }}
                      className={`flex items-center bg-[#111214] border rounded-xl overflow-hidden transition-all ${!isTPEnabled ? 'opacity-45 cursor-pointer border-[#1e2025]' : isTPInvalid ? 'border-red-500' : 'border-[#1e2025] focus-within:border-green-500/50'}`}
                    >
                      <button
                        type="button"
                        disabled={!isTPEnabled}
                        onClick={(e) => { e.stopPropagation(); adjustTakeProfit('down'); }}
                        className="px-3 py-2 text-[#5a5f6e] hover:text-white transition-colors border-r border-[#1e2025] font-black text-sm select-none disabled:pointer-events-none"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        disabled={!isTPEnabled}
                        placeholder={executionPrice.toFixed(2)}
                        value={takeProfit}
                        onChange={(e) => setTakeProfit(e.target.value)}
                        className="w-full bg-transparent px-2 py-2 text-[11px] text-white focus:outline-none placeholder:text-[#333] text-center font-bold disabled:cursor-not-allowed"
                      />
                      <button
                        type="button"
                        disabled={!isTPEnabled}
                        onClick={(e) => { e.stopPropagation(); adjustTakeProfit('up'); }}
                        className="px-3 py-2 text-[#5a5f6e] hover:text-white transition-colors border-l border-[#1e2025] font-black text-sm select-none disabled:pointer-events-none"
                      >
                        +
                      </button>
                    </div>
                    {isTPEnabled && isTPInvalid && (
                      <p className="text-[8px] text-red-500 mt-1 font-medium text-center">Must be &gt; {executionPrice.toFixed(2)}</p>
                    )}
                    {isTPEnabled && takeProfit && (
                      <p className="text-[8px] text-[#5a5f6e] mt-1 text-center font-semibold">
                        Est. Value: ₹{((qty > 0 ? qty : 1) * (parseFloat(takeProfit) || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    )}
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
