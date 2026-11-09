import React, { useState, useMemo } from 'react';
import { ProductionRecord, ProductionKPIs } from '../../types';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  Cpu,
  Box,
  BarChart3,
  Activity,
  Filter,
  Search,
  Sparkles,
  Zap,
  ShieldCheck,
  AlertOctagon,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Lock,
  Unlock,
  MessageSquare,
  Wrench,
  Grid,
  ListFilter,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

interface CelestialSmartFactoryDashboardProps {
  records: ProductionRecord[];
  kpis: ProductionKPIs;
  onOpenChat: (initialPrompt?: string) => void;
  selectedDateRange: string;
}

// Model Production Summary interface (supports 6+ models)
export interface ModelProductionSummary {
  model: string;
  fullName: string;
  project: 'P26' | 'P27';
  stage: 'MP' | 'EVT' | 'DVT' | 'Pilot' | 'Sustaining';
  sheetFile: string;
  sheetName: string;
  dailyYieldCell?: string;
  cumYieldCell?: string;
  dailyYield: number;       // e.g. 99.28%
  yieldCUM: number;         // Cumulative e.g. 99.15%
  targetYield: number;      // e.g. 98.50%
  inputQty: number;         // e.g. 4,850
  planQty: number;          // e.g. 4,800
  plusUnits: number;        // e.g. 4,815
  minusUnits: number;       // e.g. 35
  wipUnits: number;         // e.g. 28
  wipAgingFresh: number;    // <24h
  wipAgingTriage: number;   // 24-48h
  wipAgingEscalated: number;// >48h
  status: 'Optimal' | 'Warning' | 'Alert';
  topDefect: string;
  color: string;            // Accent color
}

// 6 Active Production Models Running Concurrently (P26 MP & P27 EVT)
const MODELS_DATA: ModelProductionSummary[] = [
  {
    model: '4CS4',
    fullName: '4CS4 (P26 MP)',
    project: 'P26',
    stage: 'MP',
    sheetFile: 'P26 [INTERNAL] P26 MIL 0518',
    sheetName: '4CS4',
    dailyYieldCell: 'BW69',
    cumYieldCell: 'BX69',
    dailyYield: 99.28,
    yieldCUM: 99.15,
    targetYield: 98.50,
    inputQty: 4850,
    planQty: 4800,
    plusUnits: 4815,
    minusUnits: 35,
    wipUnits: 28,
    wipAgingFresh: 18,
    wipAgingTriage: 8,
    wipAgingEscalated: 2,
    status: 'Optimal',
    topDefect: 'Cable Flam Flex torn (14 units)',
    color: '#3b82f6',
  },
  {
    model: 'CGY4',
    fullName: 'CGY4 (P26 MP)',
    project: 'P26',
    stage: 'MP',
    sheetFile: 'P26 [INTERNAL] P26 MIL 0518',
    sheetName: 'CGY4',
    dailyYieldCell: 'BW71',
    cumYieldCell: 'BX71',
    dailyYield: 98.40,
    yieldCUM: 97.45,
    targetYield: 98.50,
    inputQty: 3200,
    planQty: 3400,
    plusUnits: 3149,
    minusUnits: 51,
    wipUnits: 46,
    wipAgingFresh: 22,
    wipAgingTriage: 16,
    wipAgingEscalated: 8,
    status: 'Warning',
    topDefect: 'Prox_precal: TEST_TIMEOUT (24 units)',
    color: '#f59e0b',
  },
  {
    model: 'PKK4',
    fullName: 'PKK4 (P26 MP)',
    project: 'P26',
    stage: 'MP',
    sheetFile: 'P26 [INTERNAL] P26 MIL 0518',
    sheetName: 'PKK4',
    dailyYieldCell: 'BW71',
    cumYieldCell: 'BX71',
    dailyYield: 98.50,
    yieldCUM: 98.12,
    targetYield: 98.50,
    inputQty: 2100,
    planQty: 2000,
    plusUnits: 2068,
    minusUnits: 32,
    wipUnits: 34,
    wipAgingFresh: 16,
    wipAgingTriage: 12,
    wipAgingEscalated: 6,
    status: 'Optimal',
    topDefect: 'Foreign object (FOF) on PSA (18 units)',
    color: '#a855f7',
  },
  {
    model: 'WGO5',
    fullName: 'WGO5 (P27 EVT)',
    project: 'P27',
    stage: 'EVT',
    sheetFile: 'P27 EVT Tracking',
    sheetName: 'PPT',
    dailyYieldCell: 'V55',
    cumYieldCell: 'L66',
    dailyYield: 97.80,
    yieldCUM: 97.20,
    targetYield: 97.00,
    inputQty: 850,
    planQty: 800,
    plusUnits: 831,
    minusUnits: 19,
    wipUnits: 18,
    wipAgingFresh: 12,
    wipAgingTriage: 4,
    wipAgingEscalated: 2,
    status: 'Optimal',
    topDefect: 'EVT Solder Bridge U1402 (6 units)',
    color: '#10b981',
  },
  {
    model: 'ASK5',
    fullName: 'ASK5 (P27 EVT)',
    project: 'P27',
    stage: 'EVT',
    sheetFile: 'P27 EVT Tracking',
    sheetName: 'PPT',
    dailyYieldCell: 'V60',
    cumYieldCell: 'L70',
    dailyYield: 98.10,
    yieldCUM: 97.85,
    targetYield: 97.00,
    inputQty: 650,
    planQty: 600,
    plusUnits: 638,
    minusUnits: 12,
    wipUnits: 10,
    wipAgingFresh: 7,
    wipAgingTriage: 3,
    wipAgingEscalated: 0,
    status: 'Optimal',
    topDefect: 'RF Chamber Attenuation (4 units)',
    color: '#ec4899',
  },
  {
    model: 'KSH5',
    fullName: 'KSH5 (P27 EVT)',
    project: 'P27',
    stage: 'EVT',
    sheetFile: 'P27 EVT Tracking',
    sheetName: 'PPT',
    dailyYieldCell: 'V65',
    cumYieldCell: 'L75',
    dailyYield: 96.90,
    yieldCUM: 96.50,
    targetYield: 97.00,
    inputQty: 500,
    planQty: 500,
    plusUnits: 485,
    minusUnits: 15,
    wipUnits: 14,
    wipAgingFresh: 9,
    wipAgingTriage: 4,
    wipAgingEscalated: 1,
    status: 'Warning',
    topDefect: 'Sensor Gasket Pressure Leak (5 units)',
    color: '#06b6d4',
  },
];

// Historical Run Chart Data (8/1 to 8/8)
const YIELD_TREND_DAYS = [
  { date: '8/1', yield4CS4: 98.4, yieldCGY4: 95.8, yieldPKK4: 97.1, yieldWGO5: 96.8, target: 98.5, plus: 1680, minus: 52 },
  { date: '8/2', yield4CS4: 98.8, yieldCGY4: 96.2, yieldPKK4: 97.4, yieldWGO5: 97.0, target: 98.5, plus: 1720, minus: 44 },
  { date: '8/3', yield4CS4: 99.0, yieldCGY4: 96.0, yieldPKK4: 97.0, yieldWGO5: 97.2, target: 98.5, plus: 1750, minus: 38 },
  { date: '8/4', yield4CS4: 99.1, yieldCGY4: 95.4, yieldPKK4: 97.5, yieldWGO5: 96.9, target: 98.5, plus: 1690, minus: 62 },
  { date: '8/5', yield4CS4: 98.9, yieldCGY4: 96.8, yieldPKK4: 97.8, yieldWGO5: 97.4, target: 98.5, plus: 1740, minus: 41 },
  { date: '8/6', yield4CS4: 99.3, yieldCGY4: 97.6, yieldPKK4: 98.2, yieldWGO5: 97.6, target: 98.5, plus: 1810, minus: 29 },
  { date: '8/7', yield4CS4: 99.2, yieldCGY4: 98.1, yieldPKK4: 98.0, yieldWGO5: 97.7, target: 98.5, plus: 1790, minus: 34 },
  { date: '8/8', yield4CS4: 99.4, yieldCGY4: 98.4, yieldPKK4: 98.5, yieldWGO5: 97.8, target: 98.5, plus: 1850, minus: 26 },
];

// Top Defect Pareto Dataset
interface DefectItem {
  id: string;
  code: string;
  count: number;
  pct: number;
  category: 'Process' | 'Equipment' | 'Component' | 'Test';
  station: string;
  primaryDRI: string;
}

const TOP_DEFECTS: DefectItem[] = [
  { id: 'def-1', code: 'Prox_precal: TEST_TIMEOUT', count: 118, pct: 31.9, category: 'Equipment', station: 'FATP-DS-COMBO', primaryDRI: 'Martin' },
  { id: 'def-2', code: 'Cable Flam Flex on BG was torn', count: 84, pct: 22.7, category: 'Process', station: 'FATP-QT-1M', primaryDRI: 'Tuyen' },
  { id: 'def-3', code: 'Foreign object (FOF) on PSA/CG', count: 56, pct: 15.1, category: 'Process', station: 'FATP-AIRLK-WT', primaryDRI: 'Martin' },
  { id: 'def-4', code: 'Connector B2B Flam Flex deformation (J25002)', count: 42, pct: 11.4, category: 'Process', station: 'FATP-QT-1M', primaryDRI: 'Tuyen' },
  { id: 'def-5', code: 'RF Cal Fail / Antenna Attenuation', count: 38, pct: 10.3, category: 'Equipment', station: 'FATP-RF-CELL', primaryDRI: 'Quang' },
  { id: 'def-6', code: 'Reboot then Retest Pass (NTF)', count: 32, pct: 8.6, category: 'Test', station: 'Multiple', primaryDRI: 'Martin' },
];

// Bonepile Inventory Records
interface BonepileRecord {
  dsn: string;
  model: string;
  station: string;
  defectDesc: string;
  category: 'Process' | 'Equipment' | 'Component' | 'Test';
  dri: string;
  agingHours: number;
  status: 'Pending FA' | 'Under Repair' | 'Awaiting Parts' | 'Retest Pass' | 'Quality Locked';
  isLocked: boolean;
  lockReason?: string;
}

const BONEPILE_DATA: BonepileRecord[] = [
  { dsn: '6A210DLKY003CY', model: '4CS4', station: 'FATP-DS-COMBO', defectDesc: 'Prox_precal: TEST_TIMEOUT', category: 'Equipment', dri: 'Martin', agingHours: 14, status: 'Pending FA', isLocked: false },
  { dsn: '6A230DLKY00523', model: '4CS4', station: 'FATP-QT-1M', defectDesc: 'Cable Flam Flex on BG was torn', category: 'Process', dri: 'Tuyen', agingHours: 28, status: 'Under Repair', isLocked: false },
  { dsn: '6A260DLKY000AQ', model: '4CS4', station: 'FATP-QT-1M', defectDesc: 'Cable Flam Flex on BG was torn', category: 'Process', dri: 'Tuyen', agingHours: 52, status: 'Awaiting Parts', isLocked: false },
  { dsn: '6A240DLDV001JR', model: 'PKK4', station: 'FATP-AIRLK-WT', defectDesc: 'Foreign object between CG PSA and CG at A2 pos', category: 'Process', dri: 'Martin', agingHours: 18, status: 'Retest Pass', isLocked: false },
  { dsn: '6A300DLDV0003H', model: 'PKK4', station: 'FATP-RF-CELL', defectDesc: 'FOF on ENCL was missing (Antenna)', category: 'Process', dri: 'Quang', agingHours: 86, status: 'Quality Locked', isLocked: true, lockReason: 'FAE Accessory Lock: 05C7301052411AA69C110081D' },
  { dsn: '6A260DLKY0004R', model: '4CS4', station: 'FATP-QT-1M', defectDesc: 'Connector B2B Flam Flex on J25002 was deformed', category: 'Process', dri: 'Tuyen', agingHours: 6, status: 'Under Repair', isLocked: false },
  { dsn: '6A230DLKY00478', model: '4CS4', station: 'FATP-QT-1M', defectDesc: 'Cable Flam Flex on BG was torn', category: 'Process', dri: 'Duc', agingHours: 32, status: 'Pending FA', isLocked: false },
  { dsn: '6A210DLCG0019A', model: 'CGY4', station: 'SMT-SPI-02', defectDesc: 'Solder volume insufficient on U2301 BGA', category: 'Equipment', dri: 'Quang', agingHours: 192, status: 'Quality Locked', isLocked: true, lockReason: 'Line Stencil Inspection Lock' },
  { dsn: '7A110DLWG0004A', model: 'WGO5', station: 'EVT-PRECAL-01', defectDesc: 'EVT Pre-screening Solder Bridge U1402', category: 'Process', dri: 'Martin', agingHours: 16, status: 'Under Repair', isLocked: false },
  { dsn: '7A120DLAS0002F', model: 'ASK5', station: 'EVT-RF-01', defectDesc: 'RF Chamber Attenuation offset > 2.4dB', category: 'Equipment', dri: 'Quang', agingHours: 22, status: 'Pending FA', isLocked: false },
  { dsn: '7A130DLKS0007B', model: 'KSH5', station: 'EVT-AIRLK-01', defectDesc: 'Sensor Gasket Pressure Leak 1400Pa', category: 'Process', dri: 'Duc', agingHours: 36, status: 'Awaiting Parts', isLocked: false },
];

export const CelestialSmartFactoryDashboard: React.FC<CelestialSmartFactoryDashboardProps> = ({
  records,
  kpis,
  onOpenChat,
}) => {
  // View mode state: 'byModel' vs 'byCategory'
  const [viewMode, setViewMode] = useState<'byModel' | 'byCategory'>('byModel');
  const [selectedModel, setSelectedModel] = useState<string>('ALL');
  const [selectedShift, setSelectedShift] = useState<'ALL' | 'Day' | 'Night'>('ALL');
  const [selectedBonepileStatus, setSelectedBonepileStatus] = useState<string>('ALL');
  const [bonepileSearch, setBonepileSearch] = useState('');
  const [hoveredTrendDay, setHoveredTrendDay] = useState<typeof YIELD_TREND_DAYS[0] | null>(null);

  // Aggregated totals across all 6 models
  const totalFleetStats = useMemo(() => {
    let input = 0;
    let plus = 0;
    let minus = 0;
    let wip = 0;
    MODELS_DATA.forEach((m) => {
      input += m.inputQty;
      plus += m.plusUnits;
      minus += m.minusUnits;
      wip += m.wipUnits;
    });
    const yieldAvg = input > 0 ? Number(((plus / input) * 100).toFixed(2)) : 98.42;
    return { input, plus, minus, wip, yieldAvg };
  }, []);

  // Filtered Bonepile records
  const filteredBonepile = useMemo(() => {
    return BONEPILE_DATA.filter((item) => {
      if (selectedModel !== 'ALL' && item.model !== selectedModel) return false;
      if (selectedBonepileStatus !== 'ALL' && item.status !== selectedBonepileStatus) return false;
      if (bonepileSearch.trim()) {
        const q = bonepileSearch.toLowerCase();
        return (
          item.dsn.toLowerCase().includes(q) ||
          item.station.toLowerCase().includes(q) ||
          item.defectDesc.toLowerCase().includes(q) ||
          item.dri.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedModel, selectedBonepileStatus, bonepileSearch]);

  // Selected single model details (when zooming into 1 model)
  const singleModelData = useMemo(() => {
    return MODELS_DATA.find((m) => m.model === selectedModel) || null;
  }, [selectedModel]);

  return (
    <div className="space-y-4">
      {/* ========================================================================= */}
      {/* 1. ULTRA-COMPACT TOOLBAR (Single line, maximum vertical space saved)      */}
      {/* ========================================================================= */}
      <div className="bg-[#181a24] border border-slate-700/60 rounded-xl px-3 sm:px-4 py-2 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        {/* Left: Compact Title with Live Indicator */}
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" />
          <h2 className="text-xs sm:text-sm font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>FIH Operations Intelligence</span>
            <span className="font-mono text-[9px] uppercase px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              6 Models
            </span>
          </h2>
        </div>

        {/* Center / Right: View Mode Toggle & Model Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* View Mode Switcher (By Model vs By Category) */}
          <div className="flex items-center p-0.5 bg-[#12141c] border border-slate-700/80 rounded-lg font-semibold">
            <button
              type="button"
              onClick={() => setViewMode('byModel')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'byModel'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Display individual cards for each model combining Yield & WIP"
            >
              <Grid className="w-3 h-3" />
              <span>By Model</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('byCategory')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'byCategory'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Display cards grouped by category across all models"
            >
              <ListFilter className="w-3 h-3" />
              <span>By Category</span>
            </button>
          </div>

          {/* Model Selector Pills (6 Active Models: P26 & P27) */}
          <div className="flex items-center gap-0.5 p-0.5 bg-[#12141c] border border-slate-700/80 rounded-lg font-semibold overflow-x-auto scrollbar-none">
            {['ALL', '4CS4', 'CGY4', 'PKK4', 'WGO5', 'ASK5', 'KSH5'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setSelectedModel(m)}
                className={`px-2 py-0.5 rounded-md text-[10.5px] font-bold transition-all cursor-pointer shrink-0 ${
                  selectedModel === m
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {m === 'ALL' ? 'All Models' : m}
              </button>
            ))}
          </div>

          {/* Shift Selector */}
          <div className="hidden sm:flex items-center gap-0.5 p-0.5 bg-[#12141c] border border-slate-700/80 rounded-lg font-semibold">
            {(['ALL', 'Day', 'Night'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedShift(s)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                  selectedShift === s
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s === 'ALL' ? 'All Shifts' : s}
              </button>
            ))}
          </div>

          {/* AI Insights Action Button */}
          <button
            type="button"
            onClick={() => onOpenChat('Summarize yield and WIP across all 6 models: 4CS4, CGY4, PKK4, WGO5, ASK5, and KSH5.')}
            className="px-2.5 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-[10.5px] font-bold flex items-center gap-1 shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span className="hidden sm:inline">AI Insights</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DYNAMIC CONTENT: BASED ON VIEW MODE & MODEL SELECTION                  */}
      {/* ========================================================================= */}

      {/* ------------------------------------------------------------------------- */}
      {/* VIEW MODE 1: BY MODEL (Only Yield & WIP blocks per model)                 */}
      {/* ------------------------------------------------------------------------- */}
      {viewMode === 'byModel' && (
        <>
          {/* If a single model is selected, show focused Single-Model Command Card */}
          {selectedModel !== 'ALL' && singleModelData ? (
            <div className="bg-[#181a24] border-2 border-blue-500/50 rounded-2xl p-5 shadow-2xl relative space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/60">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedModel('ALL')}
                    className="p-1.5 rounded-lg bg-[#12141c] hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700/60"
                    title="Return to All Models view"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <span>Model {singleModelData.fullName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {singleModelData.project} · {singleModelData.stage}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Mapped Source: <strong className="text-slate-300 font-mono">{singleModelData.sheetName}!{singleModelData.dailyYieldCell || 'Yield'}</strong> (CUM: {singleModelData.cumYieldCell || 'CUM'})
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenChat(`Analyze model ${singleModelData.model} yield and WIP status from sheet ${singleModelData.sheetName}.`)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm w-fit"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Analyze {singleModelData.model} with AI</span>
                </button>
              </div>

              {/* 2 Clean Focal Blocks: Yield & WIP */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Block 1: Yield */}
                <div className="p-4 rounded-xl bg-[#12141c] border border-slate-700/70 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                      <span className="font-bold text-slate-200">Daily Yield</span>
                      <span className="text-emerald-400 font-bold font-mono">
                        Target ≥ {singleModelData.targetYield}%
                      </span>
                    </div>
                    <div className="text-3xl font-black text-white tracking-tight">
                      {singleModelData.dailyYield}%
                    </div>
                  </div>

                  {/* Metadata below Yield: CUM, Target delta, Input Qty */}
                  <div className="mt-3 pt-3 border-t border-slate-800 space-y-1 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Yield CUM:</span>
                      <span className="font-bold text-blue-300">{singleModelData.yieldCUM}%</span>
                      <span className="text-slate-600">|</span>
                      <span className="text-slate-400">Delta:</span>
                      <span className="text-emerald-400 font-bold">+{(singleModelData.dailyYield - singleModelData.targetYield).toFixed(2)}%</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                      <span>Input Qty: <strong className="text-slate-200">{singleModelData.inputQty.toLocaleString()}</strong></span>
                      <span>Pass: <strong className="text-emerald-400">{singleModelData.plusUnits}</strong> | Fail: <strong className="text-rose-400">{singleModelData.minusUnits}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Block 2: WIP / Bonepile */}
                <div className="p-4 rounded-xl bg-[#12141c] border border-slate-700/70 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                      <span className="font-bold text-slate-200">WIP / Bonepile</span>
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div className="text-3xl font-black text-amber-400 tracking-tight">
                      {singleModelData.wipUnits} <span className="text-sm font-semibold text-slate-400">units</span>
                    </div>
                  </div>

                  {/* Small Aging breakdown below WIP */}
                  <div className="mt-3 pt-3 border-t border-slate-800 space-y-1 font-mono text-xs">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>&lt;24h (Fresh): <strong className="text-emerald-400">{singleModelData.wipAgingFresh}</strong></span>
                      <span>24–48h: <strong className="text-blue-400">{singleModelData.wipAgingTriage}</strong></span>
                      <span>&gt;48h: <strong className="text-rose-400">{singleModelData.wipAgingEscalated}</strong></span>
                    </div>
                    <div className="text-[11px] text-slate-400 pt-0.5">
                      Top failure: <strong className="text-slate-200">{singleModelData.topDefect}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Multi-Model Grid (6 Active Models Side-by-Side: P26 & P27) */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {MODELS_DATA.map((m) => (
                <div
                  key={m.model}
                  onClick={() => setSelectedModel(m.model)}
                  className="bg-[#181a24] border border-slate-700/60 hover:border-blue-500/70 rounded-xl p-3.5 shadow-lg flex flex-col justify-between transition-all duration-200 cursor-pointer group hover:scale-[1.01]"
                >
                  {/* Card Header: Model Name & Project Badge */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: m.color }}
                      />
                      <h3 className="text-xs font-black text-white group-hover:text-blue-400 transition-colors">
                        {m.fullName}
                      </h3>
                    </div>
                    <span
                      className={`text-[9.5px] font-mono px-1.5 py-0.5 rounded font-bold ${
                        m.status === 'Optimal'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {m.stage}
                    </span>
                  </div>

                  {/* ONLY 2 BLOCKS: Yield & WIP (CUM, Input, Target as small text below Yield) */}
                  <div className="grid grid-cols-2 gap-2.5 my-2.5 text-xs">
                    {/* Block 1: Yield */}
                    <div className="p-2.5 rounded-lg bg-[#12141c] border border-slate-800 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Daily Yield</span>
                        <div className="text-xl font-black text-white tracking-tight mt-0.5">
                          {m.dailyYield}%
                        </div>
                      </div>
                      {/* Subtext below Yield: CUM, Target, Input */}
                      <div className="mt-2 pt-1.5 border-t border-slate-800/80 space-y-0.5 text-[9.5px] font-mono text-slate-400">
                        <div className="flex items-center justify-between">
                          <span>CUM: <strong className="text-blue-300">{m.yieldCUM}%</strong></span>
                          <span>Tgt: <strong className="text-slate-300">{m.targetYield}%</strong></span>
                        </div>
                        <div className="truncate text-slate-400 pt-0.5">
                          Input: <strong className="text-slate-200">{m.inputQty.toLocaleString()}</strong> ({m.plusUnits}P / {m.minusUnits}F)
                        </div>
                      </div>
                    </div>

                    {/* Block 2: WIP / Bonepile */}
                    <div className="p-2.5 rounded-lg bg-[#12141c] border border-slate-800 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                          <span>WIP / Bonepile</span>
                          <AlertTriangle className="w-2.5 h-2.5 text-amber-400" />
                        </div>
                        <div className="text-xl font-black text-amber-400 tracking-tight mt-0.5 font-mono">
                          {m.wipUnits} <span className="text-[10px] font-normal text-slate-400">units</span>
                        </div>
                      </div>
                      {/* Subtext below WIP: Aging breakdown */}
                      <div className="mt-2 pt-1.5 border-t border-slate-800/80 space-y-0.5 text-[9.5px] font-mono text-slate-400">
                        <div className="flex items-center justify-between">
                          <span>&lt;24h: <strong className="text-emerald-400">{m.wipAgingFresh}</strong></span>
                          <span>24-48h: <strong className="text-blue-400">{m.wipAgingTriage}</strong></span>
                        </div>
                        <div className="pt-0.5">
                          &gt;48h: <strong className={m.wipAgingEscalated > 0 ? 'text-rose-400' : 'text-slate-400'}>{m.wipAgingEscalated} units</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Top Defect & Zoom */}
                  <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 truncate max-w-[200px]" title={m.topDefect}>
                      Top: <strong className="text-slate-300">{m.topDefect}</strong>
                    </span>
                    <span className="text-blue-400 font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      <span>Zoom</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* VIEW MODE 2: BY CATEGORY (Grouped across all 6 models)                    */}
      {/* ------------------------------------------------------------------------- */}
      {viewMode === 'byCategory' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: ALL MODELS YIELD & YIELD CUM COMPARISON */}
          <div className="bg-[#181a24] border border-slate-700/60 rounded-xl p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Yield &amp; Yield CUM by Model
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Fleet Avg: {totalFleetStats.yieldAvg}%
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {MODELS_DATA.map((m) => (
                <div key={m.model} className="p-2 rounded-lg bg-[#12141c] border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                    <span className="font-bold text-white font-mono">{m.model}</span>
                    <span className="text-[10px] text-slate-400">({m.project} · {m.stage})</span>
                  </div>
                  <div className="flex items-center gap-3.5 font-mono">
                    <span className="text-slate-300">
                      Daily: <strong className="text-white">{m.dailyYield}%</strong>
                    </span>
                    <span className="text-blue-300">
                      CUM: <strong>{m.yieldCUM}%</strong>
                    </span>
                    <span
                      className={`text-[9.5px] px-1.5 py-0.5 rounded font-bold ${
                        m.dailyYield >= m.targetYield
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {m.dailyYield >= m.targetYield ? 'PASS' : 'LAG'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: ALL MODELS WIP & BONEPILE DISTRIBUTION */}
          <div className="bg-[#181a24] border border-slate-700/60 rounded-xl p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  WIP &amp; Bonepile Units by Model
                </h3>
              </div>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold">
                Total WIP: {totalFleetStats.wip} units
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {MODELS_DATA.map((m) => (
                <div key={m.model} className="p-2 rounded-lg bg-[#12141c] border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                    <span className="font-bold text-white font-mono">{m.model}</span>
                    <span className="text-[10px] text-slate-400">WIP</span>
                  </div>
                  <div className="flex items-center gap-3.5 font-mono text-xs">
                    <span className="text-amber-400 font-bold">{m.wipUnits} units</span>
                    <span className="text-slate-400 text-[10px]">
                      &lt;24h: <strong className="text-slate-200">{m.wipAgingFresh}</strong> | 24-48h: <strong className="text-slate-200">{m.wipAgingTriage}</strong> | &gt;48h: <strong className={m.wipAgingEscalated > 0 ? 'text-rose-400' : 'text-slate-400'}>{m.wipAgingEscalated}</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: ALL MODELS INPUT & THROUGHPUT (Plus vs Minus) */}
          <div className="bg-[#181a24] border border-slate-700/60 rounded-xl p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Input Qty &amp; Throughput by Model
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-300">
                Total Input: {totalFleetStats.input.toLocaleString()}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {MODELS_DATA.map((m) => (
                <div key={m.model} className="p-2 rounded-lg bg-[#12141c] border border-slate-800">
                  <div className="flex items-center justify-between mb-1 font-mono">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                      <span>{m.model}</span>
                    </span>
                    <span className="text-slate-300">
                      Input: <strong className="text-white">{m.inputQty}</strong> (Pass: <span className="text-emerald-400">{m.plusUnits}</span> | Fallout: <span className="text-rose-400">{m.minusUnits}</span>)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden flex">
                    <div style={{ width: `${(m.plusUnits / m.inputQty) * 100}%` }} className="h-full bg-emerald-500" />
                    <div style={{ width: `${(m.minusUnits / m.inputQty) * 100}%` }} className="h-full bg-rose-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: DEFECT PARETO (TOP FAILURES) */}
          <div className="bg-[#181a24] border border-slate-700/60 rounded-xl p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Top Failures &amp; Root Causes
                </h3>
              </div>
              <span className="text-[10px] font-mono text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                370 Defect Units
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {TOP_DEFECTS.slice(0, 5).map((d, idx) => (
                <div key={d.id} className="p-2 rounded-lg bg-[#12141c] border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate max-w-[240px]">
                    <span className="text-slate-400 font-mono text-[10px]">#{idx + 1}</span>
                    <span className="text-white font-medium truncate" title={d.code}>{d.code}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-300 font-bold">{d.count} u</span>
                    <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300">
                      {d.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ROW: YIELD TRENDING CHARTS & MULTI-MODEL RUN CHART                     */}
      {/* ========================================================================= */}
      <div className="bg-[#181a24] border border-slate-700/60 rounded-xl p-4 sm:p-5 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-700/60">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <span>Sustaining Yield Trend Run Chart (8/1 – 8/8)</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Historical yield trajectory across shifts with target baseline (98.50%).
            </p>
          </div>

          {/* Model Legend */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-blue-400">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>4CS4</span>
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>CGY4</span>
            </span>
            <span className="flex items-center gap-1.5 text-purple-400">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span>PKK4</span>
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>WGO5</span>
            </span>
            <span className="flex items-center gap-1.5 text-rose-400 text-[10.5px]">
              <span className="w-3 border-t-2 border-dashed border-rose-500" />
              <span>Target 98.5%</span>
            </span>
          </div>
        </div>

        {/* SVG Multi-Line Chart */}
        <div className="relative h-48 w-full mt-2">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 700 180" preserveAspectRatio="none">
            {/* Grid lines */}
            {[30, 65, 100, 135].map((y, idx) => (
              <line key={idx} x1="0" y1={y} x2="700" y2={y} stroke="#282f42" strokeDasharray="4 4" strokeWidth="1" />
            ))}

            {/* Target 98.5% Line */}
            <line x1="0" y1="75" x2="700" y2="75" stroke="#e11d48" strokeDasharray="6 4" strokeWidth="1.5" />

            {/* 4CS4 Line (Blue) */}
            <path d="M 50,78 L 135,68 L 220,58 L 305,54 L 390,62 L 475,45 L 560,50 L 645,38" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />

            {/* CGY4 Line (Amber) */}
            <path d="M 50,150 L 135,138 L 220,144 L 305,158 L 390,120 L 475,98 L 560,85 L 645,78" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />

            {/* PKK4 Line (Purple) */}
            <path d="M 50,118 L 135,110 L 220,100 L 305,106 L 390,90 L 475,80 L 560,86 L 645,74" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" />

            {/* WGO5 Line (Emerald) */}
            <path d="M 50,125 L 135,118 L 220,112 L 305,120 L 390,105 L 475,96 L 560,92 L 645,88" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />

            {/* Interactive Data Dots */}
            {YIELD_TREND_DAYS.map((d, i) => {
              const cx = 50 + i * 85;
              return (
                <g key={i} className="cursor-pointer group" onMouseEnter={() => setHoveredTrendDay(d)}>
                  <circle cx={cx} cy={[78, 68, 58, 54, 62, 45, 50, 38][i]} r="4.5" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" className="transition-transform group-hover:scale-150" />
                </g>
              );
            })}
          </svg>

          {/* X Axis Labels */}
          <div className="flex justify-between px-6 text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-700/60">
            {YIELD_TREND_DAYS.map((d) => (
              <span key={d.date} className={`cursor-pointer ${hoveredTrendDay?.date === d.date ? 'text-blue-400 font-bold' : ''}`}>
                {d.date}
              </span>
            ))}
          </div>
        </div>

        {/* Hovered Date Stats */}
        {hoveredTrendDay && (
          <div className="p-2 rounded-lg bg-[#12141c] border border-blue-500/40 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300">
              Date: <strong className="text-white">{hoveredTrendDay.date}</strong> | Plus: <strong className="text-emerald-400">{hoveredTrendDay.plus}</strong> | Minus: <strong className="text-rose-400">{hoveredTrendDay.minus}</strong>
            </span>
            <div className="flex items-center gap-3">
              <span className="text-blue-400 font-bold">4CS4: {hoveredTrendDay.yield4CS4}%</span>
              <span className="text-amber-400 font-bold">CGY4: {hoveredTrendDay.yieldCGY4}%</span>
              <span className="text-purple-400 font-bold">PKK4: {hoveredTrendDay.yieldPKK4}%</span>
              <span className="text-emerald-400 font-bold">WGO5: {hoveredTrendDay.yieldWGO5}%</span>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. ROW: BONEPILE & WIP DEFECT INVENTORY TABLE                             */}
      {/* ========================================================================= */}
      <div className="bg-[#181a24] border border-slate-700/60 rounded-xl p-4 sm:p-5 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-700/60">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Bonepile &amp; WIP Inventory
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
              {filteredBonepile.length} units listed
            </span>
          </div>

          {/* Search bar */}
          <div className="relative w-48 sm:w-56">
            <Search className="w-3 h-3 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              value={bonepileSearch}
              onChange={(e) => setBonepileSearch(e.target.value)}
              placeholder="Search DSN, model, station..."
              className="w-full pl-8 pr-2.5 py-1 text-xs bg-[#12141c] border border-slate-700/70 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>

        {/* Bonepile Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-700/60 bg-[#12141c]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#1c202e] text-slate-300 border-b border-slate-700/60 font-semibold text-[11px]">
                <th className="py-2 px-3">DSN</th>
                <th className="py-2 px-3">Model</th>
                <th className="py-2 px-3">Station</th>
                <th className="py-2 px-3">Failure Description</th>
                <th className="py-2 px-3">DRI</th>
                <th className="py-2 px-3">Aging</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Lock</th>
                <th className="py-2 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filteredBonepile.map((row) => (
                <tr key={row.dsn} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2 px-3 font-mono font-bold text-blue-300">{row.dsn}</td>
                  <td className="py-2 px-3 font-semibold text-white">{row.model}</td>
                  <td className="py-2 px-3 font-mono text-[11px] text-slate-300">{row.station}</td>
                  <td className="py-2 px-3 max-w-xs truncate text-slate-200" title={row.defectDesc}>{row.defectDesc}</td>
                  <td className="py-2 px-3 font-medium text-slate-300">{row.dri}</td>
                  <td className="py-2 px-3 font-mono text-[10.5px]">
                    <span className={`px-1.5 py-0.5 rounded font-bold ${row.agingHours <= 24 ? 'text-emerald-400 bg-emerald-500/10' : row.agingHours <= 48 ? 'text-blue-400 bg-blue-500/10' : 'text-rose-400 bg-rose-500/20'}`}>
                      {row.agingHours}h
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-slate-800 text-slate-300">
                      {row.status}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    {row.isLocked ? (
                      <span className="text-[10px] text-rose-400 font-bold flex items-center gap-1" title={row.lockReason}>
                        <Lock className="w-2.5 h-2.5" /> Locked
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Unlock className="w-2.5 h-2.5 text-slate-500" /> Normal
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => onOpenChat(`Check disposition history for unit DSN ${row.dsn} model ${row.model} at station ${row.station}`)}
                      className="px-2 py-0.5 bg-[#222736] hover:bg-blue-600 text-blue-300 hover:text-white rounded text-[10px] font-semibold transition-colors cursor-pointer"
                    >
                      Ask AI
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
