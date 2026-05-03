import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMarketNews } from "@shared/services/market-new-api/marketNewsApi";

export const useMarketNews = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["market-news", activeCategory, searchQuery, page],
        queryFn: () => getMarketNews({
            query: searchQuery,
            category: activeCategory === "All" ? "" : activeCategory,
            page,
            pageSize
        }), 
    });

    return {
        news: data?.articles || [],
        total: data?.total || 0,
        page,
        setPage,
        pageSize,
        isLoading,
        error,
        refetch,
        searchQuery,
        setSearchQuery: (q: string) => { setSearchQuery(q); setPage(1); },
        activeCategory,
        setActiveCategory: (c: string) => { setActiveCategory(c); setPage(1); }
    };
};
