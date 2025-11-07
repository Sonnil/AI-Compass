import React from 'react';
import {
  Package,
  ChevronRight,
  CheckCircle,
  BarChart3,
  AlertTriangle,
  Settings
} from 'lucide-react';
import { BRAND } from '../config/branding';

interface QMSProps {
  onBack: () => void;
}

export default function QMS({ onBack }: QMSProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back Button & Title */}
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                style={{ color: BRAND.colors.primary }}
              >
                <ChevronRight className="h-5 w-5 rotate-180" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                    Quality Management System
                  </h1>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Real-time quality metrics & compliance dashboard
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Coming Soon */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          {/* Icon */}
          <div className="mb-8 p-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
            <Package className="h-24 w-24 text-blue-600 dark:text-blue-400" />
          </div>

          {/* Title */}
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Coming Soon
          </h2>

          {/* Description */}
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl">
            The Quality Management System dashboard is currently under development.
            We're building an advanced real-time monitoring and compliance tracking system.
          </p>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-4xl">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-lg">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                  <CheckCircle className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Real-time Metrics
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Live tracking of deviations, CAPAs, and compliance scores
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-lg">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                  <BarChart3 className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Advanced Analytics
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Comprehensive dashboards and trend analysis
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-lg">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white">
                  <AlertTriangle className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Smart Alerts
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Automated notifications for critical quality events
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mt-12 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium shadow-lg">
            <Settings className="h-5 w-5 animate-spin" />
            <span>In Active Development</span>
          </div>
        </div>
      </main>
    </div>
  );
}
