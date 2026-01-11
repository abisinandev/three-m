type Props = {
    title: string;
    value: number | string;
    icon?: any;
    color?: any;
    subtitle?: string;
}

export const StatsCardComponent = ({ title, value, icon, color, subtitle }: Props) => (
    <div className="bg-[#111111] border border-neutral-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-xs text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-white mt-1">{value}</p>
            </div>
            <div className={`w-10 h-10 ${color}/10 rounded-lg flex items-center justify-center`}>
                {icon}
            </div>
        </div>
        <p className={`text-xs ${color} mt-2`}>{subtitle}</p>
    </div>
);