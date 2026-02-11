import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMarketNews } from "@shared/services/market-new-api/marketNewsApi";
import { NewsCard } from "@modules/user/market-news/components/NewsCard";
import { MarketSnapshotBar } from "@modules/user/market-news/components/MarketSnapshotBar";
import { CategoryNav } from "@modules/user/market-news/components/CategoryNav";
import { PersonalizationPanel } from "@modules/user/market-news/components/PersonalizationPanel";
import { NewsSkeleton, SidebarSkeleton } from "@modules/user/market-news/components/NewsSkeleton";
import { Search, Info, RefreshCw } from "lucide-react";
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/market-news')({
  component: MarketNewsPage,
})

function MarketNewsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const { data: news, isLoading, error, refetch } = useQuery({
    queryKey: ["market-news", activeCategory, searchQuery],
    queryFn: () => getMarketNews({
      query: searchQuery,
      category: activeCategory === "All" ? "" : activeCategory
    }),
  });

  const filteredNews = news || [];

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <MarketSnapshotBar />

      <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 mt-2">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              Market News
            </h1>
            <p className="text-gray-400 text-sm sm:text-base font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              Real-time updates from global financial markets
            </p>
          </div>

          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#3B82F6] transition-colors" />
            <input
              type="text"
              placeholder="Search by keyword, stock..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111111] border border-[#2d2d2d] text-gray-200 text-sm rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30 focus:border-[#3B82F6] transition-all"
            />
          </div>
        </header>

        <CategoryNav
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 mt-4">

          <main className="lg:col-span-7 space-y-6">
            {isLoading ? (
              <NewsSkeleton />
            ) : error ? (
              <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8 text-center">
                <p className="text-red-400 font-medium mb-4">Something went wrong while fetching market news.</p>
                <button
                  onClick={() => refetch()}
                  className="px-6 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-colors inline-flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> Try Again
                </button>
              </div>
            ) : filteredNews.length > 0 ? (
              <div className="space-y-5">
                {filteredNews.map((item) => (
                  <NewsCard key={item.url} news={item} />
                ))}
              </div>
            ) : (
              <div className="bg-black border border-[#2d2d2d] rounded-3xl p-16 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#111111] text-gray-500 mb-6">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-200 mb-2">No news found</h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                  We couldn't find any news matching "{searchQuery}" in the {activeCategory} category.
                </p>
                <button
                  onClick={() => { setSearchQuery(""); setActiveCategory("All") }}
                  className="mt-6 text-[#3B82F6] font-bold text-sm hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </main>

          <aside className="lg:col-span-3">
            {isLoading ? (
              <SidebarSkeleton />
            ) : (
              <PersonalizationPanel />
            )}

            <div className="mt-8 p-4 rounded-xl bg-[#111111]/50 border border-[#2d2d2d] border-dashed">
              <div className="flex gap-3">
                <div className="mt-0.5"><Info className="w-4 h-4 text-gray-600 flex-shrink-0" /></div>
                <p className="text-[10px] text-gray-500 leading-relaxed font-medium uppercase tracking-tight">
                  Trading involves high risk. Information provided is for educational purposes only and does not constitute financial advice.
                </p>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
