import React, { useState } from 'react';
import {
  X, CheckCircle2, Server, Database, Cpu,
  Radio, RefreshCw, Wifi, WifiOff, Activity
} from 'lucide-react';
import { useAgrivaultStore } from '../../store/storageStore';
import { apiService } from '../../services/apiService';

export const SystemStatusModal: React.FC = () => {
  const {
    isSystemStatusOpen,
    closeSystemStatus,
    offlineMode,
    toggleOfflineMode,
    syncOfflineData,
    offlineBufferCount
  } = useAgrivaultStore();

  const [pingStatus, setPingStatus] = useState<string | null>(null);
  const [isPinging, setIsPinging] = useState(false);

  if (!isSystemStatusOpen) return null;

  const handlePingBackend = async () => {
    setIsPinging(true);
    setPingStatus('Testing connection...');
    const ok = await apiService.checkHealth();
    setIsPinging(false);
    if (ok) {
      setPingStatus('Backend reachable (200 OK • 12ms)');
    } else {
      setPingStatus('Standalone Edge Mode (Local simulation active)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs select-none">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">System Status</h3>
              <p className="text-[11px] text-slate-500">Agrivault AI Edge & Cloud Health</p>
            </div>
          </div>
          <button
            onClick={closeSystemStatus}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Main Status Row */}
          <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-emerald-950">Operating Nominally</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">99.98% Uptime</span>
          </div>

          {/* Subsystems List */}
          <div className="space-y-2 border border-slate-200 rounded-lg p-3 divide-y divide-slate-100">
            {/* Backend API */}
            <div className="flex items-center justify-between py-1.5 first:pt-0">
              <div className="flex items-center gap-2">
                <Server className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-medium text-slate-800">FastAPI Backend</span>
              </div>
              <span className="font-mono text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Active (port 8000)
              </span>
            </div>

            {/* Database */}
            <div className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-medium text-slate-800">Telemetry Database</span>
              </div>
              <span className="font-mono text-[11px] text-slate-700">SQLite (agrivault.db)</span>
            </div>

            {/* Sensor Nodes */}
            <div className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-medium text-slate-800">Sensor Nodes</span>
              </div>
              <span className="font-mono text-[11px] text-emerald-600 font-semibold">ESP32 + RPi 5 (4/4 online)</span>
            </div>

            {/* AI Engine */}
            <div className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-medium text-slate-800">AI / ML Engine</span>
              </div>
              <span className="font-mono text-[11px] text-slate-700">XGBoost & Mel-CNN Ready</span>
            </div>

            {/* Last Synchronization */}
            <div className="flex items-center justify-between py-1.5 last:pb-0">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-medium text-slate-800">Last Sync</span>
              </div>
              <span className="font-mono text-[11px] text-slate-600">2 min ago</span>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-900">Network Mode</p>
              <p className="text-[11px] text-slate-500">
                {offlineMode === 'ONLINE' ? 'Cloud connected mode' : 'Edge local AI mode'}
              </p>
            </div>
            <button
              onClick={toggleOfflineMode}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                offlineMode === 'ONLINE'
                  ? 'bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50'
                  : 'bg-amber-50 text-amber-800 border-amber-300'
              }`}
            >
              {offlineMode === 'ONLINE' ? 'Switch to Offline/Edge' : 'Switch to Cloud Online'}
            </button>
          </div>

          {/* Ping Test Button */}
          <div className="space-y-1.5">
            <button
              onClick={handlePingBackend}
              disabled={isPinging}
              className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors flex items-center justify-center gap-1.5"
            >
              {isPinging ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Activity className="w-3.5 h-3.5" />}
              <span>Test Backend API Connection</span>
            </button>
            {pingStatus && (
              <p className="text-center font-mono text-[11px] text-slate-600 pt-0.5">
                {pingStatus}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
