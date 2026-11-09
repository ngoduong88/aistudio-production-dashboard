import React, { useState } from 'react';
import {
  Wrench,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Search,
  User
} from 'lucide-react';

interface Ticket {
  id: string;
  title: string;
  line: string;
  machine: string;
  priority: 'Critical' | 'High' | 'Normal';
  status: 'Open' | 'Investigating' | 'Resolved';
  assignedTech: string;
  openedAt: string;
  downtimeMinutes: number;
}

export const CelestialTicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 'TICK-801',
      title: 'SMT-02 Stencil Printer Auto-Wipe Motor Stall',
      line: 'SMT-02',
      machine: 'DEK NeoHorizon',
      priority: 'Critical',
      status: 'Investigating',
      assignedTech: 'Nguyen Van T.',
      openedAt: '24 mins ago',
      downtimeMinutes: 24,
    },
    {
      id: 'TICK-798',
      title: 'Panasonic NPM-W2 Feeder Bank 3 Optical Sensor Flag',
      line: 'SMT-01',
      machine: 'NPM-W2 #2',
      priority: 'High',
      status: 'Open',
      assignedTech: 'Pham Duc T.',
      openedAt: '48 mins ago',
      downtimeMinutes: 12,
    },
    {
      id: 'TICK-792',
      title: 'Reflow Oven Zone 4 Thermocouple Drift (+3.8°C)',
      line: 'SMT-02',
      machine: 'Heller 1913 MK5',
      priority: 'High',
      status: 'Resolved',
      assignedTech: 'Le Minh K.',
      openedAt: '3 hrs ago',
      downtimeMinutes: 38,
    },
    {
      id: 'TICK-789',
      title: 'DIP Selective Solder Nozzle Nitrogen Jacket Clog',
      line: 'DIP-01',
      machine: 'Ersa Versaflow',
      priority: 'Normal',
      status: 'Resolved',
      assignedTech: 'Doan Van B.',
      openedAt: '5 hrs ago',
      downtimeMinutes: 15,
    },
  ]);

  const [filterStatus, setFilterStatus] = useState<'all' | 'Open' | 'Investigating' | 'Resolved'>('all');

  const filteredTickets = filterStatus === 'all'
    ? tickets
    : tickets.filter(t => t.status === filterStatus);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#242735]">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Machine Downtime & Maintenance Trouble Tickets</span>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-sm">
              CMMS DISPATCH
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Log equipment faults, assign maintenance engineers, track MTTR and line downtime.
          </p>
        </div>

        {/* Filter and Add buttons */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-0.5 bg-[#181a22] border border-[#242735] rounded-md text-xs">
            {(['all', 'Open', 'Investigating', 'Resolved'] as const).map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1 font-semibold rounded-sm transition-colors cursor-pointer text-[11px] ${
                  filterStatus === s
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s === 'all' ? 'All' : s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-[#181a22] border border-[#242735] rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#242735] text-[11px] text-slate-400 font-mono bg-[#14161f]">
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Problem Summary</th>
                <th className="py-3 px-4">Line & Machine</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Downtime</th>
                <th className="py-3 px-4">Assigned Tech</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242735]">
              {filteredTickets.map(ticket => (
                <tr key={ticket.id} className="hover:bg-[#1f222e] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-400">{ticket.id}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-white block">{ticket.title}</span>
                    <span className="text-[10px] text-slate-500">Opened {ticket.openedAt}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-slate-200 block font-medium">{ticket.line}</span>
                    <span className="text-[10px] text-slate-400">{ticket.machine}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      ticket.priority === 'Critical'
                        ? 'bg-[#e11d48]/20 text-[#e11d48]'
                        : ticket.priority === 'High'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-slate-700 text-slate-300'
                    }`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {ticket.downtimeMinutes > 0 ? `${ticket.downtimeMinutes} mins` : '0 mins'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{ticket.assignedTech}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      ticket.status === 'Resolved'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : ticket.status === 'Investigating'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-[#e11d48]/20 text-[#e11d48]'
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => alert(`Opening technician checklist for ${ticket.id}`)}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-[#242735] hover:bg-[#2e3345] text-slate-300 hover:text-white rounded-md transition-colors cursor-pointer"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
