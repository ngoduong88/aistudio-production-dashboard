import React from 'react';
import { Upload, MessageSquare, Sun, Moon, Share2, BarChart2, Monitor, Table, LogOut, ShieldCheck, Sparkles } from 'lucide-react';
import { DashboardTemplate } from '../types';

interface ProductionHeaderProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  onOpenUploadModal: () => void;
  onOpenShareModal: () => void;
  onToggleChatbot: () => void;
  isChatOpen: boolean;
  currentTemplate: DashboardTemplate;
  onChangeTemplate: (t: DashboardTemplate) => void;
  authenticatedUser?: string | null;
  onSignOut?: () => void;
  onExportExcel?: () => void;
  onExportCsv?: () => void;
}

export const ProductionHeader: React.FC<ProductionHeaderProps> = ({
  darkMode,
  onToggleTheme,
  onOpenUploadModal,
  onOpenShareModal,
  onToggleChatbot,
  isChatOpen,
  currentTemplate,
  onChangeTemplate,
  authenticatedUser,
  onSignOut,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between gap-6">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <a href="#" className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap hover:opacity-90 transition-opacity">
            FIH Production Intelligence
          </a>
          {authenticatedUser && (
            <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>{authenticatedUser}</span>
            </span>
          )}
        </div>

        {/* Zone 2: Template Switcher Segmented Control */}
        <div className="hidden md:flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800/80">
          <button
            type="button"
            onClick={() => onChangeTemplate('celestial_dark')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              currentTemplate === 'celestial_dark'
                ? 'bg-[#181a22] text-[#e11d48] border border-[#2e3242] shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#e11d48]" />
            <span>Celestial Template</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeTemplate('simple_charts')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              currentTemplate === 'simple_charts'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Simple Charts</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeTemplate('shop_floor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              currentTemplate === 'shop_floor'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Shop-Floor TV</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeTemplate('full_table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              currentTemplate === 'full_table'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Detailed Grid</span>
          </button>
        </div>

        {/* Zone 3: Actions & Tools */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenShareModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            <Share2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">Share</span>
          </button>

          <button
            type="button"
            onClick={onToggleChatbot}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap shadow-sm ${
              isChatOpen
                ? 'bg-blue-700 text-white shadow-blue-500/20'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Copilot</span>
          </button>

          <button
            type="button"
            onClick={onOpenUploadModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 whitespace-nowrap"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload</span>
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer ml-1"
              title="Lock & Sign Out of Company Session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Template Switcher */}
      <div className="flex md:hidden px-4 pb-2.5 overflow-x-auto gap-1 border-t border-slate-100 dark:border-slate-900 pt-2">
        <button
          type="button"
          onClick={() => onChangeTemplate('simple_charts')}
          className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
            currentTemplate === 'simple_charts' ? 'bg-blue-600 text-white' : 'text-slate-600'
          }`}
        >
          Simple Charts
        </button>
        <button
          type="button"
          onClick={() => onChangeTemplate('shop_floor')}
          className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
            currentTemplate === 'shop_floor' ? 'bg-blue-600 text-white' : 'text-slate-600'
          }`}
        >
          Shop-Floor TV
        </button>
        <button
          type="button"
          onClick={() => onChangeTemplate('full_table')}
          className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
            currentTemplate === 'full_table' ? 'bg-blue-600 text-white' : 'text-slate-600'
          }`}
        >
          Detailed Grid
        </button>
      </div>
    </header>
  );
};
