import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, X, Minimize2, Maximize2, RefreshCw, AlertCircle, Zap } from 'lucide-react';
import { ChatMessage, ProductionRecord, ProductionKPIs } from '../types';

interface ProductionChatbotProps {
  records: ProductionRecord[];
  kpis: ProductionKPIs;
  activeLineFilter: string;
  activeShiftFilter: string;
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_GREETING: ChatMessage = {
  id: 'msg-0',
  role: 'model',
  content: `Hello! I am your **Foxconn FIH Production Line Operations AI Copilot**. I have loaded and indexed the active factory spreadsheet **[INTERNAL] P26 MIL 0518** (Sheet **'4CS4'** - *Sustaining Yield VN*).\n\n⚡ **Auto-Analysis & Insights**:\n- Click **"Auto analyze sheet"** or ask any production question to analyze yield, output, and anomalies across lines and shifts.\n- Type **"Test"** anytime to check the AI response and live latency.`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  latencyMs: 0.3,
};

const SUGGESTED_QUERIES = [
  'Test',
  'Auto analyze sheet (decipher numbers)',
  'AOI inspection setup',
  'Summarize today\'s overall production line performance',
  'Which line has the lowest yield and what is the root cause?',
];

const AOI_SETUP_TEMPLATE = `AOI inspection setup

OK samples folder: paste Google Drive folder link
NG samples folder: paste Google Drive folder link
Inspection images folder: paste Google Drive folder link
Area to inspect: e.g. USB connector / U2301 / all visible PCB
NG categories: e.g. missing component, shifted component, wrong orientation, solder bridge
Additional rules: e.g. ignore background and watermark; compare only the selected area`;

// Helper to format markdown text and tables cleanly
function renderFormattedContent(text: string) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let tableRows: string[][] = [];
  let inTable = false;

  const flushTable = (key: string) => {
    if (tableRows.length === 0) return null;
    const headerRow = tableRows[0];
    const dataRows = tableRows.slice(1).filter((r) => !r.every((c) => /^[:\-\s]+$/.test(c)));

    const tableEl = (
      <div key={key} className="my-2.5 overflow-x-auto rounded-lg border border-slate-600/60 bg-[#1e2334]">
        <table className="w-full text-left text-[11px] border-collapse">
          <thead>
            <tr className="bg-[#2d344d] text-slate-200 border-b border-slate-600/60">
              {headerRow.map((h, i) => (
                <th key={i} className="py-1.5 px-2.5 font-semibold">
                  {formatInline(h.trim())}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/60 text-slate-100">
            {dataRows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-700/30 transition-colors">
                {row.map((col, cIdx) => (
                  <td key={cIdx} className="py-1.5 px-2.5">
                    {formatInline(col.trim())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
    inTable = false;
    return tableEl;
  };

  const formatInline = (str: string) => {
    // Basic inline markdown: bold, code, italics
    const parts: React.ReactNode[] = [];
    let remaining = str;

    // Pattern for `code` or **bold**
    const regex = /(\*\*.*?\*\*|`.*?`|\*.*?\*)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(str)) !== null) {
      if (match.index > lastIndex) {
        parts.push(str.substring(lastIndex, match.index));
      }
      const token = match[0];
      if (token.startsWith('**') && token.endsWith('**')) {
        parts.push(<strong key={match.index} className="font-semibold text-white">{token.slice(2, -2)}</strong>);
      } else if (token.startsWith('`') && token.endsWith('`')) {
        parts.push(<code key={match.index} className="px-1.5 py-0.5 rounded bg-blue-950/60 text-blue-300 font-mono text-[10.5px] border border-blue-800/40">{token.slice(1, -1)}</code>);
      } else if (token.startsWith('*') && token.endsWith('*')) {
        parts.push(<em key={match.index} className="italic text-slate-300">{token.slice(1, -1)}</em>);
      }
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < str.length) {
      parts.push(str.substring(lastIndex));
    }
    return parts.length ? parts : remaining;
  };

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];

    // Table row detection
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      inTable = true;
      const cells = line.split('|').slice(1, -1);
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      const tbl = flushTable(`tbl-${idx}`);
      if (tbl) elements.push(tbl);
    }

    if (line.trim() === '---') {
      elements.push(<hr key={idx} className="my-2 border-slate-700/60" />);
    } else if (line.startsWith('### ')) {
      elements.push(<h4 key={idx} className="font-bold text-slate-100 mt-2 mb-1 text-xs">{formatInline(line.replace('### ', ''))}</h4>);
    } else if (line.startsWith('- ')) {
      elements.push(
        <div key={idx} className="flex items-start gap-1.5 my-0.5">
          <span className="text-blue-400 mt-0.5">•</span>
          <span className="leading-relaxed">{formatInline(line.substring(2))}</span>
        </div>
      );
    } else if (/^\d+\.\s/.test(line)) {
      elements.push(
        <div key={idx} className="flex items-start gap-1.5 my-0.5">
          <span className="text-indigo-400 font-mono text-[10px] mt-0.5 font-bold">
            {line.match(/^\d+\./)?.[0]}
          </span>
          <span className="leading-relaxed">{formatInline(line.replace(/^\d+\.\s*/, ''))}</span>
        </div>
      );
    } else if (line.trim() === '') {
      elements.push(<div key={idx} className="h-1" />);
    } else {
      elements.push(<div key={idx} className="leading-relaxed">{formatInline(line)}</div>);
    }
  }

  if (inTable) {
    const tbl = flushTable('tbl-end');
    if (tbl) elements.push(tbl);
  }

  return elements;
}

export const ProductionChatbot: React.FC<ProductionChatbotProps> = ({
  records,
  kpis,
  activeLineFilter,
  activeShiftFilter,
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend || input).trim();
    if (!prompt || loading) return;

    setErrorNotice(null);
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    const clientStartTime = performance.now();

    try {
      // Build lightweight aggregated payload for prompt context
      const productionContext = {
        kpis,
        activeFilters: {
          line: activeLineFilter,
          shift: activeShiftFilter,
        },
        recordsCount: records.length,
        linesSummary: records.map((r) => ({
          lineId: r.lineId,
          station: r.station,
          shift: r.shift,
          target: r.targetUnits,
          actual: r.actualUnits,
          passed: r.passedUnits,
          defects: r.defectUnits,
          yieldRatePct: r.yieldRate,
          downtimeMin: r.downtimeMinutes,
          downtimeReason: r.downtimeReason,
          topDefect: r.topDefectCode,
          oeePct: r.oee,
          status: r.status,
        })),
      };

      const response = await fetch('/api/production/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
          productionContext,
        }),
      });

      const clientElapsedMs = Math.round((performance.now() - clientStartTime) * 100) / 100;

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned error status ${response.status}`);
      }

      const data = await response.json();
      const reportedLatency = data.latencyMs ?? clientElapsedMs;

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: data.reply || 'Analysis completed with no remarks.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        latencyMs: reportedLatency,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorNotice(err.message || 'Unable to communicate with the analysis server.');
      const fallbackMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: `I encountered an issue querying the Gemini AI API: ${err.message}. Please verify the server connection.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([INITIAL_GREETING]);
    setErrorNotice(null);
  };

  if (!isOpen) return null;

  return (
    <aside
      className={`fixed z-50 transition-all duration-200 flex flex-col bg-[#1e2333] text-slate-100 border-2 border-slate-600/70 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.85)] ring-1 ring-white/10 rounded-2xl overflow-hidden ${
        isExpanded
          ? 'inset-4 md:inset-10'
          : 'bottom-4 right-4 sm:right-6 w-[94vw] sm:w-[480px] h-[670px] max-h-[90vh]'
      }`}
    >
      {/* Header */}
      <div className="px-4 py-3 bg-[#2a3147] text-white flex items-center justify-between border-b border-slate-600/60 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-tight flex items-center gap-2 text-white">
              <span>Foxconn AI Operations Copilot</span>
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-semibold">
                P26 Indexed
              </span>
            </h3>
            <p className="text-[10px] text-slate-300">
              File: <span className="text-white font-mono font-medium">[INTERNAL] P26 MIL 0518</span> (Sheet: '4CS4')
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={clearChat}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-md transition-colors cursor-pointer"
            title="Reset conversation"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-md transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse' : 'Expand full-screen'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-md transition-colors cursor-pointer"
            title="Close Assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-3 py-2 bg-[#252b3e] border-b border-slate-600/50 flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
        <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0 ml-0.5" />
        {SUGGESTED_QUERIES.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(q === 'AOI inspection setup' ? AOI_SETUP_TEMPLATE : q)}
            disabled={loading}
            className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-[#30374e] border border-slate-600/60 hover:border-blue-400 text-slate-200 hover:text-white font-medium transition-colors cursor-pointer shrink-0 disabled:opacity-50 text-[10.5px]"
          >
            {q === 'Test' ? '⚡ Test' : q}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 bg-[#181d2a] text-xs">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div key={msg.id} className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 shrink-0 mt-0.5 shadow-xs">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[88%] rounded-xl p-3 leading-relaxed space-y-2 ${
                  isUser
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'bg-[#262c3e] text-slate-100 border border-slate-600/60 shadow-sm'
                }`}
              >
                {/* Content with markdown formatting */}
                <div className="text-[11.5px] space-y-1">
                  {renderFormattedContent(msg.content)}
                </div>

                {/* Footer with Latency Badge and Timestamp */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-700/30 text-[10px]">
                  {!isUser && msg.latencyMs !== undefined ? (
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-medium">
                      <Zap className="w-2.5 h-2.5 fill-emerald-400" />
                      <span>{msg.latencyMs} ms response</span>
                    </div>
                  ) : (
                    <div />
                  )}
                  <div className={`text-[10px] ${isUser ? 'text-blue-100' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center text-slate-200 shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-2.5 items-center text-slate-300 text-xs pl-1">
            <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-300 animate-pulse">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              <span>Querying spreadsheet index & evaluating metrics...</span>
            </div>
          </div>
        )}

        {errorNotice && (
          <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorNotice}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-2.5 bg-[#252b3e] border-t border-slate-600/60 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI or type 'Test' to check response..."
          disabled={loading}
          className="flex-1 px-3.5 py-2 text-xs bg-[#191d2a] border border-slate-600/70 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Ask</span>
        </button>
      </form>
    </aside>
  );
};
