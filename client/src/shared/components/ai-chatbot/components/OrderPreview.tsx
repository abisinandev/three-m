import { Zap } from 'lucide-react';

export function OrderPreview() {
    return (
        <div className="mt-4 bg-neutral-950 border border-neutral-800 rounded-lg overflow-hidden">
            <div className="px-3 py-2 bg-neutral-900/50 border-b border-neutral-800 flex justify-between items-center">
                <span className="text-[9px] font-bold tracking-widest text-neutral-500 uppercase">Order Preview</span>
                <Zap size={10} className="text-green-500" />
            </div>
            <div className="px-3 py-3 space-y-3">
                <div className="flex justify-between items-start gap-4">
                    <span className="text-neutral-500 text-[9px] font-semibold uppercase">Investment</span>
                    <span className="text-neutral-200 text-[10px] text-right font-medium max-w-[120px]">
                        Parag Parikh Flexi Cap
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-neutral-500 text-[9px] font-semibold uppercase">Amount</span>
                    <span className="text-green-500 font-bold text-[11px]">₹45,000.00</span>
                </div>
            </div>
            <div className="grid grid-cols-2 border-t border-neutral-800">
                <button
                    onClick={() => alert('Order cancelled')}
                    className="py-2.5 text-[10px] font-bold text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900 transition-all border-r border-neutral-800"
                >
                    DISMISS
                </button>
                <button
                    onClick={() => alert('Order executed')}
                    className="py-2.5 text-[10px] font-bold bg-green-600/10 text-green-500 hover:bg-green-600 hover:text-neutral-950 transition-all"
                >
                    EXECUTE
                </button>
            </div>
        </div>
    );
}
