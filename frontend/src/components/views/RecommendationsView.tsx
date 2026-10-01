import React from 'react';
import {
  Lightbulb, AlertTriangle, ShieldCheck, CheckCircle2,
  Clock, ArrowRight, Wrench, ShieldAlert
} from 'lucide-react';
import { useAgrivaultStore } from '../../store/storageStore';

export const RecommendationsView: React.FC = () => {
  const { setActiveTab, setSelectedZone } = useAgrivaultStore();

  const recommendations = [
    {
      id: 'REC-01',
      zoneId: 'ZONE-C',
      title: 'Targeted Core Inspection & Low-Velocity Suction Aeration',
      urgency: 'URGENT',
      category: 'Physical Inspection & Aeration',
      trigger: 'Simultaneous 14.8% moisture excess and 86% Sitophilus acoustic detection in Zone C.',
      protocolSteps: [
        'Perform manual deep-core vacuum probe extraction at 8m depth to verify physical insect presence.',
        'If ambient air relative humidity is under 65%, initiate downward suction aeration fans at 0.1 m³/min/t.',
        'Check hopper outlet for grain kernel crusting or warm clumps.',
        'Log inspection findings in Agrivault Intervention Ledger to track risk decay.'
      ],
      safetyNotice: 'Decision support protocol only. Certified grain elevator safety procedures must be followed before silo bin entry.'
    },
    {
      id: 'REC-02',
      zoneId: 'ZONE-B',
      title: 'Headspace Moisture Condensation Mitigation',
      urgency: 'MEDIUM',
      category: 'Passive Aeration',
      trigger: 'Moisture trend increased by +0.3% over 6 hours in upper grain layer boundary.',
      protocolSteps: [
        'Open roof inspection dampers to vent trapped warm headspace air.',
        'Operate solar roof exhaust fans during evening low-humidity hours (19:00 - 22:00).',
        'Re-evaluate SHT31 humidity gradient after 6 hours.'
      ],
      safetyNotice: 'Verify roof safety harness points prior to roof damper inspection.'
    },
    {
      id: 'REC-03',
      zoneId: 'ZONE-A',
      title: 'Routine Scheduled Solar Radiation Monitoring',
      urgency: 'LOW',
      category: 'Preventive Routine',
      trigger: 'Surface zone within nominal parameters.',
      protocolSteps: [
        'Maintain automated 10-minute sensor telemetry sampling.',
        'Verify grain temperature sensor cables integrity during next weekly walk-around.'
      ],
      safetyNotice: 'Standard facility preventive checklist.'
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-slate-100 overflow-y-auto">
      {/* Mandatory Safety Notice Banner (Requirement 16) */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-300">
        <ShieldAlert className="w-5 h-5 text-indigo-400 shrink-0" />
        <div>
          <span className="font-bold">Agricultural Decision Support Notice:</span> Recommendations are decision support guidance only. Agrivault AI does NOT autonomously engage chemical fumigation, toxic pesticide dosing, or dangerous high-voltage machinery. All actions must be validated by certified grain storage operators.
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" /> Prescriptive Action Protocols & Recommendations
          </h2>
          <p className="text-xs text-slate-400">
            Actionable, rule-and-model-supported protocols tailored to the localized thermodynamic and acoustic signals of each zone.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('interventions')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
        >
          <Wrench className="w-4 h-4 text-sky-400" /> Log an Action Taken
        </button>
      </div>

      {/* Recommendations Cards */}
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className={`p-6 rounded-2xl border space-y-4 shadow-lg ${
              rec.urgency === 'URGENT'
                ? 'bg-red-950/20 border-red-500/40'
                : 'bg-slate-900/80 border-slate-800'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                  rec.urgency === 'URGENT' ? 'bg-red-500/20 text-red-300 border-red-500/40' :
                  rec.urgency === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                  'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {rec.urgency} URGENCY
                </span>
                <span className="text-xs text-slate-400 font-mono font-semibold">
                  Target: {rec.zoneId} • {rec.category}
                </span>
              </div>

              <button
                onClick={() => {
                  setSelectedZone(rec.zoneId);
                  setActiveTab('interventions');
                }}
                className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
              >
                Log Intervention for {rec.zoneId} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-100">{rec.title}</h3>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                <strong className="text-slate-300">Trigger:</strong> {rec.trigger}
              </p>
            </div>

            {/* Protocol Steps */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Step-by-Step Action Protocol:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {rec.protocolSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/40 border border-slate-700/40">
                    <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-sky-400 shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="text-slate-300 leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-slate-400 italic pt-1">
              ⚠️ {rec.safetyNotice}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
