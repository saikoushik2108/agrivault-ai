import React, { useState } from 'react';
import {
  TrendingUp, AlertTriangle, Clock, ShieldAlert,
  ArrowRight, Sparkles, Activity, Layers
} from 'lucide-react';
import { useAgrivaultStore } from '../../store/storageStore';

export const ForecastingView: React.FC = () => {
  const { zones, selectedZoneId, setSelectedZone } = useAgrivaultStore();
  const [activeZoneId, setActiveZoneId] = useState<string>(selectedZoneId);

  const zone = zones.find(z => z.id === activeZoneId) || zones[2];
  const isZoneC = zone.id === 'ZONE-C';

  // Deterministic forecast curve data
  const forecastData = [
    {
      horizon: 'Now (T+0)',
      risk: zone.riskScore,
      uncLow: zone.riskScore,
      uncHigh: zone.riskScore,
      level: zone.riskLevel,
      description: 'Current real-time telemetry assessment'
    },
    {
      horizon: '24 Hours (T+24)',
      risk: isZoneC ? 86.4 : 22.0,
      uncLow: isZoneC ? 83.0 : 19.5,
      uncHigh: isZoneC ? 89.8 : 24.5,
      level: isZoneC ? 'CRITICAL' : 'NORMAL',
      description: 'Projected biological core heating if unchecked'
    },
    {
      horizon: '48 Hours (T+48)',
      risk: isZoneC ? 91.2 : 24.5,
      uncLow: isZoneC ? 87.0 : 21.0,
      uncHigh: isZoneC ? 95.4 : 28.0,
      level: isZoneC ? 'CRITICAL' : 'NORMAL',
      description: 'High probability of localized mold and crusting'
    },
    {
      horizon: '72 Hours (T+72)',
      risk: isZoneC ? 94.8 : 26.0,
      uncLow: isZoneC ? 89.5 : 22.0,
      uncHigh: isZoneC ? 98.2 : 30.0,
      level: isZoneC ? 'CRITICAL' : 'NORMAL',
      description: 'Irreversible kernel discoloration and spoilage trajectory'
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-slate-100 overflow-y-auto">
      {/* Prominent Demo Disclaimer Banner */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <span className="font-bold">Temporal Model Status:</span> Demo Forecast. Infrastructure ready for Bidirectional LSTM / Temporal Fusion Transformer. Real metrics will be generated once full time-series dataset is ingested.
          </div>
        </div>
        <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-amber-500/20 text-amber-200">
          DEMO FORECAST
        </span>
      </div>

      {/* Header and Zone Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-sky-400" /> 72-Hour Storage Risk Trajectory Forecasting
          </h2>
          <p className="text-xs text-slate-400">
            Multi-horizon forward projection modeling microclimate thermodynamic momentum and pest population growth curves.
          </p>
        </div>

        {/* Zone Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Select Zone:</span>
          <select
            value={activeZoneId}
            onChange={(e) => {
              setActiveZoneId(e.target.value);
              setSelectedZone(e.target.value);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 focus:outline-none focus:border-sky-500"
          >
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name} ({z.riskLevel})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4 Horizons Grid (Now, 24h, 48h, 72h) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {forecastData.map((pt, i) => (
          <div
            key={i}
            className={`p-5 rounded-2xl border space-y-3 transition-all ${
              pt.level === 'CRITICAL'
                ? 'bg-red-950/30 border-red-500/40 shadow-lg'
                : 'bg-slate-900/80 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-400" /> {pt.horizon}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                pt.level === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}>
                {pt.level}
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-3xl font-black ${pt.level === 'CRITICAL' ? 'text-red-400' : 'text-slate-100'}`}>
                  {pt.risk}
                </span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-1">
                Uncertainty Band: [{pt.uncLow} – {pt.uncHigh}]
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2.5">
              {pt.description}
            </p>
          </div>
        ))}
      </div>

      {/* Visual Trajectory Chart (SVG) */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-400" /> Risk Trajectory Progression with 95% Confidence Interval
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Horizon: 0 to 72 Hours
          </span>
        </div>

        {/* SVG Curve */}
        <div className="relative w-full h-56 bg-slate-950 rounded-xl p-4 border border-slate-800 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
            {/* Grid Lines */}
            <line x1="0" y1="50" x2="800" y2="50" stroke="#1e293b" strokeDasharray="4 4" />
            <line x1="0" y1="100" x2="800" y2="100" stroke="#1e293b" strokeDasharray="4 4" />
            <line x1="0" y1="150" x2="800" y2="150" stroke="#1e293b" strokeDasharray="4 4" />

            {/* Threshold line 75 (Critical threshold) */}
            <line x1="0" y1="50" x2="800" y2="50" stroke="#ef4444" strokeWidth="1" strokeDasharray="6 6" />
            <text x="710" y="42" fill="#ef4444" fontSize="10" fontFamily="monospace">Critical Ceiling (75)</text>

            {/* Shaded Uncertainty Area */}
            {isZoneC ? (
              <polygon
                points="100,60 300,50 500,35 700,20 700,45 500,65 300,80 100,70"
                fill="#ef4444"
                opacity="0.15"
              />
            ) : (
              <polygon
                points="100,165 300,160 500,155 700,150 700,170 500,172 300,175 100,170"
                fill="#0ea5e9"
                opacity="0.15"
              />
            )}

            {/* Main Risk Line */}
            {isZoneC ? (
              <polyline
                fill="none"
                stroke="#ef4444"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="100,65 300,56 500,42 700,28"
              />
            ) : (
              <polyline
                fill="none"
                stroke="#0ea5e9"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="100,168 300,165 500,160 700,156"
              />
            )}

            {/* Data Points */}
            {(isZoneC
              ? [[100, 65], [300, 56], [500, 42], [700, 28]]
              : [[100, 168], [300, 165], [500, 160], [700, 156]]
            ).map(([x, y], idx) => (
              <g key={idx}>
                <circle cx={x} cy={y} r="5" fill={isZoneC ? '#ef4444' : '#0ea5e9'} />
                <circle cx={x} cy={y} r="8" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" />
              </g>
            ))}
          </svg>

          {/* X Axis Labels */}
          <div className="absolute bottom-2 left-0 right-0 px-8 flex justify-between text-[11px] font-mono text-slate-400">
            <span>Now (T+0h)</span>
            <span>T+24 Hours</span>
            <span>T+48 Hours</span>
            <span>T+72 Hours</span>
          </div>
        </div>
      </div>
    </div>
  );
};
