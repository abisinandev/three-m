import { useRef } from "react";

const CATEGORIES = [
    "All",
    "Stocks",
    "Mutual Funds",
    "Economy",
    "RBI",
    "Global Markets",
    "Crypto",
    "Commodities"
];

interface CategoryNavProps {
    activeCategory: string;
    onCategoryChange: (category: string) => void;
}

export const CategoryNav = ({ activeCategory, onCategoryChange }: CategoryNavProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    return (
        <div className="relative group/nav py-4">
            <div className="flex items-center gap-4">
                <div
                    ref={scrollRef}
                    className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth"
                >
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => onCategoryChange(category)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${activeCategory === category
                                ? "bg-[#22C55E] text-white shadow-lg shadow-[#22C55E]/20"
                                : "bg-black text-gray-400 border border-[#2d2d2d] hover:border-gray-600 hover:text-gray-200"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
