import React, { useState, useMemo } from 'react';
import { ProductionRecord, ProductionKPIs } from '../types';
import { Target, CheckCircle2, Clock, Gauge, TrendingUp, AlertTriangle, Filter } from 'lucide-react';

interface SimpleChartsDashboardProps {
  records: ProductionRecord[];
  kpis: ProductionKPIs;
  selectedLine: string;
  onSelectLine: (lineId: string) => void;
  selectedShift: string;
  onSelectShift: (shift: string) => void;
}

export const SimpleChartsDashboard: React.FC<SimpleChartsDashboardProps> = ({
  records,
  kpis,
  selectedLine,
  onSelectLine,
  selectedShift,
  onSelectShift,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchLine = selectedLine === 'all' || r.lineId === selectedLine;
      const matchShift = selectedShift === 'all' || r.shift === selectedShift;
      return matchLine && matchShift;
    });
  }, [records, selectedLine, selectedShift]);

  // Aggregate line output for Bar Chart
  const lineOutput = useMemo(() => {
    const map = new Map<string, { target: number; actual: number; passed: number; defects: number; downtime: number }>();
    records.forEach((r) => {
      const existing = map.get(r.lineId) || { target: 0, actual: 0, passed: 0, defects: 0, downtime: 0 };
      existing.target += r.targetUnits;
      existing.actual += r.actualUnits;
      existing.passed += r.passedUnits;
      existing.defects += r.defectUnits;
      existing.downtime += r.downtimeMinutes;
      map.set(r.lineId, existing);
    });
    return Array.from(map.entries()).map(([lineId, val]) => {
      const yieldRate = val.actual > 0 ? Number(((val.passed / val.actual) * 100).toFixed(1)) : 100;
      return { lineId, yieldRate, ...val };
    });
  }, [records]);

  // Downtime causes
  const downtimeCauses = useMemo(() => {
    const map = new Map<string, number>();
    filteredRecords.forEach((r) => {
      if (r.downtimeMinutes > 0 && r.downtimeReason && r.downtimeReason !== 'None / Normal') {
        const shortName = r.downtimeReason.split('(')[0].trim();
        map.set(shortName, (map.get(shortName) || 0) + r.downtimeMinutes);
      }
    });
    const items = Array.from(map.entries())
      .map(([reason, minutes]) => ({ reason, minutes }))
      .sort((a, b) => b.minutes - a.minutes)
      .slice(0, 5);
    const total = items.reduce((acc, curr) => acc + curr.minutes, 0) || 1;
    return items.map((i) => ({ ...i, pct: Math.round((i.minutes / total) * 100) }));
  }, [filteredRecords]);

  // Top defects
  const topDefects = useMemo(() => {
    const map = new Map<string, number>();
    filteredRecords.forEach((r) => {
      if (r.defectUnits > 0 && r.topDefectCode && r.topDefectCode !== 'None') {
        const name = r.topDefectCode.split('(')[0].trim();
        map.set(name, (map.get(name) || 0) + r.defectUnits);
      }
    });
    const items = Array.from(map.entries())
      .map(([code, count]) => ({ code, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    const total = items.reduce((acc, curr) => acc + curr.count, 0) || 1;
    return items.map((i) => ({ ...i, pct: Math.round((i.count / total) * 100) }));
  }, [filteredRecords]);

  // Trend line points for production output
  const trendPoints = useMemo(() => {
    return filteredRecords.map((r, idx) => ({
      index: idx,
      label: `${r.lineId} (${r.shift.includes('Night') ? 'Night' : 'Day'})`,
      actual: r.actualUnits,
      target: r.targetUnits,
      yieldRate: r.yieldRate,
    }));
  }, [filteredRecords]);

  // SVG dimensions for Trend Area Chart
  const svgW = 600;
  const svgH = 180;
  const maxActual = Math.max(...trendPoints.map((p) => Math.max(p.actual, p.target)), 1600);
  const minActual = Math.min(...trendPoints.map((p) => p.actual), 600);

  const coords = trendPoints.map((p, i) => {
    const x = (i / Math.max(1, trendPoints.length - 1)) * (svgW - 50) + 25;
    const y = svgH - ((p.actual - minActual) / (maxActual - minActual || 1)) * (svgH - 45) - 20;
    return { ...p, x, y };
  });

  const linePath = coords.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');
  const areaPath = coords.length > 0
    ? `${linePath} L ${coords[coords.length - 1].x} ${svgH - 10} L ${coords[0].x} ${svgH - 10} Z`
    : '';

  const uniqueLines = useMemo(() => Array.from(new Set(records.map((r) => r.lineId))), [records]);
  const attainmentRate = kpis.totalTarget > 0 ? ((kpis.totalActual / kpis.totalTarget) * 100).toFixed(1) : '100';

  return (
    <div className="space-y-8">
      {/* Filters Bar - Clean and Minimal */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Quick Filter:</span>
          <div className="flex items-center gap-1 overflow-x-auto">
            <button
              type="button"
              onClick={() => onSelectLine('all')}
              className={`px-2.5 py-1 text-xs rounded-lg transition-colors cursor-pointer whitespace-nowrap font-medium ${
                selectedLine === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              All Lines
            </button>
            {uniqueLines.map((line) => (
              <button
                key={line}
                type="button"
                onClick={() => onSelectLine(line)}
                className={`px-2.5 py-1 text-xs rounded-lg transition-colors cursor-pointer whitespace-nowrap font-medium ${
                  selectedLine === line
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {line}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto text-xs">
          <span className="text-slate-400">Shift:</span>
          {(['all', 'Shift 1 (Day)', 'Shift 2 (Night)'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSelectShift(s)}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap text-xs font-medium ${
                selectedShift === s
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {s === 'all' ? 'Both Shifts' : s.replace('Shift ', 'S')}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Clean Big Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Output */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Output</span>
            <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              {kpis.totalActual.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Plan: {kpis.totalTarget.toLocaleString()} units ({attainmentRate}%)
            </p>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all"
              style={{ width: `${Math.min(100, Number(attainmentRate))}%` }}
            />
          </div>
        </div>

        {/* First Pass Yield */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">First Pass Yield</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              {kpis.fleetYieldRate}%
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Target &ge; 98.0% World-Class</span>
            </p>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${Math.min(100, kpis.fleetYieldRate)}%` }}
            />
          </div>
        </div>

        {/* OEE */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Mean Line OEE</span>
            <Gauge className="w-4 h-4 text-indigo-500" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              {kpis.averageOEE}%
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Availability &times; Speed &times; Quality
            </p>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all"
              style={{ width: `${Math.min(100, kpis.averageOEE)}%` }}
            />
          </div>
        </div>

        {/* Downtime */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Downtime</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              {kpis.totalDowntimeMinutes} <span className="text-sm font-normal text-slate-500">mins</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {(kpis.totalDowntimeMinutes / 60).toFixed(1)} hours cumulative stoppage
            </p>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all"
              style={{ width: `${Math.min(100, (kpis.totalDowntimeMinutes / 180) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Charts Matrix (2x2 Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Output Progression Trend */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Production Output Velocity Trend
              </h3>
              <p className="text-xs text-slate-500">Units produced across sequential production cycles</p>
            </div>
            <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold tabular-nums">
              {hoveredPoint !== null ? `${coords[hoveredPoint]?.label}: ${coords[hoveredPoint]?.actual} units` : 'Hover to inspect'}
            </span>
          </div>

          <div className="relative w-full h-48">
            <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="simpleBlueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="20" y1="30" x2={svgW - 20} y2="30" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 3" />
              <line x1="20" y1="90" x2={svgW - 20} y2="90" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 3" />
              <line x1="20" y1="150" x2={svgW - 20} y2="150" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 3" />

              {/* Area & Line */}
              {areaPath && <path d={areaPath} fill="url(#simpleBlueGrad)" />}
              {linePath && <path d={linePath} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}

              {/* Points */}
              {coords.map((pt, idx) => (
                <g key={idx} onMouseEnter={() => setHoveredPoint(idx)} onMouseLeave={() => setHoveredPoint(null)} className="cursor-pointer">
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredPoint === idx ? 6 : 4}
                    className="fill-white dark:fill-slate-900 stroke-blue-600 stroke-2 transition-all"
                  />
                </g>
              ))}
            </svg>
          </div>

          <div className="flex justify-between text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-100 dark:border-slate-800">
            <span>Shift 1 Start</span>
            <span>Mid-Day Cycle</span>
            <span>Shift 2 Handover</span>
            <span>End of Run</span>
          </div>
        </div>

        {/* Chart 2: First Pass Yield by Line Comparison */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                First Pass Yield (FPY %) by Line
              </h3>
              <p className="text-xs text-slate-500">Benchmark target threshold: 98.0%</p>
            </div>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">
              &gt; 98% Pass Goal
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {lineOutput.map((l) => {
              const isWarning = l.yieldRate < 97.0;
              return (
                <div key={l.lineId} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{l.lineId}</span>
                    <span
                      className={`font-mono tabular-nums font-bold ${
                        isWarning ? 'text-amber-500' : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {l.yieldRate}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, l.yieldRate)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 3: Downtime Causes Breakdown */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Equipment Downtime Pareto (Minutes)
              </h3>
              <p className="text-xs text-slate-500">Top stoppage root causes impacting throughput</p>
            </div>
            <span className="text-xs font-mono text-amber-500 font-semibold tabular-nums">
              {downtimeCauses.reduce((acc, c) => acc + c.minutes, 0)} mins
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {downtimeCauses.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 dark:text-slate-300 truncate max-w-[280px]">
                    {item.reason}
                  </span>
                  <span className="font-mono tabular-nums text-slate-900 dark:text-white font-semibold">
                    {item.minutes}m ({item.pct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 4: Defect Breakdown Pareto */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Quality Defect Scrap Pareto (Units)
              </h3>
              <p className="text-xs text-slate-500">Top detected failure codes requiring countermeasure</p>
            </div>
            <span className="text-xs font-mono text-red-500 font-semibold tabular-nums">
              {topDefects.reduce((acc, c) => acc + c.count, 0)} units
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {topDefects.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 dark:text-slate-300 truncate max-w-[280px]">
                    {item.code}
                  </span>
                  <span className="font-mono tabular-nums text-red-600 dark:text-red-400 font-semibold">
                    {item.count} units ({item.pct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full transition-all"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
