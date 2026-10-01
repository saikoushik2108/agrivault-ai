import React, { useState } from 'react';
import {
  Activity, Thermometer, Droplets, Wind, Volume2,
  CheckCircle2, AlertTriangle, ArrowRight, Eye, RefreshCw
} from 'lucide-react';
import { useAgrivaultStore } from '../../store/storageStore';

export const LiveMonitoringView: React.FC = () => {
  const { zones, selectedZoneId, setSelectedZone, open3DModal } = useAgrivaultStore();
  const [filter, setFilter] = useState<'ALL' | string>('ALL');

  // Compute aggregate stats across zones
  const avgTemp = +(zones.reduce((acc, z) => acc + z.temperature, 0) / zones.length).toFixed(1);
  const avgHumidity = +(zones.reduce((acc, z) => acc + z.humidity, 0) / zones.length).toFixed(1);
  const avgMoisture = +(zones.reduce((acc, z) => acc + z.moisture, 0) / zones.length).toFixed(1);
  const avgCo2 = Math.round(zones.reduce((acc, z) => acc + z.co2, 0) / zones.length);
  const avgAcoustic = +(zones.reduce((acc, z) => acc + z.acousticActivity, 0) / zones.length).toFixed(2);

  const displayedZones = filter === 'ALL' ? zones : zones.filter(z => z.id === filter);

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded text-xs font-semibold badge-critical">CRITICAL</span>;
      case 'WARNING':
        return <span className="px-2 py-0.5 rounded text-xs font-semibold badge-warning">WARNING</span>;
      case 'WATCH':
        return <span className="px-2 py-0.5 rounded text-xs font-semibold badge-watch">WATCH</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-xs font-semibold badge-normal">NORMAL</span>;
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto text-slate-900 select-none animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Live Monitoring
          </h2>
          <p className="text-xs text-slate-500">
            Continuous interstitial environmental and acoustic sensor feeds from Silo #01.
          </p>
        </div>

        {/* Filter by Zone */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              filter === 'ALL' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Zones
          </button>
          {zones.map((z) => (
            <button
              key={z.id}
              onClick={() => setFilter(z.id)}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                filter === z.id ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {z.id.replace('ZONE-', 'Zone ')}
            </button>
          ))}
        </div>
      </div>

      {/* Four Primary Sensor Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Temperature Card */}
        <div className="clean-card p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Temperature
            </span>
            <Thermometer className="w-4 h-4 text-sky-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{avgTemp}°C</span>
            <span className="text-xs text-slate-400">avg across zones</span>
          </div>
          <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
            <span>Range: 22.9°C – 31.8°C</span>
            <span className="text-emerald-700 font-medium">SHT31-DIS</span>
          </div>
        </div>

        {/* 2. Humidity Card */}
        <div className="clean-card p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Relative Humidity
            </span>
            <Droplets className="w-4 h-4 text-sky-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{avgHumidity}% RH</span>
            <span className="text-xs text-slate-400">interstitial air</span>
          </div>
          <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
            <span>Range: 54.1% – 72.4%</span>
            <span className="text-emerald-700 font-medium">Equilibrium Safe</span>
          </div>
        </div>

        {/* 3. Moisture Card */}
        <div className="clean-card p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Grain Moisture
            </span>
            <Wind className="w-4 h-4 text-sky-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{avgMoisture}%</span>
            <span className="text-xs text-slate-400">wet basis (w.b.)</span>
          </div>
          <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
            <span>Safe Ceiling: 13.5%</span>
            <span className="text-amber-700 font-semibold">Zone C: 14.8%</span>
          </div>
        </div>

        {/* 4. CO2 Respiration Card */}
        <div className="clean-card p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Carbon Dioxide (CO2)
            </span>
            <Activity className="w-4 h-4 text-sky-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{avgCo2} ppm</span>
            <span className="text-xs text-slate-400">biological respiration</span>
          </div>
          <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
            <span>Baseline: 450 ppm</span>
            <span className="text-red-700 font-semibold">Zone C: 940 ppm</span>
          </div>
        </div>
      </div>

      {/* Acoustic Activity Section */}
      <div className="clean-card p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Acoustic Activity Stream (MEMS INMP441)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">
            Sampling: 16.0 kHz • 24-bit I2S
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="space-y-1">
            <span className="text-[11px] text-slate-500 uppercase font-medium">Mean Acoustic Energy</span>
            <p className="text-xl font-bold text-slate-900">{avgAcoustic} activity index</p>
            <p className="text-xs text-slate-500">Threshold for insect alarm: 0.45</p>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 font-medium">Acoustic Activity Spectrum</span>
              <span className="font-semibold text-red-600">Peak localized in Zone C (0.89)</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
              <div className="bg-emerald-500 h-full" style={{ width: '45%' }} title="Baseline kernel noise" />
              <div className="bg-amber-500 h-full" style={{ width: '25%' }} title="Watch threshold" />
              <div className="bg-red-500 h-full" style={{ width: '30%' }} title="Pest stridulation" />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0.00 (Silent)</span>
              <span>0.45 (Pest Threshold)</span>
              <span>1.00 (Severe Infestation)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Zone Monitoring Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Zone Monitoring
          </h3>
          <span className="text-xs text-slate-500">
            Showing {displayedZones.length} depth strata
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayedZones.map((z) => {
            const isSelected = selectedZoneId === z.id;

            return (
              <div
                key={z.id}
                onClick={() => setSelectedZone(z.id)}
                className={`clean-card p-4 space-y-3 cursor-pointer transition-all ${
                  isSelected ? 'ring-2 ring-slate-900 border-transparent shadow-sm' : ''
                }`}
              >
                {/* Zone Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{z.name}</h4>
                    <p className="text-[11px] text-slate-500">{z.depthLevel}</p>
                  </div>
                  {getRiskBadge(z.riskLevel)}
                </div>

                {/* Metrics */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Temperature</span>
                    <span className="font-semibold text-slate-900">{z.temperature}°C</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Relative Humidity</span>
                    <span className="font-semibold text-slate-900">{z.humidity}% RH</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Moisture Content</span>
                    <span className="font-semibold text-slate-900">{z.moisture}%</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Carbon Dioxide</span>
                    <span className="font-semibold text-slate-900">{z.co2} ppm</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Acoustic Activity</span>
                    <span className="font-semibold text-slate-900">
                      {Math.round(z.acousticActivity * 100)}%
                    </span>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Score: {z.riskScore}/100
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedZone(z.id);
                      open3DModal();
                    }}
                    className="text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1 transition-colors"
                  >
                    <span>Inspect in 3D</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
