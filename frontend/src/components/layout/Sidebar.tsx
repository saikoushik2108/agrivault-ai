import React from 'react';
import {
  LayoutDashboard, Activity, Box, ShieldAlert,
  Volume2, History, Bell, Settings, CheckCircle2
} from 'lucide-react';
import { useAgrivaultStore } from '../../store/storageStore';
import { ActiveTab } from '../../types';

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  onClickOverride?: () => void;
}

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    alerts,
    open3DModal,
    openSystemStatus
  } = useAgrivaultStore();

  const unackCount = alerts.filter((a) => !a.acknowledged).length;

  const primaryItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'monitoring', label: 'Monitoring', icon: Activity },
    {
      id: 'twin',
      label: '3D Digital Twin',
      icon: Box,
      onClickOverride: () => open3DModal()
    },
    { id: 'risk', label: 'Risk Intelligence', icon: ShieldAlert },
    { id: 'acoustic', label: 'Acoustic', icon: Volume2 },
    { id: 'history', label: 'History', icon: History },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: Bell,
      badge: unackCount > 0 ? `${unackCount}` : undefined
    }
  ];

  const handleNavClick = (item: NavItem) => {
    if (item.onClickOverride) {
      item.onClickOverride();
    } else {
      setActiveTab(item.id);
    }
  };

  return (
    <aside className="w-60 bg-white border-r border-slate-200 flex flex-col h-[calc(100vh-4rem)] select-none shrink-0 overflow-y-auto">
      {/* Primary Navigation */}
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Platform
        </div>

        {primaryItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-900' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 leading-none">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Secondary Navigation */}
      <div className="mt-auto p-3 border-t border-slate-100 space-y-1">
        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'settings'
              ? 'bg-slate-100 text-slate-900 font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Settings className="w-4 h-4 text-slate-500" />
          <span>Settings</span>
        </button>

        <button
          onClick={openSystemStatus}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>System Status</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </button>
      </div>
    </aside>
  );
};
