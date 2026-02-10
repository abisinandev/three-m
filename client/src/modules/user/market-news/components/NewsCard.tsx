import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { Bookmark, Share2, ExternalLink, X, Check, Copy } from "lucide-react";
import type { MarketNews } from "../types";

export function NewsCard({ news }: { news: MarketNews }) {
    const [isSaved, setIsSaved] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const savedItems = JSON.parse(localStorage.getItem("saved_news") || "[]");
        setIsSaved(savedItems.some((item: MarketNews) => item.url === news.url));
    }, [news.url]);

    const toggleSave = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const savedItems = JSON.parse(localStorage.getItem("saved_news") || "[]");
        let newSavedItems;

        if (isSaved) {
            newSavedItems = savedItems.filter((item: MarketNews) => item.url !== news.url);
        } else {
            newSavedItems = [...savedItems, news];
        }

        localStorage.setItem("saved_news", JSON.stringify(newSavedItems));
        setIsSaved(!isSaved);

        window.dispatchEvent(new Event("saved_news_updated"));
    };

    const handleShare = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowShareModal(true);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(news.url);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
            setShowShareModal(false);
        }, 2000);
    };

    return (
        <div className="group block mb-6 px-4 sm:px-0">
            <div className="relative overflow-hidden rounded-xl border border-[#2D2D2D] bg-black transition-all duration-300 hover:border-[#404040] hover:shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                <div className="flex flex-col md:flex-row h-full">
                    <div className="relative w-full md:w-64 h-48 md:h-auto overflow-hidden bg-[#0A0A0A]">
                        <img
                            src={news.image || "/placeholder-news.jpg"}
                            alt={news.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1611974714652-96048a9fbc75?auto=format&fit=crop&q=80&w=800";
                            }}
                        />
                        {/* Category Tag */}
                        <div className="absolute top-3 left-3">
                            <span className="rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold uppercase text-white backdrop-blur-md border border-white/10 tracking-widest">
                                Market
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5 md:p-6">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center space-x-2 text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                                <span className="text-white px-2 py-0.5 bg-blue-600/10 border border-blue-600/20 rounded-md">{news.source}</span>
                                <span>•</span>
                                <span>{formatDistanceToNow(new Date(news.publishedAt), { addSuffix: true })}</span>
                            </div>
                            <div className="flex items-center space-x-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={toggleSave}
                                    className={`p-2 rounded-full border border-[#2D2D2D] hover:bg-[#1A1A1A] transition-colors ${isSaved ? 'text-yellow-500 border-yellow-500/50' : 'text-gray-400'}`}
                                    title={isSaved ? "Remove from saved" : "Save article"}
                                >
                                    <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="p-2 rounded-full border border-[#2D2D2D] hover:bg-[#1A1A1A] text-gray-400 transition-colors"
                                    title="Share article"
                                >
                                    <Share2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <a href={news.url} target="_blank" rel="noopener noreferrer" className="block group/title">
                            <h3 className="mb-3 text-lg font-bold leading-tight text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                                {news.title}
                            </h3>
                            <p className="mb-4 text-sm leading-relaxed text-gray-400 line-clamp-2 md:line-clamp-3">
                                {news.description}
                            </p>
                        </a>

                        <div className="mt-auto pt-4 flex items-center justify-between border-t border-[#1A1A1A]">
                            <a
                                href={news.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-[10px] font-bold text-white hover:text-blue-400 transition-colors uppercase tracking-widest group/link"
                            >
                                Read Article
                                <ExternalLink className="ml-2 h-3 w-3 transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Share Modal */}
            {showShareModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-2xl border border-[#2D2D2D] bg-[#0A0A0A] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white tracking-tight">Share Article</h3>
                            <button
                                onClick={() => setShowShareModal(false)}
                                className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-[#1A1A1A] transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex items-center space-x-2 rounded-xl bg-black border border-[#2D2D2D] p-3 mb-6 group-focus-within:border-blue-500/50 transition-colors">
                            <input
                                type="text"
                                value={news.url}
                                readOnly
                                className="flex-1 bg-transparent text-xs text-gray-400 outline-none truncate"
                            />
                            <button
                                onClick={copyToClipboard}
                                className={`p-2 rounded-lg transition-all duration-300 ${copied ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'}`}
                            >
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </button>
                        </div>

                        <div className="text-center text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                            {copied ? "Link Copied!" : "Click to copy link"}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
