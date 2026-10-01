import React, { useState } from 'react';
import {
  Wrench, Plus, CheckCircle2, Clock, ShieldAlert,
  ArrowRight, Sparkles, AlertTriangle, UserCheck
} from 'lucide-react';
import { useAgrivaultStore } from '../../store/storageStore';

export const InterventionsView: React.FC = () => {
  const { interventions, addIntervention, zones } = useAgrivaultStore();
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [targetZone, setTargetZone] = useState('ZONE-C');
  const [actionName, setActionName] = useState('Physical core probe inspection and aeration fan trigger');
  const [operator, setOperator] = useState('J. Miller (Silo Manager)');
  const [observation, setObservation] = useState('Sitophilus cluster confirmed; grain temperature dropped following downward aeration.');
  const [riskBefore, setRiskBefore] = useState(82.6);
  const [riskAfter, setRiskAfter] = useState(68.0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addIntervention({
      zoneId: targetZone,
      timestamp: 'Just now',
      actionTaken: actionName,
      operatorName: operator,
      observation: observation,
      riskBefore: Number(riskBefore),
      riskAfter: Number(riskAfter),
      status: 'COMPLETED'
    });
    setShowModal(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-slate-100 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-sky-400" /> Physical Interventions & Verification Ledger
          </h2>
          <p className="text-xs text-slate-400">
            Tracks operator actions, physical probe observations, and post-intervention risk score changes.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-semibold text-white shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" /> Log New Intervention
        </button>
      </div>

      {/* Mandatory Scientific Rigor Note (Requirement 24) */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400">
        <ShieldAlert className="w-4 h-4 text-sky-400 shrink-0" />
        <div>
          <strong className="text-slate-300">Methodology Clarification:</strong> Post-intervention metric changes are classified strictly as <span className="text-sky-300 font-semibold">"Observed Change"</span>. Causality is not assumed without longitudinal sensor verification.
        </div>
      </div>

      {/* Timeline of Interventions */}
      <div className="space-y-4">
        {interventions.map((item, idx) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-lg"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-500/10 text-sky-300 border border-sky-500/30">
                  {item.id}
                </span>
                <span className="font-bold text-sm text-slate-100">{item.actionTaken}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1"><UserCheck className="w-3.5 h-3.5 text-slate-400" /> {item.operatorName}</span>
                <span>• {item.timestamp}</span>
              </div>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-slate-400">Operator Observation:</strong> {item.observation}
            </div>

            {/* Before vs After Risk Score Timeline */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3 font-mono">
                <span className="text-slate-400">Observed Risk Shift:</span>
                <span className="text-red-400 font-bold">{item.riskBefore} pts</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-emerald-400 font-bold">{item.riskAfter || 'In Progress'} pts</span>
                {item.riskAfter && (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-semibold">
                    -{(item.riskBefore - item.riskAfter).toFixed(1)} pts Observed Change
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Target: {item.zoneId}</span>
            </div>
          </div>
        ))}
      </div>

      {/* New Intervention Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-100">Log Physical Storage Intervention</h3>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs text-slate-300">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Target Zone</label>
                <select
                  value={targetZone}
                  onChange={(e) => setTargetZone(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200"
                >
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>{z.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Action Protocol Taken</label>
                <input
                  type="text"
                  value={actionName}
                  onChange={(e) => setActionName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Operator Name & Credentials</label>
                <input
                  type="text"
                  value={operator}
                  onChange={(e) => setOperator(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Physical Observations</label>
                <textarea
                  rows={3}
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Risk Score Before</label>
                  <input
                    type="number"
                    step="0.1"
                    value={riskBefore}
                    onChange={(e) => setRiskBefore(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Risk Score After (Observed)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={riskAfter}
                    onChange={(e) => setRiskAfter(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold shadow-md transition-colors"
                >
                  Save Intervention Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
