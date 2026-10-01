import React, { useEffect, Suspense, lazy } from 'react';
import './App.css';
import { useAgrivaultStore, store } from './store/storageStore';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Floating3DTab } from './components/layout/Floating3DTab';
import { Silo3DModal } from './components/layout/Silo3DModal';
import { SystemStatusModal } from './components/layout/SystemStatusModal';
import { HardwareInspectorModal } from './components/layout/HardwareInspectorModal';
import { Loader2 } from 'lucide-react';

// Eager primary views for instantaneous first-paint
import { OverviewView } from './components/views/OverviewView';

// Code-split secondary views for bundle optimization
const LiveMonitoringView = lazy(() => import('./components/views/LiveMonitoringView').then(m => ({ default: m.LiveMonitoringView })));
const RiskIntelligenceView = lazy(() => import('./components/views/RiskIntelligenceView').then(m => ({ default: m.RiskIntelligenceView })));
const AcousticIntelligenceView = lazy(() => import('./components/views/AcousticIntelligenceView').then(m => ({ default: m.AcousticIntelligenceView })));
const HistoricalDataView = lazy(() => import('./components/views/HistoricalDataView').then(m => ({ default: m.HistoricalDataView })));
const AlertsView = lazy(() => import('./components/views/AlertsView').then(m => ({ default: m.AlertsView })));
const SettingsView = lazy(() => import('./components/views/SettingsView').then(m => ({ default: m.SettingsView })));

const ViewLoadingFallback = () => (
  <div className="flex flex-col items-center justify-center h-full w-full py-32 text-slate-400 space-y-3">
    <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
    <span className="text-xs font-medium tracking-wide text-slate-500">Loading view…</span>
  </div>
);

export function App() {
  const { activeTab } = useAgrivaultStore();

  // Real-time sensor simulation engine — runs continuously for living telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      store.simulateTelemetryTick();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewView />;
      case 'monitoring':
        return <LiveMonitoringView />;
      case 'risk':
        return <RiskIntelligenceView />;
      case 'acoustic':
        return <AcousticIntelligenceView />;
      case 'history':
        return <HistoricalDataView />;
      case 'alerts':
        return <AlertsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[var(--bg-page)] text-[var(--text-primary)] overflow-hidden font-sans">
      {/* Top Application Header */}
      <Header />

      {/* Main Content Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Center Dynamic View */}
        <main className="flex-1 h-full overflow-y-auto relative">
          <Suspense fallback={<ViewLoadingFallback />}>
            {renderActiveView()}
          </Suspense>
        </main>
      </div>

      {/* Floating 3D Tab (right edge) */}
      <Floating3DTab />

      {/* 3D Digital Twin Full-Screen Workspace Modal */}
      <Silo3DModal />

      {/* System Status & Diagnostics Modal */}
      <SystemStatusModal />

      {/* Global Interactive Hardware Inspection Modal */}
      <HardwareInspectorModal />
    </div>
  );
}

export default App;
