import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  unit?: string;
};

export const Pagination = ({
  page,
  limit,
  total,
  totalPages: totalPagesProp,
  onPageChange,
  isLoading = false,
  unit = "results",
}: PaginationProps) => {
  const totalPages = totalPagesProp ?? Math.ceil(total / limit);
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  if (totalPages <= 1 && total <= limit) return null;

  return (
    <div className="p-4 border-t border-[#1e2025] flex justify-between items-center text-[11px] text-[#5a5f6e] bg-[#111214]">
      <div className="font-medium bg-[#1a1c20] px-2 py-1 rounded">
        Showing <span className="text-white">{startItem}–{endItem}</span> of{" "}
        <span className="text-white">{total.toLocaleString()}</span> {unit}
      </div>
      <div className="flex gap-1.5 items-center">
        <span className="mr-2">Page {page} of {totalPages}</span>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1 || isLoading}
          className="p-1.5 bg-[#1a1c20] border border-[#1e2025] text-[#5a5f6e] hover:text-white disabled:opacity-30 disabled:hover:text-[#5a5f6e] rounded-md transition-all shadow-sm"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages || isLoading}
          className="p-1.5 bg-[#1a1c20] border border-[#1e2025] text-[#5a5f6e] hover:text-white disabled:opacity-30 disabled:hover:text-[#5a5f6e] rounded-md transition-all shadow-sm"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};