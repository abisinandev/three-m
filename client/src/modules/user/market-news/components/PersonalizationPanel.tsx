import { useState, useEffect } from "react";
import { Plus, ChevronRight, Bookmark, X, TrendingUp } from "lucide-react";
import type { MarketNews } from "../types";

export function PersonalizationPanel() {
    const [savedArticles, setSavedArticles] = useState<MarketNews[]>([]);

    const loadSavedArticles = () => {
        const saved = JSON.parse(localStorage.getItem("saved_news") || "[]");
        setSavedArticles(saved);
    };

    useEffect(() => {
        loadSavedArticles();

        // Listen for custom event when things are saved/unsaved
        window.addEventListener("saved_news_updated", loadSavedArticles);
        return () => window.removeEventListener("saved_news_updated", loadSavedArticles);
    }, []);

    const removeSavedItem = (url: string) => {
        const saved = JSON.parse(localStorage.getItem("saved_news") || "[]");
        const newSaved = saved.filter((item: MarketNews) => item.url !== url);
        localStorage.setItem("saved_news", JSON.stringify(newSaved));
        setSavedArticles(newSaved);
        // Notify other components (like NewsCard) that list changed
        window.dispatchEvent(new Event("saved_news_updated"));
    };

    return (
        <aside className="hidden lg:flex flex-col gap-6 w-full lg:sticky lg:top-24 max-h-[calc(100vh-120px)] overflow-y-auto no-scrollbar">
            {/* Your Interests */}
            <div className="rounded-2xl border border-[#2D2D2D] bg-black p-6">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#505050]">Your Interests</h3>
                <div className="flex flex-wrap gap-2">
                    {["Stocks", "Mutual Funds", "Economy", "Crypto", "RBI"].map((interest) => (
                        <button
                            key={interest}
                            className="rounded-full border border-[#2D2D2D] bg-black px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 transition-all hover:border-white hover:text-white"
                        >
                            {interest}
                        </button>
                    ))}
                    <button className="flex items-center space-x-1 rounded-full border border-dashed border-[#404040] bg-transparent px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:border-gray-400 hover:text-gray-400 transition-colors">
                        <Plus className="h-3 w-3" />
                        <span>Add</span>
                    </button>
                </div>
            </div>

            {/* Recommended */}
            <div className="rounded-2xl border border-[#2D2D2D] bg-black p-6">
                <div className="mb-4 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#505050]">Market Insights</h3>
                </div>
                <div className="space-y-4">
                    {[
                        "RBI Repo Rate: Impact on Home Loans",
                        "NIFTY 50 hits record high: What's next?",
                        "Top 5 Debt Funds for 2026"
                    ].map((title, i) => (
                        <div key={i} className="group cursor-pointer">
                            <h4 className="mb-1 text-xs font-bold leading-snug text-gray-300 transition-colors group-hover:text-blue-400 line-clamp-2">
                                {title}
                            </h4>
                            <p className="text-[9px] uppercase tracking-wider text-gray-600 font-bold">
                                {i === 0 ? "Economy" : i === 1 ? "Stocks" : "Mutual Funds"} • {i + 1}h ago
                            </p>
                        </div>
                    ))}
                </div>
                <button className="mt-6 flex w-full items-center justify-center space-x-2 rounded-xl bg-[#0A0A0A] border border-[#1A1A1A] py-3 text-[10px] font-bold uppercase tracking-widest text-white transition-all hover:bg-[#1A1A1A] hover:border-[#333333]">
                    <span>View Detailed Insights</span>
                    <ChevronRight className="h-3 w-3" />
                </button>
            </div>

            {/* Saved News */}
            <div className="rounded-2xl border border-[#2D2D2D] bg-black p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#505050]">Saved News</h3>
                    <span className="rounded-full bg-blue-600/20 border border-blue-600/30 px-2 py-0.5 text-[9px] font-bold text-blue-400">
                        {savedArticles.length}
                    </span>
                </div>

                {savedArticles.length > 0 ? (
                    <div className="space-y-5">
                        {savedArticles.map((article) => (
                            <div key={article.url} className="group relative border-l-2 border-[#1A1A1A] pl-3 hover:border-blue-500 transition-colors">
                                <a href={article.url} target="_blank" rel="noopener noreferrer" className="block pr-6">
                                    <h4 className="mb-1 text-[11px] font-bold leading-relaxed text-gray-300 group-hover:text-blue-400 line-clamp-2 transition-colors">
                                        {article.title}
                                    </h4>
                                    <p className="text-[9px] uppercase tracking-wider text-[#505050] font-bold">
                                        {article.source}
                                    </p>
                                </a>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        removeSavedItem(article.url);
                                    }}
                                    className="absolute top-0 right-0 p-1 text-[#333333] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Remove"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-10 text-center border border-dashed border-[#1A1A1A] rounded-xl">
                        <Bookmark className="mx-auto mb-3 h-8 w-8 text-[#1A1A1A]" />
                        <p className="text-[9px] uppercase tracking-widest font-bold text-gray-600">No saved items</p>
                        <p className="mt-1 text-[8px] text-gray-700">Save articles to read later</p>
                    </div>
                )}
            </div>
        </aside>
    );
}
