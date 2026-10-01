import React from 'react';
import {
  MapPin, ShieldAlert, Volume2, Droplets, Thermometer,
  Wind, ArrowRight, Box, AlertTriangle, CheckCircle2, ChevronRight
} from 'lucide-react';
import { useAgrivaultStore } from '../../store/storageStore';

export const HotspotLocalizationView: React.FC = () => {
  const { zones, selectedZoneId, setSelectedZone, setActiveTab } = useAgrivaultStore();

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-500/20 text-red-400 border-red-500/40 ring-1 ring-red-500/50';
      case 'WARNING': return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'WATCH': return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      default: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-slate-100 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-400" /> Hotspot Localization & Cross-Section Zone Map
          </h2>
          <p className="text-xs text-slate-400">
            Spatial 3D layer analysis pinpoints biological self-heating and insect colonization pockets across the silo depth.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('twin')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-semibold text-white shadow-md transition-colors"
        >
          <Box className="w-4 h-4" /> Focus 3D Camera on Hotspot
        </button>
      </div>

      {/* Cross-Section Graphic & Zone Detail Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Silo Cross Section (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Silo Vertical Profile (Cross-Section)
          </h3>

          <div className="space-y-2.5">
            {zones.map((z) => {
              const isSelected = selectedZoneId === z.id;
              const isCrit = z.riskLevel === 'CRITICAL';

              return (
                <div
                  key={z.id}
                  onClick={() => setSelectedZone(z.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer select-none space-y-2 ${
                    isSelected
                      ? (isCrit ? 'bg-red-950/60 border-red-500 ring-2 ring-red-500/60 shadow-lg' : 'bg-slate-800 border-sky-500 ring-2 ring-sky-500/50')
                      : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${
                        isCrit ? 'bg-red-400 animate-ping' : (z.riskLevel === 'WATCH' ? 'bg-amber-400' : 'bg-emerald-400')
                      }`} />
                      <span className="font-bold text-sm text-slate-100">{z.name}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRiskColor(z.riskLevel)}`}>
                      {z.riskLevel} ({z.riskScore})
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>Depth: {z.depthLevel}</span>
                    <span className="text-slate-300">
                      {z.temperature}°C • {z.moisture}% • {z.co2} ppm
                    </span>
                  </div>

                  {isCrit && (
                    <div className="pt-1 text-[11px] font-semibold text-red-400 flex items-center gap-1.5 animate-pulse">
                      <AlertTriangle className="w-3.5 h-3.5" /> High Risk Hotspot Detected
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Zone Hotspot Diagnostics (7 Cols) */}
        {(() => {
          const selZone = zones.find(z => z.id === selectedZoneId) || zones[2];
          const isCrit = selZone.riskLevel === 'CRITICAL';

          return (
            <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Localized Hotspot Intelligence
                  </span>
                  <h3 className="text-lg font-bold text-slate-100">{selZone.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-black border ${getRiskColor(selZone.riskLevel)}`}>
                    RISK SCORE: {selZone.riskScore} / 100
                  </span>
                </div>
              </div>

              {/* Sensor Contributors Grid */}
              <div className="space-y-2">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">
                  Contributing Sensors in this Layer
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-1">
                    <span className="text-slate-400 flex items-center gap-1"><Volume2 className="w-3.5 h-3.5 text-indigo-400" /> Acoustic</span>
                    <div className="text-base font-bold text-slate-100">{Math.round(selZone.pestProbability * 100)}%</div>
                    <p className="text-[10px] text-slate-400">INMP441 Channel</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-1">
                    <span className="text-slate-400 flex items-center gap-1"><Thermometer className="w-3.5 h-3.5 text-amber-400" /> Temperature</span>
                    <div className="text-base font-bold text-slate-100">{selZone.temperature}°C</div>
                    <p className="text-[10px] text-amber-300">+{selZone.tempChange1h}°C/h</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-1">
                    <span className="text-slate-400 flex items-center gap-1"><Droplets className="w-3.5 h-3.5 text-blue-400" /> Moisture</span>
                    <div className="text-base font-bold text-slate-100">{selZone.moisture}%</div>
                    <p className="text-[10px] text-blue-300">+{selZone.moistureChange1h}%/h</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-1">
                    <span className="text-slate-400 flex items-center gap-1"><Wind className="w-3.5 h-3.5 text-emerald-400" /> CO2 Gas</span>
                    <div className="text-base font-bold text-slate-100">{selZone.co2} ppm</div>
                    <p className="text-[10px] text-emerald-300">+{selZone.co2Change1h} ppm</p>
                  </div>
                </div>
              </div>

              {/* Environmental Trend Summary */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-400" /> Layer Anomaly Diagnosis
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isCrit
                    ? 'Zone C exhibits a localized self-insulating hot core with high acoustic activity (+28 pts) and elevated grain moisture (+24 pts). Heat cannot dissipate naturally without forced aeration.'
                    : 'This zone is currently maintaining stable interstitial equilibrium with nominal heat and moisture dissipation.'}
                </p>
              </div>

              {/* Recommended Action Protocol */}
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-indigo-400 uppercase">Recommended Preventive Action</span>
                  <p className="text-xs font-medium text-slate-200">
                    {isCrit
                      ? 'Deploy targeted downward suction aeration & conduct manual deep-core inspection probe.'
                      : 'Maintain routine automated adaptive telemetry sampling.'}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('recommendations')}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shrink-0 transition-colors"
                >
                  View Protocol
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
