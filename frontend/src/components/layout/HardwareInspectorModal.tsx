import React from 'react';
import {
  X, Cpu, Radio, Zap, Activity, HardDrive, ShieldCheck,
  AlertTriangle, ArrowRight, CheckCircle2, Clock, Sparkles
} from 'lucide-react';
import { useAgrivaultStore } from '../../store/storageStore';
import { HARDWARE_COMPONENTS } from '../../data/hardwareData';

export const HardwareInspectorModal: React.FC = () => {
  const { selectedHardwareId, setSelectedHardware, setActiveTab } = useAgrivaultStore();

  if (!selectedHardwareId) return null;

  const spec = HARDWARE_COMPONENTS[selectedHardwareId] || HARDWARE_COMPONENTS['inmp441'];

  const getStatusBadge = () => {
    switch (spec.status) {
      case 'Connected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> Connected & Streaming
          </span>
        );
      case 'Warning':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3.5 h-3.5" /> High Respiration Rate
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/30">
            <Clock className="w-3.5 h-3.5" /> Standby
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-sky-500/20 border border-indigo-500/30 flex items-center justify-center text-sky-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-100">{spec.name}</h3>
                {getStatusBadge()}
              </div>
              <p className="text-xs text-slate-400">{spec.type}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedHardware(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          {/* Summary / Purpose */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/50 space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Primary Purpose</span>
            <p className="text-slate-200 leading-relaxed">{spec.purpose}</p>
          </div>

          {/* Quick Hardware Specs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-mono">Used For</span>
              <p className="font-medium text-slate-200">{spec.usedFor}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-mono">Data Captured</span>
              <p className="font-medium text-slate-200">{spec.dataCaptured}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-mono">AI Model Pipeline</span>
              <p className="font-medium text-sky-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> {spec.aiModel}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-mono">Hardware Bus & Protocol</span>
              <p className="font-medium text-slate-200">{spec.protocol}</p>
            </div>
          </div>

          {/* Live Telemetry Card */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" /> Latest Live Sensor Telemetry
              </span>
              <span className="text-xs text-slate-400">Last Seen: {spec.lastSeen}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <span className="text-[11px] text-slate-400">Current Reading</span>
                <p className="text-sm font-semibold text-slate-100 mt-0.5">{spec.latestReading}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">Telemetry Confidence</span>
                <p className="text-sm font-semibold text-emerald-400 mt-0.5">{spec.confidence}% Verified</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">Attached Storage Zone</span>
                <p className="text-sm font-semibold text-amber-400 mt-0.5">{spec.zone}</p>
              </div>
            </div>
          </div>

          {/* Electrical & Physical Parameters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-800">
              <span className="text-slate-400 flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-amber-400" /> Power</span>
              <p className="font-medium text-slate-200 mt-1">{spec.power}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-800">
              <span className="text-slate-400 flex items-center gap-1"><Radio className="w-3.5 h-3.5 text-sky-400" /> Signal (RSSI)</span>
              <p className="font-medium text-slate-200 mt-1">{spec.rssi} dBm</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-800">
              <span className="text-slate-400 flex items-center gap-1"><HardDrive className="w-3.5 h-3.5 text-indigo-400" /> Sampling</span>
              <p className="font-medium text-slate-200 mt-1">{spec.samplingRate}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-800">
              <span className="text-slate-400 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Battery SoC</span>
              <p className="font-medium text-slate-200 mt-1">{spec.battery}%</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-800/30">
          <div className="flex items-center gap-2">
            {Object.keys(HARDWARE_COMPONENTS).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedHardware(key)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  selectedHardwareId === key
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {HARDWARE_COMPONENTS[key].name.split(' ')[0]}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {spec.id === 'inmp441' && (
              <button
                onClick={() => {
                  setSelectedHardware(null);
                  setActiveTab('acoustic');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors"
              >
                Open Acoustic Lab <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => setSelectedHardware(null)}
              className="px-4 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
