import { Search, RotateCw } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import type { UserFilters } from "@shared/types/admin/user-management.types";

interface FiltersRowProps {
  onSearch: (search: string) => void;
  onFilterChange: <K extends keyof UserFilters>(key: K, value: UserFilters[K]) => void;
  onRefresh?: () => void;
  currentFilters: UserFilters;
}

export const FiltersRow = ({
  onSearch,
  onFilterChange,
  onRefresh,
  currentFilters,
}: FiltersRowProps) => {

  const debouncedSearch = useDebouncedCallback((value: string) => {
    onSearch(value);
  }, 400);

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Search by name, email, or user ID..."
          defaultValue={currentFilters.search || ""}
          onChange={(e) => debouncedSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[#111111] border border-neutral-800 rounded-lg text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-teal-500/40 transition-colors"
        />
      </div>

      <button
        onClick={onRefresh}
        className="p-2.5 bg-[#111111] border border-neutral-800 rounded-lg text-gray-400 hover:bg-white/5 hover:border-neutral-700 hover:text-gray-300 transition-all"
        title="Refresh data"
      >
        <RotateCw size={18} />
      </button>

      <select
        value={currentFilters.role || ""}
        onChange={(e) => onFilterChange("role", e.target.value || undefined)}
        className="px-4 py-2.5 bg-[#111111] border border-neutral-800 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-teal-500/40 transition-colors"
      >
        <option value="">All Users</option>
        <option value="active">Active Only</option>
        <option value="blocked">Blocked Only</option>
      </select>

      <select
        value={currentFilters.sortBy || "createdAt"}
        onChange={(e) => onFilterChange("sortBy", e.target.value)}
        className="px-4 py-2.5 bg-[#111111] border border-neutral-800 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-teal-500/40 transition-colors"
      >
        <option value="createdAt">Date Joined</option>
        <option value="fullName">Name</option>
        <option value="email">Email</option>
      </select>

      <button
        onClick={() =>
          onFilterChange("sortOrder", currentFilters.sortOrder === "asc" ? "desc" : "asc")
        }
        className="px-4 py-2.5 bg-[#111111] border border-neutral-800 rounded-lg text-sm text-gray-300 hover:bg-white/5 hover:border-neutral-700 transition-all flex items-center gap-2"
      >
        {currentFilters.sortOrder === "asc" ? (
          <span className="text-xs">↑ Asc</span>
        ) : (
          <span className="text-xs">↓ Desc</span>
        )}
      </button>
    </div>
  );
};
