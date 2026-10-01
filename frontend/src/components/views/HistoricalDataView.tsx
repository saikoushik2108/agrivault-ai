import React, { useState } from 'react';
import {
  History, Download, Filter, Thermometer, Droplets,
  Wind, Volume2, ShieldAlert, Calendar, Activity
} from 'lucide-react';
import { useAgrivaultStore } from '../../store/storageStore';

export const HistoricalDataView: React.FC = () => {
  const { zones, selectedZoneId } = useAgrivaultStore();
  const [activeZone, setActiveZone] = useState<string>(selectedZoneId);
  const [timeRange, setTimeRange] = useState<'24H' | '7D' | '30D' | 'CUSTOM'>('24H');
  const [parameter, setParameter] = useState<'temp' | 'humidity' | 'moisture' | 'co2' | 'acoustic' | 'risk'>('temp');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const isZoneC = activeZone === 'ZONE-C';
  const pointsCount = timeRange === '24H' ? 24 : timeRange === '7D' ? 28 : 30;

  // Generate deterministic parameter series
  const data = Array.from({ length: pointsCount }).map((_, i) => {
    const p = i / (pointsCount - 1);
    let val = 0;
    let unit = '';

    if (parameter === 'temp') {
      val = isZoneC ? 27.2 + p * 4.6 : 23.1 + Math.sin(p * 3) * 0.8;
      unit = '°C';
    } else if (parameter === 'humidity') {
      val = isZoneC ? 64.0 + p * 8.4 : 56.0 + Math.sin(p * 2.5) * 1.5;
      unit = '% RH';
    } else if (parameter === 'moisture') {
      val = isZoneC ? 13.1 + p * 1.7 : 11.8 + Math.cos(p * 2) * 0.2;
      unit = '%';
    } else if (parameter === 'co2') {
      val = isZoneC ? 580 + p * 360 : 490 + Math.sin(p * 2) * 30;
      unit = 'ppm';
    } else if (parameter === 'acoustic') {
      val = isZoneC ? 0.18 + p * 0.71 : 0.05 + Math.random() * 0.04;
      unit = '';
    } else {
      val = isZoneC ? 42 + p * 40.6 : 18 + Math.sin(p * 2) * 4;
      unit = '/100';
    }

    const roundedVal = parameter === 'co2' ? Math.round(val) : +val.toFixed(1);
    const label = timeRange === '24H' ? `${i}:00` : `Day ${i + 1}`;

    return { label, value: roundedVal, unit };
  });

  const values = data.map(d => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const avgVal = +(values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  const delta = +(values[values.length - 1] - values[0]).toFixed(1);

  // Download CSV Export
  const handleExportCSV = () => {
    const headers = 'Time,Zone,Parameter,Value,Unit\n';
    const rows = data.map(d => `${d.label},${activeZone},${parameter},${d.value},${d.unit}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agrivault_${activeZone}_${parameter}_${timeRange}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getParamLabel = () => {
    switch (parameter) {
      case 'temp': return 'Temperature (°C)';
      case 'humidity': return 'Relative Humidity (% RH)';
      case 'moisture': return 'Grain Moisture (% w.b.)';
      case 'co2': return 'Carbon Dioxide (ppm)';
      case 'acoustic': return 'Acoustic Activity Index';
      case 'risk': return 'Risk Index (0-100)';
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto text-slate-900 select-none animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Historical Analytics
          </h2>
          <p className="text-xs text-slate-500">
            Inspect sensor trends and temporal rates of change across customizable historical windows.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Control Bar: Date Range, Zone, and Parameter Selectors */}
      <div className="clean-card p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Date Range Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          {(['24H', '7D', '30D', 'CUSTOM'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                timeRange === r
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Zone Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500">Zone:</span>
          <select
            value={activeZone}
            onChange={(e) => setActiveZone(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-800 bg-white"
          >
            {zones.map((z) => (
              <option key={z.id} value={z.id}>{z.name}</option>
            ))}
          </select>
        </div>

        {/* Parameter Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500">Parameter:</span>
          <select
            value={parameter}
            onChange={(e) => setParameter(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-800 bg-white"
          >
            <option value="temp">Temperature</option>
            <option value="humidity">Relative Humidity</option>
            <option value="moisture">Grain Moisture</option>
            <option value="co2">Carbon Dioxide (CO2)</option>
            <option value="acoustic">Acoustic Activity</option>
            <option value="risk">Risk Score</option>
          </select>
        </div>
      </div>

      {/* Main Single Historical Chart */}
      <div className="clean-card p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {getParamLabel()}
            </h3>
            <p className="text-xs text-slate-500">
              {activeZone} • {timeRange} window
            </p>
          </div>

          {/* Summary Mini-KPIs */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">MIN</span>
              <span className="font-bold text-slate-800">{minVal}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">MAX</span>
              <span className="font-bold text-slate-800">{maxVal}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">AVG</span>
              <span className="font-bold text-slate-800">{avgVal}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">DELTA</span>
              <span className={`font-bold ${delta > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {delta > 0 ? `+${delta}` : delta}
              </span>
            </div>
          </div>
        </div>

        {/* SVG Chart Area */}
        <div className="h-64 w-full bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col justify-between relative">
          <svg viewBox="0 0 600 160" className="w-full h-44 overflow-visible">
            {/* Horizontal guide lines */}
            <line x1="0" y1="20" x2="600" y2="20" stroke="#E2E8F0" strokeWidth="1" />
            <line x1="0" y1="80" x2="600" y2="80" stroke="#E2E8F0" strokeWidth="1" />
            <line x1="0" y1="140" x2="600" y2="140" stroke="#E2E8F0" strokeWidth="1" />

            {/* Polyline */}
            <polyline
              fill="none"
              stroke="#0284C7"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={data.map((d, idx) => {
                const x = (idx / (data.length - 1)) * 600;
                const range = maxVal - minVal || 1;
                const y = 140 - ((d.value - minVal) / range) * 110;
                return `${x},${y}`;
              }).join(' ')}
            />

            {/* Data points */}
            {data.map((d, idx) => {
              const x = (idx / (data.length - 1)) * 600;
              const range = maxVal - minVal || 1;
              const y = 140 - ((d.value - minVal) / range) * 110;
              const isHovered = hoveredIndex === idx;

              return (
                <circle
                  key={idx}
                  cx={x}
                  cy={y}
                  r={isHovered ? 6 : 3.5}
                  fill={isHovered ? '#0284C7' : '#FFFFFF'}
                  stroke="#0284C7"
                  strokeWidth="2"
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })}
          </svg>

          {/* Hovered data tooltip info */}
          {hoveredIndex !== null && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-3 py-1 rounded text-xs font-mono shadow-md">
              {data[hoveredIndex].label}: {data[hoveredIndex].value} {data[hoveredIndex].unit}
            </div>
          )}

          {/* Time axis labels */}
          <div className="flex justify-between text-[11px] text-slate-500 font-mono pt-1">
            <span>{data[0]?.label}</span>
            <span>{data[Math.floor(data.length / 2)]?.label}</span>
            <span>{data[data.length - 1]?.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
