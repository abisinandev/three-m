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
        <div className="group block mb-4">
            <div 
                style={{ background: '#111214', border: '1px solid #1e2025', borderRadius: 6 }}
                className="relative overflow-hidden transition-all duration-200 hover:border-[#2a2a2a]"
            >
                <div className="flex flex-col md:flex-row h-full">
                    <div className="relative w-full md:w-48 h-40 md:h-48 flex-shrink-0 overflow-hidden bg-[#1a1a1a]">
                        <img
                            src={news.image || "/placeholder-news.jpg"}
                            alt={news.title}
                            className="h-full w-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1611974714652-96048a9fbc75?auto=format&fit=crop&q=80&w=800";
                            }}
                        />
                        <div className="absolute top-2 left-2">
                            <span className="rounded bg-black/60 px-2 py-0.5 text-[8px] font-bold uppercase text-gray-300 backdrop-blur-sm border border-white/5 tracking-wider">
                                Report
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-1 flex-col p-4">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2 text-[9px] uppercase tracking-wider text-gray-500 font-semibold">
                                <span className="text-blue-400 font-bold px-1.5 py-0.5 bg-blue-500/5 border border-blue-500/10 rounded">
                                    {news.source}
                                </span>
                                <span>•</span>
                                <span>{formatDistanceToNow(new Date(news.publishedAt), { addSuffix: true })}</span>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={toggleSave}
                                    style={{ background: '#1a1a1a', border: '1px solid #2d2d2d' }}
                                    className={`p-1.5 rounded transition-colors ${isSaved ? 'text-amber-500 border-amber-500/30' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    <Bookmark className={`h-3 w-3 ${isSaved ? "fill-current" : ""}`} />
                                </button>
                                <button
                                    onClick={handleShare}
                                    style={{ background: '#1a1a1a', border: '1px solid #2d2d2d' }}
                                    className="p-1.5 rounded text-gray-500 hover:text-gray-300 transition-colors"
                                >
                                    <Share2 className="h-3 w-3" />
                                </button>
                            </div>
                        </div>

                        <a href={news.url} target="_blank" rel="noopener noreferrer" className="block">
                            <h3 className="mb-2 text-xs font-semibold leading-snug text-gray-100 hover:text-blue-400 transition-colors line-clamp-2 tracking-tight">
                                {news.title}
                            </h3>
                            <p className="text-[11px] leading-relaxed text-gray-500 line-clamp-2 font-medium">
                                {news.description}
                            </p>
                        </a>

                        <div className="mt-auto pt-3 flex items-center justify-between border-t border-[#1e2025]">
                            <a
                                href={news.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-[9px] font-bold text-gray-400 hover:text-gray-200 transition-colors uppercase tracking-widest group/link"
                            >
                                Intelligence View
                                <ExternalLink className="ml-1.5 h-2.5 w-2.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Share Modal */}
            {showShareModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div style={{ background: '#111214', border: '1px solid #1e2025', borderRadius: 6 }} className="w-full max-w-xs p-5 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-[11px] font-bold text-gray-200 uppercase tracking-widest">Share Report</h3>
                            <button
                                onClick={() => setShowShareModal(false)}
                                className="p-1 text-gray-500 hover:text-white transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div style={{ background: '#0b0c0e', border: '1px solid #1e2025' }} className="flex items-center gap-2 p-2 rounded mb-4">
                            <input
                                type="text"
                                value={news.url}
                                readOnly
                                className="flex-1 bg-transparent text-[10px] text-gray-500 outline-none truncate font-medium"
                            />
                            <button
                                onClick={copyToClipboard}
                                className={`p-1.5 rounded transition-all duration-300 ${copied ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                            >
                                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            </button>
                        </div>

                        <div className="text-center text-[8px] text-gray-600 uppercase tracking-widest font-bold">
                            {copied ? "Link Secured" : "Click to secure link"}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
