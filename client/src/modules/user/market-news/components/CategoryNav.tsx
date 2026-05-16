import { MARKET_NEWS_CATEGORIES as CATEGORIES } from "../constants/categories";

interface CategoryNavProps {
    activeCategory: string;
    onCategoryChange: (category: string) => void;
}

export const CategoryNav = ({ activeCategory, onCategoryChange }: CategoryNavProps) => {
    return (
        <div className="relative py-2">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
                {CATEGORIES.map((category) => {
                    const isActive = activeCategory === category;
                    return (
                        <button
                            key={category}
                            onClick={() => onCategoryChange(category)}
                            style={{ 
                                background: isActive ? '#22C55E' : '#111214',
                                border: isActive ? '1px solid #22C55E' : '1px solid #1e2025'
                            }}
                            className={`px-3 py-1 rounded text-[10px] font-semibold whitespace-nowrap transition-all duration-200 uppercase tracking-wider ${isActive
                                ? "text-white shadow-lg shadow-emerald-500/10"
                                : "text-gray-500 hover:border-gray-700 hover:text-gray-300"
                                }`}
                        >
                            {category}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
