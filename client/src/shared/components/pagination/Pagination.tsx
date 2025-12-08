import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
};

export const Pagination = ({ page, limit, total, onPageChange }: PaginationProps) => {
  const totalPages = Math.ceil(total / limit);
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const showPages = 5;

  let start = Math.max(1, page - Math.floor(showPages / 2));
  const end = Math.min(totalPages, start + showPages - 1);

  if (end === totalPages) {
    start = Math.max(1, totalPages - showPages + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-between border-t border-neutral-800 px-6 py-4">
      <p className="text-xs text-gray-500">
        Showing {startItem}–{endItem} of {total.toLocaleString()} results
      </p>

      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className={`p-2 rounded-lg transition ${
            page === 1
              ? "text-gray-600 cursor-not-allowed"
              : "text-gray-400 hover:bg-white/10"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`min-w-10 px-3 py-2 rounded-lg text-xs font-medium transition ${
              page === p
                ? "bg-teal-500/20 border border-teal-500/40 text-teal-400"
                : "text-gray-400 hover:bg-white/10"
            }`}
          >
            {p}
          </button>
        ))}

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className={`p-2 rounded-lg transition ${
            page === totalPages
              ? "text-gray-600 cursor-not-allowed"
              : "text-gray-400 hover:bg-white/10"
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};