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
import { CelestialSmartFactoryDashboard } from './celestial/CelestialSmartFactoryDashboard';

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
            <CelestialSmartFactoryDashboard
              records={records}
              kpis={kpis}
              onOpenChat={onOpenChat}
              selectedDateRange={selectedDateRange}
            />
          )}

          {/* ========================================================================= */}
          {/* FOOTER (Matching template bottom text) */}
          {/* ========================================================================= */}
          <footer className="pt-6 pb-2 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-[#242735]">
            <p>
              Copyright © 2026 <strong className="text-rose-500 font-semibold">FIH Foxconn Smart Operations</strong>. All rights reserved.
            </p>
            <p className="flex items-center gap-1">
              <span>Hand-crafted & made with</span>
              <span className="text-rose-500">â¤ï¸</span>
              <span>for Smart Factory</span>
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};
