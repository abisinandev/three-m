import { useMarketNews } from "../hooks/useMarketNews";
import { NewsCard } from "../components/NewsCard";
import { CategoryNav } from "../components/CategoryNav";
import { PersonalizationPanel } from "../components/PersonalizationPanel";
import { NewsSkeleton, SidebarSkeleton } from "../components/NewsSkeleton";
import { Search, Info, RefreshCw } from "lucide-react";

export const MarketNewsPage = () => {
    const {
        news,
        total,
        page,
        setPage,
        pageSize,
        isLoading,
        error: _error,
        refetch,
        searchQuery,
        setSearchQuery,
        activeCategory,
        setActiveCategory
    } = useMarketNews();

    const totalPages = Math.ceil(total / pageSize);

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0b0c0e',
            color: '#e8eaed',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            paddingBottom: 48,
        }}>
            <div style={{ maxWidth: 1400, margin: '0 auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                
                <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div>
                        <h1 style={{ fontSize: 16, fontWeight: 600, color: '#e8eaed', letterSpacing: '-0.2px', margin: 0 }}>
                            Market Intelligence
                        </h1>
                        <p style={{ fontSize: 11, color: '#5a5f6e', marginTop: 2, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                            Real-time updates from global financial markets
                        </p>
                    </div>

                    <div className="relative w-full md:w-72 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ background: '#111214', border: '1px solid #1e2025' }}
                            className="w-full text-gray-200 text-[11px] rounded-md py-2 pl-9 pr-4 focus:outline-none focus:border-blue-500/50 transition-all"
                        />
                    </div>
                </header>

                <CategoryNav
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <main className="lg:col-span-8">
                        {isLoading ? (
                            <NewsSkeleton />
                        ) : _error ? (
                            <div style={{ background: '#111214', border: '1px solid #1e2025', borderRadius: 6 }} className="p-12 text-center">
                                <p className="text-red-400 text-xs font-medium mb-4">Connection to news intelligence lost.</p>
                                <button
                                    onClick={() => refetch()}
                                    className="px-6 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-md text-[10px] font-bold hover:bg-red-500/20 transition-colors inline-flex items-center gap-2 uppercase tracking-wider"
                                >
                                    <RefreshCw className="w-3.5 h-3.5" /> Reconnect
                                </button>
                            </div>
                        ) : news.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                <div className="space-y-4">
                                    {news.map((item) => (
                                        <NewsCard key={item.url} news={item} />
                                    ))}
                                </div>

                                {/* Pagination Controls */}
                                <div className="flex items-center justify-between mt-4 px-1">
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
                                        Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} of {total} Reports
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            disabled={page === 1}
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            style={{ background: '#111214', border: '1px solid #1e2025' }}
                                            className="px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed hover:text-white transition-colors"
                                        >
                                            Prev
                                        </button>
                                        <div className="px-3 py-1.5 text-[10px] font-bold text-gray-300 bg-[#1a1a1a] rounded border border-[#1e2025]">
                                            {page} / {totalPages}
                                        </div>
                                        <button
                                            disabled={page >= totalPages}
                                            onClick={() => setPage(p => p + 1)}
                                            style={{ background: '#111214', border: '1px solid #1e2025' }}
                                            className="px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed hover:text-white transition-colors"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ background: '#111214', border: '1px solid #1e2025', borderRadius: 6 }} className="p-16 text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1a1a1a] text-gray-500 mb-6">
                                    <Search className="w-5 h-5" />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-200 mb-1">No results found</h3>
                                <p className="text-[11px] text-gray-500 max-w-xs mx-auto">
                                    We couldn't find any intelligence reports matching "{searchQuery}".
                                </p>
                            </div>
                        )}
                    </main>

                    <aside className="lg:col-span-4 space-y-4">
                        {isLoading ? (
                            <SidebarSkeleton />
                        ) : (
                            <PersonalizationPanel />
                        )}

                        <div style={{ background: '#111214', border: '1px solid #1e2025', borderRadius: 6 }} className="p-4 border-dashed">
                            <div className="flex gap-3">
                                <Info className="w-3.5 h-3.5 text-gray-600 mt-0.5 flex-shrink-0" />
                                <p className="text-[9px] text-gray-500 leading-relaxed font-medium uppercase tracking-wider">
                                    Market intelligence is for informational purposes. Trading involves capital risk. Professional consultation is advised.
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

