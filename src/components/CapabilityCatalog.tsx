import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Sparkles, Database, LayoutGrid, Terminal, Gauge, Cpu } from 'lucide-react';
import { CapabilityItem } from '../types';

const CAPABILITIES: CapabilityItem[] = [
  {
    id: 'analytics',
    category: 'Business & SaaS',
    title: 'Enterprise Analytics & KPI Control Hubs',
    tagline: 'High-density telemetry, multi-axis charting, and transactional exports',
    description: 'Transform complex business logic into reactive, accessible dashboards with custom SVG/Canvas data visualizations, multi-column tabular filtering, role-based controls, and instant CSV/JSON report downloads.',
    architecture: ['React 19', 'Tailwind CSS v4', 'SVG/Canvas Rendering', 'Blob Exporter'],
    samplePrompt: 'Build an Enterprise Cloud Cost Optimization dashboard with monthly spending charts, idle resource anomaly detection, interactive cost allocation tables, and CSV export functionality.',
  },
  {
    id: 'kanban',
    category: 'Productivity & Workflows',
    title: 'Collaborative Agile Workspaces & Kanbans',
    tagline: 'Multi-stage workflow tracking with persistent local state & task hierarchy',
    description: 'Build project management platforms, issue trackers, and editorial calendars featuring responsive column pipelines, priority sorting, subtask checklists, and client-side or database storage.',
    architecture: ['State Machines', 'LocalStorage / IndexedDB', 'Search Filters', 'Form Validation'],
    samplePrompt: 'Create a Project Roadmap and Kanban application with customizable columns, priority tags, milestone deadlines, task search, and local persistence.',
  },
  {
    id: 'ecommerce',
    category: 'Retail & Commerce',
    title: 'E-Commerce Portals & Booking Engines',
    tagline: 'Product catalogs, basket state, reservation matrices, and checkout flows',
    description: 'Create high-converting direct-to-consumer store experiences, boutique collections, hotel/service booking calendars, and inventory management consoles with smooth micro-interactions.',
    architecture: ['Cart Context', 'Variant Selectors', 'Order Calculation', 'Responsive Grid'],
    samplePrompt: 'Build a modern artisanal coffee roaster e-commerce storefront with roast profile filters, subscription frequency selectors, interactive cart drawer, and order review flow.',
  },
  {
    id: 'science',
    category: 'Science & Engineering',
    title: 'Interactive Simulations & Mathematical Calculators',
    tagline: 'Complex computational modeling, algorithm visualizers, and physics loops',
    description: 'Implement complex computational simulations—from cellular automata and orbital mechanics to compound interest Monte Carlo calculations and scientific data normalization.',
    architecture: ['HTML5 Canvas 2D/WebGL', 'Numerical Algorithms', 'FPS Clocks', 'Matrix Math'],
    samplePrompt: 'Build an interactive Retirement Monte Carlo Simulation with adjustable asset allocations, inflation variance sliders, probability of success charts, and dynamic milestone markers.',
  },
  {
    id: 'media',
    category: 'Creative & Audio',
    title: 'Web Audio Synthesizers & Visual Editors',
    tagline: 'Oscillators, real-time audio FFT, image processing, and canvas playgrounds',
    description: 'Leverage the native browser capabilities with the Web Audio API, Canvas drawing engines, waveform visualizers, filter effects, and generative graphic algorithms.',
    architecture: ['Web Audio API', 'FFT Analysers', 'Canvas 2D API', 'Key Event Listeners'],
    samplePrompt: 'Build an interactive 16-step Drum Machine and Sequencer with 4 instrument tracks, BPM tempo tap, pattern presets, and audio export.',
  },
  {
    id: 'fullstack',
    category: 'Full-Stack Architecture',
    title: 'Node.js Express Services & Cloud Databases',
    tagline: 'REST API proxying, Cloud SQL PostgreSQL, and Firestore integration',
    description: 'Construct complete full-stack applications with an Express backend, relational Cloud SQL databases via Drizzle ORM, Firebase Firestore real-time collections, and OAuth authentication.',
    architecture: ['Express 4 / Node.js', 'PostgreSQL / Firestore', 'Drizzle ORM', 'OAuth Scopes'],
    samplePrompt: 'Create a full-stack Customer Feedback API and Dashboard with Express backend endpoints, PostgreSQL database schema, sentiment categorization, and search filters.',
  },
];

export const CapabilityCatalog: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section id="capabilities" className="py-16 md:py-24 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        {/* Section Title */}
        <div className="space-y-3 max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            02. Engineered Domains
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight text-balance">
            Comprehensive Software Capabilities
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Every application category below is engineered from first principles with responsive layouts, accessible controls, and resilient architecture. Click &quot;Copy Prompt&quot; on any card to test building it directly.
          </p>
        </div>

        {/* Feature Spotlight Banner with Generated Image */}
        <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 text-white grid grid-cols-1 lg:grid-cols-12 shadow-sm">
          <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
                <span>Enterprise Grade</span>
                <span aria-hidden="true">·</span>
                <span>Sub-50ms Client Latency</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Architected For Production Workloads
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                We avoid brittle mock code and shallow templates. Every database query, API contract, and reactive UI component is designed with proper error boundaries, loading states, and accessible WCAG contrast.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
              <div>
                <p className="font-mono text-lg font-bold text-white tabular-nums">100%</p>
                <p className="text-slate-400 text-[11px]">TypeScript Strictness</p>
              </div>
              <div>
                <p className="font-mono text-lg font-bold text-white tabular-nums">0 ms</p>
                <p className="text-slate-400 text-[11px]">Build Lock-in</p>
              </div>
              <div>
                <p className="font-mono text-lg font-bold text-white tabular-nums">Dual</p>
                <p className="text-slate-400 text-[11px]">Dark / Light Modes</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative aspect-16/10 lg:aspect-auto">
            <img
              src="/src/assets/images/showcase_analytics_platform_1793949920265.jpg"
              alt="High-density data analytics wall showcasing production monitoring consoles"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Capability Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CAPABILITIES.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-5 shadow-xs"
            >
              <div className="space-y-3">
                {/* Category & Tagline - Clean unboxed metadata (§1.A) */}
                <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-medium">
                  <span>{item.category}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.description}
                </p>

                {/* Tech Stack Unboxed Tokens */}
                <div className="pt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  {item.architecture.map((tech, i) => (
                    <React.Fragment key={tech}>
                      <span>{tech}</span>
                      {i < item.architecture.length - 1 && <span aria-hidden="true">·</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Action Box with Copy Prompt */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-medium text-slate-700 dark:text-slate-200">Sample Prompt: </span>
                  &ldquo;{item.samplePrompt}&rdquo;
                </div>
                <button
                  type="button"
                  onClick={() => copyPrompt(item.id, item.samplePrompt)}
                  className={`w-full py-2 px-3 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    copiedId === item.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied! Paste into Chat</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Starter Prompt</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
