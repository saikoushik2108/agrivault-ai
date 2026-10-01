import React, { useState } from 'react';
import {
  FileText, Download, Printer, ShieldCheck, CheckCircle2,
  Calendar, Layers, HardDrive, AlertTriangle, ArrowRight
} from 'lucide-react';
import { useAgrivaultStore } from '../../store/storageStore';

export const ReportsView: React.FC = () => {
  const { zones, alerts, interventions } = useAgrivaultStore();
  const [reportingMonth, setReportingMonth] = useState('October 2026');

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-slate-100 overflow-y-auto">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-400" /> Comprehensive Grain Storage Audit Reports
          </h2>
          <p className="text-xs text-slate-400">
            Exportable regulatory compliance and asset preservation audit report for grain storage facilities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Print / Save PDF
          </button>
          <button
            onClick={() => alert('Official Agrivault Certified Grain Audit PDF report generated and downloaded.')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-semibold text-white shadow-md transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Download Full PDF
          </button>
        </div>
      </div>

      {/* Official Audit Document Paper Layout */}
      <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 text-xs text-slate-300">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30">
              AUDIT REPORT #AGV-2026-OCT-01
            </span>
            <h3 className="text-xl font-black text-slate-100 mt-1">
              Monthly Storage Integrity & Biomass Condition Report
            </h3>
            <p className="text-slate-400">
              Facility: Agrivault Terminal Unit #1 • Hard Red Winter Wheat (420 Tonnes)
            </p>
          </div>
          <div className="text-right font-mono text-[11px] text-slate-400">
            <div>Generated: {new Date().toLocaleDateString()}</div>
            <div>Period: Past 30 Days</div>
            <div className="text-emerald-400 font-bold mt-1">● CERTIFIED DIGITAL TWIN AUDIT</div>
          </div>
        </div>

        {/* Executive Summary Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 uppercase">Avg Temperature</span>
            <div className="text-xl font-bold text-slate-100">26.2°C</div>
            <p className="text-[10px] text-slate-400">Peak: 31.8°C (Zone C)</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 uppercase">Avg Moisture Content</span>
            <div className="text-xl font-bold text-slate-100">12.8% w.b.</div>
            <p className="text-[10px] text-amber-400">14.8% Hotspot in Zone C</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 uppercase">Acoustic Insect Detections</span>
            <div className="text-xl font-bold text-red-400">412 Events</div>
            <p className="text-[10px] text-slate-400">Sitophilus oryzae dominant</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 uppercase">Interventions Logged</span>
            <div className="text-xl font-bold text-emerald-400">{interventions.length} Verified</div>
            <p className="text-[10px] text-slate-400">-5.9 pts observed risk decay</p>
          </div>
        </div>

        {/* Monitored Zones Breakdown */}
        <div className="space-y-3 pt-2">
          <h4 className="font-bold text-sm text-slate-200 uppercase tracking-wider">
            1. Depth Layer Condition Matrix
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
              <thead className="bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase">
                <tr>
                  <th className="p-3">Zone</th>
                  <th className="p-3">Depth</th>
                  <th className="p-3">Risk Category</th>
                  <th className="p-3">Temp</th>
                  <th className="p-3">Moisture</th>
                  <th className="p-3">CO2</th>
                  <th className="p-3">Primary Diagnosis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {zones.map((z) => (
                  <tr key={z.id}>
                    <td className="p-3 font-semibold text-slate-200">{z.name}</td>
                    <td className="p-3 font-mono text-slate-400">{z.depthLevel}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        z.riskLevel === 'CRITICAL' ? 'text-red-400 bg-red-500/10' :
                        z.riskLevel === 'WATCH' ? 'text-amber-400 bg-amber-500/10' : 'text-emerald-400 bg-emerald-500/10'
                      }`}>
                        {z.riskLevel} ({z.riskScore})
                      </span>
                    </td>
                    <td className="p-3 font-mono">{z.temperature}°C</td>
                    <td className="p-3 font-mono">{z.moisture}%</td>
                    <td className="p-3 font-mono">{z.co2} ppm</td>
                    <td className="p-3 text-slate-400">
                      {z.id === 'ZONE-C' ? 'Biological hotspot core; requires aeration' : 'Nominal storage condition'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Interventions & Recommendations Summary */}
        <div className="space-y-3 pt-2">
          <h4 className="font-bold text-sm text-slate-200 uppercase tracking-wider">
            2. Verified Interventions & Prescriptive Follow-up
          </h4>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <p>
              • Operator logged physical core probe inspection at Zone C depth (8.2m). Visual kernel inspection confirmed presence of Sitophilus oryzae. Localized downward suction fans were triggered.
            </p>
            <p>
              • Observed risk dropped from 88.5 to 82.6 pts. Continuous 1-minute adaptive sampling remains active until moisture drops below 13.5%.
            </p>
          </div>
        </div>

        {/* Signatures & Certification */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-slate-400 text-xs">
          <div>
            <div>Audited By: <span className="text-slate-200 font-semibold">Agrivault AI Automated Kernel Telemetry Engine</span></div>
            <div>Facility Operator: <span className="text-slate-200 font-semibold">J. Miller (Certified Grain Storage Manager)</span></div>
          </div>
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
            <span className="font-mono text-[11px] font-bold">DIGITALLY SIGNED & VERIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
};
