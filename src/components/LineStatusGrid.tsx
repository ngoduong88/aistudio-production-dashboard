import React from 'react';
import { Activity, AlertTriangle, CheckCircle, Clock, MessageSquare, ArrowUpRight } from 'lucide-react';
import { ProductionRecord } from '../types';

interface LineStatusGridProps {
  records: ProductionRecord[];
  selectedLineFilter: string;
  onSelectLineFilter: (lineId: string) => void;
  onAskLine?: (lineId: string, lineName: string) => void;
}

export const LineStatusGrid: React.FC<LineStatusGridProps> = ({
  records,
  selectedLineFilter,
  onSelectLineFilter,
  onAskLine,
}) => {
  // Aggregate by lineId
  const lineSummaries = React.useMemo(() => {
    const map = new Map<
      string,
      {
        lineId: string;
        lineName: string;
        stations: string[];
        totalTarget: number;
        totalActual: number;
        totalPassed: number;
        totalDefects: number;
        totalDowntime: number;
        downtimeReasons: string[];
        topDefects: string[];
        avgOEE: number;
        status: 'running' | 'warning' | 'down';
        count: number;
      }
    >();

    records.forEach((r) => {
      const existing = map.get(r.lineId) || {
        lineId: r.lineId,
        lineName: r.lineName.split(' - ')[0] || r.lineId,
        stations: [],
        totalTarget: 0,
        totalActual: 0,
        totalPassed: 0,
        totalDefects: 0,
        totalDowntime: 0,
        downtimeReasons: [],
        topDefects: [],
        avgOEE: 0,
        status: 'running',
        count: 0,
      };

      if (!existing.stations.includes(r.station)) existing.stations.push(r.station);
      existing.totalTarget += r.targetUnits;
      existing.totalActual += r.actualUnits;
      existing.totalPassed += r.passedUnits;
      existing.totalDefects += r.defectUnits;
      existing.totalDowntime += r.downtimeMinutes;
      if (r.downtimeReason && r.downtimeReason !== 'None / Normal') existing.downtimeReasons.push(r.downtimeReason);
      if (r.topDefectCode && r.topDefectCode !== 'None') existing.topDefects.push(r.topDefectCode);
      existing.avgOEE += r.oee;
      existing.count += 1;

      if (r.status === 'down') existing.status = 'down';
      else if (r.status === 'warning' && existing.status !== 'down') existing.status = 'warning';

      map.set(r.lineId, existing);
    });

    return Array.from(map.values()).map((line) => {
      const yieldRate = line.totalActual > 0 ? Number(((line.totalPassed / line.totalActual) * 100).toFixed(2)) : 100;
      const oee = line.count > 0 ? Number((line.avgOEE / line.count).toFixed(1)) : 85;
      return { ...line, yieldRate, oee };
    });
  }, [records]);

  return (
    <section id="lines" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Production Line Status Matrix
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time telemetry across SMT, Through-hole, Box-build Assembly, and Testing cells
          </p>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => onSelectLineFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
              selectedLineFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Lines ({lineSummaries.length})
          </button>
          {lineSummaries.map((line) => (
            <button
              key={line.lineId}
              type="button"
              onClick={() => onSelectLineFilter(line.lineId)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedLineFilter === line.lineId
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {line.lineId}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lineSummaries
          .filter((line) => selectedLineFilter === 'all' || line.lineId === selectedLineFilter)
          .map((line) => {
            const achievementPct = line.totalTarget > 0 ? Math.min(100, Math.round((line.totalActual / line.totalTarget) * 100)) : 100;

            return (
              <div
                key={line.lineId}
                className={`p-5 rounded-xl border transition-all flex flex-col justify-between space-y-4 shadow-xs ${
                  line.status === 'warning'
                    ? 'bg-amber-50/20 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/60'
                    : line.status === 'down'
                    ? 'bg-red-50/20 dark:bg-red-950/20 border-red-300 dark:border-red-800/60'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Header row */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 dark:text-white text-base">
                          {line.lineId}
                        </span>
                        <span
                          className={`text-[11px] font-semibold uppercase tracking-wider ${
                            line.status === 'warning'
                              ? 'text-amber-600 dark:text-amber-400'
                              : line.status === 'down'
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {line.status === 'warning' ? 'Yield Warning' : line.status === 'down' ? 'Line Down' : 'Normal'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        {line.lineName}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                        {line.yieldRate}%
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">FPY Yield</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                      <span>Target: {line.totalTarget.toLocaleString()}</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        Actual: {line.totalActual.toLocaleString()} ({achievementPct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          line.status === 'warning' ? 'bg-amber-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${achievementPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Metrics & Stoppage Notes */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400">Total Downtime:</span>
                      <p className="font-semibold font-mono tabular-nums text-slate-800 dark:text-slate-200">
                        {line.totalDowntime} mins
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400">Line OEE:</span>
                      <p className="font-semibold font-mono tabular-nums text-slate-800 dark:text-slate-200">
                        {line.oee}%
                      </p>
                    </div>
                  </div>

                  {line.downtimeReasons.length > 0 && (
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 text-[11px]">
                      <span className="font-medium text-slate-700 dark:text-slate-300">Stoppage: </span>
                      <span className="text-slate-500 dark:text-slate-400 line-clamp-1">
                        {line.downtimeReasons[0]}
                      </span>
                    </div>
                  )}

                  {line.topDefects.length > 0 && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      <span className="font-medium text-slate-700 dark:text-slate-300">Top Defect: </span>
                      <span>{line.topDefects[0]}</span>
                    </div>
                  )}
                </div>

                {/* Action footer */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectLineFilter(selectedLineFilter === line.lineId ? 'all' : line.lineId)}
                    className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-1 cursor-pointer truncate"
                  >
                    <span>{selectedLineFilter === line.lineId ? 'All Lines' : 'Filter'}</span>
                  </button>
                  {onAskLine && (
                    <button
                      type="button"
                      onClick={() => onAskLine(line.lineId, line.lineName)}
                      className="py-1.5 px-3 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-900 transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                      title={`Ask AI Copilot about ${line.lineId}`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Ask AI</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
};
