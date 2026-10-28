import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  cardCount?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading campus reports...',
  cardCount = 6,
}) => {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-center space-x-2 text-indigo-600 mb-8">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="text-sm font-medium text-slate-600">{message}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: cardCount }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200/80 p-4 animate-pulse shadow-xs"
          >
            <div className="w-full h-48 bg-slate-200 rounded-xl mb-4" />
            <div className="flex items-center justify-between mb-3">
              <div className="h-5 bg-slate-200 rounded-full w-24" />
              <div className="h-5 bg-slate-200 rounded-md w-16" />
            </div>
            <div className="h-6 bg-slate-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-slate-200 rounded w-full mb-1" />
            <div className="h-4 bg-slate-200 rounded w-2/3 mb-4" />
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="h-4 bg-slate-200 rounded w-20" />
              <div className="h-8 bg-slate-200 rounded-lg w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
