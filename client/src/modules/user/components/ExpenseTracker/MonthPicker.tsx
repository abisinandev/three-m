import { useRef, useState, useEffect } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { getYear, getMonth, format, startOfMonth } from 'date-fns';

interface MonthPickerProps {
    selectedMonth: Date;
    setSelectedMonth: (date: Date) => void;
    displayMonth: string;
}

export const MonthPicker = ({ selectedMonth, setSelectedMonth, displayMonth }: MonthPickerProps) => {
    const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
    const [pickerYear, setPickerYear] = useState(getYear(selectedMonth));
    const monthPickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (monthPickerRef.current && !monthPickerRef.current.contains(event.target as Node)) {
                setIsMonthPickerOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={monthPickerRef}>
            <button
                onClick={() => {
                    setIsMonthPickerOpen(!isMonthPickerOpen);
                    setPickerYear(getYear(selectedMonth));
                }}
                className="flex items-center gap-2 bg-[#111] px-4 py-2 rounded-xl border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900 transition-all duration-300 shadow-sm group"
            >
                <Calendar size={16} className="text-neutral-500 group-hover:text-blue-500 transition-colors" />
                <span className="text-sm text-neutral-200 font-bold tracking-tight">{displayMonth}</span>
                <ChevronDown size={14} className={`text-neutral-500 transition-transform duration-300 ${isMonthPickerOpen ? 'rotate-180 text-blue-500' : ''}`} />
            </button>

            {isMonthPickerOpen && (
                <div className="absolute top-full right-0 mt-3 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border border-neutral-800 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-72 animate-in fade-in zoom-in duration-200 origin-top-right">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <button
                            onClick={() => setPickerYear(prev => prev - 1)}
                            className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors"
                        >
                            <ChevronDown className="rotate-90" size={16} />
                        </button>
                        <span className="text-sm font-black text-white tracking-widest">{pickerYear}</span>
                        <button
                            onClick={() => setPickerYear(prev => prev + 1)}
                            className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors"
                        >
                            <ChevronDown className="-rotate-90" size={16} />
                        </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {Array.from({ length: 12 }).map((_, i) => {
                            const monthDate = new Date(pickerYear, i, 1);
                            const isSelected = getYear(selectedMonth) === pickerYear && getMonth(selectedMonth) === i;
                            const isCurrentMonth = getYear(new Date()) === pickerYear && getMonth(new Date()) === i;

                            return (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setSelectedMonth(monthDate);
                                        setIsMonthPickerOpen(false);
                                    }}
                                    className={`
                                        py-2.5 rounded-xl text-xs font-bold transition-all duration-200
                                        ${isSelected
                                            ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] scale-105 z-10'
                                            : 'text-neutral-500 hover:bg-neutral-800/80 hover:text-neutral-200'}
                                        ${isCurrentMonth && !isSelected ? 'border border-blue-500/30 text-blue-400' : ''}
                                    `}
                                >
                                    {format(monthDate, 'MMM')}
                                </button>
                            );
                        })}
                    </div>
                    <div className="mt-4 pt-4 border-t border-neutral-800/50 flex justify-center">
                        <button
                            onClick={() => {
                                setSelectedMonth(startOfMonth(new Date()));
                                setIsMonthPickerOpen(false);
                            }}
                            className="text-[10px] font-black uppercase tracking-widest text-blue-500/80 hover:text-blue-400 transition-colors"
                        >
                            Go to Current Month
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
