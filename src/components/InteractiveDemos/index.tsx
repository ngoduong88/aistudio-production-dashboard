import React, { useState } from 'react';
import { BarChart3, Activity, Music, Layers } from 'lucide-react';
import { DemoTab } from '../../types';
import { AnalyticsDemo } from './AnalyticsDemo';
import { KanbanDemo } from './KanbanDemo';
import { AudioSynthDemo } from './AudioSynthDemo';
import { SimulationDemo } from './SimulationDemo';

export const InteractiveDemos: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DemoTab>('analytics');

  return (
    <section id="demos" className="py-16 md:py-24 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              01. Live Execution Sandbox
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight text-balance">
              Test Real Working Applications
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              These are not mock mockups or static screenshots. Every demo below is a live, fully functional software module running in this React 19 environment.
            </p>
          </div>

          {/* Tab Selector - Segmented interactive buttons (§1.A compliant) */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800/80 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'analytics'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Data & Analytics</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('kanban')}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'kanban'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Kanban Workflow</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('synth')}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'synth'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>Audio Synthesizer</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('simulation')}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'simulation'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Life Simulation</span>
            </button>
          </div>
        </div>

        {/* Demo Stage Container */}
        <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
          {activeTab === 'analytics' && <AnalyticsDemo />}
          {activeTab === 'kanban' && <KanbanDemo />}
          {activeTab === 'synth' && <AudioSynthDemo />}
          {activeTab === 'simulation' && <SimulationDemo />}
        </div>
      </div>
    </section>
  );
};
