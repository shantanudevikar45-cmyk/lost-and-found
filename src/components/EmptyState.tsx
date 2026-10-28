import React from 'react';
import { SearchX, PlusCircle, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  resetText?: string;
  onReset?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No reports found',
  description = 'Try adjusting your search terms or filter criteria to find what you are looking for.',
  actionText,
  onAction,
  resetText,
  onReset,
  icon,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs my-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 mb-4">
        {icon || <SearchX className="w-8 h-8" />}
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">{description}</p>
      
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onReset && (
          <button
            onClick={onReset}
            className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{resetText || 'Clear Filters'}</span>
          </button>
        )}
        {onAction && actionText && (
          <button
            onClick={onAction}
            className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{actionText}</span>
          </button>
        )}
      </div>
    </div>
  );
};
