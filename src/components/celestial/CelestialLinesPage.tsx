import React, { useState } from 'react';
import { ProductionRecord, ProductionKPIs } from '../../types';
import {
  Cpu,
  Layers,
  Box,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Sliders,
  Sparkles,
  BarChart2,
  RefreshCw
} from 'lucide-react';

interface CelestialLinesPageProps {
  records: ProductionRecord[];
  kpis: ProductionKPIs;
  onAskCopilot: (query: string) => void;
}

export const CelestialLinesPage: React.FC<CelestialLinesPageProps> = ({
  records,
  kpis,
  onAskCopilot,
}) => {
  const [activeLineTab, setActiveLineTab] = useState('SMT-01');

  const lineOptions = [
    { id: 'SMT-01', name: 'SMT Line 01', type: 'Surface Mount High-Speed', product: 'Smartphone 5G Mainboard', yieldPct: 99.1, status: 'running', cph: '68,400 CPH', cycleTime: '14.2s' },
    { id: 'SMT-02', name: 'SMT Line 02', type: 'Surface Mount Fine-Pitch', product: 'Automotive ECU Controller', yieldPct: 98.4, status: 'warning', cph: '54,200 CPH', cycleTime: '18.6s' },
    { id: 'DIP-01', name: 'DIP Line 01', type: 'Through-Hole & Selective Soldering', product: 'Power Inverter Module', yieldPct: 98.8, status: 'running', cph: '12,800 CPH', cycleTime: '24.5s' },
    { id: 'ASSY-01', name: 'Assembly Line 01', type: 'Final Box-Build Assembly', product: 'Consumer Electronics Enclosure', yieldPct: 97.6, status: 'running', cph: '4,200 UPH', cycleTime: '32.0s' },
    { id: 'TEST-01', name: 'Test Line 01', type: 'In-Circuit & Functional Testing', product: 'RF Wireless Calibration', yieldPct: 98.0, status: 'running', cph: '3,800 UPH', cycleTime: '28.4s' },
    { id: 'PACK-01', name: 'Packaging Line 01', type: 'Automated Packing & Labeling', product: 'Retail Packaging & IMEI Laser', yieldPct: 99.5, status: 'running', cph: '5,100 UPH', cycleTime: '19.8s' },
  ];

  const currentLine = lineOptions.find(l => l.id === activeLineTab) || lineOptions[0];

  const stations = [
    { step: 1, name: 'Solder Paste Printer', machine: 'DEK NeoHorizon', cycleTime: '12.0s', cpk: '1.67', status: 'optimal', alert: 'Stencil cleaned 18m ago' },
    { step: 2, name: '3D SPI Inspection', machine: 'Koh Young Aspire3', cycleTime: '11.5s', cpk: '1.58', status: 'optimal', alert: 'Volume 128.4μm (target 130)' },
    { step: 3, name: 'High-Speed Chip Mounter', machine: 'Panasonic NPM-W2', cycleTime: '13.8s', cpk: '1.72', status: 'optimal', alert: 'Nozzle pickup rate 99.98%' },
    { step: 4, name: 'Multi-Function Odd-Form', machine: 'Fuji NXT III M6', cycleTime: '14.2s', cpk: '1.45', status: activeLineTab === 'SMT-02' ? 'warning' : 'optimal', alert: activeLineTab === 'SMT-02' ? 'Feeder slot 28 low stock' : 'Optimal' },
    { step: 5, name: '10-Zone Reflow Oven', machine: 'Heller 1913 MK5', cycleTime: '180s', cpk: '1.62', status: 'optimal', alert: 'Peak 244.6°C SAC305' },
    { step: 6, name: '3D AOI Optical Inspection', machine: 'Mirtec MV-6e OMNI', cycleTime: '13.5s', cpk: '1.55', status: 'optimal', alert: 'First Pass: 99.2%' },
    { step: 7, name: 'In-Circuit Test (ICT)', machine: 'Keysight 3070 v9', cycleTime: '16.0s', cpk: '1.48', status: 'optimal', alert: 'Open/Short: 0 defects' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Title & Line Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#242735]">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Production Line Station Operations & Telemetry</span>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-sm">
              MES LINK
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Station-by-station telemetry, cycle times, Cpk process capability, and live machine parameters.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onAskCopilot(`Analyze bottleneck stations and yield for ${currentLine.name}.`)}
          className="px-3 py-1.5 text-xs font-semibold bg-[#242735] hover:bg-[#2e3345] text-slate-200 border border-[#2e3242] rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Ask AI About {currentLine.id}</span>
        </button>
      </div>

      {/* Line Selection Buttons (Pill-free clean segmented control) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {lineOptions.map((line) => (
          <button
            key={line.id}
            type="button"
            onClick={() => setActiveLineTab(line.id)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeLineTab === line.id
                ? 'bg-[#242838] text-white border border-blue-500/50 shadow-md'
                : 'bg-[#181a22] text-slate-400 border border-[#242735] hover:text-slate-200 hover:bg-[#20232e]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${line.status === 'warning' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
            <span>{line.name}</span>
            <span className="text-[10px] font-mono text-slate-400">({line.yieldPct}%)</span>
          </button>
        ))}
      </div>

      {/* Selected Line Overview Card */}
      <div className="bg-[#181a22] border border-[#242735] rounded-xl p-6 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#242735]">
          <div>
            <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold uppercase tracking-wider">
              <span>{currentLine.type}</span>
              <span>·</span>
              <span className="text-emerald-400 font-bold">STATUS: {currentLine.status.toUpperCase()}</span>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight mt-1">{currentLine.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">Active SKU: <strong className="text-slate-200">{currentLine.product}</strong></p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-[#13151b] border border-[#242735] rounded-lg">
              <span className="text-slate-400 text-[10px]">Line First Pass Yield</span>
              <p className="text-xl font-extrabold text-emerald-400 font-mono mt-0.5">{currentLine.yieldPct}%</p>
            </div>
            <div className="p-3 bg-[#13151b] border border-[#242735] rounded-lg">
              <span className="text-slate-400 text-[10px]">Takt / Cycle Time</span>
              <p className="text-xl font-extrabold text-white font-mono mt-0.5">{currentLine.cycleTime}</p>
            </div>
            <div className="p-3 bg-[#13151b] border border-[#242735] rounded-lg">
              <span className="text-slate-400 text-[10px]">Placement Velocity</span>
              <p className="text-xl font-extrabold text-blue-400 font-mono mt-0.5">{currentLine.cph}</p>
            </div>
            <div className="p-3 bg-[#13151b] border border-[#242735] rounded-lg">
              <span className="text-slate-400 text-[10px]">Line OEE Efficiency</span>
              <p className="text-xl font-extrabold text-purple-400 font-mono mt-0.5">89.4%</p>
            </div>
          </div>
        </div>

        {/* Linear Station Sequential Process Flow */}
        <div className="pt-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Station Sequential Production Flow (Step 1 to Step 7)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {stations.map((s) => (
              <div
                key={s.step}
                className={`p-3.5 rounded-lg border transition-all ${
                  s.status === 'warning'
                    ? 'bg-amber-950/20 border-amber-500/40'
                    : 'bg-[#13151b] border-[#242735] hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mb-1">
                  <span>STEP 0{s.step}</span>
                  <span className={s.status === 'warning' ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                    {s.status.toUpperCase()}
                  </span>
                </div>
                <h5 className="text-xs font-bold text-white line-clamp-1">{s.name}</h5>
                <p className="text-[10px] text-slate-400 mt-0.5">{s.machine}</p>

                <div className="mt-3 pt-2 border-t border-[#242735] space-y-1 text-[11px] font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>CT:</span>
                    <span className="text-slate-200">{s.cycleTime}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Cpk:</span>
                    <span className="text-emerald-400 font-bold">{s.cpk}</span>
                  </div>
                </div>

                <div className="mt-2 text-[10px] text-slate-400 truncate" title={s.alert}>
                  {s.alert}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
