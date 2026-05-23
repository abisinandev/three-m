import type React from "react";

interface StatCardProps {
    label: string;
    value: string;
    color: string;         
    badge?: string;        
}

export const StatCard: React.FC<StatCardProps> = ({
    label,
    value,
    color,
    badge = "",
}) => (
    <div className="bg-[#1a1a1a] rounded-xl p-3 sm:p-4 border border-cool-white/10 backdrop-blur-sm hover:border-teal-green/30 transition-all duration-300 group">
        <div className="text-xs sm:text-sm text-cool-white/60 mb-1 group-hover:text-cool-white/80 transition-colors">
            {label}
        </div>
        <div className={`text-lg sm:text-xl font-bold ${color} flex items-center gap-2`}>
            {value}
            {badge && <span className={`text-xs px-2 py-0.5 rounded-full ${badge}`}>Live</span>}
        </div>
    </div>
);