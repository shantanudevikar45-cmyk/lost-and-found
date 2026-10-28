import React, { useState } from 'react';
import {
  UserCheck,
  PlusCircle,
  ShieldCheck,
  Edit3,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Layers,
  MapPin,
  Calendar,
  LogIn,
  Mail,
  User,
} from 'lucide-react';
import { Item, ItemType } from '../types/item';
import { CATEGORY_LABELS } from '../utils/constants';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';

interface MyReportsProps {
  items: Item[];
  onViewDetails: (id: number) => void;
  onEdit: (item: Item) => void;
  onDelete: (id: number) => Promise<void>;
  onResolve: (id: number) => Promise<void>;
  onOpenReport: (type: ItemType) => void;
  onNavigateToLogin?: () => void;
}

export const MyReports: React.FC<MyReportsProps> = ({
  items,
  onViewDetails,
  onEdit,
  onDelete,
  onResolve,
  onOpenReport,
  onNavigateToLogin,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [subTab, setSubTab] = useState<'all' | 'lost' | 'found' | 'active' | 'resolved'>('all');
  const [selectedItemForDelete, setSelectedItemForDelete] = useState<Item | null>(null);
  const [selectedItemForResolve, setSelectedItemForResolve] = useState<Item | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Filter items associated with current user
  const userFirstName = user ? user.name.split(' ')[0].toLowerCase() : '';
  const userEmail = user?.email.toLowerCase() || '';

  const myReports = items.filter(i => {
    if (i.isDemoSession) return true;
    if (userEmail && i.contactEmail && i.contactEmail.toLowerCase() === userEmail) return true;
    if (userFirstName && i.contactName.toLowerCase().includes(userFirstName)) return true;
    return i.id >= 107; // Recent demo reports
  });

  // Sub-filtering by tab
  const displayedReports = myReports.filter(item => {
    if (subTab === 'lost') return item.type === 'LOST';
    if (subTab === 'found') return item.type === 'FOUND';
    if (subTab === 'active') return item.status === 'ACTIVE';
    if (subTab === 'resolved') return item.status === 'RESOLVED';
    return true;
  });

  const handleDeleteConfirm = async () => {
    if (!selectedItemForDelete) return;
    setActionLoading(true);
    try {
      await onDelete(selectedItemForDelete.id);
      setSelectedItemForDelete(null);
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolveConfirm = async () => {
    if (!selectedItemForResolve) return;
    setActionLoading(true);
    try {
      await onResolve(selectedItemForResolve.id);
      setSelectedItemForResolve(null);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2.5">
            <UserCheck className="w-7 h-7 text-indigo-600" />
            <span>My Submitted Reports</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage belongings you reported lost or found during your campus session.
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

      {/* User Status Banner */}
      {isAuthenticated && user ? (
        <div className="bg-indigo-50/80 border border-indigo-200/70 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-indigo-900">
          <div className="flex items-center space-x-3">
            <img
              src={
                user.avatar ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`
              }
              alt={user.name}
              className="w-12 h-12 rounded-xl object-cover border border-indigo-200 flex-shrink-0"
            />
            <div>
              <p className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                <span>{user.name}</span>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-bold">
                  {user.provider === 'google' ? 'Google Account' : 'Campus User'}
                </span>
              </p>
              <p className="text-xs text-slate-500">{user.email} • {user.studentId || user.role}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onNavigateToLogin}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-indigo-100 text-xs transition cursor-pointer"
            >
              Switch Account
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 font-bold">
              ?
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900">You are browsing as a Guest</p>
              <p className="text-xs text-slate-500">
                Sign in with your campus Google account to associate and manage your personal reports.
              </p>
            </div>
          </div>

          {onNavigateToLogin && (
            <button
              onClick={onNavigateToLogin}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition cursor-pointer flex items-center space-x-1.5 flex-shrink-0"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with Google</span>
            </button>
          )}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center overflow-x-auto gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'all', label: `All Reports (${myReports.length})` },
          { id: 'lost', label: `My Lost (${myReports.filter(i => i.type === 'LOST').length})` },
          { id: 'found', label: `My Found (${myReports.filter(i => i.type === 'FOUND').length})` },
          { id: 'active', label: `Active (${myReports.filter(i => i.status === 'ACTIVE').length})` },
          { id: 'resolved', label: `Resolved (${myReports.filter(i => i.status === 'RESOLVED').length})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              subTab === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reports List */}
      {displayedReports.length === 0 ? (
        <EmptyState
          title="No reports in this category"
          description="You haven't submitted any reports matching this filter yet."
          actionText="Create a Report"
          onAction={() => onOpenReport('LOST')}
        />
      ) : (
        <div className="space-y-4">
          {displayedReports.map(item => {
            const isLost = item.type === 'LOST';
            const isResolved = item.status === 'RESOLVED';

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-indigo-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Left side: Item image & info */}
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                    <img
                      src={
                        item.imageUrl ||
                        (isLost
                          ? 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80'
                          : 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80')
                      }
                      alt={item.itemName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          isLost ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.type}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {CATEGORY_LABELS[item.category] || item.category}
                      </span>
                      {isResolved ? (
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold border border-slate-200 flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Resolved</span>
                        </span>
                      ) : (
                        <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold border border-blue-200">
                          Active Listing
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 truncate">
                      {item.itemName}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-2">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.location}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.incidentDate}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side: Action buttons */}
                <div className="flex items-center space-x-2 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    onClick={() => onViewDetails(item.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer flex items-center space-x-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>

                  <button
                    onClick={() => onEdit(item)}
                    className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition cursor-pointer flex items-center space-x-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  {!isResolved && (
                    <button
                      onClick={() => setSelectedItemForResolve(item)}
                      className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition cursor-pointer flex items-center space-x-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Resolve</span>
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedItemForDelete(item)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                    title="Delete report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modals */}
      <ConfirmDialog
        isOpen={Boolean(selectedItemForResolve)}
        title="Mark Report as Resolved?"
        message={`Mark "${selectedItemForResolve?.itemName}" as returned/resolved?`}
        confirmText="Confirm Resolved"
        variant="success"
        loading={actionLoading}
        onConfirm={handleResolveConfirm}
        onCancel={() => setSelectedItemForResolve(null)}
      />

      <ConfirmDialog
        isOpen={Boolean(selectedItemForDelete)}
        title="Delete Report?"
        message={`Are you sure you want to delete report #${selectedItemForDelete?.id} ("${selectedItemForDelete?.itemName}")?`}
        confirmText="Delete"
        variant="danger"
        loading={actionLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setSelectedItemForDelete(null)}
      />
    </div>
  );
};
