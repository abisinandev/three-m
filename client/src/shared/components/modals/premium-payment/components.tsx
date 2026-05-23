import { Check, Crown, X } from 'lucide-react';

export const FeatureItem = ({ label, isPremium = false }: { label: string; isPremium?: boolean }) => (
    <div className="flex items-center gap-2">
        {isPremium ? (
            <Check className="w-2.5 h-2.5 text-amber-500 shrink-0" />
        ) : (
            <div className="w-1.5 h-1.5 rounded-full bg-[#2a2d35] shrink-0" />
        )}
        <span className={`text-[11px] ${isPremium ? 'text-[#c8cacd]' : 'text-[#5a5f6e]'}`}>{label}</span>
    </div>
);

export const PlanCard = ({
    name,
    price,
    duration,
    features,
    isPremium = false,
    best = false
}: {
    name: string;
    price: string | number;
    duration: string;
    features: string[];
    isPremium?: boolean;
    best?: boolean;
}) => (
    <div className={`relative rounded-lg p-3.5 border transition-all ${
        isPremium 
            ? 'bg-amber-500/[0.05] border-amber-500/30' 
            : 'bg-[#111214] border-[#1e2025]'
    }`}>
        {best && (
            <div className="absolute -top-px right-3 px-2 py-0.5 bg-amber-500 rounded-b text-[8px] font-black uppercase tracking-widest text-white">
                Best
            </div>
        )}
        <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isPremium ? 'text-amber-500' : 'text-[#5a5f6e]'}`}>
            {name}
        </p>
        <div className="flex items-baseline gap-1 mb-3">
            <span className={`text-xl font-extrabold tracking-tight ${isPremium ? 'text-[#e8eaed]' : 'text-[#9ca3af]'}`}>₹{price}</span>
            <span className="text-[10px] text-[#5a5f6e]">/ {duration}</span>
        </div>
        <div className="flex flex-col gap-1.5">
            {features.map(f => (
                <FeatureItem key={f} label={f} isPremium={isPremium} />
            ))}
        </div>
    </div>
);

export const ModalHeader = ({ onClose }: { onClose: () => void }) => (
    <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2025]">
        <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Crown className="w-4 h-4 text-amber-500" />
            </div>
            <div>
                <p className="text-sm font-bold text-[#e8eaed] leading-tight">Choose your plan</p>
                <p className="text-[10px] text-[#5a5f6e] uppercase tracking-widest mt-0.5">threeM · Invest smarter</p>
            </div>
        </div>
        <button
            onClick={onClose}
            className="text-[#5a5f6e] hover:text-[#e8eaed] transition-colors p-1"
        >
            <X className="w-4 h-4" />
        </button>
    </div>
);
