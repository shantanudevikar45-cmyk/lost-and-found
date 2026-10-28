import React from 'react';
import { Search, RotateCcw, Filter, MapPin, Tag, Activity } from 'lucide-react';
import { ItemCategory, ItemFilterParams, ItemStatus, ItemType } from '../types/item';
import { CATEGORIES, CAMPUS_LOCATIONS } from '../utils/constants';

interface SearchFiltersProps {
  filters: ItemFilterParams;
  onChange: (newFilters: ItemFilterParams) => void;
  onReset: () => void;
  totalResults?: number;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onChange,
  onReset,
  totalResults,
}) => {
  const hasActiveFilters = Boolean(
    filters.search || filters.type || filters.category || filters.location || filters.status
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs mb-8">
      {/* Top row: Search input & Type toggle */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Search bar */}
        <div className="md:col-span-7 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={filters.search || ''}
            onChange={e => onChange({ ...filters, search: e.target.value, page: 0 })}
            placeholder="Search items by name, keywords, or description..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
          />
        </div>

        {/* Type selector (All / Lost / Found) */}
        <div className="md:col-span-5 flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => onChange({ ...filters, type: '', page: 0 })}
            className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg transition cursor-pointer text-center ${
              !filters.type ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Reports
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...filters, type: 'LOST', page: 0 })}
            className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg transition cursor-pointer text-center ${
              filters.type === 'LOST'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-amber-700 hover:bg-amber-100/50'
            }`}
          >
            Lost Items
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...filters, type: 'FOUND', page: 0 })}
            className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg transition cursor-pointer text-center ${
              filters.type === 'FOUND'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-700 hover:bg-emerald-100/50'
            }`}
          >
            Found Items
          </button>
        </div>
      </div>

      {/* Second row: Dropdowns for Category, Location, Status + Clear button */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
        {/* Category Dropdown */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
            <Tag className="w-3 h-3 text-indigo-500" />
            <span>Category</span>
          </label>
          <select
            value={filters.category || ''}
            onChange={e => onChange({ ...filters, category: (e.target.value as ItemCategory) || '', page: 0 })}
            className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 transition"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Location Dropdown */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            <span>Campus Location</span>
          </label>
          <select
            value={filters.location || ''}
            onChange={e => onChange({ ...filters, location: e.target.value, page: 0 })}
            className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 transition"
          >
            <option value="">All Locations</option>
            {CAMPUS_LOCATIONS.map(loc => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Status Dropdown */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
            <Activity className="w-3 h-3 text-slate-400" />
            <span>Status</span>
          </label>
          <select
            value={filters.status || ''}
            onChange={e => onChange({ ...filters, status: (e.target.value as ItemStatus) || '', page: 0 })}
            className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 transition"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="RESOLVED">Resolved Only</option>
          </select>
        </div>

        {/* Actions row: Reset Filters & Result count */}
        <div className="flex items-end justify-between sm:col-span-2 lg:col-span-1 space-x-2">
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={onReset}
              className="w-full py-2 px-3 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition flex items-center justify-center space-x-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          ) : (
            <div className="w-full py-2 px-3 text-xs text-slate-400 bg-slate-50 rounded-xl flex items-center justify-center space-x-1 border border-slate-100">
              <Filter className="w-3.5 h-3.5" />
              <span>Filtering Ready</span>
            </div>
          )}
        </div>
      </div>

      {/* Result Counter Pill */}
      {totalResults !== undefined && (
        <div className="mt-3 pt-2 text-xs text-slate-500 flex items-center justify-between">
          <span>
            Showing <strong className="text-slate-800">{totalResults}</strong> {totalResults === 1 ? 'item' : 'items'}
          </span>
          {hasActiveFilters && (
            <span className="text-[11px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
              Filtered
            </span>
          )}
        </div>
      )}
    </div>
  );
};
