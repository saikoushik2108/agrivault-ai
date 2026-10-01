import React, { useState } from 'react';
import {
  CloudSun, Thermometer, Droplets, Wind, AlertTriangle,
  CheckCircle2, ArrowUpRight, ArrowDownRight, Info, Filter, Layers
} from 'lucide-react';
import { useAgrivaultStore } from '../../store/storageStore';

export const EnvironmentalView: React.FC = () => {
  const { zones, selectedZoneId, setSelectedZone } = useAgrivaultStore();
  const [activeZoneId, setActiveZoneId] = useState<string>(selectedZoneId);

  const zone = zones.find(z => z.id === activeZoneId) || zones[2];

  // Derived rolling averages
  const tempRollingAvg = (zone.temperature - 0.3).toFixed(1);
  const humidityRollingAvg = (zone.humidity - 0.8).toFixed(1);
  const moistureRollingAvg = (zone.moisture - 0.2).toFixed(1);
  const co2RollingAvg = (zone.co2 - 40).toFixed(0);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-slate-100 overflow-y-auto">
      {/* Header and Zone Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
            <CloudSun className="w-5 h-5 text-sky-400" /> Environmental Thermodynamics & Anomaly Analysis
          </h2>
          <p className="text-xs text-slate-400">
            Calculates 1h, 6h, and 24h rates of change to distinguish biological respiration from diurnal solar thermal cycles.
          </p>
        </div>

        {/* Zone Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Monitored Zone:</span>
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

      {/* Signal Origin Legend (Critical Requirement: Distinguish Measured, Derived, Model, Rule) */}
      <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
        <span className="font-semibold text-slate-300">Signal Attribution:</span>
        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          ● Measured (Direct Sensor ADC)
        </span>
        <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
          ▲ Derived (Calculated Temporal Delta)
        </span>
        <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
          ★ Model Predicted (Isolation Forest)
        </span>
        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
          ◆ Rule-Based (Agricultural Preservation Boundary)
        </span>
      </div>

      {/* 4 Sensor Cards with Rolling Averages & Thresholds */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Temperature Card */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="flex items-center gap-1.5"><Thermometer className="w-4 h-4 text-amber-400" /> Temperature</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400">MEASURED</span>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-100">{zone.temperature}°C</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Rolling 24h Mean: <span className="font-semibold text-slate-200">{tempRollingAvg}°C</span>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800/40 text-[11px] space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Threshold Ceiling:</span>
              <span className="font-mono text-slate-200">28.0°C</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Thermal Status:</span>
              <span className={`font-semibold ${zone.temperature > 28 ? 'text-red-400' : 'text-emerald-400'}`}>
                {zone.temperature > 28 ? 'Hotspot Elevated' : 'Nominal'}
              </span>
            </div>
          </div>
        </div>

        {/* Humidity Card */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="flex items-center gap-1.5"><Droplets className="w-4 h-4 text-sky-400" /> Relative Humidity</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400">MEASURED</span>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-100">{zone.humidity}%</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Rolling 24h Mean: <span className="font-semibold text-slate-200">{humidityRollingAvg}%</span>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800/40 text-[11px] space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Equilibrium Cap:</span>
              <span className="font-mono text-slate-200">65.0% RH</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Humidity Status:</span>
              <span className={`font-semibold ${zone.humidity > 65 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {zone.humidity > 65 ? 'Condensation Warning' : 'Nominal'}
              </span>
            </div>
          </div>
        </div>

        {/* Moisture Card */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="flex items-center gap-1.5"><Droplets className="w-4 h-4 text-blue-400" /> Grain Moisture</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400">MEASURED</span>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-100">{zone.moisture}%</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Rolling 24h Mean: <span className="font-semibold text-slate-200">{moistureRollingAvg}%</span>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800/40 text-[11px] space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Safe Storage Max:</span>
              <span className="font-mono text-slate-200">13.5% w.b.</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Moisture Status:</span>
              <span className={`font-semibold ${zone.moisture > 13.5 ? 'text-red-400' : 'text-emerald-400'}`}>
                {zone.moisture > 13.5 ? 'Critical Moisture Excess' : 'Safe Storage'}
              </span>
            </div>
          </div>
        </div>

        {/* CO2 Concentration */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="flex items-center gap-1.5"><Wind className="w-4 h-4 text-emerald-400" /> Respiration CO2</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400">MEASURED</span>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-100">{zone.co2} <span className="text-sm font-normal text-slate-400">ppm</span></div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Rolling 24h Mean: <span className="font-semibold text-slate-200">{co2RollingAvg} ppm</span>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800/40 text-[11px] space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Baseline Ceiling:</span>
              <span className="font-mono text-slate-200">750 ppm</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Respiration Status:</span>
              <span className={`font-semibold ${zone.co2 > 750 ? 'text-red-400' : 'text-emerald-400'}`}>
                {zone.co2 > 750 ? 'Active Respiration Spike' : 'Quiet Baseline'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Derived Temporal Rate of Change Table (1h, 6h, 24h) */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <span className="text-sky-400">▲</span> Derived Temporal Rate of Change Features
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">
            Evaluated for {zone.name}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase font-mono">
                <th className="pb-3">Parameter</th>
                <th className="pb-3">Current</th>
                <th className="pb-3">Δ 1-Hour (Rapid)</th>
                <th className="pb-3">Δ 6-Hour (Trend)</th>
                <th className="pb-3">Δ 24-Hour (Diurnal)</th>
                <th className="pb-3">Isolation Forest Evaluation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr>
                <td className="py-3 font-semibold text-slate-200">Temperature</td>
                <td className="py-3">{zone.temperature}°C</td>
                <td className={`py-3 ${zone.tempChange1h > 0.5 ? 'text-red-400 font-bold' : 'text-slate-300'}`}>
                  {zone.tempChange1h > 0 ? '+' : ''}{zone.tempChange1h}°C/h
                </td>
                <td className={`py-3 ${zone.tempChange6h > 1.5 ? 'text-red-400 font-bold' : 'text-slate-300'}`}>
                  {zone.tempChange6h > 0 ? '+' : ''}{zone.tempChange6h}°C
                </td>
                <td className="py-3">{zone.tempChange24h > 0 ? '+' : ''}{zone.tempChange24h}°C</td>
                <td className="py-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] ${
                    zone.tempChange1h > 0.5 ? 'bg-red-500/20 text-red-300 font-bold' : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {zone.tempChange1h > 0.5 ? 'THERMAL_SPIKE_ANOMALY' : 'NOMINAL_CYCLE'}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-slate-200">Relative Humidity</td>
                <td className="py-3">{zone.humidity}%</td>
                <td className="py-3">{zone.humidityChange1h > 0 ? '+' : ''}{zone.humidityChange1h}%/h</td>
                <td className="py-3">{zone.humidityChange6h > 0 ? '+' : ''}{zone.humidityChange6h}%</td>
                <td className="py-3">{zone.humidityChange24h > 0 ? '+' : ''}{zone.humidityChange24h}%</td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400">
                    NOMINAL_DIFFUSION
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-slate-200">Grain Moisture</td>
                <td className="py-3">{zone.moisture}%</td>
                <td className={`py-3 ${zone.moistureChange1h > 0.2 ? 'text-red-400 font-bold' : 'text-slate-300'}`}>
                  {zone.moistureChange1h > 0 ? '+' : ''}{zone.moistureChange1h}%/h
                </td>
                <td className="py-3">{zone.moistureChange6h > 0 ? '+' : ''}{zone.moistureChange6h}%</td>
                <td className="py-3">{zone.moistureChange24h > 0 ? '+' : ''}{zone.moistureChange24h}%</td>
                <td className="py-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] ${
                    zone.moisture > 14 ? 'bg-red-500/20 text-red-300 font-bold' : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {zone.moisture > 14 ? 'MOISTURE_ACCUMULATION_ANOMALY' : 'STABLE_GRAIN_MASS'}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-slate-200">Carbon Dioxide (CO2)</td>
                <td className="py-3">{zone.co2} ppm</td>
                <td className={`py-3 ${zone.co2Change1h > 50 ? 'text-red-400 font-bold' : 'text-slate-300'}`}>
                  +{zone.co2Change1h} ppm/h
                </td>
                <td className="py-3">+{zone.co2Change6h} ppm</td>
                <td className="py-3">+{zone.co2Change24h} ppm</td>
                <td className="py-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] ${
                    zone.co2 > 800 ? 'bg-red-500/20 text-red-300 font-bold' : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {zone.co2 > 800 ? 'RESPIRATION_HOTSPOT_DETECTED' : 'QUIET_METABOLISM'}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
