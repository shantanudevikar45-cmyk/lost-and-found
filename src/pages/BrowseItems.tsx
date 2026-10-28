import React from 'react';
import { SearchFilters } from '../components/SearchFilters';
import { ItemGrid } from '../components/ItemGrid';
import { Item, ItemFilterParams, ItemType } from '../types/item';
import { ChevronLeft, ChevronRight, Layers, PlusCircle } from 'lucide-react';

interface BrowseItemsProps {
  items: Item[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  filters: ItemFilterParams;
  onFilterChange: (filters: ItemFilterParams) => void;
  onResetFilters: () => void;
  onPageChange: (page: number) => void;
  onViewDetails: (id: number) => void;
  onOpenReport: (type: ItemType) => void;
}

export const BrowseItems: React.FC<BrowseItemsProps> = ({
  items,
  totalElements,
  totalPages,
  currentPage,
  loading,
  filters,
  onFilterChange,
  onResetFilters,
  onPageChange,
  onViewDetails,
  onOpenReport,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2.5">
            <Layers className="w-7 h-7 text-indigo-600" />
            <span>Browse Campus Reports</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Search lost and found belongings across all campus locations.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onOpenReport('LOST')}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl transition cursor-pointer shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Lost</span>
          </button>
          <button
            onClick={() => onOpenReport('FOUND')}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition cursor-pointer shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Found</span>
          </button>
        </div>
      </div>

      {/* Search & Multi-criteria Filters */}
      <SearchFilters
        filters={filters}
        onChange={onFilterChange}
        onReset={onResetFilters}
        totalResults={totalElements}
      />

      {/* Grid of Items */}
      <ItemGrid
        items={items}
        loading={loading}
        onViewDetails={onViewDetails}
        onResetFilters={onResetFilters}
        onReportClick={() => onOpenReport('LOST')}
      />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            Page <span className="font-bold text-slate-800">{currentPage + 1}</span> of{' '}
            <span className="font-bold text-slate-800">{totalPages}</span> ({totalElements} total items)
          </p>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 0 || loading}
              className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {/* Page number buttons */}
            <div className="hidden sm:flex items-center space-x-1">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => onPageChange(idx)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer ${
                    currentPage === idx
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1 || loading}
              className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
