'use client';
import { useRef, useState, useEffect } from 'react';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
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
                className="flex items-center gap-2 bg-[#111214] py-1.5 px-3 rounded-md border border-[#1e2025] cursor-pointer transition-colors duration-150 hover:border-[#3a3d45]"
            >
                <Calendar size={13} className="text-[#5a5f6e]" />
                <span className="text-xs font-bold text-[#e8eaed] tracking-tight">{displayMonth.toUpperCase()}</span>
                <ChevronDown size={12} className={`text-[#5a5f6e] transition-transform duration-200 ${isMonthPickerOpen ? 'rotate-180' : ''}`} />
            </button>


            {isMonthPickerOpen && (
                <div className="absolute top-full right-0 mt-2 z-50 bg-[#0b0c0e] border border-[#1e2025] rounded-lg p-4 w-[240px] shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center justify-between mb-3">
                        <button
                            onClick={() => setPickerYear(prev => prev - 1)}
                            className="bg-transparent border-none cursor-pointer text-[#5a5f6e] p-1 hover:text-[#e8eaed] transition-colors"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="text-xs font-extrabold text-[#e8eaed] tracking-widest tabular-nums">{pickerYear}</span>
                        <button
                            onClick={() => setPickerYear(prev => prev + 1)}
                            className="bg-transparent border-none cursor-pointer text-[#5a5f6e] p-1 hover:text-[#e8eaed] transition-colors"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                        {Array.from({ length: 12 }).map((_, i) => {
                            const monthDate = new Date(pickerYear, i, 1);
                            const isSelected = getYear(selectedMonth) === pickerYear && getMonth(selectedMonth) === i;
                            const isCurrentMonth = getYear(new Date()) === pickerYear && getMonth(new Date()) === i;
                            
                            const btnBorder = isCurrentMonth && !isSelected ? 'border border-blue-500/25' : 'border border-transparent';
                            const btnBg = isSelected ? 'bg-blue-500 hover:bg-blue-600' : 'bg-transparent hover:bg-[#1e2025]';
                            const btnText = isSelected ? 'text-white' : isCurrentMonth ? 'text-blue-500' : 'text-[#5a5f6e]';

                            return (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setSelectedMonth(monthDate);
                                        setIsMonthPickerOpen(false);
                                    }}
                                    className={`py-2 rounded text-xs font-bold cursor-pointer transition-colors duration-150 ${btnBorder} ${btnBg} ${btnText}`}
                                >
                                    {format(monthDate, 'MMM').toUpperCase()}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#1e2025] flex justify-center">
                        <button
                            onClick={() => {
                                setSelectedMonth(startOfMonth(new Date()));
                                setIsMonthPickerOpen(false);
                            }}
                            className="bg-transparent border-none cursor-pointer text-xs font-extrabold text-[#3B82F6] tracking-wider hover:text-blue-400 transition-colors"
                        >
                            CURRENT MONTH
                        </button>
                    </div>
                </div>
            )}
        </div>

    );
};
