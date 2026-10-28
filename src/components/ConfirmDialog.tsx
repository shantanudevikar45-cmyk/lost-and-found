import React from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'success' | 'indigo';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const colorStyles = {
    danger: {
      iconBg: 'bg-red-50 text-red-600',
      btn: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
      icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
    },
    success: {
      iconBg: 'bg-emerald-50 text-emerald-600',
      btn: 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500',
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
    },
    indigo: {
      iconBg: 'bg-indigo-50 text-indigo-600',
      btn: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500',
      icon: <AlertTriangle className="w-6 h-6 text-indigo-600" />,
    },
  }[variant];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onCancel}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          className="relative transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all w-full max-w-md border border-slate-200"
        >
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start space-x-4">
            <div className={`flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-xl ${colorStyles.iconBg}`}>
              {colorStyles.icon}
            </div>
            <div className="mt-1">
              <h3 className="text-lg font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">{message}</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              disabled={loading}
              onClick={onCancel}
              className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition cursor-pointer"
            >
              {cancelText}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={onConfirm}
              className={`px-4 py-2 text-sm font-semibold rounded-xl shadow-xs transition cursor-pointer flex items-center space-x-2 ${colorStyles.btn}`}
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              <span>{confirmText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
