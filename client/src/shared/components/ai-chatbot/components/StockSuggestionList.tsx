import { TrendingUp, Plus } from 'lucide-react';
import type { BotStock } from '../types/chatbot.types';

interface StockSuggestionListProps {
    stocks: BotStock[];
    onStockClick?: (symbol: string) => void;
}

export function StockSuggestionList({ stocks, onStockClick }: StockSuggestionListProps) {
    if (!stocks || stocks.length === 0) return null;

    return (
        <div className="mt-4 bg-neutral-950 border border-neutral-800 rounded-lg overflow-hidden">
            <div className="px-3 py-2 bg-neutral-900/50 border-b border-neutral-800 flex justify-between items-center">
                <span className="text-[9px] font-bold tracking-widest text-neutral-500 uppercase">Top Suggestions</span>
                <TrendingUp size={10} className="text-green-500" />
            </div>
            <div className="divide-y divide-neutral-800">
                {stocks.map((stock) => (
                    <div
                        key={stock.id}
                        className="px-3 py-3 flex items-center justify-between hover:bg-neutral-900/50 transition-colors cursor-pointer"
                        onClick={() => onStockClick?.(stock.symbol)}
                    >
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-md bg-neutral-900 border border-neutral-800 flex items-center justify-center overflow-hidden">
                                {stock.logo ? (
                                    <img src={stock.logo} alt={stock.symbol} className="w-5 h-5 object-contain" />
                                ) : (
                                    <span className="text-[10px] font-bold text-neutral-500">{stock.symbol.substring(0, 1)}</span>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-bold text-neutral-200 uppercase">{stock.symbol}</span>
                                <span className="text-[9px] text-neutral-500 truncate max-w-[100px]">{stock.name}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col items-end">
                                <span className="text-[11px] font-bold text-neutral-200">
                                    {stock.price ? `₹${stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : 'N/A'}
                                </span>
                                {stock.changePercent !== undefined && (
                                    <span className={`text-[9px] font-medium ${stock.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                                    </span>
                                )}
                            </div>
                            <button className="p-1.5 rounded-md bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-neutral-950 transition-all">
                                <Plus size={12} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
