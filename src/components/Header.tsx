import React from 'react';
import { Moon, Sun } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  onOpenScoper: () => void;
}

export const Header: React.FC<HeaderProps> = ({ darkMode, onToggleTheme, onOpenScoper }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a href="#" className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity">
          Engineering Studio
        </a>

        {/* Zone 2: 4 single-line clean navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a href="#demos" className="hover:text-slate-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
            Interactive Demos
          </a>
          <a href="#capabilities" className="hover:text-slate-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
            Capabilities
          </a>
          <a href="#scoper" className="hover:text-slate-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
            Prompt Scoper
          </a>
          <a href="#architecture" className="hover:text-slate-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
            System Stack
          </a>
        </nav>

        {/* Zone 3: 1 primary action & theme switch */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
          <button
            type="button"
            onClick={onOpenScoper}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-blue-600 rounded-lg hover:bg-slate-800 dark:hover:bg-blue-500 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
          >
            Design Your App
          </button>
        </div>
      </div>
    </header>
  );
};
