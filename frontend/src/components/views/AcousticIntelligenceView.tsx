import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2, Play, Pause, Upload, Sparkles, AlertTriangle,
  Info, Mic, CheckCircle2, RefreshCw
} from 'lucide-react';
import { useAgrivaultStore } from '../../store/storageStore';

export const AcousticIntelligenceView: React.FC = () => {
  const { zones, selectedZoneId, setSelectedZone } = useAgrivaultStore();
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedZone, setLocalZone] = useState<string>(selectedZoneId);
  const waveformCanvasRef = useRef<HTMLCanvasElement>(null);
  const spectrogramCanvasRef = useRef<HTMLCanvasElement>(null);

  const isZoneC = selectedZone === 'ZONE-C';
  const pestProbability = isZoneC ? 86 : 4;
  const predictedSpecies = isZoneC ? 'Sitophilus oryzae (Rice Weevil)' : 'None (Ambient Background)';
  const confidence = isZoneC ? 91.4 : 98.2;
  const timestamp = '14 sec ago';

  // Live Canvas Waveform Rendering
  useEffect(() => {
    let animId: number;
    let phase = 0;

    const renderWaveform = () => {
      const canvas = waveformCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Clean light background grid
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Oscilloscope wave
      ctx.strokeStyle = isZoneC ? '#DC2626' : '#0284C7';
      ctx.lineWidth = 2;
      ctx.beginPath();

      const sliceWidth = width / 180;
      let x = 0;

      for (let i = 0; i < 180; i++) {
        const pestBurst = isZoneC ? Math.sin(i * 0.4 + phase * 3) * Math.sin(i * 0.08) * 32 : 0;
        const baseNoise = Math.sin(i * 0.15 + phase) * 8;
        const randomFlicker = (Math.random() - 0.5) * (isZoneC ? 12 : 3);
        const y = height / 2 + baseNoise + pestBurst + randomFlicker;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        x += sliceWidth;
      }
      ctx.stroke();

      if (isPlaying) {
        phase += 0.08;
      }
      animId = requestAnimationFrame(renderWaveform);
    };

    renderWaveform();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isZoneC]);

  // Spectrogram / MFCC Canvas Rendering
  useEffect(() => {
    const canvas = spectrogramCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const cols = 48;
    const rows = 16;
    const colWidth = width / cols;
    const rowHeight = height / rows;

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        // Higher intensity for mid-high frequencies in Zone C
        let intensity = Math.random() * 0.25;
        if (isZoneC && r >= 6 && r <= 11) {
          intensity += Math.sin(c * 0.3) * 0.5 + 0.35;
        }
        intensity = Math.max(0, Math.min(1, intensity));

        // Clean heat color mapping
        if (intensity > 0.7) {
          ctx.fillStyle = '#DC2626';
        } else if (intensity > 0.4) {
          ctx.fillStyle = '#EA580C';
        } else if (intensity > 0.2) {
          ctx.fillStyle = '#FCD34D';
        } else {
          ctx.fillStyle = '#F1F5F9';
        }

        ctx.fillRect(c * colWidth, height - (r + 1) * rowHeight, colWidth - 1, rowHeight - 1);
      }
    }
  }, [selectedZone, isZoneC]);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto text-slate-900 select-none animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Acoustic Intelligence
          </h2>
          <p className="text-xs text-slate-500">
            Real-time piezoelectric and MEMS acoustic vibration monitoring for early pest detection.
          </p>
        </div>

        {/* DEMO MODEL LABEL (Non-hallucinatory) */}
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-600" />
            <span>DEMO MODEL</span>
          </span>

          {/* Zone Selector */}
          <select
            value={selectedZone}
            onChange={(e) => {
              setLocalZone(e.target.value);
              setSelectedZone(e.target.value);
            }}
            className="px-3 py-1 rounded-lg border border-slate-300 text-xs font-medium text-slate-800 bg-white"
          >
            {zones.map((z) => (
              <option key={z.id} value={z.id}>{z.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: LEFT Audio Waveform (~60%), RIGHT Acoustic Intelligence (~40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT: Audio Waveform (Oscilloscope) */}
        <div className="lg:col-span-7 clean-card p-5 space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-sky-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Acoustic Waveform (INMP441)
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-1.5 rounded-lg border text-xs font-medium transition-colors ${
                  isPlaying ? 'bg-slate-100 text-slate-900 border-slate-300' : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <span className="text-[11px] font-mono text-slate-500">16.0 kHz PCM</span>
            </div>
          </div>

          {/* Canvas Waveform */}
          <div className="bg-slate-50 rounded-lg border border-slate-200 p-2 overflow-hidden">
            <canvas
              ref={waveformCanvasRef}
              width={540}
              height={140}
              className="w-full h-36 rounded"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Peak Amplitude: {isZoneC ? '42.8 dB SPL' : '18.2 dB SPL'}</span>
            <span className={isZoneC ? 'text-red-600 font-semibold' : 'text-slate-500'}>
              {isZoneC ? 'High-Frequency Burst Detected (2.4 kHz)' : 'Ambient background only'}
            </span>
          </div>
        </div>

        {/* RIGHT: Acoustic Intelligence Breakdown */}
        <div className="lg:col-span-5 clean-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Acoustic Intelligence
            </h3>
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
              isZoneC ? 'badge-critical' : 'badge-normal'
            }`}>
              {isZoneC ? 'Infestation Active' : 'Normal'}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Insect Probability */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <span className="text-slate-600 font-medium">Insect Probability</span>
              <span className="font-mono text-base font-bold text-slate-900">{pestProbability}%</span>
            </div>

            {/* Species */}
            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-medium">Predicted Species</span>
              <p className="font-semibold text-slate-900 text-sm">{predictedSpecies}</p>
            </div>

            {/* Confidence */}
            <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
              <span className="text-slate-600 font-medium">Model Confidence</span>
              <span className="font-mono font-bold text-slate-900">{confidence}%</span>
            </div>

            {/* Zone & Timestamp */}
            <div className="grid grid-cols-2 gap-2 text-slate-700">
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block uppercase">Zone</span>
                <span className="font-semibold text-slate-900">{selectedZone}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block uppercase">Timestamp</span>
                <span className="font-semibold text-slate-900">{timestamp}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM: Spectrogram & MFCC Visualization */}
      <div className="clean-card p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Spectrogram & MFCC Spectral Matrix
            </h3>
            <p className="text-[11px] text-slate-500">
              Time-frequency energy distribution (128-band Mel filterbank, 60 Hz – 8.0 kHz)
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">128 Mel Bins</span>
        </div>

        {/* Canvas Spectrogram */}
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-2 overflow-hidden">
          <canvas
            ref={spectrogramCanvasRef}
            width={720}
            height={100}
            className="w-full h-28 rounded"
          />
        </div>

        <div className="flex justify-between text-[10px] text-slate-500">
          <span>0.0s</span>
          <span>1.0s</span>
          <span>2.0s</span>
          <span>3.0s</span>
          <span>4.0s (Latest)</span>
        </div>
      </div>
    </div>
  );
};
