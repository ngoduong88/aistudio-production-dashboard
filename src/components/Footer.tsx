import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <p className="font-extrabold text-slate-900 dark:text-white tracking-tight text-sm">
            Engineering Studio
          </p>
          <p className="text-[11px] text-slate-500">
            Autonomous software engineering and rapid application delivery.
          </p>
        </div>

        <nav className="flex items-center gap-6 font-medium">
          <a href="#demos" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Interactive Demos
          </a>
          <a href="#capabilities" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Capabilities
          </a>
          <a href="#scoper" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Prompt Scoper
          </a>
          <a href="#architecture" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Stack
          </a>
        </nav>

        <p className="text-[11px] text-slate-500 font-mono">
          Ready for your next build instruction
        </p>
      </div>
    </footer>
  );
};
