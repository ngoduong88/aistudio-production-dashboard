import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  Award,
  Search
} from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  role: string;
  shift: 'Shift 1 (Day)' | 'Shift 2 (Night)';
  station: string;
  certification: string;
  attendance: 'On Duty' | 'Standby' | 'Break';
  avatarInitials: string;
}

export const CelestialEmployeePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [shiftFilter, setShiftFilter] = useState<'all' | 'day' | 'night'>('all');

  const employees: Employee[] = [
    { id: 'FIH-4012', name: 'Nguyen Van Tuan', role: 'SMT Line Lead Supervisor', shift: 'Shift 1 (Day)', station: 'SMT-01 & SMT-02', certification: 'IPC-A-610 Master Trainer', attendance: 'On Duty', avatarInitials: 'NT' },
    { id: 'FIH-4089', name: 'Tran Thi Mai', role: 'Senior AOI Inspection Specialist', shift: 'Shift 1 (Day)', station: '3D AOI & SPI', certification: 'IPC J-STD-001 Certified', attendance: 'On Duty', avatarInitials: 'TM' },
    { id: 'FIH-3912', name: 'Le Minh Khoa', role: 'Process Reflow Oven Engineer', shift: 'Shift 1 (Day)', station: 'Reflow MK5 & N2', certification: 'SMTA Process Engineer', attendance: 'On Duty', avatarInitials: 'LK' },
    { id: 'FIH-5104', name: 'Pham Duc Thang', role: 'SMT Feeder Setup Operator', shift: 'Shift 1 (Day)', station: 'NPM-W2 Feeders', certification: 'Level 2 Feeder Prep', attendance: 'Break', avatarInitials: 'PT' },
    { id: 'FIH-4890', name: 'Doan Van Binh', role: 'DIP Selective Solder Specialist', shift: 'Shift 2 (Night)', station: 'Versaflow DIP', certification: 'IPC-7711/7721 Rework', attendance: 'Standby', avatarInitials: 'DB' },
    { id: 'FIH-3840', name: 'Vu Hoang Long', role: 'In-Circuit Test (ICT) Engineer', shift: 'Shift 2 (Night)', station: 'Keysight 3070', certification: 'ATE Test Systems Cert', attendance: 'Standby', avatarInitials: 'VL' },
  ];

  const filtered = employees.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.station.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesShift = shiftFilter === 'all' ||
      (shiftFilter === 'day' && e.shift.includes('Day')) ||
      (shiftFilter === 'night' && e.shift.includes('Night'));
    return matchesSearch && matchesShift;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#242735]">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Shift Team Roster & Line Personnel</span>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-sm">
              ON DUTY: {employees.filter(e => e.attendance === 'On Duty').length} / {employees.length}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Production line supervisors, certified process technicians, and AOI inspection specialists.
          </p>
        </div>

        {/* Search & Shift Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search staff..."
              className="bg-[#181a22] border border-[#242735] rounded-md px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 pr-7"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          <div className="flex items-center gap-1 p-0.5 bg-[#181a22] border border-[#242735] rounded-md text-xs">
            {(['all', 'day', 'night'] as const).map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setShiftFilter(s)}
                className={`px-3 py-1 font-semibold rounded-sm transition-colors cursor-pointer text-[11px] capitalize ${
                  shiftFilter === s ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {s === 'all' ? 'All Shifts' : `${s} Shift`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Staff Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(emp => (
          <div key={emp.id} className="bg-[#181a22] border border-[#242735] rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center font-bold text-xs text-white">
                  {emp.avatarInitials}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{emp.name}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">{emp.id}</span>
                </div>
              </div>

              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                emp.attendance === 'On Duty'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : emp.attendance === 'Break'
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-slate-700 text-slate-300'
              }`}>
                {emp.attendance}
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Position</span>
                <span className="text-slate-200 font-semibold">{emp.role}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Shift</span>
                <span className="text-blue-400 font-medium">{emp.shift}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Station</span>
                <span className="text-slate-300">{emp.station}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#242735] flex items-center justify-between text-[10px]">
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <Award className="w-3 h-3" />
                {emp.certification}
              </span>
              <button
                type="button"
                onClick={() => alert(`Connecting to line intercom for ${emp.name}`)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                Page Line
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
