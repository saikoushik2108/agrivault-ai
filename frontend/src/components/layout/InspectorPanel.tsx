import React from 'react';
import {
  X, CheckCircle2, AlertTriangle, Clock,
  Cpu, Radio, Zap, Activity
} from 'lucide-react';
import { useAgrivaultStore } from '../../store/storageStore';
import { HARDWARE_COMPONENTS } from '../../data/hardwareData';

interface InspectorPanelProps {
  onClose?: () => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({ onClose }) => {
  const {
    selectedHardwareId,
    setSelectedHardware,
    selectedZone,
    zones,
    setSelectedZone
  } = useAgrivaultStore();

  if (!selectedHardwareId && !selectedZone) return null;

  // If a hardware component is selected
  if (selectedHardwareId) {
    const spec = HARDWARE_COMPONENTS[selectedHardwareId] || HARDWARE_COMPONENTS['inmp441'];

    return (
      <div className="w-80 sm:w-96 bg-white border-l border-slate-200 h-full flex flex-col z-30 shadow-lg animate-slide-right select-none">
        {/* Panel Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">{spec.name}</h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </span>
            </div>
            <p className="text-xs text-slate-500">{spec.type}</p>
          </div>
          <button
            onClick={() => {
              setSelectedHardware(null);
              if (onClose) onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Panel Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* Purpose */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Purpose
            </span>
            <p className="text-slate-700 leading-relaxed font-normal">
              {spec.purpose}
            </p>
          </div>

          {/* Key Attributes */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-400 uppercase font-medium">Zone Location</span>
              <p className="font-semibold text-slate-900 mt-0.5">{spec.zone}</p>
            </div>
            <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-400 uppercase font-medium">Protocol</span>
              <p className="font-semibold text-slate-900 mt-0.5">{spec.protocol}</p>
            </div>
          </div>

          {/* Latest Activity & Reading */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Latest Reading
              </span>
              <span className="text-[10px] text-slate-400">12 sec ago</span>
            </div>
            <p className="font-mono text-xs font-semibold text-slate-900 bg-white p-2 rounded border border-slate-200">
              {spec.latestReading}
            </p>
          </div>

          {/* AI Model Connection */}
          <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
            <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
              <Activity className="w-3.5 h-3.5 text-sky-600" />
              <span>AI Model Attribution</span>
            </div>
            <p className="text-slate-600 text-[11px]">{spec.aiModel}</p>
          </div>

          {/* Electrical Specs Table */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Electrical & Specs
            </span>
            <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100 text-[11px]">
              <div className="flex justify-between p-2 bg-white">
                <span className="text-slate-500">Power</span>
                <span className="font-mono text-slate-800">{spec.power}</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50/50">
                <span className="text-slate-500">Sampling Rate</span>
                <span className="font-mono text-slate-800">{spec.samplingRate}</span>
              </div>
              <div className="flex justify-between p-2 bg-white">
                <span className="text-slate-500">Signal Confidence</span>
                <span className="font-mono text-slate-800">{spec.confidence}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/80">
          <button
            onClick={() => {
              setSelectedHardware(null);
            }}
            className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors"
          >
            Deselect Component
          </button>
        </div>
      </div>
    );
  }

  // If a zone is selected
  return (
    <div className="w-80 sm:w-96 bg-white border-l border-slate-200 h-full flex flex-col z-30 shadow-lg animate-slide-right select-none">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
        <div>
          <h3 className="text-base font-bold text-slate-900">{selectedZone.name}</h3>
          <p className="text-xs text-slate-500">{selectedZone.depthLevel}</p>
        </div>
        <button
          onClick={() => {
            if (onClose) onClose();
          }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 overflow-y-auto space-y-4 text-xs">
        {/* Risk Level Badge */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Assessed Risk</span>
          <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
            selectedZone.riskLevel === 'CRITICAL' ? 'badge-critical' :
            selectedZone.riskLevel === 'WARNING' ? 'badge-warning' :
            selectedZone.riskLevel === 'WATCH' ? 'badge-watch' : 'badge-normal'
          }`}>
            {selectedZone.riskLevel} ({selectedZone.riskScore}/100)
          </span>
        </div>

        {/* Live Telemetry Metrics */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 bg-white border border-slate-200 rounded-lg">
            <span className="text-[10px] text-slate-400 uppercase font-medium">Temperature</span>
            <p className="text-base font-bold text-slate-900 mt-0.5">{selectedZone.temperature}°C</p>
            <span className="text-[10px] text-slate-500">{selectedZone.tempChange1h > 0 ? `+${selectedZone.tempChange1h}` : selectedZone.tempChange1h}°C / hr</span>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-lg">
            <span className="text-[10px] text-slate-400 uppercase font-medium">Humidity</span>
            <p className="text-base font-bold text-slate-900 mt-0.5">{selectedZone.humidity}% RH</p>
            <span className="text-[10px] text-slate-500">{selectedZone.humidityChange1h > 0 ? `+${selectedZone.humidityChange1h}` : selectedZone.humidityChange1h}% / hr</span>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-lg">
            <span className="text-[10px] text-slate-400 uppercase font-medium">Moisture</span>
            <p className="text-base font-bold text-slate-900 mt-0.5">{selectedZone.moisture}%</p>
            <span className="text-[10px] text-slate-500">{selectedZone.moistureChange1h > 0 ? `+${selectedZone.moistureChange1h}` : selectedZone.moistureChange1h}% / hr</span>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-lg">
            <span className="text-[10px] text-slate-400 uppercase font-medium">CO2 Level</span>
            <p className="text-base font-bold text-slate-900 mt-0.5">{selectedZone.co2} ppm</p>
            <span className="text-[10px] text-slate-500">Biological activity</span>
          </div>
        </div>

        {/* Acoustic Activity Meter */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
          <div className="flex justify-between text-[11px]">
            <span className="font-semibold text-slate-700">Acoustic Activity</span>
            <span className="font-mono font-bold text-slate-900">{Math.round(selectedZone.acousticActivity * 100)}%</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                selectedZone.acousticActivity > 0.6 ? 'bg-red-500' :
                selectedZone.acousticActivity > 0.3 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${selectedZone.acousticActivity * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
