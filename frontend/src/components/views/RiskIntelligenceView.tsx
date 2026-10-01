import React, { useState } from 'react';
import {
  ShieldAlert, TrendingUp, Sparkles, CheckCircle2,
  AlertTriangle, ArrowRight, HelpCircle, Layers, Info
} from 'lucide-react';
import { useAgrivaultStore } from '../../store/storageStore';

export const RiskIntelligenceView: React.FC = () => {
  const { zones, setSelectedZone, open3DModal } = useAgrivaultStore();
  const [selectedZoneTab, setSelectedZoneTab] = useState<string>('ZONE-C');

  const activeZone = zones.find(z => z.id === selectedZoneTab) || zones[2];

  // SHAP Risk Contributors for the selected zone
  const getContributors = (zoneId: string) => {
    if (zoneId === 'ZONE-C') {
      return [
        {
          name: 'Moisture Migration Trend',
          contribution: '+34 pts',
          pct: 78,
          direction: 'positive',
          note: 'Moisture at 14.8% exceeding safe storage ceiling (13.5%) with +0.4%/h upward drift.'
        },
        {
          name: 'Acoustic Feeding Activity',
          contribution: '+28 pts',
          pct: 65,
          direction: 'positive',
          note: 'INMP441 sensor detected high-frequency feeding bursts (86% insect probability).'
        },
        {
          name: 'Temperature Respiration Rate',
          contribution: '+14 pts',
          pct: 35,
          direction: 'positive',
          note: 'Interstitial temperature rose to 31.8°C (+0.9°C/h), indicating biological heat production.'
        },
        {
          name: 'Environmental Headspace Anomaly',
          contribution: '+6 pts',
          pct: 18,
          direction: 'positive',
          note: 'CO2 respiration peaked at 940 ppm against ambient 450 ppm baseline.'
        }
      ];
    }
    return [
      {
        name: 'Moisture Equilibrium Margin',
        contribution: '+4 pts',
        pct: 12,
        direction: 'neutral',
        note: `Grain moisture is safe at ${activeZone.moisture}% (below 13.5% ceiling).`
      },
      {
        name: 'Acoustic Ambient Baseline',
        contribution: '+2 pts',
        pct: 6,
        direction: 'neutral',
        note: 'Normal kernel settling and ambient ventilation noise (no insect signatures).'
      },
      {
        name: 'Temperature Stability',
        contribution: '+3 pts',
        pct: 8,
        direction: 'neutral',
        note: `Temperature stable at ${activeZone.temperature}°C.`
      },
      {
        name: 'Air Exchange Baseline',
        contribution: '+1 pts',
        pct: 4,
        direction: 'neutral',
        note: `CO2 at normal equilibrium (${activeZone.co2} ppm).`
      }
    ];
  };

  const contributors = getContributors(selectedZoneTab);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto text-slate-900 select-none animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Risk Intelligence
          </h2>
          <p className="text-xs text-slate-500">
            Multimodal risk fusion combining acoustic vibration, thermodynamic drift, and biological respiration.
          </p>
        </div>

        {/* Demo Model Badge */}
        <span className="px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5 self-start sm:self-auto">
          <Info className="w-3.5 h-3.5 text-slate-500" />
          <span>XGBoost Fusion • Demo Model</span>
        </span>
      </div>

      {/* OVERALL RISK CARD */}
      <div className="clean-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Overall Silo Storage Risk
          </span>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-slate-900">28</span>
            <span className="text-sm text-slate-400 font-medium">/ 100</span>
            <span className="px-2.5 py-1 rounded-md text-xs font-bold badge-normal ml-2">
              NORMAL
            </span>
          </div>
          <p className="text-xs text-slate-600 max-w-xl">
            Silo aggregate risk is currently within acceptable preservation boundaries. However, localized hotspot activity in Zone C requires preventive intervention.
          </p>
        </div>

        <div className="w-full md:w-72 space-y-2">
          <div className="flex justify-between text-xs text-slate-600 font-medium">
            <span>Silo Index</span>
            <span className="font-bold text-slate-900">28% (Normal)</span>
          </div>
          <div className="risk-meter">
            <div className="risk-meter-fill normal" style={{ width: '28%' }} />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>0 Safe</span>
            <span>35 Watch</span>
            <span>55 Warning</span>
            <span>75 Critical</span>
          </div>
        </div>
      </div>

      {/* Risk by Zone Breakdown */}
      <div className="clean-card p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Risk by Strata Zone
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {zones.map((z) => {
            const isSelected = selectedZoneTab === z.id;
            const isCritical = z.riskLevel === 'CRITICAL';

            return (
              <div
                key={z.id}
                onClick={() => setSelectedZoneTab(z.id)}
                className={`p-4 rounded-lg border transition-all cursor-pointer bg-white ${
                  isSelected
                    ? 'border-slate-900 ring-2 ring-slate-900/10 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">{z.name.split(' - ')[0]}</h4>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    z.riskLevel === 'CRITICAL' ? 'badge-critical' :
                    z.riskLevel === 'WARNING' ? 'badge-warning' :
                    z.riskLevel === 'WATCH' ? 'badge-watch' : 'badge-normal'
                  }`}>
                    {z.riskLevel}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{z.depthLevel}</p>

                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-slate-900">{z.riskScore}</span>
                  <span className="text-xs text-slate-400">/ 100</span>
                </div>

                <div className="risk-meter mt-1.5">
                  <div
                    className={`risk-meter-fill ${z.riskLevel.toLowerCase()}`}
                    style={{ width: `${z.riskScore}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Left Risk Contributors (SHAP), Right AI Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left ~65%: Risk Contributors (SHAP Attribution) */}
        <div className="lg:col-span-8 clean-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Risk Contributors ({activeZone.name.split(' - ')[0]})
              </h3>
              <p className="text-[11px] text-slate-500">
                SHAP feature attributions explaining the reasons behind the assessed score
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-700 font-mono">
              Score: {activeZone.riskScore} / 100
            </span>
          </div>

          <div className="space-y-4">
            {contributors.map((c, i) => (
              <div key={i} className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{c.name}</span>
                  <span className="font-mono font-bold text-slate-900">{c.contribution}</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      c.pct > 50 ? 'bg-red-500' : c.pct > 25 ? 'bg-amber-500' : 'bg-slate-400'
                    }`}
                    style={{ width: `${c.pct}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-500">
                  {c.note}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right ~35%: AI Recommendation Card */}
        <div className="lg:col-span-4 clean-card p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              AI Recommendation
            </h3>
          </div>

          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-lg space-y-1.5 text-xs">
            <span className="font-bold text-emerald-900 uppercase text-[10px] tracking-wider">
              Protocol Action
            </span>
            <p className="text-emerald-950 font-medium leading-relaxed">
              "Monitor Zone C moisture levels and inspect the zone if the upward trend continues."
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">
              Action Checklist
            </span>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Perform physical deep-core probe sampling at 8.2m depth in Zone C.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Verify insect larvae presence (*Sitophilus oryzae* cluster).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Prepare low-velocity aeration fans to equalize core thermal gradient.</span>
              </li>
            </ul>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setSelectedZone(selectedZoneTab);
                open3DModal();
              }}
              className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors text-center"
            >
              Inspect Hotspot in 3D View →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
