import React from 'react';
import {
  ShieldAlert, Activity, AlertTriangle, ArrowRight,
  TrendingUp, CheckCircle2, ChevronRight, Sparkles, Droplets
} from 'lucide-react';
import { useAgrivaultStore } from '../../store/storageStore';

export const OverviewView: React.FC = () => {
  const {
    zones,
    alerts,
    setActiveTab,
    setSelectedZone,
    selectedZoneId,
    open3DModal
  } = useAgrivaultStore();

  const activeAlerts = alerts.filter(a => !a.acknowledged);

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded text-xs font-semibold badge-critical">Critical</span>;
      case 'WARNING':
        return <span className="px-2 py-0.5 rounded text-xs font-semibold badge-warning">Warning</span>;
      case 'WATCH':
        return <span className="px-2 py-0.5 rounded text-xs font-semibold badge-watch">Watch</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-xs font-semibold badge-normal">Normal</span>;
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto text-slate-900 select-none animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Overview
          </h2>
          <p className="text-xs text-slate-500">
            Real-time silo storage telemetry, multimodal risk assessment, and active alerts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={open3DModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs"
          >
            <span>Open 3D Twin</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Summary KPI Cards (4–5 compact cards) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {/* KPI 1: Overall Risk */}
        <div className="kpi-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Overall Risk</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold badge-normal">
              NORMAL
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900">28</span>
            <span className="text-xs text-slate-400 font-normal">/ 100</span>
          </div>
          <div className="risk-meter">
            <div className="risk-meter-fill normal" style={{ width: '28%' }} />
          </div>
        </div>

        {/* KPI 2: Active Alerts */}
        <div className="kpi-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Alerts</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900">{activeAlerts.length}</span>
            <span className="text-xs text-slate-400 font-normal">requires attention</span>
          </div>
          <p className="text-[11px] text-slate-500 truncate">1 Critical • 1 Warning</p>
        </div>

        {/* KPI 3: Monitored Zones */}
        <div className="kpi-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Monitored Zones</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900">4 / 4</span>
          </div>
          <p className="text-[11px] text-slate-500">All depth strata active</p>
        </div>

        {/* KPI 4: Pest Probability */}
        <div className="kpi-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pest Probability</span>
            <span className="text-[11px] text-amber-700 font-semibold">Elevated (Zone C)</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900">8%</span>
            <span className="text-xs text-slate-400 font-normal">silo aggregate</span>
          </div>
          <p className="text-[11px] text-slate-500">Zone C isolated cluster</p>
        </div>

        {/* KPI 5: System Health */}
        <div className="kpi-card space-y-2 col-span-2 md:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">System Health</span>
            <span className="text-emerald-700 font-semibold text-[11px]">Nominal</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900">98%</span>
          </div>
          <p className="text-[11px] text-slate-500">Sensors & Gateway online</p>
        </div>
      </div>

      {/* Main Content Area: Left ~65% Storage Overview, Right ~35% AI Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT ~65%: Storage Overview (2D Analytical Representation of Zones) */}
        <div className="lg:col-span-8 space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Storage Overview (Zones)
            </h3>
            <button
              onClick={() => setActiveTab('monitoring')}
              className="text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1 transition-colors"
            >
              <span>Detailed Sensor Telemetry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {zones.map((z) => {
              const isSelected = selectedZoneId === z.id;
              const isCritical = z.riskLevel === 'CRITICAL';

              return (
                <div
                  key={z.id}
                  onClick={() => setSelectedZone(z.id)}
                  className={`clean-card p-4 cursor-pointer transition-all ${
                    isSelected ? 'ring-2 ring-slate-900 border-transparent shadow-sm' : ''
                  } ${isCritical ? 'border-red-200' : ''}`}
                >
                  {/* Zone Header */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{z.name}</h4>
                      <p className="text-[11px] text-slate-500">{z.depthLevel}</p>
                    </div>
                    {getRiskBadge(z.riskLevel)}
                  </div>

                  {/* Telemetry Metrics */}
                  <div className="grid grid-cols-3 gap-2 pt-3 text-center">
                    <div className="p-2 rounded bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-medium uppercase block">Temp</span>
                      <span className="text-sm font-bold text-slate-900">{z.temperature}°C</span>
                    </div>

                    <div className="p-2 rounded bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-medium uppercase block">Humidity</span>
                      <span className="text-sm font-bold text-slate-900">{z.humidity}%</span>
                    </div>

                    <div className="p-2 rounded bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-medium uppercase block">Moisture</span>
                      <span className="text-sm font-bold text-slate-900">{z.moisture}%</span>
                    </div>
                  </div>

                  {/* Micro Footer Indicator */}
                  <div className="flex items-center justify-between mt-3 pt-2 text-[11px] text-slate-500 border-t border-slate-50">
                    <span>CO2: {z.co2} ppm</span>
                    <span className="text-sky-700 font-medium hover:underline">
                      Focus in 3D →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT ~35%: AI Intelligence Card */}
        <div className="lg:col-span-4 clean-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                AI Intelligence
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              Risk Increasing
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Target Area */}
            <div>
              <span className="text-[11px] text-slate-400 font-medium uppercase">Focal Hotspot</span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">Zone C (Mid-Lower Core)</p>
            </div>

            {/* Primary Contributor */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Primary Contributor
              </span>
              <p className="text-slate-800 font-medium leading-relaxed">
                Rising moisture trend (+0.4% in 1h) & acoustic feeding pulses detected by INMP441 sensor.
              </p>
            </div>

            {/* Short-Term Trend */}
            <div>
              <span className="text-[11px] text-slate-400 font-medium uppercase">Short-Term Trajectory</span>
              <p className="text-slate-700 mt-0.5">
                Thermal convection moving heat toward Zone B boundary. Spoilage window: 48-72h without aeration.
              </p>
            </div>

            {/* Recommended Action */}
            <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 space-y-1">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                Recommended Action
              </span>
              <p className="text-emerald-950 font-medium leading-relaxed">
                Inspect Zone C core moisture level and activate low-velocity downward suction aeration fans.
              </p>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => setActiveTab('risk')}
                className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors text-center"
              >
                View Risk Contributors (SHAP)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Risk Trajectory Trend Chart & Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Risk Trend Trajectory Chart (72h Forecast) */}
        <div className="lg:col-span-7 clean-card p-5 space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Risk Trajectory (72-Hour Forecast)
              </h3>
              <p className="text-[11px] text-slate-500">
                Temporal XGBoost predictive model with 95% confidence intervals
              </p>
            </div>
            <button
              onClick={() => setActiveTab('risk')}
              className="text-xs font-semibold text-sky-700 hover:text-sky-900 transition-colors"
            >
              Full Forecast Details →
            </button>
          </div>

          {/* SVG Trajectory Chart */}
          <div className="h-48 w-full bg-slate-50 rounded-lg border border-slate-100 p-3 flex flex-col justify-between">
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Risk 100</span>
              <span className="text-red-500 font-bold">Critical Threshold (75)</span>
              <span>Risk 0</span>
            </div>

            <svg viewBox="0 0 500 130" className="w-full h-32 overflow-visible">
              {/* Threshold line */}
              <line x1="0" y1="35" x2="500" y2="35" stroke="#FCA5A5" strokeDasharray="4 4" strokeWidth="1" />

              {/* Confidence Band Polygon */}
              <polygon
                points="0,95 100,90 200,80 320,60 420,40 500,28 500,60 420,70 320,85 200,98 100,105 0,105"
                fill="#E0F2FE"
                opacity="0.7"
              />

              {/* Trajectory Line */}
              <polyline
                points="0,100 100,96 200,88 320,72 420,54 500,42"
                fill="none"
                stroke="#0284C7"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Data points */}
              <circle cx="0" cy="100" r="4" fill="#0284C7" />
              <circle cx="200" cy="88" r="4" fill="#0284C7" />
              <circle cx="320" cy="72" r="4" fill="#0284C7" />
              <circle cx="420" cy="54" r="4" fill="#EA580C" />
              <circle cx="500" cy="42" r="4" fill="#DC2626" />
            </svg>

            <div className="flex justify-between text-[11px] text-slate-500 font-medium">
              <span>Now (28)</span>
              <span>+12h (36)</span>
              <span>+24h (48)</span>
              <span>+48h (66)</span>
              <span>+72h (82 - Critical)</span>
            </div>
          </div>
        </div>

        {/* Recent Alerts Feed */}
        <div className="lg:col-span-5 clean-card p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Alerts</h3>
              <p className="text-[11px] text-slate-500">Live storage warnings and threshold breaches</p>
            </div>
            <button
              onClick={() => setActiveTab('alerts')}
              className="text-xs font-semibold text-sky-700 hover:text-sky-900 transition-colors"
            >
              All Alerts ({alerts.length}) →
            </button>
          </div>

          <div className="space-y-2.5">
            {alerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className="p-3 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getRiskBadge(alert.severity)}
                    <span className="font-semibold text-slate-800 text-xs">{alert.zoneId}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{alert.timestamp}</span>
                </div>

                <p className="text-xs text-slate-700 font-medium leading-snug">
                  {alert.title}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500 truncate max-w-[200px]">
                    {alert.reason}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedZone(alert.zoneId);
                      setActiveTab('monitoring');
                    }}
                    className="text-xs font-semibold text-sky-700 hover:text-sky-900 hover:underline shrink-0"
                  >
                    View Zone
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
