import React, { useState } from 'react';
import { ProductionRecord, ProductionKPIs } from '../../types';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  AlertTriangle,
  Sparkles,
  Download,
  Filter
} from 'lucide-react';

interface CelestialChartsPageProps {
  records: ProductionRecord[];
  kpis: ProductionKPIs;
  onAskCopilot: (query: string) => void;
  onExportCsv: () => void;
}

export const CelestialChartsPage: React.FC<CelestialChartsPageProps> = ({
  records,
  kpis,
  onAskCopilot,
  onExportCsv,
}) => {
  const [chartView, setChartView] = useState<'yield' | 'downtime' | 'oee'>('yield');

  const downtimePareto = [
    { reason: 'Solder Stencil Aperture Clogging', minutes: 78, pct: 34.2, line: 'SMT-02' },
    { reason: 'Component Feeder Jam (0402 Reel)', minutes: 52, pct: 22.8, line: 'SMT-01' },
    { reason: 'Reflow Oven Zone 4 Thermal Drift', minutes: 38, pct: 16.7, line: 'SMT-02' },
    { reason: 'AOI Optical Camera False Trigger', minutes: 26, pct: 11.4, line: 'SMT-01' },
    { reason: 'ICT Flying Probe Pin Wear', minutes: 19, pct: 8.3, line: 'TEST-01' },
    { reason: 'Selective Solder Nozzle Dross', minutes: 15, pct: 6.6, line: 'DIP-01' },
  ];

  const defectCodes = [
    { code: 'DEF-01', name: 'Solder Bridging (BGA/QFN)', count: 342, rate: '43.6%', action: 'Reduce squeegee pressure by 0.5kg & clean stencil cycle every 5 boards.' },
    { code: 'DEF-02', name: 'Tombstoning (0201 chip)', count: 184, rate: '23.5%', action: 'Rebalance reflow preheat ramp rate to 1.5°C/sec to equalize pad surface tension.' },
    { code: 'DEF-03', name: 'Component Misalignment', count: 126, rate: '16.1%', action: 'Clean pick-and-place optical centering camera lens and calibrate vacuum nozzle.' },
    { code: 'DEF-04', name: 'Solder Voids (>15%)', count: 82, rate: '10.5%', action: 'Increase soak zone peak soak dwell time to 75 seconds to evacuate volatile flux.' },
    { code: 'DEF-05', name: 'Cold Solder / De-wetting', count: 50, rate: '6.4%', action: 'Inspect PCB pad oxidation and verify nitrogen N2 oxygen level < 500 ppm.' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#242735]">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Production Quality & OEE Charts</span>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-rose-500/20 text-[#e11d48] border border-rose-500/30 rounded-sm">
              ANALYTICS
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Statistical Process Control (SPC), Downtime Pareto, and OEE availability losses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExportCsv}
            className="px-3 py-1.5 text-xs font-semibold bg-[#181a22] hover:bg-[#20232e] text-slate-300 border border-[#2e3242] rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Data</span>
          </button>
          <button
            type="button"
            onClick={() => onAskCopilot('Analyze the top defect codes and give engineering countermeasures for SMT lines.')}
            className="px-3 py-1.5 text-xs font-semibold bg-[#242735] hover:bg-[#2e3345] text-slate-200 border border-[#2e3242] rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Root Cause Analysis</span>
          </button>
        </div>
      </div>

      {/* Row 1: OEE Loss Breakdown & Line Yield Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: OEE Waterfall Analysis (Col 5) */}
        <div className="lg:col-span-5 bg-[#181a22] border border-[#242735] rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Overall Equipment Effectiveness (OEE)</h3>
            <span className="text-xs font-mono font-bold text-blue-400">{kpis.averageOEE || 85.3}%</span>
          </div>

          <p className="text-xs text-slate-400">
            Three-factor calculation: Availability × Performance × Quality Rate.
          </p>

          <div className="space-y-3 pt-2 text-xs">
            <div>
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-300 font-medium">1. Availability (Planned vs. Run Time)</span>
                <span className="font-mono text-emerald-400 font-bold">92.4%</span>
              </div>
              <div className="w-full bg-[#242735] h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[92.4%]" />
              </div>
              <span className="text-[10px] text-slate-500">Loss: 228 mins downtime / shift</span>
            </div>

            <div>
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-300 font-medium">2. Performance (Design vs. Actual CPH)</span>
                <span className="font-mono text-blue-400 font-bold">94.1%</span>
              </div>
              <div className="w-full bg-[#242735] h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[94.1%]" />
              </div>
              <span className="text-[10px] text-slate-500">Loss: Micro-stops & feeder pitch delays</span>
            </div>

            <div>
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-300 font-medium">3. Quality (First Pass Yield Rate)</span>
                <span className="font-mono text-purple-400 font-bold">{kpis.fleetYieldRate || 98.2}%</span>
              </div>
              <div className="w-full bg-[#242735] h-2 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full w-[98.2%]" />
              </div>
              <span className="text-[10px] text-slate-500">Loss: {kpis.totalDefects || 784} defect units</span>
            </div>
          </div>
        </div>

        {/* Right: Downtime Pareto Ranking (Col 7) */}
        <div className="lg:col-span-7 bg-[#181a22] border border-[#242735] rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Downtime Root Cause Pareto (Minutes Lost)</h3>
              <p className="text-[11px] text-slate-400">Ranked by equipment stoppage impact</p>
            </div>
            <span className="text-xs font-mono text-[#e11d48] font-bold">
              Total: {downtimePareto.reduce((a, b) => a + b.minutes, 0)} mins
            </span>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            {downtimePareto.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-200 font-medium truncate pr-2">
                    {idx + 1}. {item.reason} <span className="text-slate-500 font-mono">({item.line})</span>
                  </span>
                  <span className="font-mono text-[#e11d48] shrink-0 font-bold">
                    {item.minutes}m ({item.pct}%)
                  </span>
                </div>
                <div className="w-full bg-[#242735] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-[#e11d48]"
                    style={{ width: `${item.pct * 2.5}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Quality Defect Countermeasures SOP Table */}
      <div className="bg-[#181a22] border border-[#242735] rounded-xl p-6 shadow-lg">
        <h3 className="text-sm font-bold text-white mb-2">
          Defect Code Distribution & Engineering Countermeasure SOPs
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Top scrap drivers recorded during current manufacturing run with recommended corrective actions.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#242735] text-[11px] text-slate-400 font-mono">
                <th className="pb-3 pr-4">Defect Code</th>
                <th className="pb-3 px-4">Failure Mode</th>
                <th className="pb-3 px-4">Scrap Count</th>
                <th className="pb-3 px-4">Share (%)</th>
                <th className="pb-3 pl-4">Corrective Action (SOP)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242735]">
              {defectCodes.map((d, i) => (
                <tr key={i} className="hover:bg-[#1f222e] transition-colors">
                  <td className="py-3 pr-4 font-mono font-bold text-blue-400">{d.code}</td>
                  <td className="py-3 px-4 text-white font-medium">{d.name}</td>
                  <td className="py-3 px-4 font-mono text-slate-200">{d.count} pcs</td>
                  <td className="py-3 px-4 font-mono text-[#e11d48] font-bold">{d.rate}</td>
                  <td className="py-3 pl-4 text-slate-300 text-[11px]">{d.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
