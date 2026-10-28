import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  count: number;
  icon: LucideIcon;
  variant: 'blue' | 'amber' | 'emerald' | 'slate';
  description?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  count,
  icon: Icon,
  variant,
  description,
  onClick,
}) => {
  const styles = {
    blue: {
      bg: 'bg-blue-50/70',
      iconBg: 'bg-blue-600 text-white',
      border: 'border-blue-100 hover:border-blue-300',
      accent: 'text-blue-600',
    },
    amber: {
      bg: 'bg-amber-50/70',
      iconBg: 'bg-amber-500 text-white',
      border: 'border-amber-100 hover:border-amber-300',
      accent: 'text-amber-600',
    },
    emerald: {
      bg: 'bg-emerald-50/70',
      iconBg: 'bg-emerald-600 text-white',
      border: 'border-emerald-100 hover:border-emerald-300',
      accent: 'text-emerald-600',
    },
    slate: {
      bg: 'bg-slate-50',
      iconBg: 'bg-slate-600 text-white',
      border: 'border-slate-200 hover:border-slate-300',
      accent: 'text-slate-600',
    },
  }[variant];

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border ${styles.border} p-5 shadow-xs transition-all duration-200 flex items-center justify-between ${
        onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''
      }`}
    >
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        <h4 className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">{count}</h4>
        {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-xs ${styles.iconBg}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};
