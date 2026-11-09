import React from 'react';
import { ArrowRight, Code2, Database, Sparkles, Layers, Cpu } from 'lucide-react';

interface HeroProps {
  onExploreDemos: () => void;
  onOpenScoper: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreDemos, onOpenScoper }) => {
  return (
    <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <span>Full-Stack Engineering</span>
              <span aria-hidden="true">·</span>
              <span>Production Architecture</span>
              <span aria-hidden="true">·</span>
              <span>Rapid Deployment</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] text-balance">
              What Can We Build Together?
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              From responsive frontend applications and high-frequency analytical dashboards to full-stack Express backends, real-time collaboration tools, and custom simulation engines. Tell me your project requirements in plain language, and I will architect, write, debug, and deploy the entire application.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onExploreDemos}
                className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm shadow-blue-500/20 whitespace-nowrap"
              >
                <span>Test Live Interactive Demos</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onOpenScoper}
                className="px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer border border-slate-200 dark:border-slate-800 whitespace-nowrap"
              >
                Launch Prompt Scoper
              </button>
            </div>

            {/* Quick architectural capability trust marks */}
            <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>React 19 & TypeScript</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Tailwind CSS v4</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Express Node Services</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Cloud SQL & Firestore</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-100 dark:bg-slate-900 aspect-16/10">
              <img
                src="/src/assets/images/hero_software_workspace_1793949919660.jpg"
                alt="Modern software engineering workspace with dual displays and architecture schematics"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback container if local image is unavailable
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.parentElement?.querySelector('.image-fallback');
                  if (fallback) fallback.classList.remove('hidden');
                }}
              />
              <div className="image-fallback hidden absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 p-8 flex flex-col justify-between text-white">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold">Autonomous Engineering Engine</h3>
                  <p className="text-xs text-slate-400">Interactive live code execution and testing.</p>
                </div>
              </div>

              {/* Measured contrast scrim and subtle caption badge */}
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent flex items-center justify-between text-white text-xs">
                <div>
                  <p className="font-semibold text-slate-100">Live Engineering Sandbox</p>
                  <p className="text-slate-400 text-[11px]">Instant live compilation, HMR-free safety</p>
                </div>
                <div className="font-mono text-[11px] text-blue-400 tabular-nums">
                  Active Runtime
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
