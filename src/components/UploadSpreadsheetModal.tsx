import React, { useState } from 'react';
import { Upload, X, FileSpreadsheet, Download, AlertCircle, Link2, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { parseSpreadsheetFile, exportRecordsToExcel } from '../utils/spreadsheetHelper';
import { ProductionRecord } from '../types';
import { INITIAL_PRODUCTION_RECORDS } from '../data/sampleProductionData';

interface UploadSpreadsheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (records: ProductionRecord[]) => void;
  onOpenAnalysisInChat?: (analysisText: string) => void;
}

export const UploadSpreadsheetModal: React.FC<UploadSpreadsheetModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
  onOpenAnalysisInChat,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'link'>('link');
  const [isDragging, setIsDragging] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [sheetUrl, setSheetUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFile = async (file: File) => {
    setErrorMsg(null);
    setParsing(true);
    try {
      const records = await parseSpreadsheetFile(file);
      onImportSuccess(records);
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to parse spreadsheet file. Please check file format.');
    } finally {
      setParsing(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const downloadSampleTemplate = () => {
    exportRecordsToExcel(INITIAL_PRODUCTION_RECORDS.slice(0, 6), 'production_line_template.xlsx');
  };

  const handleAutoAnalyzeLink = async (useInternal = false) => {
    setErrorMsg(null);
    setAnalysisResult(null);
    setAnalyzing(true);

    try {
      const payload = useInternal
        ? { useLoadedP26: true }
        : { url: sheetUrl.trim() };

      if (!useInternal && !sheetUrl.trim()) {
        throw new Error('Please enter a valid Google Sheets URL.');
      }

      const res = await fetch('/api/production/auto-analyze-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.error === 'RESTRICTED_ACCESS') {
          throw new Error(data.message || 'Google Sheet access is restricted. Please make it viewable with the link or download as CSV.');
        }
        throw new Error(data.error || 'Failed to analyze spreadsheet.');
      }

      setAnalysisResult(data.analysis);
      if (onOpenAnalysisInChat && data.analysis) {
        onOpenAnalysisInChat(data.analysis);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during automatic sheet analysis.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-start sm:items-center justify-center p-3 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-xl my-auto bg-[#181a24] text-slate-200 border border-[#2e3242] rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xl relative max-h-[calc(100vh-2rem)] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2a2e3d]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Spreadsheet Intelligence & Import</span>
                <span className="text-[10px] font-normal px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Zero Explanation Needed
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                AI autonomously decodes columns, codes, and numerical meanings
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-md cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex rounded-lg bg-[#12141c] p-1 border border-[#242735]">
          <button
            type="button"
            onClick={() => setActiveTab('link')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'link'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Google Sheet Link & Auto-Analysis</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File (.xlsx, .csv)</span>
          </button>
        </div>

        {/* Tab 1: Google Sheet Link & Auto-Analysis */}
        {activeTab === 'link' && (
          <div className="space-y-3.5">
            <div className="p-3.5 rounded-xl bg-[#12141c] border border-[#282c3c] space-y-2.5">
              <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                <span>Paste Google Sheet Link:</span>
                <span className="text-[10px] text-slate-400">No need to explain numbers</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/.../edit#gid=0"
                  disabled={analyzing}
                  className="flex-1 px-3 py-2 text-xs bg-[#181a24] border border-[#2e3242] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => handleAutoAnalyzeLink(false)}
                  disabled={analyzing || !sheetUrl.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{analyzing ? 'Analyzing...' : 'Auto-Analyze'}</span>
                </button>
              </div>

              <div className="pt-2 border-t border-[#242735] flex items-center justify-between text-[11px] text-slate-400">
                <span>Want to test with the preloaded factory spreadsheet?</span>
                <button
                  type="button"
                  onClick={() => handleAutoAnalyzeLink(true)}
                  disabled={analyzing}
                  className="text-amber-400 hover:text-amber-300 font-semibold underline cursor-pointer"
                >
                  ⚡ Auto-Analyze [INTERNAL] P26
                </button>
              </div>
            </div>

            {/* Analysis result display */}
            {analysisResult && (
              <div className="p-3.5 rounded-xl bg-[#141620] border border-emerald-500/30 space-y-2 max-h-64 overflow-y-auto">
                <div className="flex items-center justify-between pb-1.5 border-b border-emerald-500/20">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Autonomous Sheet Breakdown Ready</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Zero Explanation Required</span>
                </div>
                <div className="text-[11.5px] text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {analysisResult}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: File Upload (.xlsx, .csv) */}
        {activeTab === 'upload' && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center transition-colors cursor-pointer ${
              isDragging
                ? 'border-blue-500 bg-blue-950/20'
                : 'border-[#2e3242] hover:border-slate-500 bg-[#12141c]'
            }`}
            onClick={() => document.getElementById('sheetFileInput')?.click()}
          >
            <input
              id="sheetFileInput"
              type="file"
              accept=".xlsx, .xls, .csv, .tsv"
              onChange={onFileInputChange}
              className="hidden"
            />

            <Upload className="w-8 h-8 text-blue-400 mb-2.5" />
            <p className="text-xs font-semibold text-slate-200">
              {parsing ? 'Parsing Spreadsheet...' : 'Drop your spreadsheet here, or click to browse'}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Supports Excel (.xlsx) and CSV exports from factory ERP / MES
            </p>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 rounded-xl bg-[#12141c] border border-[#242735] flex items-center justify-between text-xs">
          <div>
            <p className="font-semibold text-slate-200">Standardized Foxconn Template</p>
            <p className="text-[10px] text-slate-400">
              Download structure template for high-speed automated ingestion
            </p>
          </div>
          <button
            type="button"
            onClick={downloadSampleTemplate}
            className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-[#1e212d] border border-[#2e3242] hover:bg-[#282c3c] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Template .xlsx</span>
          </button>
        </div>
      </div>
    </div>
  );
};
