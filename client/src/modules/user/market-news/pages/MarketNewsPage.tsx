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
        <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans pb-12">
            <div className="max-w-[1400px] mx-auto p-[20px_24px] flex flex-col gap-4">

                {/* Page Header */}
                <header className="flex items-center justify-between mb-2">
                    <div>
                        <h1 className="text-2xl font-semibold text-[#e8eaed] tracking-tight m-0">
                            Market Intelligence
                        </h1>
                        <p className="text-sm text-[#5a5f6e] mt-1 m-0 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                            Real-time updates from global financial markets
                        </p>
                    </div>

                    <div className="relative w-full md:w-72 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#5a5f6e] group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full text-sm text-[#e8eaed] rounded-md py-2 pl-9 pr-4 bg-[#111214] border border-[#1e2025] focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-[#5a5f6e]"
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
                            <div className="bg-[#111214] border border-[#1e2025] p-12 text-center rounded-md">
                                <p className="text-sm text-[#5a5f6e] font-medium mb-4">
                                    Connection to news intelligence lost.
                                </p>
                                <button
                                    onClick={() => refetch()}
                                    className="px-5 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-md text-xs font-semibold hover:bg-red-500/20 transition-colors inline-flex items-center gap-2 uppercase tracking-wider"
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
                                    <p className="text-xs font-medium uppercase tracking-widest text-[#5a5f6e]">
                                        Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total} reports
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            disabled={page === 1}
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            className="px-3 py-1.5 rounded bg-[#111214] border border-[#1e2025] text-xs font-medium text-[#9ca3af] disabled:opacity-30 disabled:cursor-not-allowed hover:text-[#e8eaed] hover:border-[#2a2d35] transition-colors"
                                        >
                                            Prev
                                        </button>
                                        <div className="px-3 py-1.5 text-xs font-medium text-[#9ca3af] bg-[#111214] rounded border border-[#1e2025]">
                                            {page} / {totalPages}
                                        </div>
                                        <button
                                            disabled={page >= totalPages}
                                            onClick={() => setPage(p => p + 1)}
                                            className="px-3 py-1.5 rounded bg-[#111214] border border-[#1e2025] text-xs font-medium text-[#9ca3af] disabled:opacity-30 disabled:cursor-not-allowed hover:text-[#e8eaed] hover:border-[#2a2d35] transition-colors"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-[#111214] border border-[#1e2025] p-16 text-center rounded-md">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1a1a1a] text-[#5a5f6e] mb-5">
                                    <Search className="w-5 h-5" />
                                </div>
                                <h3 className="text-sm font-semibold text-[#e8eaed] mb-1">No results found</h3>
                                <p className="text-xs text-[#5a5f6e] max-w-xs mx-auto font-normal">
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

                        <div className="bg-[#111214] border border-[#1e2025] border-dashed p-4 rounded-md">
                            <div className="flex gap-3 items-start">
                                <Info className="w-3.5 h-3.5 text-[#5a5f6e] mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-[#5a5f6e] leading-relaxed font-normal">
                                    Market intelligence is for informational purposes only. Trading involves capital risk. Professional consultation is advised.
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}