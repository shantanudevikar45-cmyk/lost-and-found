import React, { useState } from 'react';
import { Search, PlusCircle, CheckCircle, MapPin, Sparkles } from 'lucide-react';
import { ItemType } from '../types/item';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  onOpenReport: (type: ItemType) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, onOpenReport }) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput.trim());
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 via-white to-slate-50/50 pt-10 pb-12 border-b border-slate-200/60">
      {/* Subtle decorative background dots */}
      <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Campus Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 text-indigo-700 text-xs font-semibold mb-6 shadow-xs border border-indigo-200/50">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Official Campus Lost & Found Network</span>
        </div>

        {/* Hero Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-3xl mx-auto">
          Lost Something on Campus? <br className="hidden sm:inline" />
          <span className="text-indigo-600">Let's Find It.</span>
        </h1>

        {/* Supporting text */}
        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Report lost belongings, share found items, and help your campus community reconnect with what matters.
        </p>

        {/* Quick Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onOpenReport('LOST')}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-amber-500 hover:bg-amber-600 active:bg-amber-700 shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Report Lost Item</span>
          </button>

          <button
            onClick={() => onOpenReport('FOUND')}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Report Found Item</span>
          </button>
        </div>

        {/* Integrated Quick Search Bar */}
        <div className="mt-8 max-w-2xl mx-auto">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center bg-white rounded-2xl shadow-sm border border-slate-200/90 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition p-1.5"
          >
            <div className="pl-3 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search by item name, keywords, or location (e.g. 'AirPods', 'Library', 'Keys')..."
              className="w-full px-3 py-2 text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs flex items-center space-x-1"
            >
              <span>Search</span>
            </button>
          </form>

          {/* Quick campus spot suggestions */}
          <div className="mt-3 flex items-center justify-center flex-wrap gap-2 text-xs text-slate-500">
            <span className="flex items-center space-x-1 text-slate-400">
              <MapPin className="w-3 h-3" />
              <span>Popular spots:</span>
            </span>
            {['Library', 'Sports Arena', 'Science Complex', 'Cafeteria'].map(loc => (
              <button
                key={loc}
                type="button"
                onClick={() => {
                  setSearchInput(loc);
                  onSearch(loc);
                }}
                className="hover:text-indigo-600 hover:underline cursor-pointer bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600"
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
