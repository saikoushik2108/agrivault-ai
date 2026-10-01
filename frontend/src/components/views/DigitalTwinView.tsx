import React, { useState } from 'react';
import {
  Layers, Maximize2, RotateCcw, Play, Pause, Eye,
  ChevronDown, ChevronRight, Cpu, Radio, ShieldAlert,
  Flame, CheckCircle2, AlertTriangle, AlertCircle, Compass
} from 'lucide-react';
import { useAgrivaultStore } from '../../store/storageStore';
import { SiloCanvas } from '../../three/SiloCanvas';
import { RightIntelligencePanel } from '../layout/RightIntelligencePanel';
import { ViewMode } from '../../types';

export const DigitalTwinView: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    exploded,
    toggleExploded,
    autoRotate,
    setAutoRotate,
    selectedZoneId,
    setSelectedZone,
    setSelectedHardware,
    zones
  } = useAgrivaultStore();

  const [showHierarchy, setShowHierarchy] = useState(false);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex overflow-hidden bg-slate-950">
      {/* Center 3D Digital Twin Canvas */}
      <div className="relative flex-1 h-full flex flex-col overflow-hidden">
        {/* Top Floating 3D Control Bar */}
        <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 select-none">
          {/* View Mode Pills */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-700/80 backdrop-blur-md shadow-xl text-xs">
            <button
              onClick={() => setViewMode('normal')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'normal'
                  ? 'bg-sky-500 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Normal View
            </button>
            <button
              onClick={() => setViewMode('exploded')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'exploded'
                  ? 'bg-sky-500 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Exploded View
            </button>
            <button
              onClick={() => setViewMode('risk')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'risk'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Risk Heatmap
            </button>
            <button
              onClick={() => setViewMode('sensor')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'sensor'
                  ? 'bg-indigo-500 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sensor Wireframe
            </button>
          </div>

          {/* Explode / Collapse Toggle Button */}
          <button
            onClick={toggleExploded}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold backdrop-blur-md shadow-xl border transition-all ${
              exploded
                ? 'bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30'
                : 'bg-slate-900/90 text-sky-400 border-slate-700/80 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{exploded ? 'Collapse Silo' : 'Explode Silo'}</span>
          </button>

          {/* Auto Rotate Button */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium backdrop-blur-md shadow-xl border transition-all ${
              autoRotate
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                : 'bg-slate-900/90 text-slate-400 border-slate-700/80 hover:text-slate-200'
            }`}
          >
            {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Auto Rotate</span>
          </button>

          {/* Component Hierarchy Tree Drawer Toggle */}
          <button
            onClick={() => setShowHierarchy(!showHierarchy)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium backdrop-blur-md shadow-xl border transition-all ${
              showHierarchy
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-semibold'
                : 'bg-slate-900/90 text-slate-400 border-slate-700/80 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Component Tree</span>
          </button>
        </div>

        {/* Bottom Floating Zone Quick-Focus Pill */}
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 select-none">
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-700/80 backdrop-blur-md shadow-xl text-xs">
            <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
              Focus Zone:
            </span>
            {zones.map((z) => {
              const isSelected = selectedZoneId === z.id;
              const isCrit = z.riskLevel === 'CRITICAL';
              return (
                <button
                  key={z.id}
                  onClick={() => setSelectedZone(z.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                    isSelected
                      ? (isCrit ? 'bg-red-500 text-white font-bold' : 'bg-sky-500 text-white font-bold')
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${
                    isCrit ? 'bg-red-400 animate-ping' : (z.riskLevel === 'WATCH' ? 'bg-amber-400' : 'bg-emerald-400')
                  }`} />
                  <span>{z.id.replace('ZONE-', 'Zone ')}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md text-[11px] text-slate-400">
            <span>🖱️ Click silo shell to explode • Orbit with left click • Zoom with scroll</span>
          </div>
        </div>

        {/* Component Hierarchy Tree Drawer */}
        {showHierarchy && (
          <div className="absolute top-16 left-4 z-30 w-72 bg-slate-900/95 border border-slate-700/80 rounded-2xl p-4 shadow-2xl backdrop-blur-md max-h-[75vh] overflow-y-auto text-xs text-slate-300 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                Digital Twin Hierarchy Tree
              </span>
              <button
                onClick={() => setShowHierarchy(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1 font-mono text-[11px]">
              <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                <ChevronDown className="w-3.5 h-3.5 text-sky-400" /> Storage Unit: SILO-01
              </div>
              <div className="pl-4 space-y-1 border-l border-slate-800 ml-1.5">
                <div
                  onClick={toggleExploded}
                  className="cursor-pointer text-slate-400 hover:text-sky-400 py-0.5"
                >
                  ├── Silo Outer Shell (Corrugated Steel)
                </div>
                <div
                  onClick={toggleExploded}
                  className="cursor-pointer text-slate-400 hover:text-sky-400 py-0.5"
                >
                  ├── Roof & Intake Auger Head
                </div>
                <div
                  onClick={() => setSelectedZone('ZONE-A')}
                  className="cursor-pointer text-slate-400 hover:text-emerald-400 py-0.5"
                >
                  ├── Zone A - Headspace (0-3m) [Normal]
                </div>
                <div
                  onClick={() => setSelectedZone('ZONE-B')}
                  className="cursor-pointer text-slate-400 hover:text-amber-400 py-0.5"
                >
                  ├── Zone B - Upper Core (3-7m) [Watch]
                </div>
                <div
                  onClick={() => setSelectedZone('ZONE-C')}
                  className="cursor-pointer text-red-400 font-bold hover:text-red-300 py-0.5"
                >
                  ├── Zone C - Hotspot Core (7-11m) [Critical]
                </div>
                <div className="pl-4 border-l border-slate-800 ml-1.5 space-y-0.5 text-slate-400">
                  <div
                    onClick={() => setSelectedHardware('inmp441')}
                    className="hover:text-sky-400 cursor-pointer"
                  >
                    ├── INMP441 Acoustic Mic
                  </div>
                  <div
                    onClick={() => setSelectedHardware('sht31')}
                    className="hover:text-amber-400 cursor-pointer"
                  >
                    ├── SHT31 Temp & RH Sensor
                  </div>
                  <div
                    onClick={() => setSelectedHardware('moisture-sensor')}
                    className="hover:text-blue-400 cursor-pointer"
                  >
                    ├── Moisture Sensor Rods
                  </div>
                  <div
                    onClick={() => setSelectedHardware('co2-sensor')}
                    className="hover:text-emerald-400 cursor-pointer"
                  >
                    └── Optical NDIR CO2 Sensor
                  </div>
                </div>
                <div
                  onClick={() => setSelectedZone('ZONE-D')}
                  className="cursor-pointer text-slate-400 hover:text-emerald-400 py-0.5"
                >
                  ├── Zone D - Hopper Base (11-15m) [Normal]
                </div>
                <div
                  onClick={() => setSelectedHardware('esp32')}
                  className="cursor-pointer text-indigo-400 hover:text-indigo-300 py-0.5"
                >
                  ├── ESP32 Wireless Sensor Node
                </div>
                <div
                  onClick={() => setSelectedHardware('rpi5')}
                  className="cursor-pointer text-rose-400 hover:text-rose-300 py-0.5"
                >
                  └── Raspberry Pi 5 Edge Gateway
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3D WebGL Canvas */}
        <SiloCanvas />
      </div>

      {/* Right Live Intelligence Panel */}
      <RightIntelligencePanel />
    </div>
  );
};
