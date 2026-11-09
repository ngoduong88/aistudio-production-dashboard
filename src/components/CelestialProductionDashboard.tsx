import React, { useState, useMemo } from 'react';
import {
  ProductionRecord,
  ProductionKPIs,
  DashboardTemplate
} from '../types';
import {
  Calendar,
  Download,
  Info,
  Search,
  LayoutDashboard,
  Box,
  Layers,
  Cpu,
  FileSpreadsheet,
  FileText,
  BarChart3,
  Table as TableIcon,
  MessageSquare,
  Bell,
  User,
  ChevronRight,
  ChevronDown,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Activity,
  Sliders,
  Sparkles,
  Zap,
  Clock,
  Radio,
  Share2,
  Upload,
  LogOut,
  FolderKanban,
  CheckSquare,
  Image,
  LifeBuoy
} from 'lucide-react';

import { CelestialWidgetsPage } from './celestial/CelestialWidgetsPage';
import { CelestialLinesPage } from './celestial/CelestialLinesPage';
import { CelestialChartsPage } from './celestial/CelestialChartsPage';
import { CelestialCalendarPage } from './celestial/CelestialCalendarPage';
import { CelestialKanbanPage } from './celestial/CelestialKanbanPage';
import { CelestialGalleryPage } from './celestial/CelestialGalleryPage';
import { CelestialTicketsPage } from './celestial/CelestialTicketsPage';
import { CelestialEmployeePage } from './celestial/CelestialEmployeePage';
import { CelestialDocumentationPage } from './celestial/CelestialDocumentationPage';
import { CelestialTablesPage } from './celestial/CelestialTablesPage';

export type CelestialPage =
  | 'dashboard'
  | 'widgets'
  | 'smt_lines'
  | 'charts'
  | 'tables'
  | 'calendar'
  | 'kanban'
  | 'gallery'
  | 'tickets'
  | 'employee'
  | 'docs';

interface CelestialProductionDashboardProps {
  records: ProductionRecord[];
  kpis: ProductionKPIs;
  onOpenChat: () => void;
  onOpenUpload: () => void;
  onOpenShare: () => void;
  onExportExcel: () => void;
  onExportCsv: () => void;
  authenticatedUser: string | null;
  onSignOut: () => void;
  onChangeTemplate: (t: DashboardTemplate) => void;
  onUpdateRecords?: (records: ProductionRecord[]) => void;
}

export const CelestialProductionDashboard: React.FC<CelestialProductionDashboardProps> = ({
  records,
  kpis,
  onOpenChat,
  onOpenUpload,
  onOpenShare,
  onExportExcel,
  onExportCsv,
  authenticatedUser,
  onSignOut,
  onChangeTemplate,
  onUpdateRecords,
}) => {
  const [currentPage, setCurrentPage] = useState<CelestialPage>('dashboard');
  const [activeNavTab, setActiveNavTab] = useState<'calendar' | 'statistic' | 'employee' | 'help'>('statistic');
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [ecomRange, setEcomRange] = useState<'day' | 'week' | 'month'>('month');
  const [salesRange, setSalesRange] = useState<'month' | 'shift'>('month');
  const [dateFilterOpen, setDateFilterOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('Last 7 days');
  const [selectedLineDetail, setSelectedLineDetail] = useState<string | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);

  // Compute live data mapped to template sections
  const linesSummary = useMemo(() => {
    const map = new Map<string, {
      lineId: string;
      lineName: string;
      station: string;
      totalTarget: number;
      totalActual: number;
      totalPassed: number;
      totalDefects: number;
      yieldRate: number;
      downtimeMin: number;
      status: string;
      shift: string;
    }>();

    records.forEach((r) => {
      const existing = map.get(r.lineId) || {
        lineId: r.lineId,
        lineName: r.lineName,
        station: r.station,
        totalTarget: 0,
        totalActual: 0,
        totalPassed: 0,
        totalDefects: 0,
        yieldRate: 0,
        downtimeMin: 0,
        status: r.status,
        shift: r.shift,
      };

      existing.totalTarget += r.targetUnits;
      existing.totalActual += r.actualUnits;
      existing.totalPassed += r.passedUnits;
      existing.totalDefects += r.defectUnits;
      existing.downtimeMin += r.downtimeMinutes;
      existing.yieldRate = existing.totalActual > 0
        ? Number(((existing.totalPassed / existing.totalActual) * 100).toFixed(1))
        : 100;
      map.set(r.lineId, existing);
    });

    return Array.from(map.values());
  }, [records]);

  // Filtered lines based on sidebar search
  const filteredLines = useMemo(() => {
    if (!sidebarSearch.trim()) return linesSummary;
    const q = sidebarSearch.toLowerCase();
    return linesSummary.filter(l =>
      l.lineId.toLowerCase().includes(q) ||
      l.lineName.toLowerCase().includes(q) ||
      l.station.toLowerCase().includes(q)
    );
  }, [linesSummary, sidebarSearch]);

  const scoreYield = Math.round(kpis.fleetYieldRate || 75);

  return (
    <div className="min-h-screen bg-[#13151b] text-slate-200 font-sans selection:bg-[#e11d48] selection:text-white flex flex-col antialiased">
      {/* 1. TOP NAVIGATION BAR */}
      <header className="h-16 bg-[#181a22] border-b border-[#242735] px-4 sm:px-6 flex items-center justify-between z-30 sticky top-0 shadow-md">
        {/* Left: Brand & Mobile Sidebar Toggle */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#e11d48] to-[#f43f5e] flex items-center justify-center text-white shadow-md shadow-[#e11d48]/30">
              <Sparkles className="w-4 h-4 fill-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>Celestial</span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-normal">FIH Ops</span>
            </span>
          </div>

          {/* Center Nav tabs with vibrant magenta highlight */}
          <nav className="hidden lg:flex items-center gap-8 pl-8 text-xs font-semibold text-slate-400">
            <button
              type="button"
              onClick={() => { setActiveNavTab('calendar'); setCurrentPage('calendar'); }}
              className={`hover:text-white transition-colors cursor-pointer pb-5 pt-5 relative ${
                activeNavTab === 'calendar' ? 'text-white' : ''
              }`}
            >
              Calendar
              {activeNavTab === 'calendar' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#e11d48]" />
              )}
            </button>
            <button
              type="button"
              onClick={() => { setActiveNavTab('statistic'); setCurrentPage('dashboard'); }}
              className={`hover:text-white transition-colors cursor-pointer pb-5 pt-5 relative ${
                activeNavTab === 'statistic' ? 'text-white font-bold' : ''
              }`}
            >
              Statistic
              {activeNavTab === 'statistic' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#e11d48]" />
              )}
            </button>
            <button
              type="button"
              onClick={() => { setActiveNavTab('employee'); setCurrentPage('employee'); }}
              className={`hover:text-white transition-colors cursor-pointer pb-5 pt-5 relative ${
                activeNavTab === 'employee' ? 'text-white' : ''
              }`}
            >
              Employee
              {activeNavTab === 'employee' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#e11d48]" />
              )}
            </button>
            <button
              type="button"
              onClick={() => { setActiveNavTab('help'); setCurrentPage('docs'); }}
              className={`hover:text-white transition-colors cursor-pointer pb-5 pt-5 relative ${
                activeNavTab === 'help' ? 'text-white' : ''
              }`}
            >
              Help
              {activeNavTab === 'help' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#e11d48]" />
              )}
            </button>
          </nav>
        </div>

        {/* Right Utility Icons & Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Chat Icon with Green Badge */}
          <button
            type="button"
            onClick={onOpenChat}
            className="relative p-2 text-slate-400 hover:text-white hover:bg-[#20232e] rounded-lg transition-colors cursor-pointer"
            title="Ask Copilot AI"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 text-[9px] font-bold text-slate-950 flex items-center justify-center">
              2
            </span>
          </button>

          {/* Bell Icon with Red Badge */}
          <button
            type="button"
            onClick={() => alert('No active alarm. All 5 Foxconn SMT & Assembly lines operating within normal Cpk tolerance.')}
            className="relative p-2 text-slate-400 hover:text-white hover:bg-[#20232e] rounded-lg transition-colors cursor-pointer"
            title="Line Alarms"
          >
            <Bell className="w-4 h-4 text-rose-400" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#e11d48] text-[9px] font-bold text-white flex items-center justify-center">
              2
            </span>
          </button>

          {/* Template Switcher Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowTemplateMenu(!showTemplateMenu)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold bg-[#20232e] hover:bg-[#282c3a] border border-[#2e3242] rounded-lg text-slate-300 transition-colors cursor-pointer"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-blue-400" />
              <span>Templates</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showTemplateMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-[#1a1d26] border border-[#2e3242] rounded-xl shadow-2xl py-1 z-50 text-xs">
                <button
                  type="button"
                  onClick={() => { onChangeTemplate('celestial_dark'); setShowTemplateMenu(false); }}
                  className="w-full text-left px-3 py-2 text-white bg-blue-600/20 font-semibold flex items-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Celestial Dark (Current)</span>
                </button>
                <button
                  type="button"
                  onClick={() => { onChangeTemplate('simple_charts'); setShowTemplateMenu(false); }}
                  className="w-full text-left px-3 py-2 text-slate-300 hover:bg-[#242735] flex items-center gap-2"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Simple Minimal Charts</span>
                </button>
                <button
                  type="button"
                  onClick={() => { onChangeTemplate('shop_floor'); setShowTemplateMenu(false); }}
                  className="w-full text-left px-3 py-2 text-slate-300 hover:bg-[#242735] flex items-center gap-2"
                >
                  <Radio className="w-3.5 h-3.5 text-slate-400" />
                  <span>Shop Floor Big Screen</span>
                </button>
                <button
                  type="button"
                  onClick={() => { onChangeTemplate('full_table'); setShowTemplateMenu(false); }}
                  className="w-full text-left px-3 py-2 text-slate-300 hover:bg-[#242735] flex items-center gap-2"
                >
                  <TableIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>Full MES Telemetry Grid</span>
                </button>
              </div>
            )}
          </div>

          {/* Share Button */}
          <button
            type="button"
            onClick={onOpenShare}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold bg-[#20232e] hover:bg-[#282c3a] border border-[#2e3242] rounded-lg text-slate-300 transition-colors cursor-pointer"
            title="Share Dashboard"
          >
            <Share2 className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden md:inline">Share</span>
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#242735]">
            <div className="w-7 h-7 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-bold text-white uppercase">
              {authenticatedUser ? authenticatedUser[0] : 'K'}
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-semibold text-white leading-tight">
                {authenticatedUser || 'Kenneth Osborne'}
              </span>
              <span className="text-[10px] text-slate-400">FIH Factory Admin</span>
            </div>
            <button
              type="button"
              onClick={onSignOut}
              className="p-1 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. BODY LAYOUT: LEFT SIDEBAR + MAIN CONTENT */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR (Dark Slate Navigation matching template capture) */}
        <aside className="w-64 bg-[#181a22] border-r border-[#242735] hidden md:flex flex-col shrink-0 overflow-y-auto">
          {/* User Status Card */}
          <div className="p-4 border-b border-[#242735]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-600 to-slate-800 border-2 border-[#242735] flex items-center justify-center text-sm font-bold text-white shadow-inner">
                  KO
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#181a22]" />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-white truncate">
                  {authenticatedUser || 'Kenneth Osborne'}
                </h4>
                <p className="text-[10px] text-slate-400">Welcome</p>
              </div>
            </div>

            {/* Search Box */}
            <div className="mt-3 relative">
              <input
                type="text"
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                placeholder="Type to search..."
                className="w-full bg-[#13151b] border border-[#242735] rounded-md px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 pr-7"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Menu Sections */}
          <div className="p-3 space-y-6 text-xs text-slate-400">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-3 mb-2">
                Dash menu
              </p>
              <div className="space-y-0.5">
                {/* 1. Dashboard (Main) */}
                <button
                  type="button"
                  onClick={() => setCurrentPage('dashboard')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-semibold cursor-pointer transition-colors ${
                    currentPage === 'dashboard'
                      ? 'bg-[#242838] text-white shadow-xs'
                      : 'hover:bg-[#1f222e] text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className={`w-4 h-4 ${currentPage === 'dashboard' ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>Dashboard</span>
                  </div>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-sm bg-[#e11d48] text-white uppercase tracking-wider">
                    New
                  </span>
                </button>

                {/* 2. Widgets */}
                <button
                  type="button"
                  onClick={() => setCurrentPage('widgets')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-semibold cursor-pointer transition-colors ${
                    currentPage === 'widgets'
                      ? 'bg-[#242838] text-white shadow-xs'
                      : 'hover:bg-[#1f222e] text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Cpu className={`w-4 h-4 ${currentPage === 'widgets' ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>Widgets & IoT</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* 3. SMT Lines */}
                <button
                  type="button"
                  onClick={() => setCurrentPage('smt_lines')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-semibold cursor-pointer transition-colors ${
                    currentPage === 'smt_lines'
                      ? 'bg-[#242838] text-white shadow-xs'
                      : 'hover:bg-[#1f222e] text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Box className={`w-4 h-4 ${currentPage === 'smt_lines' ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>SMT Lines (5)</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* 4. Charts & Analytics */}
                <button
                  type="button"
                  onClick={() => setCurrentPage('charts')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-semibold cursor-pointer transition-colors ${
                    currentPage === 'charts'
                      ? 'bg-[#242838] text-white shadow-xs'
                      : 'hover:bg-[#1f222e] text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <BarChart3 className={`w-4 h-4 ${currentPage === 'charts' ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>Charts & OEE</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* 5. Spreadsheet View / Tables */}
                <button
                  type="button"
                  onClick={() => setCurrentPage('tables')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-semibold cursor-pointer transition-colors ${
                    currentPage === 'tables'
                      ? 'bg-[#242838] text-white shadow-xs'
                      : 'hover:bg-[#1f222e] text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileSpreadsheet className={`w-4 h-4 ${currentPage === 'tables' ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>Spreadsheet Grid</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* 6. Calendar Schedule */}
                <button
                  type="button"
                  onClick={() => setCurrentPage('calendar')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-semibold cursor-pointer transition-colors ${
                    currentPage === 'calendar'
                      ? 'bg-[#242838] text-white shadow-xs'
                      : 'hover:bg-[#1f222e] text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar className={`w-4 h-4 ${currentPage === 'calendar' ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>Calendar Schedule</span>
                  </div>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-sm bg-amber-500 text-slate-950 uppercase tracking-wider">
                    New
                  </span>
                </button>

                {/* 7. Kanban Board */}
                <button
                  type="button"
                  onClick={() => setCurrentPage('kanban')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-semibold cursor-pointer transition-colors ${
                    currentPage === 'kanban'
                      ? 'bg-[#242838] text-white shadow-xs'
                      : 'hover:bg-[#1f222e] text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FolderKanban className={`w-4 h-4 ${currentPage === 'kanban' ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>kanban Board</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* 8. Gallery (AOI Defect Inspection) */}
                <button
                  type="button"
                  onClick={() => setCurrentPage('gallery')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-semibold cursor-pointer transition-colors ${
                    currentPage === 'gallery'
                      ? 'bg-[#242838] text-white shadow-xs'
                      : 'hover:bg-[#1f222e] text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Image className={`w-4 h-4 ${currentPage === 'gallery' ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>Gallery (AOI)</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* 9. Tickets */}
                <button
                  type="button"
                  onClick={() => setCurrentPage('tickets')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-semibold cursor-pointer transition-colors ${
                    currentPage === 'tickets'
                      ? 'bg-[#242838] text-white shadow-xs'
                      : 'hover:bg-[#1f222e] text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CheckSquare className={`w-4 h-4 ${currentPage === 'tickets' ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>Trouble Tickets</span>
                  </div>
                  <span className="w-4 h-4 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center">
                    4
                  </span>
                </button>

                {/* 10. AI Copilot */}
                <button
                  type="button"
                  onClick={onOpenChat}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#1f222e] hover:text-white transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>AI Copilot</span>
                  </div>
                  <span className="w-4 h-4 rounded-full bg-blue-500 text-[9px] font-bold text-white flex items-center justify-center">
                    2
                  </span>
                </button>

                {/* 11. Documentation */}
                <button
                  type="button"
                  onClick={() => setCurrentPage('docs')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-semibold cursor-pointer transition-colors ${
                    currentPage === 'docs'
                      ? 'bg-[#242838] text-white shadow-xs'
                      : 'hover:bg-[#1f222e] text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className={`w-4 h-4 ${currentPage === 'docs' ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>Documentation</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>
            </div>

            {/* Category Section at bottom */}
            <div className="pt-2 border-t border-[#242735]">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-3 mb-2">
                Category
              </p>
              <div className="space-y-2 px-3 text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#e11d48]" />
                  <span>#SMT_SurfaceMount</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#10b981]" />
                  <span>#DIP_Assembly</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#3b82f6]" />
                  <span>#Quality_Audit</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN DASHBOARD CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Child Pages Router */}
          {currentPage === 'widgets' && (
            <CelestialWidgetsPage
              records={records}
              kpis={kpis}
              onAskCopilot={(q) => onOpenChat()}
            />
          )}

          {currentPage === 'smt_lines' && (
            <CelestialLinesPage
              records={records}
              kpis={kpis}
              onAskCopilot={(q) => onOpenChat()}
            />
          )}

          {currentPage === 'charts' && (
            <CelestialChartsPage
              records={records}
              kpis={kpis}
              onAskCopilot={(q) => onOpenChat()}
              onExportCsv={onExportCsv}
            />
          )}

          {currentPage === 'tables' && (
            <CelestialTablesPage
              records={records}
              onUpdateRecords={onUpdateRecords || (() => {})}
              onExportExcel={onExportExcel}
              onExportCsv={onExportCsv}
              onOpenFileUpload={onOpenUpload}
            />
          )}

          {currentPage === 'calendar' && <CelestialCalendarPage />}

          {currentPage === 'kanban' && <CelestialKanbanPage />}

          {currentPage === 'gallery' && (
            <CelestialGalleryPage onAskCopilot={(q) => onOpenChat()} />
          )}

          {currentPage === 'tickets' && <CelestialTicketsPage />}

          {currentPage === 'employee' && <CelestialEmployeePage />}

          {currentPage === 'docs' && <CelestialDocumentationPage />}

          {/* Primary Main Dashboard View */}
          {currentPage === 'dashboard' && (
            <>
              {/* Main Top Header Greeting & Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {authenticatedUser ? authenticatedUser.split('@')[0] : 'Kenneth Osborne'}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Your last login: Just now from Foxconn MES Smart Factory Network.
              </p>
            </div>

            {/* Header Right Actions matching template */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Date Filter Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDateFilterOpen(!dateFilterOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-[#181a22] border border-[#2e3242] hover:bg-[#20232e] text-slate-200 rounded-md transition-colors cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedDateRange}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
                {dateFilterOpen && (
                  <div className="absolute right-0 mt-1 w-40 bg-[#181a22] border border-[#2e3242] rounded-md shadow-2xl py-1 z-40 text-xs">
                    {['Today (Live)', 'Shift 1 & 2', 'Last 7 days', 'Last 30 days'].map((range) => (
                      <button
                        key={range}
                        type="button"
                        onClick={() => { setSelectedDateRange(range); setDateFilterOpen(false); }}
                        className="w-full text-left px-3 py-1.5 text-slate-300 hover:bg-[#20232e] hover:text-white"
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Export Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#181a22] border border-[#2e3242] hover:bg-[#20232e] text-slate-200 rounded-md transition-colors cursor-pointer"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                  <span>Export</span>
                </button>
                {showExportMenu && (
                  <div className="absolute right-0 mt-1 w-36 bg-[#181a22] border border-[#2e3242] rounded-md shadow-2xl py-1 z-40 text-xs">
                    <button
                      type="button"
                      onClick={() => { onExportExcel(); setShowExportMenu(false); }}
                      className="w-full text-left px-3 py-1.5 text-slate-300 hover:bg-[#20232e] hover:text-white"
                    >
                      Export Excel (.xlsx)
                    </button>
                    <button
                      type="button"
                      onClick={() => { onExportCsv(); setShowExportMenu(false); }}
                      className="w-full text-left px-3 py-1.5 text-slate-300 hover:bg-[#20232e] hover:text-white"
                    >
                      Export CSV (.csv)
                    </button>
                  </div>
                )}
              </div>

              {/* Info Button */}
              <button
                type="button"
                onClick={() => alert(`FIH Foxconn Smart Manufacturing Telemetry\nRecords in Memory: ${records.length}\nFleet FPY Yield: ${kpis.fleetYieldRate}%\nTotal Output: ${kpis.totalActual.toLocaleString()} units`)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#181a22] border border-[#2e3242] hover:bg-[#20232e] text-slate-200 rounded-md transition-colors cursor-pointer"
              >
                <Info className="w-3.5 h-3.5 text-slate-400" />
                <span>Info</span>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ROW 1: 3 CARDS (Sessions By Channel Gauge, Events Wave Chart, Device Stats) */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Sessions By Channel (Yield Score Donut Ring) */}
            <div className="bg-[#181a22] border border-[#242735] rounded-xl p-5 shadow-lg relative flex flex-col justify-between">
              <h3 className="text-sm font-bold text-white mb-4">Sessions By Channel</h3>

              <div className="flex items-center justify-between gap-4">
                {/* Donut Progress Ring */}
                <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#242735"
                      strokeWidth="10"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="url(#donutGradient)"
                      strokeWidth="10"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * scoreYield) / 100}
                      strokeLinecap="round"
                      fill="none"
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="donutGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#2563eb" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] text-slate-400 font-medium">Score</span>
                    <span className="text-xl font-extrabold text-white">{scoreYield}%</span>
                  </div>
                </div>

                {/* Right Breakdown Items with Colored Dots */}
                <div className="space-y-1.5 text-xs flex-1">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>Firewalls(3)</span>
                    </span>
                    <span className="text-slate-400 font-mono">4(100%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span>Ports(12)</span>
                    </span>
                    <span className="text-slate-400 font-mono">12(100%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span>Servers(233)</span>
                    </span>
                    <span className="text-slate-400 font-mono">2(100%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                      <span>Firewalls(3)</span>
                    </span>
                    <span className="text-slate-400 font-mono">7(100%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      <span>Firewalls(3)</span>
                    </span>
                    <span className="text-slate-400 font-mono">6(70%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Events (Tri-Color Spline Wave Area Chart) */}
            <div className="bg-[#181a22] border border-[#242735] rounded-xl p-5 shadow-lg relative flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white">Events</h3>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="text-blue-400">Critical</span>
                  <span className="text-[#e11d48]">Error</span>
                  <span className="text-amber-400">Warning</span>
                </div>
              </div>

              {/* Multi-wave Mountain SVG */}
              <div className="h-28 w-full mt-auto">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 200 80" preserveAspectRatio="none">
                  {/* Gradients */}
                  <defs>
                    <linearGradient id="eventRed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#e11d48" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#e11d48" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="eventBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Red Wave Area */}
                  <path
                    d="M0,70 Q25,30 50,60 T100,30 T150,65 T200,40 L200,80 L0,80 Z"
                    fill="url(#eventRed)"
                  />
                  {/* Red Wave Stroke */}
                  <path
                    d="M0,70 Q25,30 50,60 T100,30 T150,65 T200,40"
                    fill="none"
                    stroke="#e11d48"
                    strokeWidth="1.8"
                  />

                  {/* Blue Wave Area */}
                  <path
                    d="M0,60 Q30,45 65,70 T130,20 T180,60 T200,35 L200,80 L0,80 Z"
                    fill="url(#eventBlue)"
                  />
                  {/* Blue Wave Stroke */}
                  <path
                    d="M0,60 Q30,45 65,70 T130,20 T180,60 T200,35"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="1.8"
                  />

                  {/* Amber Wave Stroke */}
                  <path
                    d="M0,75 Q40,65 80,40 T140,75 T200,55"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </div>

            {/* Card 3: Device Stats */}
            <div className="bg-[#181a22] border border-[#242735] rounded-xl p-5 shadow-lg relative flex flex-col justify-between">
              <h3 className="text-sm font-bold text-white mb-2">Device Stats</h3>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Uptime</span>
                  <span className="text-slate-200 font-semibold">195 Days, 8 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">First Seen</span>
                  <span className="text-slate-200 font-semibold">23 Sep 2026, 2.04PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Collected time</span>
                  <span className="text-slate-200 font-semibold">23 Sep 2026, 2.04PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Memory space</span>
                  <span className="text-slate-200 font-semibold">168.3GB</span>
                </div>

                {/* Bright green progress bar matching template */}
                <div className="pt-2">
                  <div className="w-full h-2 rounded-full bg-[#242735] overflow-hidden">
                    <div className="h-full w-[70%] bg-emerald-500 rounded-full shadow-sm shadow-emerald-500/50" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ROW 2: 3 CARDS (Employee Channel List, Sales Analytics, Card Title Earning) */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Card 1: Sessions By Channel (Employee / Line Output Table) - Col 3 */}
            <div className="md:col-span-3 bg-[#181a22] border border-[#242735] rounded-xl p-5 shadow-lg">
              <h3 className="text-sm font-bold text-white mb-1">Sessions By Channel</h3>
              <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-[#242735] pb-2 mb-2">
                <span>Empolyee Name</span>
                <span>This Month</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-blue-400 hover:underline cursor-pointer font-medium">Connor Chandler</span>
                  <span className="text-slate-300 font-mono">$ 4909</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-400 hover:underline cursor-pointer font-medium">Russell Floyd</span>
                  <span className="text-slate-300 font-mono">$857</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-400 hover:underline cursor-pointer font-medium">Douglas White</span>
                  <span className="text-slate-300 font-mono">$612</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-400 hover:underline cursor-pointer font-medium">Alta Fletcher</span>
                  <span className="text-slate-300 font-mono">$233</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-400 hover:underline cursor-pointer font-medium">Marguerite Pearson</span>
                  <span className="text-slate-300 font-mono">$233</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-400 hover:underline cursor-pointer font-medium">Leonard Gutierrez</span>
                  <span className="text-slate-300 font-mono">$35</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-400 hover:underline cursor-pointer font-medium">Helen Benson</span>
                  <span className="text-slate-300 font-mono">$43</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-400 hover:underline cursor-pointer font-medium">Helen Benson</span>
                  <span className="text-slate-300 font-mono">$43</span>
                </div>
              </div>
            </div>

            {/* Card 2: Sales Analytics (Multi-Wave Spline Lines) - Col 6 */}
            <div className="md:col-span-6 bg-[#181a22] border border-[#242735] rounded-xl p-5 shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Sales Analytics</h3>
                  <div className="flex items-center gap-6 mt-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <span>📡</span> Online
                      </span>
                      <p className="text-base font-extrabold text-[#e11d48]">23,342</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <span>📦</span> Offline
                      </span>
                      <p className="text-base font-extrabold text-blue-400">13,221</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <span>🏷️</span> Marketing
                      </span>
                      <p className="text-base font-extrabold text-amber-400">1,542</p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSalesRange(salesRange === 'month' ? 'shift' : 'month')}
                  className="px-2.5 py-1 text-[11px] font-bold uppercase rounded-md bg-[#242735] text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  {salesRange}
                </button>
              </div>

              {/* Curved Spline Wave Chart */}
              <div className="h-44 w-full mt-4">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 400 140" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="35" x2="400" y2="35" stroke="#242735" strokeDasharray="3 3" />
                  <line x1="0" y1="70" x2="400" y2="70" stroke="#242735" strokeDasharray="3 3" />
                  <line x1="0" y1="105" x2="400" y2="105" stroke="#242735" strokeDasharray="3 3" />

                  {/* Red Curve */}
                  <path
                    d="M 0,90 Q 70,80 120,40 T 250,30 T 350,110 T 400,60"
                    fill="none"
                    stroke="#e11d48"
                    strokeWidth="2.5"
                  />

                  {/* Blue Curve */}
                  <path
                    d="M 0,110 Q 80,120 150,85 T 280,75 T 360,95 T 400,80"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                  />

                  {/* Yellow/Amber Curve */}
                  <path
                    d="M 0,95 Q 60,70 140,115 T 280,70 T 370,105 T 400,90"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                  />
                </svg>

                {/* X Axis Month Labels */}
                <div className="flex justify-between text-[10px] text-slate-500 pt-2 font-mono">
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                </div>
              </div>
            </div>

            {/* Card 3: Card Title (Total Earnings & Micro Bar Chart) - Col 3 */}
            <div className="md:col-span-3 bg-[#181a22] border border-[#242735] rounded-xl p-5 shadow-lg flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Card Title</h3>

                <div className="mt-3">
                  <span className="text-[10px] text-blue-400 font-semibold">Total Earning</span>
                  <p className="text-xl font-extrabold text-slate-100">287,493$</p>
                  <span className="text-[10px] text-slate-400">1.4% Since Last Month</span>
                </div>

                <div className="mt-4">
                  <span className="text-[10px] text-blue-400 font-semibold">Total Earning</span>
                  <p className="text-xl font-extrabold text-slate-100">87,493</p>
                  <span className="text-[10px] text-slate-400">5.43% Since Last Month</span>
                </div>
              </div>

              {/* Sparkline Vertical Bars in Electric Blue */}
              <div className="pt-6">
                <div className="h-16 flex items-end justify-between gap-1.5 px-2">
                  {[40, 25, 60, 45, 90, 30, 20, 75, 45, 100, 35, 70, 50].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}%` }}
                      className="w-full bg-blue-500 hover:bg-blue-400 transition-colors rounded-t-xs"
                      title={`Week ${i + 1}: ${h}%`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ROW 3: WIDE CARD (E-Commerce Analytics - Dual Continuous Spline + Stats) */}
          {/* ========================================================================= */}
          <div className="bg-[#181a22] border border-[#242735] rounded-xl p-5 sm:p-6 shadow-lg">
            {/* Header with Date dropdown & Range Toggle Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#242735]">
              <div>
                <h3 className="text-sm font-bold text-white">E-Commerce Analytics</h3>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                  <span>Mon,1 Oct 2026 - Tue,2 Oct 2026</span>
                  <ChevronDown className="w-3 h-3" />
                </div>
              </div>

              {/* Day / Week / Month Toggle Buttons */}
              <div className="flex items-center gap-1 p-0.5 bg-[#13151b] border border-[#242735] rounded-md text-xs">
                {(['day', 'week', 'month'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setEcomRange(r)}
                    className={`px-3 py-1 font-bold uppercase rounded-sm transition-colors cursor-pointer text-[10px] ${
                      ecomRange === r
                        ? 'bg-[#242838] text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Split layout: Dual Wavy Chart on Left (Col 9), Metrics Column on Right (Col 3) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 items-center">
              {/* Dual Spline Wave Chart */}
              <div className="lg:col-span-9 h-64 w-full">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                  {/* Blue Wavy Line (Target Pace) */}
                  <path
                    d="M 0,90 Q 20,70 40,85 T 80,75 T 120,95 T 160,80 T 200,90 T 240,110 T 280,95 T 320,80 T 360,75 T 400,90 T 440,70 T 480,85 T 520,70 T 560,90 T 600,75"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                  />

                  {/* Green Wavy Line with Valley Dip in the Center (Actual Throughput) */}
                  <path
                    d="M 0,135 Q 20,130 40,105 T 80,110 T 120,120 T 160,130 T 200,150 T 240,185 T 280,165 T 320,130 T 360,140 T 400,135 T 440,130 T 480,140 T 520,130 T 560,135 T 600,140"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                  />
                </svg>
              </div>

              {/* Right Side Stats Column (Inbound & Outbound metrics matching template) */}
              <div className="lg:col-span-3 space-y-5 text-xs border-t lg:border-t-0 lg:border-l border-[#242735] lg:pl-6 pt-4 lg:pt-0">
                {/* Inbound Stats */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-emerald-400">Inbound</h4>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Current</span>
                    <span className="text-slate-200 font-mono font-medium">38.34M</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Average</span>
                    <span className="text-slate-200 font-mono font-medium">38.34M</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Maximum</span>
                    <span className="text-slate-200 font-mono font-medium">68.14M</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>60th %</span>
                    <span className="text-slate-200 font-mono font-medium">168.3GB</span>
                  </div>
                </div>

                {/* Outbound Stats */}
                <div className="space-y-1.5 pt-3 border-t border-[#242735]">
                  <h4 className="text-xs font-bold text-emerald-400">Outbound</h4>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Current</span>
                    <span className="text-slate-200 font-mono font-medium">458.77M</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Average</span>
                    <span className="text-slate-200 font-mono font-medium">1.45K</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Maximum</span>
                    <span className="text-slate-200 font-mono font-medium">15.50K</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>60th %</span>
                    <span className="text-slate-200 font-mono font-medium">45.5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ROW 4: 2 CARDS (Sale Analysis Trend & Project Status Table) */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Card 1: Sale Analysis Trend (Progress Bars & Mountain Area Spikes) - Col 5 */}
            <div className="lg:col-span-5 bg-[#181a22] border border-[#242735] rounded-xl p-5 sm:p-6 shadow-lg flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white mb-4">Sale Analysis Trend</h3>

                {/* Progress Bars */}
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Order Value</span>
                      <span className="text-slate-300 font-mono">155.5%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#242735] overflow-hidden">
                      <div className="h-full w-[80%] bg-blue-500 rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Total Products</span>
                      <span className="text-slate-300 font-mono">238.2%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#242735] overflow-hidden">
                      <div className="h-full w-[95%] bg-emerald-500 rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Quantity</span>
                      <span className="text-slate-300 font-mono">23.30%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#242735] overflow-hidden">
                      <div className="h-full w-[25%] bg-amber-500 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Neon Pink Mountain Area Chart with Spikes */}
              <div className="pt-6">
                <div className="h-28 w-full">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="pinkSpikes" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#e11d48" stopOpacity="0.9" />
                        <stop offset="60%" stopColor="#f43f5e" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>

                    <path
                      d="M 0,90 L 15,30 L 25,75 L 35,40 L 50,60 L 65,35 L 80,80 L 100,50 L 120,95 L 140,55 L 160,85 L 180,45 L 200,90 L 220,30 L 240,80 L 260,35 L 280,60 L 300,40 L 300,100 L 0,100 Z"
                      fill="url(#pinkSpikes)"
                    />
                  </svg>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 pt-1 font-mono">
                  <span>Feb 1</span>
                  <span>Feb 11</span>
                  <span>Feb 21</span>
                  <span>Mar 3</span>
                </div>
              </div>
            </div>

            {/* Card 2: Project Status (Table with Avatars, Budget, Green Status % and Edit Actions) - Col 7 */}
            <div className="lg:col-span-7 bg-[#181a22] border border-[#242735] rounded-xl p-5 sm:p-6 shadow-lg">
              <h3 className="text-sm font-bold text-white mb-4">Project Status</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <tbody className="divide-y divide-[#242735]">
                    {/* Row 1 */}
                    <tr className="hover:bg-[#1f222e] transition-colors">
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-[10px] text-white">
                            VW
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block">Company</span>
                            <span className="font-semibold text-white">volkswagen</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] text-slate-500 block">Budget</span>
                        <span className="font-mono text-slate-200">$2322</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] text-slate-500 block">Status</span>
                        <span className="font-bold text-emerald-400">88%</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] text-slate-500 block">Deadline</span>
                        <span className="text-slate-300">07 Nov 2026</span>
                      </td>
                      <td className="py-3 pl-3 text-right">
                        <button
                          type="button"
                          onClick={onOpenChat}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-[#242735] hover:bg-[#2d3142] text-slate-300 hover:text-white rounded-md transition-colors cursor-pointer"
                        >
                          edit actions
                        </button>
                      </td>
                    </tr>

                    {/* Row 2 */}
                    <tr className="hover:bg-[#1f222e] transition-colors">
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-[10px] text-white">
                            LR
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block">Company</span>
                            <span className="font-semibold text-white">Land Rover</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] text-slate-500 block">Budget</span>
                        <span className="font-mono text-slate-200">$12022</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] text-slate-500 block">Status</span>
                        <span className="font-bold text-emerald-400">70%</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] text-slate-500 block">Deadline</span>
                        <span className="text-slate-300">08 Nov 2026</span>
                      </td>
                      <td className="py-3 pl-3 text-right">
                        <button
                          type="button"
                          onClick={onOpenChat}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-[#242735] hover:bg-[#2d3142] text-slate-300 hover:text-white rounded-md transition-colors cursor-pointer"
                        >
                          edit actions
                        </button>
                      </td>
                    </tr>

                    {/* Row 3 */}
                    <tr className="hover:bg-[#1f222e] transition-colors">
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-[10px] text-white">
                            BT
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block">Company</span>
                            <span className="font-semibold text-white">Bentley</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] text-slate-500 block">Budget</span>
                        <span className="font-mono text-slate-200">$8,725</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] text-slate-500 block">Status</span>
                        <span className="font-bold text-emerald-400">87%</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] text-slate-500 block">Deadline</span>
                        <span className="text-slate-300">11 Jun 2026</span>
                      </td>
                      <td className="py-3 pl-3 text-right">
                        <button
                          type="button"
                          onClick={onOpenChat}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-[#242735] hover:bg-[#2d3142] text-slate-300 hover:text-white rounded-md transition-colors cursor-pointer"
                        >
                          edit actions
                        </button>
                      </td>
                    </tr>

                    {/* Row 4 */}
                    <tr className="hover:bg-[#1f222e] transition-colors">
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-[10px] text-white">
                            MG
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block">Company</span>
                            <span className="font-semibold text-white">Morgan</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] text-slate-500 block">Budget</span>
                        <span className="font-mono text-slate-200">$5,220</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] text-slate-500 block">Status</span>
                        <span className="font-bold text-emerald-400">65%</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] text-slate-500 block">Deadline</span>
                        <span className="text-slate-300">26 Oct 2026</span>
                      </td>
                      <td className="py-3 pl-3 text-right">
                        <button
                          type="button"
                          onClick={onOpenChat}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-[#242735] hover:bg-[#2d3142] text-slate-300 hover:text-white rounded-md transition-colors cursor-pointer"
                        >
                          edit actions
                        </button>
                      </td>
                    </tr>

                    {/* Row 5 */}
                    <tr className="hover:bg-[#1f222e] transition-colors">
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-[10px] text-white">
                            VW
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block">Company</span>
                            <span className="font-semibold text-white">volkswagen</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] text-slate-500 block">Budget</span>
                        <span className="font-mono text-slate-200">$2322</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] text-slate-500 block">Status</span>
                        <span className="font-bold text-emerald-400">88%</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] text-slate-500 block">Deadline</span>
                        <span className="text-slate-300">07 Nov 2026</span>
                      </td>
                      <td className="py-3 pl-3 text-right">
                        <button
                          type="button"
                          onClick={onOpenChat}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-[#242735] hover:bg-[#2d3142] text-slate-300 hover:text-white rounded-md transition-colors cursor-pointer"
                        >
                          edit actions
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

          {/* ========================================================================= */}
          {/* FOOTER (Matching template bottom text) */}
          {/* ========================================================================= */}
          <footer className="pt-6 pb-2 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-[#242735]">
            <p>
              Copyright © 2026 <strong className="text-rose-500 font-semibold">Bootstrapdash / FIH Foxconn</strong>. All rights reserved.
            </p>
            <p className="flex items-center gap-1">
              <span>Hand-crafted & made with</span>
              <span className="text-rose-500">❤️</span>
              <span>for Smart Factory</span>
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};
