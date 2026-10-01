import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  QrCode, ShieldCheck, FileCheck, Layers, Calendar,
  Scale, Wheat, ArrowRight, ExternalLink, X, Printer
} from 'lucide-react';
import { useAgrivaultStore } from '../../store/storageStore';
import { GrainLotItem } from '../../types';

export const GrainLotPassportView: React.FC = () => {
  const { grainLots } = useAgrivaultStore();
  const [selectedLot, setSelectedLot] = useState<GrainLotItem | null>(null);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-slate-100 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-sky-400" /> Grain Lot Records & QR Digital Passports
          </h2>
          <p className="text-xs text-slate-400">
            Cryptographically linked digital storage passports verifying biological integrity, cold chain history, and quality grading.
          </p>
        </div>
      </div>

      {/* Grain Lots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {grainLots.map((lot) => (
          <div
            key={lot.id}
            className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/30">
                  <Wheat className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-base text-slate-100">{lot.grainType}</h3>
                  <span className="font-mono text-xs text-sky-400">{lot.id}</span>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                lot.currentRisk === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                lot.currentRisk === 'WATCH' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}>
                {lot.currentRisk}
              </span>
            </div>

            {/* Lot Details */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-0.5">
                <span className="text-slate-400">Net Quantity:</span>
                <p className="font-bold text-slate-200">{(lot.quantityKg / 1000).toFixed(1)} Tonnes</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-0.5">
                <span className="text-slate-400">Intake Moisture:</span>
                <p className="font-bold text-slate-200">{lot.initialMoisture}% w.b.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-0.5">
                <span className="text-slate-400">Assigned Zone:</span>
                <p className="font-bold text-slate-200">{lot.storageUnitId} • {lot.zoneId}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-0.5">
                <span className="text-slate-400">Protein Content:</span>
                <p className="font-bold text-slate-200">{lot.proteinContent}%</p>
              </div>
            </div>

            {/* QR Card Preview & Open Action */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white rounded-lg">
                  <QRCodeSVG value={`https://agrivault.ai/passport/${lot.id}`} size={48} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-200">Verified Grain Passport</span>
                  <p className="text-[11px] text-slate-400">Scan for harvest & storage audit</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedLot(lot)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-semibold text-white shadow-sm transition-colors"
              >
                Inspect Passport <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Digital Passport Modal */}
      {selectedLot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/50">
              <div className="flex items-center gap-2.5">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-slate-100">Official Grain Digital Passport</h3>
              </div>
              <button
                onClick={() => setSelectedLot(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
              {/* Top QR & Batch Identification */}
              <div className="flex items-center gap-5 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="p-2 bg-white rounded-xl shrink-0">
                  <QRCodeSVG value={`https://agrivault.ai/passport/${selectedLot.id}`} size={96} />
                </div>
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30">
                    DIGITAL PRODUCT PASSPORT (DPP)
                  </span>
                  <div className="text-lg font-bold text-slate-100">{selectedLot.id}</div>
                  <p className="text-slate-400">{selectedLot.grainType}</p>
                  <p className="text-slate-400 font-mono">Origin: {selectedLot.origin}</p>
                </div>
              </div>

              {/* Historical & Sensor Audit Summary */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Audit & Storage Telemetry History
                </span>
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-2 text-slate-300">
                  <div className="flex justify-between">
                    <span>Intake Date:</span>
                    <span className="font-mono text-slate-100">{selectedLot.storageDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expected Storage Horizon:</span>
                    <span className="font-mono text-slate-100">{selectedLot.expectedDurationDays} Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Storage Location:</span>
                    <span className="font-mono text-slate-100">{selectedLot.storageUnitId} ({selectedLot.zoneId})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Interstitial Temperature:</span>
                    <span className="font-mono text-slate-100">26.4°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Moisture Content Retention:</span>
                    <span className="font-mono text-slate-100">{selectedLot.initialMoisture}% → Current 14.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Biological Status:</span>
                    <span className="font-bold text-amber-400">{selectedLot.currentRisk} (Under Active Monitoring)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-800/40">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" /> Print Certificate
              </button>
              <button
                onClick={() => setSelectedLot(null)}
                className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs font-semibold text-white transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
