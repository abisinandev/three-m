import { useState, useEffect } from "react";
import { Plus, Bookmark, X, TrendingUp } from "lucide-react";
import { MARKET_NEWS_CATEGORIES } from "../constants/categories";
import type { MarketNews } from "../types";

export function PersonalizationPanel() {
    const [savedArticles, setSavedArticles] = useState<MarketNews[]>([]);

    const loadSavedArticles = () => {
        const saved = JSON.parse(localStorage.getItem("saved_news") || "[]");
        setSavedArticles(saved);
    };

    useEffect(() => {
        loadSavedArticles();
        window.addEventListener("saved_news_updated", loadSavedArticles);
        return () => window.removeEventListener("saved_news_updated", loadSavedArticles);
    }, []);

    const removeSavedItem = (url: string) => {
        const saved = JSON.parse(localStorage.getItem("saved_news") || "[]");
        const newSaved = saved.filter((item: MarketNews) => item.url !== url);
        localStorage.setItem("saved_news", JSON.stringify(newSaved));
        setSavedArticles(newSaved);
        window.dispatchEvent(new Event("saved_news_updated"));
    };

    return (
        <div className="flex flex-col gap-4">

            <div style={{ background: '#111214', border: '1px solid #1e2025', borderRadius: 6 }} className="p-4">
                <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500">Curated Interests</h3>
                <div className="flex flex-wrap gap-2">
                    {MARKET_NEWS_CATEGORIES.filter(c => c !== "All").map((interest) => (
                        <button
                            key={interest}
                            style={{ background: '#0b0c0e', border: '1px solid #1e2025' }}
                            className="rounded px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-gray-400 transition-all hover:border-gray-600 hover:text-gray-200"
                        >
                            {interest}
                        </button>
                    ))}
                    <button
                        style={{ border: '1px dashed #2d2d2d' }}
                        className="flex items-center gap-1 rounded bg-transparent px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-gray-600 hover:border-gray-500 transition-colors"
                    >
                        <Plus className="h-2.5 w-2.5" />
                        <span>Add</span>
                    </button>
                </div>
            </div>

            <div style={{ background: '#111214', border: '1px solid #1e2025', borderRadius: 6 }} className="p-4">
                <div className="mb-3 flex items-center gap-2">
                    <TrendingUp className="h-3.5 w-3.5 text-blue-500/80" />
                    <h3 className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Market Briefings</h3>
                </div>
                <div className="space-y-4">
                    {[
                        "RBI Repo Rate: Impact on Home Loans",
                        "NIFTY 50 hits record high: Technical Analysis",
                        "Top 5 Debt Funds for 2026 Strategy"
                    ].map((title, i) => (
                        <div key={i} className="group cursor-pointer">
                            <h4 className="mb-1 text-[11px] font-semibold leading-relaxed text-gray-300 transition-colors group-hover:text-blue-400 line-clamp-2">
                                {title}
                            </h4>
                            <p className="text-[9px] uppercase tracking-wider text-gray-600 font-bold">
                                {i === 0 ? "Economy" : i === 1 ? "Stocks" : "Mutual Funds"} • {i + 1}h ago
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ background: '#111214', border: '1px solid #1e2025', borderRadius: 6 }} className="p-4">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Intel Archive</h3>
                    <span className="rounded bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 text-[8px] font-bold text-blue-400">
                        {savedArticles.length}
                    </span>
                </div>

                {savedArticles.length > 0 ? (
                    <div className="space-y-4">
                        {savedArticles.slice(0, 5).map((article) => (
                            <div key={article.url} className="group relative border-l-2 border-[#1e2025] pl-3 hover:border-blue-500/50 transition-colors">
                                <a href={article.url} target="_blank" rel="noopener noreferrer" className="block pr-6">
                                    <h4 className="mb-1 text-[11px] font-medium leading-relaxed text-gray-400 group-hover:text-gray-200 line-clamp-2 transition-colors">
                                        {article.title}
                                    </h4>
                                    <p className="text-[9px] uppercase tracking-wider text-gray-600 font-bold">
                                        {article.source}
                                    </p>
                                </a>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        removeSavedItem(article.url);
                                    }}
                                    className="absolute top-0 right-0 p-1 text-gray-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-8 text-center border border-dashed border-[#1e2025] rounded">
                        <Bookmark className="mx-auto mb-2 h-6 w-6 text-[#1e2025]" />
                        <p className="text-[9px] uppercase tracking-widest font-bold text-gray-600">No archived reports</p>
                    </div>
                )}
            </div>
        </div>
    );
}
