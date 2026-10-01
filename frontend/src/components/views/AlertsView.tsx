import React, { useState } from 'react';
import {
  Bell, AlertTriangle, CheckCircle2, ShieldAlert,
  Clock, Check, Filter, ArrowRight, Eye
} from 'lucide-react';
import { useAgrivaultStore } from '../../store/storageStore';

export const AlertsView: React.FC = () => {
  const { alerts, acknowledgeAlert, setSelectedZone, setActiveTab } = useAgrivaultStore();
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filteredAlerts = filterSeverity === 'ALL'
    ? alerts
    : alerts.filter(a => a.severity === filterSeverity);

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return <span className="px-2.5 py-0.5 rounded text-xs font-bold badge-critical">CRITICAL</span>;
      case 'WARNING':
        return <span className="px-2.5 py-0.5 rounded text-xs font-bold badge-warning">WARNING</span>;
      case 'WATCH':
        return <span className="px-2.5 py-0.5 rounded text-xs font-bold badge-watch">WATCH</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded text-xs font-bold badge-normal">INFO</span>;
    }
  };

  const handleViewZone = (zoneId: string) => {
    setSelectedZone(zoneId);
    setActiveTab('monitoring');
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto text-slate-900 select-none animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Alerts & Threshold Violations
          </h2>
          <p className="text-xs text-slate-500">
            Active and historical automated storage alarms requiring operator inspection.
          </p>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          {['ALL', 'CRITICAL', 'WARNING', 'WATCH'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                filterSeverity === sev
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Feed */}
      <div className="space-y-3.5">
        {filteredAlerts.length === 0 ? (
          <div className="clean-card p-12 text-center text-slate-500 text-xs">
            No alerts found for the selected filter.
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.severity === 'CRITICAL';

            return (
              <div
                key={alert.id}
                className={`clean-card p-5 space-y-3 transition-all ${
                  alert.acknowledged
                    ? 'opacity-70 bg-slate-50/50'
                    : isCritical
                    ? 'border-red-200 ring-1 ring-red-100'
                    : ''
                }`}
              >
                {/* Alert Top Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    {getSeverityBadge(alert.severity)}
                    <span className="font-bold text-sm text-slate-900">{alert.zoneId}</span>
                    <span className="text-xs text-slate-400 font-mono">• {alert.id}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-500">{alert.timestamp}</span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      alert.acknowledged ? 'bg-slate-100 text-slate-600' : 'bg-red-50 text-red-700'
                    }`}>
                      {alert.acknowledged ? 'Acknowledged' : 'Active'}
                    </span>
                  </div>
                </div>

                {/* Alert Title & Message */}
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">{alert.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{alert.reason}</p>
                </div>

                {/* Recommended Action & Working Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-slate-50">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <span className="font-semibold text-slate-800">Action:</span>
                    <span>{alert.recommendedAction}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleViewZone(alert.zoneId)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-sky-700 hover:text-sky-900 hover:bg-sky-50 border border-sky-200 transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Zone</span>
                    </button>

                    {!alert.acknowledged && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Acknowledge</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
