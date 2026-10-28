import React from 'react';
import { FileEdit, Search, MessageSquare, CheckCircle } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Report an Item',
      description: 'Fill out a quick report with item details, category, campus location, and an optional photo.',
      icon: FileEdit,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    },
    {
      step: '02',
      title: 'Browse Matching Reports',
      description: 'Filter through campus lost and found listings by keywords, building locations, and incident dates.',
      icon: Search,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
    },
    {
      step: '03',
      title: 'Contact & Verify Ownership',
      description: 'Connect with the reporter safely and verify item details before arranging a public campus meetup.',
      icon: MessageSquare,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
    },
    {
      step: '04',
      title: 'Mark as Resolved',
      description: 'Once reunited, update the report status to Resolved so fellow students know the item is accounted for.',
      icon: CheckCircle,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
  ];

  return (
    <section className="py-14 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How CampusFind Works
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-500">
            A simple, secure four-step workflow designed specifically for campus students and staff.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(s => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="bg-slate-50/70 rounded-2xl p-6 border border-slate-200/80 relative hover:border-indigo-300 transition-all hover:bg-white hover:shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${s.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-black text-slate-300 tracking-wider">
                    {s.step}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{s.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl max-w-2xl mx-auto text-center">
          <p className="text-xs text-indigo-900 font-medium">
            💡 <strong>Note on Status:</strong> An item remains listed as Active until the reporter marks it as
            Resolved. Always arrange handovers in well-lit public spots like the Library or Student Center desk.
          </p>
        </div>
      </div>
    </section>
  );
};
