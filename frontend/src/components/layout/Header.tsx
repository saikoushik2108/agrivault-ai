import React from 'react';
import {
  Bell, User, CheckCircle2, RefreshCw
} from 'lucide-react';
import { useAgrivaultStore } from '../../store/storageStore';

export const Header: React.FC = () => {
  const {
    alerts,
    setActiveTab,
    demoMode,
    openSystemStatus
  } = useAgrivaultStore();

  const unackAlerts = alerts.filter((a) => !a.acknowledged);

  return (
    <header className="h-16 px-4 sm:px-6 bg-white border-b border-slate-200 flex items-center justify-between z-30 select-none shadow-xs">
      {/* Brand & Subtitle */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm shadow-xs">
          AV
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
              Agrivault AI
            </h1>
            {demoMode && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide uppercase bg-slate-100 text-slate-600 border border-slate-200">
                Demo Mode
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 hidden sm:block">
            AI-Powered Grain Storage Intelligence
          </p>
        </div>
      </div>

      {/* Status, Sync & Actions */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Interactive System Status Button */}
        <button
          onClick={openSystemStatus}
          title="Click to view full System Status & Diagnostics"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-900">System Status:</span>
          <span className="text-emerald-700">Operational</span>
        </button>

        {/* Last synchronized indicator */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500">
          <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
          <span>Synced: 2 min ago</span>
        </div>

        {/* Alerts Pill */}
        <button
          onClick={() => setActiveTab('alerts')}
          title="View Alerts"
          className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unackAlerts.length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-600" />
          )}
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <button
            onClick={() => setActiveTab('settings')}
            title="User Profile & Facility Settings"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-700 transition-colors"
          >
            <User className="w-4 h-4" />
          </button>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-900 leading-tight">Operator Miller</p>
            <p className="text-[11px] text-slate-500 leading-tight">Silo #01 • Wheat</p>
          </div>
        </div>
      </div>
    </header>
  );
};
