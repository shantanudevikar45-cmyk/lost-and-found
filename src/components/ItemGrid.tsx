import React from 'react';
import { Item } from '../types/item';
import { ItemCard } from './ItemCard';
import { LoadingState } from './LoadingState';
import { EmptyState } from './EmptyState';

interface ItemGridProps {
  items: Item[];
  loading: boolean;
  onViewDetails: (id: number) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  onResetFilters?: () => void;
  onReportClick?: () => void;
}

export const ItemGrid: React.FC<ItemGridProps> = ({
  items,
  loading,
  onViewDetails,
  emptyTitle,
  emptyDescription,
  onResetFilters,
  onReportClick,
}) => {
  if (loading) {
    return <LoadingState message="Fetching campus reports..." cardCount={6} />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title={emptyTitle || 'No items found'}
        description={emptyDescription || 'We could not find any reports matching your search or filters.'}
        onReset={onResetFilters}
        resetText="Reset Filters"
        onAction={onReportClick}
        actionText="Report an Item"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map(item => (
        <ItemCard key={item.id} item={item} onViewDetails={onViewDetails} />
      ))}
    </div>
  );
};
