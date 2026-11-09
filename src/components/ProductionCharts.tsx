import React from 'react';
import { ProductionRecord } from '../types';
import { BarChart, Clock, AlertOctagon, GitCompare } from 'lucide-react';

interface ProductionChartsProps {
  records: ProductionRecord[];
}

export const ProductionCharts: React.FC<ProductionChartsProps> = ({ records }) => {
  // Aggregate lines output
  const lineOutput = React.useMemo(() => {
    const map = new Map<string, { target: number; actual: number }>();
    records.forEach((r) => {
      const existing = map.get(r.lineId) || { target: 0, actual: 0 };
      existing.target += r.targetUnits;
      existing.actual += r.actualUnits;
      map.set(r.lineId, existing);
    });
    return Array.from(map.entries()).map(([lineId, val]) => ({ lineId, ...val }));
  }, [records]);

  // Aggregate downtime reasons
  const downtimeReasons = React.useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => {
      if (r.downtimeMinutes > 0 && r.downtimeReason && r.downtimeReason !== 'None / Normal') {
        const shortName = r.downtimeReason.split('(')[0].trim();
        map.set(shortName, (map.get(shortName) || 0) + r.downtimeMinutes);
      }
    });
    return Array.from(map.entries())
      .map(([reason, minutes]) => ({ reason, minutes }))
      .sort((a, b) => b.minutes - a.minutes)
      .slice(0, 5);
  }, [records]);

  // Aggregate top defects
  const defectPareto = React.useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => {
      if (r.defectUnits > 0 && r.topDefectCode && r.topDefectCode !== 'None') {
        const code = r.topDefectCode.split('(')[0].trim();
        map.set(code, (map.get(code) || 0) + r.defectUnits);
      }
    });
    return Array.from(map.entries())
      .map(([code, count]) => ({ code, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [records]);

  // Shift comparison
  const shiftComparison = React.useMemo(() => {
    const day = { target: 0, actual: 0, passed: 0, defects: 0, downtime: 0, oeeSum: 0, count: 0 };
    const night = { target: 0, actual: 0, passed: 0, defects: 0, downtime: 0, oeeSum: 0, count: 0 };

    records.forEach((r) => {
      const bucket = r.shift.includes('Night') ? night : day;
      bucket.target += r.targetUnits;
      bucket.actual += r.actualUnits;
      bucket.passed += r.passedUnits;
      bucket.defects += r.defectUnits;
      bucket.downtime += r.downtimeMinutes;
      bucket.oeeSum += r.oee;
      bucket.count += 1;
    });

    return {
      day: {
        ...day,
        yieldRate: day.actual > 0 ? ((day.passed / day.actual) * 100).toFixed(2) : '100',
        avgOEE: day.count > 0 ? (day.oeeSum / day.count).toFixed(1) : '0',
      },
      night: {
        ...night,
        yieldRate: night.actual > 0 ? ((night.passed / night.actual) * 100).toFixed(2) : '100',
        avgOEE: night.count > 0 ? (night.oeeSum / night.count).toFixed(1) : '0',
      },
    };
  }, [records]);

  const maxOutput = Math.max(...lineOutput.map((l) => Math.max(l.target, l.actual)), 2500);
  const totalDowntimeAll = downtimeReasons.reduce((acc, curr) => acc + curr.minutes, 0) || 1;
  const totalDefectsAll = defectPareto.reduce((acc, curr) => acc + curr.count, 0) || 1;

  return (
    <section id="analytics" className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          Pareto Analysis & Bottleneck Telemetry
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Root cause distribution for equipment stoppages, defect scrap rates, and cross-shift performance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Output vs Target Comparison Chart */}
        <div className="lg:col-span-6 p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <BarChart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Target vs. Actual Output by Line</span>
            </span>
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-slate-300 dark:bg-slate-700" />
                Target Plan
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-blue-600" />
                Actual Output
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {lineOutput.map((item) => {
              const targetPct = (item.target / maxOutput) * 100;
              const actualPct = (item.actual / maxOutput) * 100;
              return (
                <div key={item.lineId} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{item.lineId}</span>
                    <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400 text-[11px]">
                      {item.actual.toLocaleString()} / {item.target.toLocaleString()} units
                    </span>
                  </div>
                  <div className="h-5 bg-slate-100 dark:bg-slate-800/80 rounded-md overflow-hidden relative flex flex-col justify-center">
                    <div
                      className="absolute top-0 bottom-0 left-0 bg-slate-300 dark:bg-slate-700 rounded-md"
                      style={{ width: `${targetPct}%` }}
                    />
                    <div
                      className="absolute top-1 bottom-1 left-0 bg-blue-600 dark:bg-blue-500 rounded-sm"
                      style={{ width: `${actualPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Downtime Reasons Pareto */}
        <div className="lg:col-span-6 p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Top Downtime Root Causes (Minutes)</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">Top 5 Pareto</span>
          </div>

          <div className="space-y-3 pt-2">
            {downtimeReasons.map((dt, idx) => {
              const pct = Math.round((dt.minutes / totalDowntimeAll) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-700 dark:text-slate-300 truncate max-w-[280px]">
                      {dt.reason}
                    </span>
                    <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                      {dt.minutes}m ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Defect Code Distribution */}
        <div className="lg:col-span-6 p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4 text-red-500" />
              <span>Top Quality Defects (Pareto Count)</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">Scrap / Rework Units</span>
          </div>

          <div className="space-y-3 pt-2">
            {defectPareto.map((df, idx) => {
              const pct = Math.round((df.count / totalDefectsAll) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-700 dark:text-slate-300 truncate max-w-[280px]">
                      {df.code}
                    </span>
                    <span className="font-mono tabular-nums font-semibold text-red-600 dark:text-red-400">
                      {df.count} units ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shift 1 vs Shift 2 Benchmark */}
        <div className="lg:col-span-6 p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <GitCompare className="w-4 h-4 text-indigo-500" />
              <span>Shift 1 (Day) vs. Shift 2 (Night) Variance</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">Shift Benchmark</span>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  <th className="py-2.5 px-3 font-semibold">Metric</th>
                  <th className="py-2.5 px-3 font-semibold">Shift 1 (Day)</th>
                  <th className="py-2.5 px-3 font-semibold">Shift 2 (Night)</th>
                  <th className="py-2.5 px-3 font-semibold">Delta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono tabular-nums text-slate-700 dark:text-slate-300">
                <tr>
                  <td className="py-2 px-3 font-sans font-medium text-slate-900 dark:text-white">Output Units</td>
                  <td className="py-2 px-3">{shiftComparison.day.actual.toLocaleString()}</td>
                  <td className="py-2 px-3">{shiftComparison.night.actual.toLocaleString()}</td>
                  <td className="py-2 px-3 text-blue-600 dark:text-blue-400">
                    {shiftComparison.day.actual > shiftComparison.night.actual ? '+' : ''}
                    {shiftComparison.day.actual - shiftComparison.night.actual}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans font-medium text-slate-900 dark:text-white">Yield Rate</td>
                  <td className="py-2 px-3">{shiftComparison.day.yieldRate}%</td>
                  <td className="py-2 px-3">{shiftComparison.night.yieldRate}%</td>
                  <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400">
                    {(Number(shiftComparison.night.yieldRate) - Number(shiftComparison.day.yieldRate)).toFixed(2)}%
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans font-medium text-slate-900 dark:text-white">Mean OEE</td>
                  <td className="py-2 px-3">{shiftComparison.day.avgOEE}%</td>
                  <td className="py-2 px-3">{shiftComparison.night.avgOEE}%</td>
                  <td className="py-2 px-3 text-indigo-600 dark:text-indigo-400">
                    {(Number(shiftComparison.night.avgOEE) - Number(shiftComparison.day.avgOEE)).toFixed(1)}%
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans font-medium text-slate-900 dark:text-white">Downtime Minutes</td>
                  <td className="py-2 px-3">{shiftComparison.day.downtime}m</td>
                  <td className="py-2 px-3">{shiftComparison.night.downtime}m</td>
                  <td className="py-2 px-3 text-amber-600 dark:text-amber-400">
                    -{shiftComparison.day.downtime - shiftComparison.night.downtime}m
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
