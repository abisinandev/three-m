import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
    subtitle: string;
    icon: React.ReactNode;
    valueClass?: string;
    alertIcon?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ 
    title, 
    value, 
    subtitle, 
    icon, 
    valueClass = "text-white", 
    alertIcon = false 
}) => (
    <div className="bg-[#111214] rounded-lg p-4 flex flex-col justify-between border border-[#1e2025] min-h-[110px] shadow-sm">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-[10px] font-semibold text-[#5a5f6e] tracking-wider uppercase">{title}</h3>
            <div className={`p-1.5 rounded-md ${alertIcon ? 'bg-red-500/10' : 'bg-[#1a1c20]'}`}>
                {icon}
            </div>
        </div>
        <div className="flex items-end justify-between">
            <div>
                <div className={`text-xl font-bold mb-1 leading-none tracking-tight ${valueClass}`}>
                    {value === '—' ? <div className="w-8 h-1 bg-[#1e2025] rounded-full my-2"></div> : value}
                </div>
                <div className="text-[10px] text-[#5a5f6e] font-medium">{subtitle}</div>
            </div>
        </div>
    </div>
);
