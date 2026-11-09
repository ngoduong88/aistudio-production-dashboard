import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Wrench,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Plus,
  ShieldCheck
} from 'lucide-react';

export const CelestialCalendarPage: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState(12);

  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  const scheduledEvents = [
    { day: 4, type: 'pm', title: 'SMT-01 Nozzle Ultrasonic Cleaning', time: '06:00 - 07:30', line: 'SMT-01', tech: 'Nguyen Van T.' },
    { day: 7, type: 'shift', title: 'Shift 1 & 2 Bi-Weekly Handover Review', time: '18:00 - 18:45', line: 'All Lines', tech: 'Shift Leads' },
    { day: 12, type: 'audit', title: 'ISO-9001 / IATF-16949 Internal Quality Audit', time: '09:00 - 16:00', line: 'SMT & DIP', tech: 'Audit Committee' },
    { day: 15, type: 'pm', title: 'Reflow Oven Zone 7-8 Thermal Calibration', time: '22:00 - 23:30', line: 'SMT-02', tech: 'Process Eng Team' },
    { day: 19, type: 'pm', title: 'Koh Young 3D AOI Optical Sensor Profiling', time: '05:30 - 06:45', line: 'SMT-01', tech: 'Vision Specialists' },
    { day: 24, type: 'shift', title: 'Monthly Plant Safety & 5S Floor Walk', time: '14:00 - 15:30', line: 'Plant-Wide', tech: 'EHS Department' },
    { day: 28, type: 'pm', title: 'Keysight ICT Bed-of-Nails Fixture Pin Replacement', time: '07:00 - 08:30', line: 'TEST-01', tech: 'Test Eng' },
  ];

  const selectedDayEvents = scheduledEvents.filter(e => e.day === selectedDay);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#242735]">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Plant Shift Schedule & Maintenance Calendar</span>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-sm">
              NOVEMBER 2026
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Shift handovers, autonomous maintenance (TPM), optical calibration, and ISO quality audits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => alert('New maintenance or shift event modal')}
            className="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Maintenance</span>
          </button>
        </div>
      </div>

      {/* Main Calendar Grid & Day Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Monthly Calendar Grid (Col 8) */}
        <div className="lg:col-span-8 bg-[#181a22] border border-[#242735] rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#242735]">
            <span className="text-sm font-bold text-white">November 2026</span>
            <div className="flex items-center gap-1 text-slate-400">
              <button className="p-1 hover:text-white rounded hover:bg-[#242735] cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs px-2 font-mono">Today: Nov 12</span>
              <button className="p-1 hover:text-white rounded hover:bg-[#242735] cursor-pointer">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-slate-500 pb-2">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Blank offset for starting day */}
            <div className="h-20 p-1.5 rounded-lg border border-transparent bg-transparent" />
            <div className="h-20 p-1.5 rounded-lg border border-transparent bg-transparent" />

            {daysInMonth.map((day) => {
              const dayEvents = scheduledEvents.filter((e) => e.day === day);
              const isSelected = selectedDay === day;
              const isToday = day === 12;

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`h-20 p-1.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#242838] border-blue-500 shadow-md'
                      : isToday
                      ? 'bg-[#1e2230] border-emerald-500/50'
                      : 'bg-[#13151b] border-[#242735] hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className={`font-mono font-bold ${isToday ? 'text-emerald-400' : isSelected ? 'text-white' : 'text-slate-400'}`}>
                      {day}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48]" />
                    )}
                  </div>

                  {/* Micro event indicators */}
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((ev, i) => (
                      <div
                        key={i}
                        className={`text-[9px] px-1 py-0.5 rounded truncate font-medium ${
                          ev.type === 'pm'
                            ? 'bg-blue-500/20 text-blue-300'
                            : ev.type === 'audit'
                            ? 'bg-[#e11d48]/20 text-rose-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                        title={ev.title}
                      >
                        {ev.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Day Events Inspector (Col 4) */}
        <div className="lg:col-span-4 bg-[#181a22] border border-[#242735] rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#242735]">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4 text-blue-400" />
              <span>Events on Nov {selectedDay}, 2026</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              {selectedDayEvents.length} scheduled
            </span>
          </div>

          {selectedDayEvents.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-slate-600 mx-auto" />
              <p>No downtime or maintenance scheduled for this day.</p>
              <p className="text-[10px]">Standard 2-shift operations running as planned.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDayEvents.map((ev, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-[#13151b] border border-[#242735] rounded-lg space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      ev.type === 'pm'
                        ? 'bg-blue-500/20 text-blue-400'
                        : ev.type === 'audit'
                        ? 'bg-[#e11d48]/20 text-[#e11d48]'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {ev.type === 'pm' ? 'Preventive Maint' : ev.type === 'audit' ? 'Quality Audit' : 'Shift Event'}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {ev.time}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white">{ev.title}</h4>

                  <div className="text-[11px] text-slate-400 flex justify-between pt-1 border-t border-[#242735]">
                    <span>Target: <strong className="text-slate-200">{ev.line}</strong></span>
                    <span>Assigned: <strong className="text-slate-200">{ev.tech}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
