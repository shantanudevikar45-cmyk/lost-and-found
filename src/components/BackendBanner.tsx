import React from 'react';
import { Database, AlertTriangle, CheckCircle, RefreshCw, Code2, Server } from 'lucide-react';

interface BackendBannerProps {
  isBackendConnected: boolean;
  isChecking: boolean;
  onRetry: () => void;
  onOpenBackendGuide: () => void;
  apiUrl: string;
}

export const BackendBanner: React.FC<BackendBannerProps> = ({
  isBackendConnected,
  isChecking,
  onRetry,
  onOpenBackendGuide,
  apiUrl,
}) => {
  return (
    <div
      className={`border-b transition-colors ${
        isBackendConnected
          ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
          : 'bg-amber-50/90 border-amber-200 text-amber-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          {/* Status Message */}
          <div className="flex items-center space-x-2">
            {isBackendConnected ? (
              <span className="flex items-center space-x-1.5 font-semibold text-emerald-800">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Spring Boot Backend Connected:</span>
                <code className="bg-emerald-100 px-1.5 py-0.5 rounded text-[11px] font-mono text-emerald-900">
                  {apiUrl}
                </code>
              </span>
            ) : (
              <span className="flex items-center space-x-1.5 font-medium text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>
                  <strong>Spring Boot Backend Offline</strong> — Running in <strong>Demo Mode (Sample Records)</strong>.
                  All features are fully interactive.
                </span>
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={onRetry}
              disabled={isChecking}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white text-slate-700 border border-slate-300 font-medium transition cursor-pointer shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
              <span>{isChecking ? 'Checking...' : 'Check Backend (8080)'}</span>
            </button>

            <button
              onClick={onOpenBackendGuide}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition cursor-pointer shadow-2xs"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Spring Boot Source Code & Guide</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
