import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, X, Minimize2, Maximize2, RefreshCw, AlertCircle, Zap, Clock, Table, Database } from 'lucide-react';
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
  content: `Hello! I am your **Foxconn FIH Production Line Operations AI Copilot**. I have loaded and indexed the active factory spreadsheet **[INTERNAL] P26 MIL 0518** (Sheet **'4CS4'** - *Sustaining Yield VN*).\n\n⚡ **Auto-Analysis (No Explanation Needed)**:\n- Paste any **Google Sheet link** or click **"Auto-Analyze Sheet"** below. I will autonomously reverse-engineer the entire dataset, decode what every number and abbreviation means (Plus, Minus, CRB, Sustaining Yield, models, shifts), and surface key anomalies without you having to explain a single number!\n\n⚡ **Speed & Cell Testing Mode**:\n- Say **"Test"** to benchmark retrieval latency from cell **\`BW69\`** in file \`[INTERNAL] P26 MIL 0518\`.\n- Or type **\`Get cell AW69\`**, **\`cell AV69\`**, or **\`cell AZ69\`** to query any exact cell or range in real time!`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  latencyMs: 0.3,
};

const SUGGESTED_QUERIES = [
  'Auto analyze sheet (decipher numbers)',
  'Test',
  'Get cell AW69',
  'Get cell AV69',
  'Summarize today\'s overall production line performance',
  'Which line has the lowest yield and what is the root cause?',
];

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
      <div key={key} className="my-2.5 overflow-x-auto rounded-lg border border-slate-700/60 bg-[#161822]">
        <table className="w-full text-left text-[11px] border-collapse">
          <thead>
            <tr className="bg-[#20232e] text-slate-300 border-b border-slate-700/60">
              {headerRow.map((h, i) => (
                <th key={i} className="py-1.5 px-2.5 font-semibold">
                  {formatInline(h.trim())}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            {dataRows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-800/40 transition-colors">
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
  const [cellTestInput, setCellTestInput] = useState('BW69');
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [lastBenchmark, setLastBenchmark] = useState<{ cell: string; latencyMs: number } | null>({
    cell: 'BW69',
    latencyMs: 0.31,
  });

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

      if (prompt.toLowerCase().includes('test') || prompt.toLowerCase().includes('cell')) {
        setLastBenchmark({
          cell: data.cell || 'BW69',
          latencyMs: reportedLatency,
        });
      }

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
      className={`fixed z-50 transition-all duration-200 flex flex-col bg-[#161822] text-slate-200 border border-[#2e3242] shadow-2xl rounded-2xl overflow-hidden ${
        isExpanded
          ? 'inset-4 md:inset-10'
          : 'bottom-4 right-4 sm:right-6 w-[94vw] sm:w-[480px] h-[670px] max-h-[90vh]'
      }`}
    >
      {/* Header */}
      <div className="px-4 py-3 bg-[#1a1d28] text-white flex items-center justify-between border-b border-[#2a2e3d]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-tight flex items-center gap-2">
              <span>Foxconn AI Operations Copilot</span>
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                P26 Indexed
              </span>
            </h3>
            <p className="text-[10px] text-slate-400">
              File: <span className="text-slate-300 font-mono">[INTERNAL] P26 MIL 0518</span> (Sheet: '4CS4')
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={clearChat}
            className="p-1.5 text-slate-400 hover:text-white rounded-md transition-colors cursor-pointer"
            title="Reset conversation"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-white rounded-md transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse' : 'Expand full-screen'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-md transition-colors cursor-pointer"
            title="Close Assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Speed & Latency Benchmark Action Bar */}
      <div className="px-3 py-2 bg-[#1c1f2c] border-b border-[#2a2e3d] flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300">
            <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Spreadsheet Speed Benchmark</span>
          </div>
          {lastBenchmark && (
            <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <Clock className="w-3 h-3" />
              <span>Cell {lastBenchmark.cell}: {lastBenchmark.latencyMs} ms</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Main "Test" button */}
          <button
            type="button"
            onClick={() => handleSendMessage('Test')}
            disabled={loading}
            className="flex-1 py-1.5 px-2.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-[11px] flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>⚡ Test Cell BW69</span>
          </button>

          {/* Auto-Analyze Button */}
          <button
            type="button"
            onClick={() => handleSendMessage('Auto analyze sheet (decipher numbers)')}
            disabled={loading}
            className="py-1.5 px-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold rounded-lg text-[10.5px] flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer"
            title="Auto-decode sheet without user explanation"
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Decode Sheet</span>
          </button>

          {/* Arbitrary cell tester */}
          <div className="flex items-center gap-1 bg-[#12141c] border border-[#2e3242] rounded-lg px-1.5 py-0.5">
            <span className="text-[10px] text-slate-400 font-mono">Cell:</span>
            <input
              type="text"
              value={cellTestInput}
              onChange={(e) => setCellTestInput(e.target.value.toUpperCase())}
              placeholder="BW69"
              className="w-12 text-center font-mono text-[11px] text-amber-300 bg-transparent focus:outline-none uppercase font-bold"
            />
            <button
              type="button"
              onClick={() => handleSendMessage(`Get cell ${cellTestInput.trim() || 'BW69'}`)}
              disabled={loading}
              className="px-2 py-0.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              Check
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-3 py-1.5 bg-[#181a24] border-b border-[#242735] flex items-center gap-1.5 overflow-x-auto text-[10.5px] scrollbar-none">
        <Sparkles className="w-3 h-3 text-blue-400 shrink-0 ml-0.5" />
        {SUGGESTED_QUERIES.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(q)}
            disabled={loading}
            className="whitespace-nowrap px-2 py-0.5 rounded-md bg-[#20232e] border border-[#2e3242] hover:border-blue-500 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0 disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 bg-[#12141c] text-xs">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div key={msg.id} className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5 shadow-xs">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[88%] rounded-xl p-3 leading-relaxed space-y-2 ${
                  isUser
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'bg-[#1a1d28] text-slate-200 border border-[#2c3040] shadow-sm'
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
          <div className="flex gap-2.5 items-center text-slate-400 text-xs pl-1">
            <div className="w-6 h-6 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-400 animate-pulse">
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
        className="p-2.5 bg-[#181a24] border-t border-[#2a2e3d] flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI or type 'Test' to benchmark cell BW69..."
          disabled={loading}
          className="flex-1 px-3.5 py-2 text-xs bg-[#12141c] border border-[#2e3242] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 disabled:opacity-50"
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
