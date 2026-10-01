import React, { useState } from 'react';
import {
  X, RotateCcw, Play, Pause, Layers, ShieldAlert,
  Sliders, Info, Eye
} from 'lucide-react';
import { useAgrivaultStore } from '../../store/storageStore';
import { SiloCanvas } from '../../three/SiloCanvas';
import { InspectorPanel } from './InspectorPanel';
import { ViewMode } from '../../types';

export const Silo3DModal: React.FC = () => {
  const {
    is3DModalOpen,
    close3DModal,
    viewMode,
    setViewMode,
    exploded,
    toggleExploded,
    autoRotate,
    setAutoRotate,
    selectedHardwareId,
    selectedZoneId,
    setSelectedHardware
  } = useAgrivaultStore();

  const [resetSignal, setResetSignal] = useState(0);

  if (!is3DModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="relative w-full h-full bg-white flex flex-col overflow-hidden">
        {/* Workspace Header */}
        <header className="h-16 px-6 border-b border-slate-200 flex items-center justify-between bg-white shrink-0 z-20 shadow-xs">
          {/* Title & Unit Information */}
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-slate-900">
                  3D DIGITAL TWIN
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  Unit 01
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Storage Unit 01 • Hard Red Winter Wheat
              </p>
            </div>
          </div>

          {/* Central View Switchers */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('normal')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                viewMode === 'normal'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Normal View
            </button>
            <button
              onClick={() => setViewMode('risk')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                viewMode === 'risk'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Risk View
            </button>
            <button
              onClick={toggleExploded}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                exploded
                  ? 'bg-sky-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {exploded ? 'Collapse View' : 'Exploded View'}
            </button>
          </div>

          {/* Utility Actions & Close */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setResetSignal((s) => s + 1)}
              title="Reset Camera Orientation"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset</span>
            </button>

            <button
              onClick={() => setAutoRotate(!autoRotate)}
              title={autoRotate ? 'Pause Rotation' : 'Auto Rotate'}
              className={`p-2 rounded-lg border text-xs font-medium transition-colors ${
                autoRotate
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            <div className="h-6 w-px bg-slate-200 mx-1" />

            <button
              onClick={close3DModal}
              title="Close 3D Workspace"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main 3D Canvas Area & Inspector Panel */}
        <div className="flex-1 relative flex overflow-hidden bg-white">
          {/* Centered Canvas */}
          <div className="flex-1 h-full relative">
            <SiloCanvas resetSignal={resetSignal} />

            {/* Bottom Status / Navigation Hints */}
            <div className="absolute bottom-4 left-6 pointer-events-none z-10 flex items-center gap-4 text-xs text-slate-500 bg-white/90 backdrop-blur-xs px-3.5 py-1.5 rounded-lg border border-slate-200 shadow-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                Left-drag to rotate
              </span>
              <span>•</span>
              <span>Right-drag to pan</span>
              <span>•</span>
              <span>Scroll to zoom</span>
              <span>•</span>
              <span className="text-slate-800 font-medium">Click zones or hardware models to inspect</span>
            </div>
          </div>

          {/* Right Inspector Panel */}
          {(selectedHardwareId || selectedZoneId) && (
            <InspectorPanel onClose={() => setSelectedHardware(null)} />
          )}
        </div>
      </div>
    </div>
  );
};
