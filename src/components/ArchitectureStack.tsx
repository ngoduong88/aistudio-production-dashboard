import React from 'react';
import { Terminal, Database, Code, Globe, ShieldCheck, Zap } from 'lucide-react';

const STACK_LAYERS = [
  {
    icon: Code,
    category: 'Client Presentation & UI',
    technologies: 'React 19, TypeScript, Tailwind CSS v4, Motion',
    features: 'Zero-bundle bloat, strictly typed components, WCAG AA contrast compliance, sub-16ms frame rate renders, and native dark mode.',
  },
  {
    icon: Terminal,
    category: 'Server & API Services',
    technologies: 'Node.js, Express, tsx Server Runner',
    features: 'RESTful API endpoints, server-side data aggregation, CORS management, secure secret proxying, and client token authentication.',
  },
  {
    icon: Database,
    category: 'Persistence & Databases',
    technologies: 'Cloud SQL (PostgreSQL), Firebase Firestore, LocalStorage',
    features: 'Drizzle ORM relational migrations, scale-to-zero developer databases, Firestore real-time rules and NoSQL document collections.',
  },
  {
    icon: Zap,
    category: 'Browser Hardware & Media APIs',
    technologies: 'Web Audio API, HTML5 Canvas 2D/WebGL, File Blobs',
    features: 'In-browser sound synthesis, dynamic waveform FFT, 2D simulation physics grids, and instant client-side CSV/JSON/PDF exports.',
  },
  {
    icon: Globe,
    category: 'Ecosystem & 1P Integrations',
    technologies: 'Google Workspace (OAuth), Google Maps Platform',
    features: 'Direct integration with Google Calendar, Sheets, Drive, Gmail, Docs, interactive Map viewports, and geocoding services.',
  },
  {
    icon: ShieldCheck,
    category: 'Quality & Verification Guardrails',
    technologies: 'Lint Validation, Pre-flight Build Checks, Strict Schema',
    features: 'Automated type checking, absence of dead interactive affordances, resilient error boundaries, and zero mock fallbacks.',
  },
];

export const ArchitectureStack: React.FC = () => {
  return (
    <section id="architecture" className="py-16 md:py-24 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="space-y-3 max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            04. Architectural Stack
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight text-balance">
            Production-Ready Foundations
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Every application built in this environment runs on verified modern web standards. We orchestrate both frontend user interfaces and backend server architecture seamlessly.
          </p>
        </div>

        {/* Stack Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STACK_LAYERS.map((layer, idx) => {
            const Icon = layer.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Icon className="w-5 h-5" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {layer.category}
                  </h3>
                  <p className="text-xs font-mono text-blue-600 dark:text-blue-400">
                    {layer.technologies}
                  </p>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  {layer.features}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
