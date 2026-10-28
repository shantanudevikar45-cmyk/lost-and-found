import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Tag,
  CheckCircle2,
  Clock,
  ShieldCheck,
  User,
  Mail,
  Phone,
  Edit3,
  Trash2,
  Share2,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { Item } from '../types/item';
import { CATEGORY_LABELS } from '../utils/constants';
import { ConfirmDialog } from './ConfirmDialog';

interface ItemDetailsProps {
  item: Item;
  onBack: () => void;
  onEdit: (item: Item) => void;
  onDelete: (id: number) => Promise<void>;
  onResolve: (id: number) => Promise<void>;
  loading?: boolean;
}

export const ItemDetails: React.FC<ItemDetailsProps> = ({
  item,
  onBack,
  onEdit,
  onDelete,
  onResolve,
  loading = false,
}) => {
  const [imgError, setImgError] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isLost = item.type === 'LOST';
  const isResolved = item.status === 'RESOLVED';

  const fallbackSvg = isLost
    ? 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80'
    : 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80';

  const displayImage = !imgError && item.imageUrl ? item.imageUrl : fallbackSvg;

  const formattedIncidentDate = new Date(item.incidentDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedReportDate = new Date(item.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleResolveConfirm = async () => {
    setActionLoading(true);
    setErrorMessage(null);
    try {
      await onResolve(item.id);
      setShowResolveModal(false);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setErrorMessage(error.message || 'Failed to mark report as resolved');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setActionLoading(true);
    setErrorMessage(null);
    try {
      await onDelete(item.id);
      setShowDeleteModal(false);
      onBack();
    } catch (err: unknown) {
      const error = err as { message?: string };
      setErrorMessage(error.message || 'Failed to delete report');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Top back button & Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Browse</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyLink}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition cursor-pointer"
            title="Share report"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onEdit(item)}
            className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 rounded-xl hover:bg-rose-100 transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden">
        {/* Large Image Header */}
        <div className="relative w-full h-80 sm:h-96 bg-slate-900 overflow-hidden">
          <img
            src={displayImage}
            alt={item.itemName}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

          {/* Badges Overlay */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {isLost ? (
              <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-amber-500 text-white shadow-md">
                LOST ITEM
              </span>
            ) : (
              <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-emerald-600 text-white shadow-md">
                FOUND ITEM
              </span>
            )}

            {isResolved ? (
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-slate-900/90 text-emerald-300 border border-emerald-500/40 backdrop-blur-xs flex items-center space-x-1 shadow-md">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>RESOLVED / REUNITED</span>
              </span>
            ) : (
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-md">
                ACTIVE LISTING
              </span>
            )}
          </div>

          {/* Title on banner */}
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex items-center space-x-2 text-xs font-medium text-slate-300 mb-1">
              <Tag className="w-3.5 h-3.5 text-indigo-300" />
              <span>{CATEGORY_LABELS[item.category] || item.category}</span>
              <span>•</span>
              <span>Report #{item.id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {item.itemName}
            </h1>
          </div>
        </div>

        {/* Details Content */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Status Alert Banner if resolved */}
          {isResolved ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start space-x-3 text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm">This report has been marked as Resolved</p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  The item was successfully returned to its rightful owner. Thank you for helping keep our campus connected!
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex items-start space-x-3 text-blue-900">
              <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <span className="font-bold">Active Campus Investigation:</span> If this item belongs to you or you have information, please contact the reporter below. Verify ownership by describing subtle details before meeting.
              </div>
            </div>
          )}

          {/* Key Incident Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
                <MapPin className="w-4 h-4 text-indigo-500" />
                <span>Incident Location</span>
              </div>
              <p className="text-sm font-bold text-slate-900">{item.location}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
                <Calendar className="w-4 h-4 text-indigo-500" />
                <span>Date of Incident</span>
              </div>
              <p className="text-sm font-bold text-slate-900">{formattedIncidentDate}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
                <Clock className="w-4 h-4 text-indigo-500" />
                <span>Published On</span>
              </div>
              <p className="text-sm font-bold text-slate-900">{formattedReportDate}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              Item Description & Distinguishing Features
            </h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/60 p-5 rounded-2xl border border-slate-100">
              {item.description}
            </p>
          </div>

          {/* Actions Section */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Primary Contact CTA */}
            <button
              onClick={() => setShowContactModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>Contact Reporter</span>
            </button>

            {/* Resolve button (available if active) */}
            {!isResolved ? (
              <button
                onClick={() => setShowResolveModal(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3 text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark as Resolved / Returned</span>
              </button>
            ) : (
              <span className="text-xs text-slate-500 italic">
                Report is closed. No further actions needed.
              </span>
            )}
          </div>

          {/* Ownership limitation note */}
          <div className="p-3 bg-slate-50 rounded-xl text-center text-[11px] text-slate-500">
            <strong>Campus Notice:</strong> In this college project version without a central login system, reports can be managed in demo mode or directly via Spring Boot backend API.
          </div>
        </div>
      </div>

      {/* Contact Reporter Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setShowContactModal(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl p-6 shadow-xl w-full max-w-md border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-1">Contact Reporter</h3>
              <p className="text-xs text-slate-500 mb-4">
                Reach out to coordinate item verification and arrange a safe public handover.
              </p>

              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                <div className="flex items-center space-x-3 text-sm text-slate-700">
                  <User className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <span className="font-semibold">{item.contactName}</span>
                </div>

                {item.contactEmail && (
                  <div className="flex items-center justify-between text-sm text-slate-700">
                    <div className="flex items-center space-x-3 truncate">
                      <Mail className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                      <a
                        href={`mailto:${item.contactEmail}?subject=CampusFind: Regarding ${item.itemName}`}
                        className="text-indigo-600 hover:underline truncate"
                      >
                        {item.contactEmail}
                      </a>
                    </div>
                  </div>
                )}

                {item.contactPhone && (
                  <div className="flex items-center space-x-3 text-sm text-slate-700">
                    <Phone className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    <a href={`tel:${item.contactPhone}`} className="text-indigo-600 hover:underline">
                      {item.contactPhone}
                    </a>
                  </div>
                )}

                {!item.contactEmail && !item.contactPhone && (
                  <p className="text-xs text-slate-500 italic">
                    The reporter did not provide phone or email. Please check with campus security or the {item.location} desk.
                  </p>
                )}
              </div>

              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-800 mb-5">
                🔒 <strong>Campus Safety Tip:</strong> Always meet during daylight in public campus areas (Library entrance, Student Union, or Campus Security office). Never share passwords or PIN numbers.
              </div>

              <button
                onClick={() => setShowContactModal(false)}
                className="w-full py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={showResolveModal}
        title="Mark Item as Resolved?"
        message={`Are you sure you want to mark "${item.itemName}" as resolved? This confirms that the owner has been found or the item was safely returned.`}
        confirmText="Mark as Resolved"
        variant="success"
        loading={actionLoading}
        onConfirm={handleResolveConfirm}
        onCancel={() => setShowResolveModal(false)}
      />

      <ConfirmDialog
        isOpen={showDeleteModal}
        title="Delete this Report?"
        message={`Are you sure you want to permanently delete report #${item.id} ("${item.itemName}")? This action cannot be undone.`}
        confirmText="Delete Report"
        variant="danger"
        loading={actionLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};
