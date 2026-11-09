import React from 'react';
import { Target, CheckCircle2, AlertTriangle, Clock, Gauge, TrendingUp } from 'lucide-react';
import { ProductionKPIs } from '../types';

interface ProductionKPIStripProps {
  kpis: ProductionKPIs;
  recordsCount: number;
}

export const ProductionKPIStrip: React.FC<ProductionKPIStripProps> = ({ kpis, recordsCount }) => {
  const achievementRate = kpis.totalTarget > 0 ? ((kpis.totalActual / kpis.totalTarget) * 100).toFixed(1) : '100';
  const defectRate = kpis.totalActual > 0 ? ((kpis.totalDefects / kpis.totalActual) * 100).toFixed(2) : '0.00';

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Total Output */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
          <span className="text-xs font-semibold">Total Output / Plan</span>
          <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
          {kpis.totalActual.toLocaleString()}{' '}
          <span className="text-xs font-normal text-slate-500">/ {kpis.totalTarget.toLocaleString()}</span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-blue-600 dark:text-blue-400 font-mono tabular-nums">
            {achievementRate}%
          </span>
          <span aria-hidden="true">·</span>
          <span>Target Attainment</span>
        </div>
      </div>

      {/* Fleet First Pass Yield */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
          <span className="text-xs font-semibold">Fleet First Pass Yield</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
          {kpis.fleetYieldRate}%
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-mono tabular-nums text-emerald-600 dark:text-emerald-400 font-semibold">
            {kpis.totalPassed.toLocaleString()}
          </span>
          <span aria-hidden="true">·</span>
          <span>Passed Inspection</span>
        </div>
      </div>

      {/* Mean OEE */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
          <span className="text-xs font-semibold">Overall Equipment Eff. (OEE)</span>
          <Gauge className="w-4 h-4 text-indigo-500" />
        </div>
        <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
          {kpis.averageOEE}%
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span>Benchmarked &gt; 85% World-Class</span>
        </div>
      </div>

      {/* Total Stoppage Downtime */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
          <span className="text-xs font-semibold">Cumulative Downtime</span>
          <Clock className="w-4 h-4 text-amber-500" />
        </div>
        <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
          {kpis.totalDowntimeMinutes}{' '}
          <span className="text-xs font-normal text-slate-500">mins ({(kpis.totalDowntimeMinutes / 60).toFixed(1)}h)</span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span className="text-red-500 font-semibold font-mono tabular-nums">{kpis.totalDefects}</span>
          <span>total defect units ({defectRate}%)</span>
        </div>
      </div>
    </div>
  );
};
