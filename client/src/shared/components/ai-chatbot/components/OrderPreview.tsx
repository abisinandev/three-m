import { Zap, Loader2, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { confirmBotOrder } from '../../../services/chatbot/chatbotApi';
import { toast } from 'sonner';

interface OrderPreviewProps {
    data: {
        symbol: string;
        qty: number;
        price: number;
        total: number;
        name: string;
    };
    onExecuted?: () => void;
}

export function OrderPreview({ data, onExecuted }: OrderPreviewProps) {
    const [isExecuting, setIsExecuting] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const handleExecute = async () => {
        setIsExecuting(true);
        try {
            await confirmBotOrder(data.symbol, data.qty);
            setIsDone(true);
            toast.success(`Successfully purchased ${data.qty} shares of ${data.symbol}`, {
                description: `Execution complete at ₹${data.price.toFixed(2)}`,
                duration: 5000,
            });
            onExecuted?.();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to execute order");
        } finally {
            setIsExecuting(false);
        }
    };

    if (isDone) {
        return (
            <div className="mt-4 bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 animate-in zoom-in-95 duration-500 shadow-xl shadow-green-500/5">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center animate-bounce">
                    <CheckCircle2 size={24} className="text-green-500" />
                </div>
                <div className="text-center">
                    <h4 className="text-[12px] font-bold text-green-500 uppercase tracking-widest">Trade Executed</h4>
                    <p className="text-[10px] text-neutral-400 mt-1">
                        Your purchase of <span className="text-neutral-200 font-semibold">{data.qty} {data.symbol}</span> is complete.
                    </p>
                </div>
                <div className="mt-1 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[9px] text-neutral-500 font-medium">
                    Transaction recorded in history
                </div>
            </div>
        );
    }

    return (
        <div className="mt-4 bg-neutral-950/80 backdrop-blur-md border border-neutral-800 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500 shadow-2xl">
            <div className="px-4 py-3 bg-gradient-to-r from-neutral-900 to-transparent border-b border-neutral-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="p-1 rounded-md bg-green-500/10">
                        <Zap size={12} className="text-green-500 fill-green-500" />
                    </div>
                    <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase">Trade Review</span>
                </div>
                <span className="text-[9px] font-medium text-neutral-600 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">MARKET ORDER</span>
            </div>

            <div className="px-5 py-5 space-y-4">
                <div className="flex justify-between items-start gap-4">
                    <span className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider">Asset</span>
                    <div className="flex flex-col items-end">
                        <span className="text-neutral-100 text-[13px] font-bold tracking-tight">{data.symbol}</span>
                        <span className="text-neutral-500 text-[9px] font-medium truncate max-w-[180px]">{data.name}</span>
                    </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />

                <div className="grid grid-cols-2 gap-8">
                    <div className="flex flex-col gap-1">
                        <span className="text-neutral-500 text-[9px] font-bold uppercase tracking-wider">Quantity</span>
                        <span className="text-neutral-200 font-bold text-[13px]">{data.qty.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                        <span className="text-neutral-500 text-[9px] font-bold uppercase tracking-wider">Est. Price</span>
                        <span className="text-neutral-200 font-bold text-[13px]">₹{data.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>

                <div className="pt-2">
                    <div className="bg-neutral-900/50 rounded-xl p-3 border border-neutral-800/50 flex justify-between items-center">
                        <span className="text-neutral-400 text-[10px] font-bold uppercase tracking-wider">Total Investment</span>
                        <span className="text-green-500 font-black text-[15px]">₹{data.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 bg-neutral-900/30">
                <button
                    disabled={isExecuting}
                    className="py-4 text-[11px] font-black tracking-widest text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800/50 transition-all border-r border-neutral-800 disabled:opacity-50 uppercase"
                >
                    Cancel
                </button>
                <button
                    onClick={handleExecute}
                    disabled={isExecuting}
                    className="py-4 text-[11px] font-black tracking-widest bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-neutral-950 transition-all flex items-center justify-center gap-2 disabled:opacity-50 uppercase overflow-hidden relative group"
                >
                    {isExecuting ? (
                        <>
                            <Loader2 size={14} className="animate-spin" />
                            <span>Processing</span>
                        </>
                    ) : (
                        <>
                            <Zap size={14} className="group-hover:animate-pulse" />
                            <span>Execute Trade</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
