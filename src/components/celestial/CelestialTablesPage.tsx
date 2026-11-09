import React, { useState, useMemo } from 'react';
import { ProductionRecord, ShiftType } from '../../types';
import {
  Table as TableIcon,
  Search,
  Download,
  Plus,
  RefreshCw,
  Edit2,
  Trash2,
  Filter,
  Check,
  X
} from 'lucide-react';

interface CelestialTablesPageProps {
  records: ProductionRecord[];
  onUpdateRecords: (records: ProductionRecord[]) => void;
  onExportExcel: () => void;
  onExportCsv: () => void;
  onOpenFileUpload: () => void;
}

export const CelestialTablesPage: React.FC<CelestialTablesPageProps> = ({
  records,
  onUpdateRecords,
  onExportExcel,
  onExportCsv,
  onOpenFileUpload,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShift, setSelectedShift] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ProductionRecord>>({});

  const filtered = useMemo(() => {
    return records.filter(r => {
      const matchSearch = r.lineId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.lineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.station.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.downtimeReason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.topDefectCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchShift = selectedShift === 'all' || r.shift === selectedShift;
      return matchSearch && matchShift;
    });
  }, [records, searchTerm, selectedShift]);

  const handleStartEdit = (record: ProductionRecord) => {
    setEditingId(record.id);
    setEditForm({ ...record });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    const updated = records.map(r => {
      if (r.id === editingId) {
        const actual = Number(editForm.actualUnits) || r.actualUnits;
        const passed = Number(editForm.passedUnits) || r.passedUnits;
        const defects = Number(editForm.defectUnits) || r.defectUnits;
        const yieldRate = actual > 0 ? Number(((passed / actual) * 100).toFixed(1)) : r.yieldRate;

        return {
          ...r,
          ...editForm,
          actualUnits: actual,
          passedUnits: passed,
          defectUnits: defects,
          yieldRate,
        };
      }
      return r;
    });

    onUpdateRecords(updated);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#242735]">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>MES Master Spreadsheet & Production Records Grid</span>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-sm">
              {records.length} ROWS
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Underlying manufacturing spreadsheet dataset. Edit values directly or export to Excel/CSV.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenFileUpload}
            className="px-3 py-1.5 text-xs font-semibold bg-[#242735] hover:bg-[#2e3345] text-white border border-[#2e3242] rounded-md transition-colors cursor-pointer"
          >
            Import Excel
          </button>
          <button
            type="button"
            onClick={onExportExcel}
            className="px-3 py-1.5 text-xs font-semibold bg-[#242735] hover:bg-[#2e3345] text-white border border-[#2e3242] rounded-md transition-colors cursor-pointer"
          >
            Export XLSX
          </button>
          <button
            type="button"
            onClick={onExportCsv}
            className="px-3 py-1.5 text-xs font-semibold bg-[#242735] hover:bg-[#2e3345] text-white border border-[#2e3242] rounded-md transition-colors cursor-pointer"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search lines, stations, defect codes..."
            className="w-full bg-[#181a22] border border-[#242735] rounded-md px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 pr-8"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          <span className="text-slate-400 text-[11px]">Shift:</span>
          <select
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.target.value)}
            className="bg-[#181a22] border border-[#242735] text-white rounded-md px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Shifts</option>
            <option value="Shift 1 (Day)">Shift 1 (Day)</option>
            <option value="Shift 2 (Night)">Shift 2 (Night)</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-[#181a22] border border-[#242735] rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#242735] text-[11px] text-slate-400 font-mono bg-[#14161f]">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Line ID</th>
                <th className="py-3 px-3">Station</th>
                <th className="py-3 px-3">Shift</th>
                <th className="py-3 px-3 text-right">Target</th>
                <th className="py-3 px-3 text-right">Actual</th>
                <th className="py-3 px-3 text-right">Passed</th>
                <th className="py-3 px-3 text-right">Defects</th>
                <th className="py-3 px-3 text-right">Yield %</th>
                <th className="py-3 px-3 text-right">Downtime</th>
                <th className="py-3 px-3">Top Defect</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242735]">
              {filtered.map(row => {
                const isEditing = editingId === row.id;

                if (isEditing) {
                  return (
                    <tr key={row.id} className="bg-[#242838]">
                      <td className="py-2 px-3 font-mono text-[10px]">{row.date}</td>
                      <td className="py-2 px-3 font-mono font-bold text-blue-400">{row.lineId}</td>
                      <td className="py-2 px-3">{row.station}</td>
                      <td className="py-2 px-3">{row.shift}</td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          value={editForm.targetUnits ?? row.targetUnits}
                          onChange={(e) => setEditForm({ ...editForm, targetUnits: Number(e.target.value) })}
                          className="w-16 bg-[#13151b] border border-blue-500 rounded px-1.5 py-1 text-right text-white text-xs font-mono"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          value={editForm.actualUnits ?? row.actualUnits}
                          onChange={(e) => setEditForm({ ...editForm, actualUnits: Number(e.target.value) })}
                          className="w-16 bg-[#13151b] border border-blue-500 rounded px-1.5 py-1 text-right text-white text-xs font-mono"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          value={editForm.passedUnits ?? row.passedUnits}
                          onChange={(e) => setEditForm({ ...editForm, passedUnits: Number(e.target.value) })}
                          className="w-16 bg-[#13151b] border border-blue-500 rounded px-1.5 py-1 text-right text-white text-xs font-mono"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          value={editForm.defectUnits ?? row.defectUnits}
                          onChange={(e) => setEditForm({ ...editForm, defectUnits: Number(e.target.value) })}
                          className="w-14 bg-[#13151b] border border-blue-500 rounded px-1.5 py-1 text-right text-white text-xs font-mono"
                        />
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-emerald-400 font-bold">
                        {row.yieldRate}%
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          value={editForm.downtimeMinutes ?? row.downtimeMinutes}
                          onChange={(e) => setEditForm({ ...editForm, downtimeMinutes: Number(e.target.value) })}
                          className="w-14 bg-[#13151b] border border-blue-500 rounded px-1.5 py-1 text-right text-white text-xs font-mono"
                        />
                      </td>
                      <td className="py-2 px-3 text-slate-400 text-[10px]">{row.topDefectCode}</td>
                      <td className="py-2 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={handleSaveEdit}
                            className="p-1 text-emerald-400 hover:bg-emerald-500/20 rounded cursor-pointer"
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="p-1 text-slate-400 hover:bg-slate-700 rounded cursor-pointer"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={row.id} className="hover:bg-[#1f222e] transition-colors">
                    <td className="py-3 px-3 font-mono text-slate-400 text-[10px]">{row.date}</td>
                    <td className="py-3 px-3 font-mono font-bold text-blue-400">{row.lineId}</td>
                    <td className="py-3 px-3 text-white font-medium">{row.station}</td>
                    <td className="py-3 px-3 text-slate-400">{row.shift}</td>
                    <td className="py-3 px-3 text-right font-mono text-slate-300">{row.targetUnits.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right font-mono text-white font-semibold">{row.actualUnits.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right font-mono text-emerald-400">{row.passedUnits.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right font-mono text-[#e11d48]">{row.defectUnits}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">{row.yieldRate}%</td>
                    <td className="py-3 px-3 text-right font-mono text-slate-400">{row.downtimeMinutes}m</td>
                    <td className="py-3 px-3 text-slate-300 text-[11px] truncate max-w-[120px]">{row.topDefectCode}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(row)}
                        className="p-1 text-slate-400 hover:text-white rounded hover:bg-[#242735] transition-colors cursor-pointer"
                        title="Edit row"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
