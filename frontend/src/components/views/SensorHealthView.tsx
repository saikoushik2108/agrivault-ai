import React from 'react';
import {
  HeartPulse, Battery, Radio, Clock, CheckCircle2,
  AlertTriangle, Sliders, ShieldCheck, Activity, Cpu
} from 'lucide-react';
import { useAgrivaultStore } from '../../store/storageStore';

export const SensorHealthView: React.FC = () => {
  const { samplingIntervals, updateSamplingInterval, setSelectedHardware } = useAgrivaultStore();

  const sensorFleet = [
    {
      id: 'sht31-c',
      hwId: 'sht31',
      name: 'SHT31-C (Zone C Core)',
      type: 'Temp & Humidity',
      status: 'ONLINE',
      battery: 96,
      rssi: -58,
      lastSeen: '4 sec ago',
      quality: '100% (No packet loss)',
      zone: 'Zone C',
      sampling: `${samplingIntervals.critical}s (Adaptive High)`
    },
    {
      id: 'inmp441-c',
      hwId: 'inmp441',
      name: 'INMP441-C (Zone C Mic)',
      type: 'MEMS Acoustic',
      status: 'ONLINE',
      battery: 94,
      rssi: -58,
      lastSeen: '1 sec ago',
      quality: '99.8% (I2S DMA Active)',
      zone: 'Zone C',
      sampling: 'Continuous Audio Stream'
    },
    {
      id: 'moist-c',
      hwId: 'moisture-sensor',
      name: 'Capacitive Probe #3',
      type: 'Grain Moisture',
      status: 'ONLINE',
      battery: 100,
      rssi: -54,
      lastSeen: '8 sec ago',
      quality: '100% Calibrated',
      zone: 'Zone C',
      sampling: `${samplingIntervals.critical}s (Adaptive High)`
    },
    {
      id: 'co2-c',
      hwId: 'co2-sensor',
      name: 'NDIR SCD30-C',
      type: 'CO2 Optical Chamber',
      status: 'WARNING',
      battery: 91,
      rssi: -66,
      lastSeen: '22 sec ago',
      quality: 'Elevated Gas Flag',
      zone: 'Zone C',
      sampling: `${samplingIntervals.critical}s (Adaptive High)`
    },
    {
      id: 'esp32-node',
      hwId: 'esp32',
      name: 'ESP32 Gateway Node #3',
      type: 'Wireless Acquisition',
      status: 'ONLINE',
      battery: 95,
      rssi: -52,
      lastSeen: 'Just now',
      quality: '0 dropped frames',
      zone: 'Zone C Exterior',
      sampling: 'FreeRTOS Task Scheduler'
    },
    {
      id: 'rpi5-gateway',
      hwId: 'rpi5',
      name: 'Raspberry Pi 5 Edge AI',
      type: 'Local Edge Gateway',
      status: 'ONLINE',
      battery: 100,
      rssi: -45,
      lastSeen: 'Just now',
      quality: 'Local Inference Active',
      zone: 'Control Cabinet',
      sampling: 'Autonomous Daemon'
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-slate-100 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-emerald-400" /> Sensor Fleet Diagnostics & Adaptive Sampling
          </h2>
          <p className="text-xs text-slate-400">
            Monitors hardware battery states, wireless signal RSSI, data packet integrity, and dynamic rate throttling.
          </p>
        </div>
      </div>

      {/* Adaptive Sampling Rate Configuration (Requirement 17) */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Autonomous Adaptive Sampling Policy
            </h3>
          </div>
          <span className="text-xs text-emerald-400 font-mono font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Policy Engine Running
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          To preserve sensor battery life and reduce telemetry bus traffic, Agrivault dynamically accelerates sampling frequency when a zone elevates to WATCH or CRITICAL risk.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Normal Zone */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400">Normal Risk Zones</span>
              <span className="text-xs font-mono text-slate-400">{samplingIntervals.normal}s</span>
            </div>
            <label className="block text-[11px] text-slate-400">Sampling Interval (Seconds):</label>
            <input
              type="range"
              min="120"
              max="1800"
              step="60"
              value={samplingIntervals.normal}
              onChange={(e) => updateSamplingInterval('normal', Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="text-[10px] text-slate-400 font-mono">
              Current: Every {samplingIntervals.normal / 60} minutes
            </div>
          </div>

          {/* Watch Zone */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400">Watch Risk Zones</span>
              <span className="text-xs font-mono text-slate-400">{samplingIntervals.watch}s</span>
            </div>
            <label className="block text-[11px] text-slate-400">Sampling Interval (Seconds):</label>
            <input
              type="range"
              min="60"
              max="600"
              step="30"
              value={samplingIntervals.watch}
              onChange={(e) => updateSamplingInterval('watch', Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="text-[10px] text-slate-400 font-mono">
              Current: Every {samplingIntervals.watch / 60} minutes
            </div>
          </div>

          {/* Critical Zone */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-400">Critical Hotspot Zones</span>
              <span className="text-xs font-mono text-slate-400">{samplingIntervals.critical}s</span>
            </div>
            <label className="block text-[11px] text-slate-400">Sampling Interval (Seconds):</label>
            <input
              type="range"
              min="10"
              max="120"
              step="10"
              value={samplingIntervals.critical}
              onChange={(e) => updateSamplingInterval('critical', Number(e.target.value))}
              className="w-full accent-red-500 cursor-pointer"
            />
            <div className="text-[10px] text-slate-400 font-mono">
              Current: Every {samplingIntervals.critical} seconds (High Precision)
            </div>
          </div>
        </div>
      </div>

      {/* Sensor Hardware Health Table */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" /> Active Hardware Nodes & Telemetry Integrity
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase font-mono">
                <th className="pb-3">Sensor Node</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Battery SoC</th>
                <th className="pb-3">Signal (RSSI)</th>
                <th className="pb-3">Active Sampling</th>
                <th className="pb-3">Data Quality</th>
                <th className="pb-3 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {sensorFleet.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-semibold text-slate-200">{s.name}</td>
                  <td className="py-3 text-slate-400">{s.type}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      s.status === 'ONLINE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="flex items-center gap-1.5 text-slate-200">
                      <Battery className="w-3.5 h-3.5 text-emerald-400" /> {s.battery}%
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="flex items-center gap-1 text-slate-200">
                      <Radio className="w-3.5 h-3.5 text-sky-400" /> {s.rssi} dBm
                    </span>
                  </td>
                  <td className="py-3 text-sky-300">{s.sampling}</td>
                  <td className="py-3 text-slate-300">{s.quality}</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => setSelectedHardware(s.hwId)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 font-sans transition-colors"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
