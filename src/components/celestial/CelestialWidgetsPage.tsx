import React from 'react';
import { ProductionRecord, ProductionKPIs } from '../../types';
import {
  Thermometer,
  Gauge,
  Activity,
  Wind,
  Zap,
  Cpu,
  Layers,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sliders,
  BatteryCharging
} from 'lucide-react';

interface CelestialWidgetsPageProps {
  records: ProductionRecord[];
  kpis: ProductionKPIs;
  onAskCopilot: (query: string) => void;
}

export const CelestialWidgetsPage: React.FC<CelestialWidgetsPageProps> = ({
  records,
  kpis,
  onAskCopilot,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#242735]">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Plant Telemetry & Equipment Sensors</span>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-sm">
              LIVE IoT
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time IoT sensors, reflow oven thermal zones, pick-and-place nozzle vacuum, and cleanroom air quality.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onAskCopilot('What is our current equipment health and reflow oven thermal stability?')}
          className="px-3 py-1.5 text-xs font-semibold bg-[#242735] hover:bg-[#2e3345] text-slate-200 border border-[#2e3242] rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Ask AI Equipment Health</span>
        </button>
      </div>

      {/* Row 1: High-Priority Equipment Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Widget 1: SMT Pick & Place CPH Speed */}
        <div className="bg-[#181a22] border border-[#242735] rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>SMT Mount Speed</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
              OPTIMAL
            </span>
          </div>
          <div className="my-4">
            <div className="text-2xl font-extrabold text-white font-mono">
              64,280 <span className="text-xs font-normal text-slate-400">CPH</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Components Per Hour (Rated 68k)</p>
          </div>
          <div className="w-full bg-[#242735] h-2 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 w-[94%]" />
          </div>
        </div>

        {/* Widget 2: Reflow Peak Temp */}
        <div className="bg-[#181a22] border border-[#242735] rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-[#e11d48]" />
              <span>Reflow Peak Temp</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
              ±1.2°C
            </span>
          </div>
          <div className="my-4">
            <div className="text-2xl font-extrabold text-white font-mono">
              244.6 <span className="text-xs font-normal text-slate-400">°C</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">SAC305 Lead-Free Profile Zone 7</p>
          </div>
          <div className="w-full bg-[#242735] h-2 rounded-full overflow-hidden">
            <div className="h-full bg-[#e11d48] w-[86%]" />
          </div>
        </div>

        {/* Widget 3: Solder Paste Thickness (SPI) */}
        <div className="bg-[#181a22] border border-[#242735] rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>SPI Solder Volume</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
              Cpk 1.54
            </span>
          </div>
          <div className="my-4">
            <div className="text-2xl font-extrabold text-white font-mono">
              128.4 <span className="text-xs font-normal text-slate-400">μm</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Stencil Aperture Target: 130 ±15μm</p>
          </div>
          <div className="w-full bg-[#242735] h-2 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 w-[91%]" />
          </div>
        </div>

        {/* Widget 4: Nitrogen Purity */}
        <div className="bg-[#181a22] border border-[#242735] rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-purple-400" />
              <span>N2 Chamber Purity</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
              99.98%
            </span>
          </div>
          <div className="my-4">
            <div className="text-2xl font-extrabold text-white font-mono">
              340 <span className="text-xs font-normal text-slate-400">PPM O2</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Low-Oxidation Reflow Environment</p>
          </div>
          <div className="w-full bg-[#242735] h-2 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 w-[96%]" />
          </div>
        </div>
      </div>

      {/* Row 2: 10-Zone Reflow Oven Thermocouple Live Temperature Profile */}
      <div className="bg-[#181a22] border border-[#242735] rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between pb-4 border-b border-[#242735]">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-[#e11d48]" />
              <span>10-Zone Convection Reflow Oven Thermal Profile (Zone 1 - Zone 10)</span>
            </h3>
            <p className="text-[11px] text-slate-400">Real-time Top/Bottom Heating Core Temperatures vs. Target Recipe Curve</p>
          </div>
          <span className="text-xs font-mono text-emerald-400">Belt Speed: 0.85 m/min</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3 pt-5">
          {[
            { zone: 'Z1 Pre', target: 140, current: 140.8, status: 'normal' },
            { zone: 'Z2 Pre', target: 160, current: 159.4, status: 'normal' },
            { zone: 'Z3 Soak', target: 175, current: 175.1, status: 'normal' },
            { zone: 'Z4 Soak', target: 185, current: 184.9, status: 'normal' },
            { zone: 'Z5 Soak', target: 195, current: 196.2, status: 'normal' },
            { zone: 'Z6 Ramp', target: 215, current: 214.8, status: 'normal' },
            { zone: 'Z7 Peak', target: 245, current: 244.6, status: 'normal' },
            { zone: 'Z8 Peak', target: 242, current: 241.9, status: 'normal' },
            { zone: 'Z9 Cool', target: 170, current: 168.5, status: 'normal' },
            { zone: 'Z10 Cool', target: 110, current: 108.2, status: 'normal' },
          ].map((z, idx) => (
            <div key={idx} className="bg-[#13151b] border border-[#242735] rounded-lg p-3 text-center space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block">{z.zone}</span>
              <span className="text-sm font-extrabold text-white font-mono block">{z.current}°C</span>
              <span className="text-[9px] text-slate-500 block">Tgt: {z.target}°C</span>
              <div className="w-full bg-[#242735] h-1 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-[#e11d48]"
                  style={{ width: `${Math.min(100, (z.current / 260) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 3: Cleanroom Environment & Machine Feeders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Environment Monitor */}
        <div className="bg-[#181a22] border border-[#242735] rounded-xl p-5 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span>Cleanroom Class 10,000 Environment</span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" /> ISO-14644 Verified
            </span>
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#13151b] border border-[#242735] rounded-lg space-y-1">
              <span className="text-slate-400 text-[10px]">Ambient Temperature</span>
              <p className="text-lg font-bold text-white font-mono">22.4°C</p>
              <span className="text-[9px] text-emerald-400 font-medium">Standard 22 ±2°C</span>
            </div>
            <div className="p-3 bg-[#13151b] border border-[#242735] rounded-lg space-y-1">
              <span className="text-slate-400 text-[10px]">Relative Humidity</span>
              <p className="text-lg font-bold text-white font-mono">48.2% RH</p>
              <span className="text-[9px] text-emerald-400 font-medium">Standard 40 - 60%</span>
            </div>
            <div className="p-3 bg-[#13151b] border border-[#242735] rounded-lg space-y-1">
              <span className="text-slate-400 text-[10px]">ESD Surface Resistivity</span>
              <p className="text-lg font-bold text-white font-mono">1.2 × 10⁶ Ω</p>
              <span className="text-[9px] text-emerald-400 font-medium">Grounding Verified</span>
            </div>
            <div className="p-3 bg-[#13151b] border border-[#242735] rounded-lg space-y-1">
              <span className="text-slate-400 text-[10px]">Differential Pressure</span>
              <p className="text-lg font-bold text-white font-mono">+18 Pa</p>
              <span className="text-[9px] text-emerald-400 font-medium">Positive Pressure Active</span>
            </div>
          </div>
        </div>

        {/* Machine Feeder Status */}
        <div className="bg-[#181a22] border border-[#242735] rounded-xl p-5 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span>High-Speed Mounter Intelligent Feeder Reels</span>
            <span className="text-[10px] text-slate-400 font-mono">Slot 01 - 120</span>
          </h3>

          <div className="space-y-2.5 text-xs">
            {[
              { slot: 'F-014', part: '0201 Cap 100nF 6.3V', remaining: '4,210 pcs', pct: 84, timeRemaining: '2.8 hrs', alert: false },
              { slot: 'F-028', part: '0402 Res 10kΩ 1%', remaining: '820 pcs', pct: 16, timeRemaining: '28 mins', alert: true },
              { slot: 'F-062', part: 'QFN-32 PMIC IC', remaining: '1,490 pcs', pct: 72, timeRemaining: '5.1 hrs', alert: false },
              { slot: 'F-091', part: 'BGA-128 Flash Memory', remaining: '2,880 pcs', pct: 92, timeRemaining: '9.4 hrs', alert: false },
            ].map((f, idx) => (
              <div key={idx} className="p-2.5 bg-[#13151b] border border-[#242735] rounded-lg flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-blue-400 font-semibold">{f.slot}</span>
                    <span className="font-medium text-white truncate">{f.part}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{f.remaining} left · {f.timeRemaining}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {f.alert && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-[#e11d48]/20 text-[#e11d48] border border-[#e11d48]/40 rounded">
                      LOW REEL
                    </span>
                  )}
                  <div className="w-16 bg-[#242735] h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${f.alert ? 'bg-[#e11d48]' : 'bg-emerald-500'}`}
                      style={{ width: `${f.pct}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
