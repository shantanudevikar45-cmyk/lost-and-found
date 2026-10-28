import React from 'react';
import { ArrowRight, Sparkles, Layers, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Item, ItemType, ReportStats } from '../types/item';
import { HeroSection } from '../components/HeroSection';
import { StatCard } from '../components/StatCard';
import { ItemCard } from '../components/ItemCard';
import { HowItWorks } from '../components/HowItWorks';
import { LoadingState } from '../components/LoadingState';

interface HomeProps {
  items: Item[];
  stats: ReportStats;
  loading: boolean;
  onNavigate: (tab: string) => void;
  onSearch: (query: string) => void;
  onOpenReport: (type: ItemType) => void;
  onViewDetails: (id: number) => void;
}

export const Home: React.FC<HomeProps> = ({
  items,
  stats,
  loading,
  onNavigate,
  onSearch,
  onOpenReport,
  onViewDetails,
}) => {
  // Take the 6 most recent items
  const recentItems = [...items]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-12">
      {/* Hero Section with Quick Search & CTA Buttons */}
      <HeroSection onSearch={onSearch} onOpenReport={onOpenReport} />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Dynamic Metric Summary Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <span>Campus Activity Overview</span>
            </h2>
            <span className="text-xs text-slate-400">Live Backend Metrics</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Active Reports"
              count={stats.totalActive}
              icon={Sparkles}
              variant="blue"
              description="Awaiting return or claim"
              onClick={() => onNavigate('browse')}
            />
            <StatCard
              title="Lost Items"
              count={stats.lostItems}
              icon={ShieldAlert}
              variant="amber"
              description="Reported missing by students"
              onClick={() => onNavigate('browse')}
            />
            <StatCard
              title="Found Items"
              count={stats.foundItems}
              icon={Layers}
              variant="emerald"
              description="Waiting to be claimed"
              onClick={() => onNavigate('browse')}
            />
            <StatCard
              title="Resolved Items"
              count={stats.resolvedItems}
              icon={CheckCircle2}
              variant="slate"
              description="Reunited with owners"
              onClick={() => onNavigate('browse')}
            />
          </div>
        </div>

        {/* Recently Reported Items */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Recently Reported Belongings
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                The latest items lost and found across campus buildings today.
              </p>
            </div>

            <button
              onClick={() => onNavigate('browse')}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
            >
              <span>View All Listings</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <LoadingState message="Loading recent items..." cardCount={6} />
          ) : recentItems.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <p className="text-sm text-slate-500">No reports recorded yet. Be the first to report!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentItems.map(item => (
                <ItemCard key={item.id} item={item} onViewDetails={onViewDetails} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* How It Works 4-Step Section */}
      <HowItWorks />
    </div>
  );
};
