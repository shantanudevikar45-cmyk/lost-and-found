import React, { useState } from 'react';
import { MapPin, Calendar, CheckCircle2, ArrowRight, Tag, AlertCircle } from 'lucide-react';
import { Item } from '../types/item';
import { CATEGORY_LABELS } from '../utils/constants';

interface ItemCardProps {
  item: Item;
  onViewDetails: (id: number) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onViewDetails }) => {
  const [imgError, setImgError] = useState(false);

  const isLost = item.type === 'LOST';
  const isResolved = item.status === 'RESOLVED';

  // Fallback placeholder image when none is provided or failed to load
  const fallbackSvg = isLost
    ? 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80'
    : 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80';

  const displayImage = !imgError && item.imageUrl ? item.imageUrl : fallbackSvg;

  const formattedDate = new Date(item.incidentDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Card Image Area */}
      <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
        <img
          src={displayImage}
          alt={item.itemName}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient overlay for badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

        {/* Type Badge (Lost = Orange, Found = Green) */}
        <div className="absolute top-3 left-3">
          {isLost ? (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-amber-500 text-white shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>LOST</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-600 text-white shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>FOUND</span>
            </span>
          )}
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          {isResolved ? (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900/80 text-emerald-300 backdrop-blur-xs border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Resolved</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900/70 text-slate-200 backdrop-blur-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span>Active</span>
            </span>
          )}
        </div>

        {/* Demo session indicator if added during this session */}
        {item.isDemoSession && (
          <div className="absolute bottom-2 left-3">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-900/80 text-indigo-200 backdrop-blur-xs">
              My Demo Report
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Tag */}
          <div className="flex items-center space-x-1.5 text-xs font-medium text-slate-500 mb-2">
            <Tag className="w-3.5 h-3.5 text-indigo-500" />
            <span>{CATEGORY_LABELS[item.category] || item.category}</span>
          </div>

          {/* Item Title */}
          <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {item.itemName}
          </h3>

          {/* Short Description */}
          <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* Metadata: Location & Date */}
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center space-x-2 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="truncate" title={item.location}>
                {item.location}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span>Incident: {formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-5 pt-3">
          <button
            onClick={() => onViewDetails(item.id)}
            className="w-full inline-flex items-center justify-center space-x-1.5 py-2 px-3 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-xl transition duration-200 cursor-pointer"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
