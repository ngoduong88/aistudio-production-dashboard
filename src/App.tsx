import React, { useState, useEffect, useMemo } from 'react';
import { ProductionHeader } from './components/ProductionHeader';
import { SimpleChartsDashboard } from './components/SimpleChartsDashboard';
import { ShopFloorDisplay } from './components/ShopFloorDisplay';
import { ProductionKPIStrip } from './components/ProductionKPIStrip';
import { LineStatusGrid } from './components/LineStatusGrid';
import { ProductionCharts } from './components/ProductionCharts';
import { SpreadsheetTableView } from './components/SpreadsheetTableView';
import { ProductionChatbot } from './components/ProductionChatbot';
import { UploadSpreadsheetModal } from './components/UploadSpreadsheetModal';
import { ShareWebsiteModal } from './components/ShareWebsiteModal';
import { CompanyAccessGate } from './components/CompanyAccessGate';
import { CelestialProductionDashboard } from './components/CelestialProductionDashboard';
import { INITIAL_PRODUCTION_RECORDS } from './data/sampleProductionData';
import { ProductionRecord, ProductionKPIs, DashboardTemplate } from './types';
import { exportRecordsToExcel, exportRecordsToCsv } from './utils/spreadsheetHelper';
import { MessageSquare, Upload, FileSpreadsheet, Layers } from 'lucide-react';

export default function App() {
  const [authenticatedUser, setAuthenticatedUser] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const session = localStorage.getItem('fih_auth_session');
        if (session) {
          const parsed = JSON.parse(session);
          if (parsed?.email) return parsed.email;
        }
      } catch {}
    }
    return null;
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme_preference');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [records, setRecords] = useState<ProductionRecord[]>(() => {
    const saved = localStorage.getItem('fih_production_records');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PRODUCTION_RECORDS;
      }
    }
    return INITIAL_PRODUCTION_RECORDS;
  });

  // Default to the user's requested Celestial dark template matching their capture
  const [currentTemplate, setCurrentTemplate] = useState<DashboardTemplate>('celestial_dark');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedLineFilter, setSelectedLineFilter] = useState('all');
  const [activeShiftFilter, setActiveShiftFilter] = useState('all');
  const [showTableDrawer, setShowTableDrawer] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme_preference', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme_preference', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('fih_production_records', JSON.stringify(records));
  }, [records]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  // Compute executive KPIs
  const kpis: ProductionKPIs = useMemo(() => {
    let totalTarget = 0;
    let totalActual = 0;
    let totalPassed = 0;
    let totalDefects = 0;
    let totalDowntimeMinutes = 0;
    let oeeSum = 0;

    records.forEach((r) => {
      totalTarget += r.targetUnits;
      totalActual += r.actualUnits;
      totalPassed += r.passedUnits;
      totalDefects += r.defectUnits;
      totalDowntimeMinutes += r.downtimeMinutes;
      oeeSum += r.oee;
    });

    const fleetYieldRate = totalActual > 0 ? Number(((totalPassed / totalActual) * 100).toFixed(2)) : 100;
    const averageOEE = records.length > 0 ? Number((oeeSum / records.length).toFixed(1)) : 85;
    const activeLinesCount = new Set(records.map((r) => r.lineId)).size;

    return {
      totalTarget,
      totalActual,
      totalPassed,
      totalDefects,
      fleetYieldRate,
      averageOEE,
      totalDowntimeMinutes,
      activeLinesCount,
    };
  }, [records]);

  const handleResetDefaults = () => {
    setRecords(INITIAL_PRODUCTION_RECORDS);
  };

  const handleSignOut = () => {
    localStorage.removeItem('fih_auth_session');
    setAuthenticatedUser(null);
  };

  // If user is not authenticated with corporate email, present corporate gate
  if (!authenticatedUser) {
    return <CompanyAccessGate onAuthenticate={(email) => setAuthenticatedUser(email)} />;
  }

  // 1. Template: Celestial Dark (Matches user uploaded capture)
  if (currentTemplate === 'celestial_dark') {
    return (
      <div className="min-h-screen bg-[#13151b] text-slate-200">
        <CelestialProductionDashboard
          records={records}
          kpis={kpis}
          onOpenChat={() => setIsChatOpen(true)}
          onOpenUpload={() => setIsUploadModalOpen(true)}
          onOpenShare={() => setIsShareModalOpen(true)}
          onExportExcel={() => exportRecordsToExcel(records)}
          onExportCsv={() => exportRecordsToCsv(records)}
          authenticatedUser={authenticatedUser}
          onSignOut={handleSignOut}
          onChangeTemplate={setCurrentTemplate}
          onUpdateRecords={setRecords}
        />

        {/* Floating or Docked AI Copilot Chatbot */}
        <ProductionChatbot
          records={records}
          kpis={kpis}
          activeLineFilter={selectedLineFilter}
          activeShiftFilter={activeShiftFilter}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />

        {/* Upload Spreadsheet Modal */}
        <UploadSpreadsheetModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onImportSuccess={(newRecords) => setRecords(newRecords)}
        />

        {/* Share Website Modal */}
        <ShareWebsiteModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
        />

        {/* Floating Trigger button when Copilot is closed */}
        {!isChatOpen && (
          <button
            type="button"
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-6 right-6 z-40 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full font-semibold text-xs shadow-2xl flex items-center gap-2 transition-all cursor-pointer hover:scale-105 border border-blue-400/30"
          >
            <MessageSquare className="w-4 h-4 text-white" />
            <span>Ask Copilot AI</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors selection:bg-blue-600 selection:text-white">
      {/* Top Bar Header with Template Selector */}
      <ProductionHeader
        darkMode={darkMode}
        onToggleTheme={toggleTheme}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onToggleChatbot={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
        currentTemplate={currentTemplate}
        onChangeTemplate={setCurrentTemplate}
        onExportExcel={() => exportRecordsToExcel(records)}
        onExportCsv={() => exportRecordsToCsv(records)}
        authenticatedUser={authenticatedUser}
        onSignOut={handleSignOut}
      />

      <main className="max-w-7xl mx-auto px-6 py-6 md:py-8 space-y-8">
        {/* Subheader Title & Fast Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              <span>FIH Manufacturing Operations</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{currentTemplate.replace('_', ' ')} Template</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
              {currentTemplate === 'simple_charts' && 'Production Analytics & Charts Overview'}
              {currentTemplate === 'shop_floor' && 'Shop-Floor Plant Display & Live Status'}
              {currentTemplate === 'full_table' && 'Full MES Telemetry & Master Spreadsheet Grid'}
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Upload className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Import Sheet</span>
            </button>
            <button
              type="button"
              onClick={() => setIsChatOpen(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask AI Copilot</span>
            </button>
          </div>
        </div>

        {/* 1. Template: Simple Charts (Default) */}
        {currentTemplate === 'simple_charts' && (
          <div className="space-y-8">
            <SimpleChartsDashboard
              records={records}
              kpis={kpis}
              selectedLine={selectedLineFilter}
              onSelectLine={setSelectedLineFilter}
              selectedShift={activeShiftFilter}
              onSelectShift={setActiveShiftFilter}
            />

            {/* Collapsible raw spreadsheet drawer */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                  <span>Underlying Spreadsheet Data ({records.length} records)</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowTableDrawer(!showTableDrawer)}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium"
                >
                  {showTableDrawer ? 'Hide Spreadsheet Table' : 'Show Spreadsheet Table & Editor'}
                </button>
              </div>

              {showTableDrawer && (
                <SpreadsheetTableView
                  records={records}
                  onUpdateRecords={setRecords}
                  onResetDefaults={handleResetDefaults}
                  onOpenFileUpload={() => setIsUploadModalOpen(true)}
                />
              )}
            </div>
          </div>
        )}

        {/* 2. Template: Shop Floor Big Screen TV */}
        {currentTemplate === 'shop_floor' && (
          <ShopFloorDisplay records={records} kpis={kpis} />
        )}

        {/* 3. Template: Detailed Operations Grid */}
        {currentTemplate === 'full_table' && (
          <div className="space-y-10">
            <ProductionKPIStrip kpis={kpis} recordsCount={records.length} />
            <LineStatusGrid
              records={records}
              selectedLineFilter={selectedLineFilter}
              onSelectLineFilter={setSelectedLineFilter}
              onAskLine={(lineId) => setIsChatOpen(true)}
            />
            <ProductionCharts records={records} />
            <SpreadsheetTableView
              records={records}
              onUpdateRecords={setRecords}
              onResetDefaults={handleResetDefaults}
              onOpenFileUpload={() => setIsUploadModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Floating or Docked AI Copilot Chatbot */}
      <ProductionChatbot
        records={records}
        kpis={kpis}
        activeLineFilter={selectedLineFilter}
        activeShiftFilter={activeShiftFilter}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {/* Upload Spreadsheet Modal */}
      <UploadSpreadsheetModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onImportSuccess={(newRecords) => setRecords(newRecords)}
      />

      {/* Share Website Modal (Root level, overflow-safe) */}
      <ShareWebsiteModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Floating Trigger button when Copilot is closed */}
      {!isChatOpen && (
        <button
          type="button"
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-xs shadow-xl flex items-center gap-2 transition-all cursor-pointer hover:scale-105"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Ask Copilot AI</span>
        </button>
      )}

      {/* Quiet Footer */}
      <footer className="mt-16 py-8 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-medium text-slate-700 dark:text-slate-300">
            FIH Production Line Intelligence
          </p>
          <p className="font-mono text-[11px] text-slate-400">
            Realtime Manufacturing Spreadsheet Data Analytics · Gemini 3.8 Flash
          </p>
        </div>
      </footer>
    </div>
  );
}
