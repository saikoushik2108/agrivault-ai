import React from 'react';
import {
  ShieldAlert, Activity, Volume2, Droplets, Thermometer,
  Wind, ArrowUpRight, ArrowDownRight, Sparkles, ChevronRight,
  Info, Cpu, ArrowRight
} from 'lucide-react';
import { useAgrivaultStore } from '../../store/storageStore';

export const RightIntelligencePanel: React.FC = () => {
  const {
    selectedZone,
    setSelectedHardware,
    setActiveTab,
    viewMode,
    setViewMode
  } = useAgrivaultStore();

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'WARNING': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'WATCH': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      default: return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }
  };

  return (
    <div className="w-80 bg-slate-900/90 border-l border-slate-800 flex flex-col h-[calc(100vh-4rem)] overflow-y-auto p-4 space-y-5 select-none shrink-0 backdrop-blur-md">
      {/* Zone Header & Risk Card */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Selected Storage Zone
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            {selectedZone.depthLevel}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100">{selectedZone.name}</h3>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getRiskColor(selectedZone.riskLevel)}`}>
              {selectedZone.riskLevel}
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="text-[11px] text-slate-400">Multimodal Risk Score</span>
              <div className="text-3xl font-black text-slate-100 tracking-tight">
                {selectedZone.riskScore}
                <span className="text-sm font-normal text-slate-400"> / 100</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400">Insect Probability</span>
              <div className="text-lg font-bold text-red-400">
                {Math.round(selectedZone.pestProbability * 100)}%
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-slate-700/80 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                selectedZone.riskLevel === 'CRITICAL' ? 'bg-red-500' :
                selectedZone.riskLevel === 'WARNING' ? 'bg-orange-500' :
                selectedZone.riskLevel === 'WATCH' ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${selectedZone.riskScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Live Zone Telemetry Grid */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Live Interstitial Sensors
          </span>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            1s Streaming
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* Temperature */}
          <div
            onClick={() => setSelectedHardware('sht31')}
            className="p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/40 cursor-pointer transition-colors space-y-1"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1"><Thermometer className="w-3.5 h-3.5 text-amber-400" /> Temp</span>
              <span className="text-[10px] font-mono text-amber-300">
                {selectedZone.tempChange1h >= 0 ? '+' : ''}{selectedZone.tempChange1h}°C/h
              </span>
            </div>
            <div className="text-lg font-bold text-slate-100">{selectedZone.temperature}°C</div>
          </div>

          {/* Moisture */}
          <div
            onClick={() => setSelectedHardware('moisture-sensor')}
            className="p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/40 cursor-pointer transition-colors space-y-1"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1"><Droplets className="w-3.5 h-3.5 text-sky-400" /> Moisture</span>
              <span className="text-[10px] font-mono text-sky-300">
                {selectedZone.moistureChange1h >= 0 ? '+' : ''}{selectedZone.moistureChange1h}%/h
              </span>
            </div>
            <div className="text-lg font-bold text-slate-100">{selectedZone.moisture}%</div>
          </div>

          {/* CO2 */}
          <div
            onClick={() => setSelectedHardware('co2-sensor')}
            className="p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/40 cursor-pointer transition-colors space-y-1"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1"><Wind className="w-3.5 h-3.5 text-emerald-400" /> CO2</span>
              <span className="text-[10px] font-mono text-emerald-300">
                +{selectedZone.co2Change1h} ppm
              </span>
            </div>
            <div className="text-lg font-bold text-slate-100">{selectedZone.co2} <span className="text-xs font-normal text-slate-400">ppm</span></div>
          </div>

          {/* Acoustic Activity */}
          <div
            onClick={() => setSelectedHardware('inmp441')}
            className="p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/40 cursor-pointer transition-colors space-y-1"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1"><Volume2 className="w-3.5 h-3.5 text-indigo-400" /> Acoustic</span>
              <span className="text-[10px] font-mono text-indigo-300">
                {selectedZone.acousticActivity > 0.5 ? 'Active' : 'Low'}
              </span>
            </div>
            <div className="text-lg font-bold text-slate-100">
              {Math.round(selectedZone.acousticActivity * 100)}% <span className="text-xs font-normal text-slate-400">RMS</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Intelligence Actions */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Intelligence Insights
        </span>
        <div className="space-y-1.5">
          <button
            onClick={() => setActiveTab('explainability')}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/40 text-xs text-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>Why is this zone at risk? (SHAP)</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => setActiveTab('acoustic')}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/40 text-xs text-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-indigo-400" />
              <span>Analyze Acoustic Waveform</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => setActiveTab('predictions')}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/40 text-xs text-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-amber-400" />
              <span>View 72-Hour Risk Forecast</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => setActiveTab('recommendations')}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/40 text-xs text-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>View Action Protocol</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Hardware Components Quick Selector */}
      <div className="pt-2 border-t border-slate-800 space-y-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-sky-400" /> Click to Inspect Hardware
        </span>
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          {[
            { id: 'inmp441', label: 'INMP441 Mic' },
            { id: 'sht31', label: 'SHT31 Probe' },
            { id: 'moisture-sensor', label: 'Moisture Rods' },
            { id: 'co2-sensor', label: 'NDIR CO2' },
            { id: 'esp32', label: 'ESP32 Node' },
            { id: 'rpi5', label: 'RPi 5 Gateway' }
          ].map((hw) => (
            <button
              key={hw.id}
              onClick={() => setSelectedHardware(hw.id)}
              className="px-2.5 py-1.5 text-left rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-slate-700/40 text-slate-300 hover:text-white transition-colors"
            >
              {hw.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
