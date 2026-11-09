import React from 'react';
import { ProductionRecord, ProductionKPIs } from '../types';
import { Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface ShopFloorDisplayProps {
  records: ProductionRecord[];
  kpis: ProductionKPIs;
}

export const ShopFloorDisplay: React.FC<ShopFloorDisplayProps> = ({ records, kpis }) => {
  // Line aggregations
  const lineCards = React.useMemo(() => {
    const map = new Map<string, { lineId: string; target: number; actual: number; passed: number; downtime: number; status: string }>();
    records.forEach((r) => {
      const existing = map.get(r.lineId) || { lineId: r.lineId, target: 0, actual: 0, passed: 0, downtime: 0, status: 'running' };
      existing.target += r.targetUnits;
      existing.actual += r.actualUnits;
      existing.passed += r.passedUnits;
      existing.downtime += r.downtimeMinutes;
      if (r.status === 'warning' || r.status === 'down') existing.status = r.status;
      map.set(r.lineId, existing);
    });
    return Array.from(map.values()).map((l) => {
      const yieldRate = l.actual > 0 ? ((l.passed / l.actual) * 100).toFixed(1) : '100';
      const attainment = l.target > 0 ? Math.min(100, Math.round((l.actual / l.target) * 100)) : 100;
      return { ...l, yieldRate, attainment };
    });
  }, [records]);

  return (
    <div className="space-y-8">
      {/* High-visibility TV strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="p-6 rounded-2xl bg-blue-600 text-white shadow-lg space-y-1">
          <p className="text-xs uppercase tracking-wider font-semibold opacity-80">Shift Output Total</p>
          <div className="text-4xl md:text-5xl font-black font-mono tabular-nums">
            {kpis.totalActual.toLocaleString()}
          </div>
          <p className="text-xs opacity-90">Plan: {kpis.totalTarget.toLocaleString()} units</p>
        </div>

        <div className="p-6 rounded-2xl bg-emerald-600 text-white shadow-lg space-y-1">
          <p className="text-xs uppercase tracking-wider font-semibold opacity-80">First Pass Yield</p>
          <div className="text-4xl md:text-5xl font-black font-mono tabular-nums">
            {kpis.fleetYieldRate}%
          </div>
          <p className="text-xs opacity-90">Standard &ge; 98.0%</p>
        </div>

        <div className="p-6 rounded-2xl bg-indigo-600 text-white shadow-lg space-y-1">
          <p className="text-xs uppercase tracking-wider font-semibold opacity-80">Mean Line OEE</p>
          <div className="text-4xl md:text-5xl font-black font-mono tabular-nums">
            {kpis.averageOEE}%
          </div>
          <p className="text-xs opacity-90">Target: 85%+</p>
        </div>

        <div className="p-6 rounded-2xl bg-amber-600 text-white shadow-lg space-y-1">
          <p className="text-xs uppercase tracking-wider font-semibold opacity-80">Stoppage Time</p>
          <div className="text-4xl md:text-5xl font-black font-mono tabular-nums">
            {kpis.totalDowntimeMinutes}m
          </div>
          <p className="text-xs opacity-90">Across All Cells</p>
        </div>
      </div>

      {/* Big Line Status Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {lineCards.map((line) => {
          const isWarning = line.status === 'warning' || Number(line.yieldRate) < 97.0;
          return (
            <div
              key={line.lineId}
              className={`p-6 rounded-2xl border-2 transition-all flex flex-col justify-between space-y-5 ${
                isWarning
                  ? 'bg-amber-500/10 border-amber-500'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    {line.lineId}
                  </h3>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${
                      isWarning ? 'text-amber-500' : 'text-emerald-500'
                    }`}
                  >
                    {isWarning ? 'Yield Anomaly' : 'Normal Running'}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black font-mono tabular-nums text-slate-900 dark:text-white">
                    {line.yieldRate}%
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase">Yield</span>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono tabular-nums text-slate-500">
                  <span>Actual: {line.actual.toLocaleString()}</span>
                  <span>Target: {line.target.toLocaleString()} ({line.attainment}%)</span>
                </div>
                <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isWarning ? 'bg-amber-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${line.attainment}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs text-slate-500">
                <span>Downtime: <strong className="text-slate-800 dark:text-slate-200 font-mono">{line.downtime} mins</strong></span>
                <span>Good Units: <strong className="text-slate-800 dark:text-slate-200 font-mono">{line.passed.toLocaleString()}</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
