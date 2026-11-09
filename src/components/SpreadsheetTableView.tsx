import React, { useState, useMemo } from 'react';
import { Search, Download, Upload, Plus, Trash2, FileSpreadsheet, RotateCcw, Check, Filter } from 'lucide-react';
import { ProductionRecord, ShiftType } from '../types';
import { exportRecordsToExcel, exportRecordsToCsv } from '../utils/spreadsheetHelper';

interface SpreadsheetTableViewProps {
  records: ProductionRecord[];
  onUpdateRecords: (records: ProductionRecord[]) => void;
  onResetDefaults: () => void;
  onOpenFileUpload: () => void;
}

export const SpreadsheetTableView: React.FC<SpreadsheetTableViewProps> = ({
  records,
  onUpdateRecords,
  onResetDefaults,
  onOpenFileUpload,
}) => {
  const [search, setSearch] = useState('');
  const [shiftFilter, setShiftFilter] = useState<string>('all');
  const [lineFilter, setLineFilter] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);

  // New row form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLineId, setNewLineId] = useState('SMT-03');
  const [newStation, setNewStation] = useState('Optical AOI Inspector');
  const [newShift, setNewShift] = useState<ShiftType>('Shift 1 (Day)');
  const [newTarget, setNewTarget] = useState(1200);
  const [newActual, setNewActual] = useState(1175);
  const [newPassed, setNewPassed] = useState(1160);
  const [newDowntime, setNewDowntime] = useState(15);
  const [newDowntimeReason, setNewDowntimeReason] = useState('Feeder Splicing');
  const [newTopDefect, setNewTopDefect] = useState('DF-102 Solder Bridge');

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchSearch =
        search === '' ||
        r.lineId.toLowerCase().includes(search.toLowerCase()) ||
        r.station.toLowerCase().includes(search.toLowerCase()) ||
        r.downtimeReason.toLowerCase().includes(search.toLowerCase()) ||
        r.topDefectCode.toLowerCase().includes(search.toLowerCase());

      const matchShift = shiftFilter === 'all' || r.shift === shiftFilter;
      const matchLine = lineFilter === 'all' || r.lineId === lineFilter;

      return matchSearch && matchShift && matchLine;
    });
  }, [records, search, shiftFilter, lineFilter]);

  const uniqueLines = useMemo(() => Array.from(new Set(records.map((r) => r.lineId))), [records]);

  const handleDeleteRow = (id: string) => {
    onUpdateRecords(records.filter((r) => r.id !== id));
  };

  const handleCreateRow = (e: React.FormEvent) => {
    e.preventDefault();
    const passed = Math.min(newActual, newPassed);
    const defects = Math.max(0, newActual - passed);
    const yieldRate = newActual > 0 ? Number(((passed / newActual) * 100).toFixed(2)) : 100;
    const oee = Math.min(99, Math.max(60, Number(((newActual / (newTarget || 1)) * 90).toFixed(1))));

    const newRecord: ProductionRecord = {
      id: `PRD-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      lineId: newLineId,
      lineName: `${newLineId} - ${newStation}`,
      station: newStation,
      shift: newShift,
      targetUnits: newTarget,
      actualUnits: newActual,
      passedUnits: passed,
      defectUnits: defects,
      yieldRate,
      downtimeMinutes: newDowntime,
      downtimeReason: newDowntimeReason,
      topDefectCode: newTopDefect,
      oee,
      status: yieldRate < 96 || newDowntime >= 45 ? 'warning' : 'running',
    };

    onUpdateRecords([newRecord, ...records]);
    setShowAddModal(false);
  };

  return (
    <section id="spreadsheet" className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Master Production Line Spreadsheet Data</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {records.length} production line shifts loaded · Directly interrogated by the AI Copilot
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenFileUpload}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Your Spreadsheet (.xlsx / .csv)</span>
          </button>
          <button
            type="button"
            onClick={() => exportRecordsToExcel(records)}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Excel</span>
          </button>
          <button
            type="button"
            onClick={() => exportRecordsToCsv(records)}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Row</span>
          </button>
          <button
            type="button"
            onClick={onResetDefaults}
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Reset to default FIH sample dataset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search line, station, defect, downtime reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={lineFilter}
            onChange={(e) => setLineFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <option value="all">All Lines</option>
            {uniqueLines.map((line) => (
              <option key={line} value={line}>
                {line}
              </option>
            ))}
          </select>

          <select
            value={shiftFilter}
            onChange={(e) => setShiftFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <option value="all">All Shifts</option>
            <option value="Shift 1 (Day)">Shift 1 (Day)</option>
            <option value="Shift 2 (Night)">Shift 2 (Night)</option>
          </select>
        </div>
      </div>

      {/* Spreadsheet Data Grid */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                <th className="py-2.5 px-3">Line ID</th>
                <th className="py-2.5 px-3">Station / Cell</th>
                <th className="py-2.5 px-3">Shift</th>
                <th className="py-2.5 px-3">Target</th>
                <th className="py-2.5 px-3">Actual</th>
                <th className="py-2.5 px-3">Passed</th>
                <th className="py-2.5 px-3">Defects</th>
                <th className="py-2.5 px-3">Yield (%)</th>
                <th className="py-2.5 px-3">Downtime</th>
                <th className="py-2.5 px-3">Stoppage Root Cause</th>
                <th className="py-2.5 px-3">Top Defect Code</th>
                <th className="py-2.5 px-3">OEE</th>
                <th className="py-2.5 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono tabular-nums text-slate-700 dark:text-slate-300">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={13} className="py-8 text-center text-slate-400 font-sans">
                    No matching production records found.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                    <td className="py-2 px-3 font-bold text-slate-900 dark:text-white font-sans">{row.lineId}</td>
                    <td className="py-2 px-3 font-sans truncate max-w-[140px] text-slate-800 dark:text-slate-200">{row.station}</td>
                    <td className="py-2 px-3 font-sans text-slate-500 text-[11px] whitespace-nowrap">{row.shift}</td>
                    <td className="py-2 px-3">{row.targetUnits.toLocaleString()}</td>
                    <td className="py-2 px-3 font-semibold text-slate-900 dark:text-white">{row.actualUnits.toLocaleString()}</td>
                    <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400">{row.passedUnits.toLocaleString()}</td>
                    <td className="py-2 px-3 text-red-500">{row.defectUnits}</td>
                    <td className="py-2 px-3 font-semibold text-blue-600 dark:text-blue-400">{row.yieldRate}%</td>
                    <td className="py-2 px-3 text-amber-600 dark:text-amber-400">{row.downtimeMinutes}m</td>
                    <td className="py-2 px-3 font-sans truncate max-w-[160px] text-slate-600 dark:text-slate-400 text-[11px]" title={row.downtimeReason}>
                      {row.downtimeReason}
                    </td>
                    <td className="py-2 px-3 font-sans truncate max-w-[150px] text-slate-600 dark:text-slate-400 text-[11px]" title={row.topDefectCode}>
                      {row.topDefectCode}
                    </td>
                    <td className="py-2 px-3">{row.oee}%</td>
                    <td className="py-2 px-2 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(row.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-opacity cursor-pointer"
                        title="Delete row"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Row Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateRow}
            className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Add Production Line Record
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-600 dark:text-slate-400">Line ID</label>
                <input
                  type="text"
                  value={newLineId}
                  onChange={(e) => setNewLineId(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400">Station / Process</label>
                <input
                  type="text"
                  value={newStation}
                  onChange={(e) => setNewStation(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400">Shift</label>
                <select
                  value={newShift}
                  onChange={(e) => setNewShift(e.target.value as ShiftType)}
                  className="w-full mt-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white cursor-pointer"
                >
                  <option value="Shift 1 (Day)">Shift 1 (Day)</option>
                  <option value="Shift 2 (Night)">Shift 2 (Night)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400">Target Units</label>
                <input
                  type="number"
                  value={newTarget}
                  onChange={(e) => setNewTarget(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400">Actual Output</label>
                <input
                  type="number"
                  value={newActual}
                  onChange={(e) => setNewActual(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400">Passed Units</label>
                <input
                  type="number"
                  value={newPassed}
                  onChange={(e) => setNewPassed(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400">Downtime (Minutes)</label>
                <input
                  type="number"
                  value={newDowntime}
                  onChange={(e) => setNewDowntime(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400">Downtime Stoppage Reason</label>
                <input
                  type="text"
                  value={newDowntimeReason}
                  onChange={(e) => setNewDowntimeReason(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="col-span-2">
                <label className="text-slate-600 dark:text-slate-400">Top Defect Code</label>
                <input
                  type="text"
                  value={newTopDefect}
                  onChange={(e) => setNewTopDefect(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
              >
                Add Record to Sheet
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};
