import React, { useState, useMemo } from 'react';
import { Copy, Check, Sparkles, SlidersHorizontal, CheckSquare, Square, RefreshCw } from 'lucide-react';
import { ProjectScopeConfig } from '../types';

const INITIAL_CONFIG: ProjectScopeConfig = {
  appType: 'Enterprise Analytics Dashboard',
  domain: 'FinTech & SaaS Operations',
  backendNeeded: false,
  database: 'local',
  authNeeded: false,
  features: [
    'Interactive Multi-Axis Charts',
    'CSV & JSON Export Engine',
    'Tabular Filtering & Column Sort',
    'Dark / Light Theme Toggle',
  ],
  customGoal: 'Monitor high-frequency customer transactions with anomaly alerts and team performance breakdowns.',
};

const APP_TYPES = [
  'Enterprise Analytics Dashboard',
  'Kanban & Agile Workflow Tool',
  'E-Commerce & Service Booking',
  'Interactive Simulation & Calculator',
  'Web Audio & Creative Studio',
  'Developer Console & API Inspector',
  'Educational Tool & Interactive Lab',
];

const DOMAINS = [
  'FinTech & SaaS Operations',
  'HealthTech & Medical Records',
  'Logistics & Supply Chain',
  'Creative Agency & Media',
  'Science, Biotech & Research',
  'Retail, Fashion & E-Commerce',
];

const AVAILABLE_FEATURES = [
  'Interactive Multi-Axis Charts',
  'CSV & JSON Export Engine',
  'Tabular Filtering & Column Sort',
  'Dark / Light Theme Toggle',
  'Web Audio Synthesizer Engine',
  'HTML5 Canvas 2D Physics Grid',
  'Persistent LocalStorage State',
  'Form Schema & Instant Validation',
  'Role-Based Permission Matrix',
];

export const ProjectScoper: React.FC = () => {
  const [config, setConfig] = useState<ProjectScopeConfig>(INITIAL_CONFIG);
  const [copied, setCopied] = useState(false);

  const toggleFeature = (feature: string) => {
    setConfig((prev) => {
      const exists = prev.features.includes(feature);
      const nextFeatures = exists ? prev.features.filter((f) => f !== feature) : [...prev.features, feature];
      return { ...prev, features: nextFeatures };
    });
  };

  const generatedPrompt = useMemo(() => {
    const lines = [
      `Build a ${config.appType} for ${config.domain}.`,
      '',
      `Core Objective: ${config.customGoal || 'Provide a responsive, production-ready interface with real functionality.'}`,
      '',
      'Key Technical Requirements:',
      `- Architecture: ${config.backendNeeded ? 'Full-stack React with Express Node.js server' : 'Client-side React 19 SPA with TypeScript and Tailwind CSS v4'}`,
      `- Data Persistence: ${config.database === 'cloudsql' ? 'Cloud SQL PostgreSQL database' : config.database === 'firestore' ? 'Firebase Firestore persistent collections' : 'Browser LocalStorage with robust fallbacks'}`,
      `- Authentication: ${config.authNeeded ? 'Enabled with secure session/token management' : 'Not required (open workspace)'}`,
      `- Included Modules: ${config.features.join(', ')}`,
      '',
      'UI & Design Guidelines:',
      '- High-contrast typography with Plus Jakarta Sans and JetBrains Mono for numbers.',
      '- Unboxed metadata with subtle typographic separators; zero static pill sandwiches.',
      '- Complete dual light/dark mode support.',
      '- Real, active event handlers for every interactive button, input, and export action.',
    ];
    return lines.join('\n');
  }, [config]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const resetConfig = () => {
    setConfig(INITIAL_CONFIG);
  };

  return (
    <section id="scoper" className="py-16 md:py-24 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        {/* Section Header */}
        <div className="space-y-3 max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            03. Interactive Specification Architect
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight text-balance">
            Design Your Next Application
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Customize your architecture, domain, and key feature requirements. This generator crafts an engineered brief that you can paste directly into our chat conversation to begin construction immediately.
          </p>
        </div>

        {/* Builder Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Configuration Form */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Application Configuration</span>
              </span>
              <button
                type="button"
                onClick={resetConfig}
                className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* App Type & Domain */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Target Product Type
                </label>
                <select
                  value={config.appType}
                  onChange={(e) => setConfig({ ...config, appType: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  {APP_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Industry / Domain
                </label>
                <select
                  value={config.domain}
                  onChange={(e) => setConfig({ ...config, domain: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  {DOMAINS.map((domain) => (
                    <option key={domain} value={domain}>
                      {domain}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Persistence & Backend Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Backend Architecture
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, backendNeeded: false })}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border transition-colors cursor-pointer text-center ${
                      !config.backendNeeded
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Client SPA
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, backendNeeded: true })}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border transition-colors cursor-pointer text-center ${
                      config.backendNeeded
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Express Backend
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Database Persistence
                </label>
                <select
                  value={config.database}
                  onChange={(e) => setConfig({ ...config, database: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="local">LocalStorage / In-Memory (Zero Config)</option>
                  <option value="cloudsql">Cloud SQL PostgreSQL (Relational)</option>
                  <option value="firestore">Firebase Firestore (NoSQL)</option>
                </select>
              </div>
            </div>

            {/* Custom Brief Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Custom Functional Objectives / Brief
              </label>
              <textarea
                rows={3}
                value={config.customGoal}
                onChange={(e) => setConfig({ ...config, customGoal: e.target.value })}
                placeholder="Describe your specific business rules, user interactions, or data models..."
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Feature Modules Checklist */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Key Modules & Components
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {AVAILABLE_FEATURES.map((feature) => {
                  const checked = config.features.includes(feature);
                  return (
                    <button
                      key={feature}
                      type="button"
                      onClick={() => toggleFeature(feature)}
                      className={`flex items-center gap-2 p-2 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                        checked
                          ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      {checked ? (
                        <CheckSquare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      )}
                      <span className="truncate">{feature}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Live Generated Prompt Output */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-4 shadow-sm flex flex-col justify-between h-full">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-blue-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ready-To-Run Prompt</span>
                </span>
                <span className="text-[11px] text-slate-400 font-mono">1-Click Copier</span>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed max-h-[380px] overflow-y-auto whitespace-pre-wrap selection:bg-blue-600 selection:text-white">
                {generatedPrompt}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={copyToClipboard}
                className={`w-full py-3 px-4 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied! Now Paste It In Our Chat</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Configured Prompt</span>
                  </>
                )}
              </button>
              <p className="text-center text-[11px] text-slate-400">
                Paste this into the chat window and I will immediately build your application!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
