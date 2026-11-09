import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, FastForward, Sparkles } from 'lucide-react';

const GRID_COLS = 50;
const GRID_ROWS = 30;

const createEmptyGrid = () => Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(false));

const PRESETS = {
  glider: [
    [0, 1],
    [1, 2],
    [2, 0],
    [2, 1],
    [2, 2],
  ],
  pulsar: [
    // 3-period oscillator
    [2, 4], [2, 5], [2, 6], [2, 10], [2, 11], [2, 12],
    [4, 2], [4, 7], [4, 9], [4, 14],
    [5, 2], [5, 7], [5, 9], [5, 14],
    [6, 2], [6, 7], [6, 9], [6, 14],
    [7, 4], [7, 5], [7, 6], [7, 10], [7, 11], [7, 12],
    [9, 4], [9, 5], [9, 6], [9, 10], [9, 11], [9, 12],
    [10, 2], [10, 7], [10, 9], [10, 14],
    [11, 2], [11, 7], [11, 9], [11, 14],
    [12, 2], [12, 7], [12, 9], [12, 14],
    [14, 4], [14, 5], [14, 6], [14, 10], [14, 11], [14, 12],
  ],
  spaceship: [
    [1, 1], [1, 4],
    [2, 5],
    [3, 1], [3, 5],
    [4, 2], [4, 3], [4, 4], [4, 5],
  ],
};

export const SimulationDemo: React.FC = () => {
  const [grid, setGrid] = useState<boolean[][]>(() => {
    const initial = createEmptyGrid();
    // Seed with glider and spaceship
    PRESETS.glider.forEach(([r, c]) => {
      initial[r + 4][c + 5] = true;
    });
    PRESETS.spaceship.forEach(([r, c]) => {
      initial[r + 15][c + 8] = true;
    });
    return initial;
  });

  const [isRunning, setIsRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [speedMs, setSpeedMs] = useState(120);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isRunningRef = useRef(isRunning);
  isRunningRef.current = isRunning;

  // Count population
  const population = grid.reduce((acc, row) => acc + row.filter(Boolean).length, 0);

  const stepSimulation = useCallback(() => {
    setGrid((currentGrid) => {
      const nextGrid = createEmptyGrid();
      const operations = [
        [0, 1], [0, -1], [1, -1], [-1, 1],
        [1, 1], [-1, -1], [1, 0], [-1, 0],
      ];

      for (let r = 0; r < GRID_ROWS; r++) {
        for (let c = 0; c < GRID_COLS; c++) {
          let neighbors = 0;
          operations.forEach(([dr, dc]) => {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < GRID_ROWS && nc >= 0 && nc < GRID_COLS) {
              if (currentGrid[nr][nc]) neighbors += 1;
            }
          });

          if (neighbors < 2 || neighbors > 3) {
            nextGrid[r][c] = false;
          } else if (currentGrid[r][c] && (neighbors === 2 || neighbors === 3)) {
            nextGrid[r][c] = true;
          } else if (!currentGrid[r][c] && neighbors === 3) {
            nextGrid[r][c] = true;
          }
        }
      }
      return nextGrid;
    });
    setGeneration((g) => g + 1);
  }, []);

  // Run loop
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      stepSimulation();
    }, speedMs);
    return () => clearInterval(interval);
  }, [isRunning, speedMs, stepSimulation]);

  // Render to Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellWidth = canvas.width / GRID_COLS;
    const cellHeight = canvas.height / GRID_ROWS;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw cells
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        if (grid[r][c]) {
          ctx.fillStyle = '#2563eb';
          ctx.fillRect(c * cellWidth + 0.5, r * cellHeight + 0.5, cellWidth - 1, cellHeight - 1);
        } else {
          ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#0f172a' : '#f8fafc';
          ctx.fillRect(c * cellWidth + 0.5, r * cellHeight + 0.5, cellWidth - 1, cellHeight - 1);
        }
      }
    }

    // Hairline grid
    ctx.strokeStyle = document.documentElement.classList.contains('dark') ? '#1e293b' : '#e2e8f0';
    ctx.lineWidth = 0.5;

    for (let c = 0; c <= GRID_COLS; c++) {
      ctx.beginPath();
      ctx.moveTo(c * cellWidth, 0);
      ctx.lineTo(c * cellWidth, canvas.height);
      ctx.stroke();
    }
    for (let r = 0; r <= GRID_ROWS; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * cellHeight);
      ctx.lineTo(canvas.width, r * cellHeight);
      ctx.stroke();
    }
  }, [grid]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const col = Math.floor((x * scaleX) / (canvas.width / GRID_COLS));
    const row = Math.floor((y * scaleY) / (canvas.height / GRID_ROWS));

    if (row >= 0 && row < GRID_ROWS && col >= 0 && col < GRID_COLS) {
      setGrid((prev) => {
        const next = prev.map((r) => [...r]);
        next[row][col] = !next[row][col];
        return next;
      });
    }
  };

  const loadPreset = (type: keyof typeof PRESETS | 'random') => {
    const next = createEmptyGrid();
    if (type === 'random') {
      for (let r = 0; r < GRID_ROWS; r++) {
        for (let c = 0; c < GRID_COLS; c++) {
          next[r][c] = Math.random() > 0.82;
        }
      }
    } else {
      const coords = PRESETS[type];
      const startR = 8;
      const startC = 16;
      coords.forEach(([dr, dc]) => {
        if (startR + dr < GRID_ROWS && startC + dc < GRID_COLS) {
          next[startR + dr][startC + dc] = true;
        }
      });
    }
    setGrid(next);
    setGeneration(0);
  };

  const clearGrid = () => {
    setIsRunning(false);
    setGrid(createEmptyGrid());
    setGeneration(0);
  };

  return (
    <div className="space-y-6">
      {/* Top Simulation Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRunning ? 'Pause Loop' : 'Run Simulation'}</span>
          </button>
          <button
            type="button"
            disabled={isRunning}
            onClick={stepSimulation}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>Step</span>
          </button>
          <button
            type="button"
            onClick={clearGrid}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium mr-1">Presets:</span>
          {(['glider', 'pulsar', 'spaceship', 'random'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => loadPreset(p)}
              className="px-2.5 py-1 text-[11px] font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-md transition-colors cursor-pointer capitalize text-slate-700 dark:text-slate-200"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Live Metrics */}
        <div className="flex items-center gap-4 text-xs font-mono tabular-nums text-slate-600 dark:text-slate-400">
          <div>
            Gen: <span className="font-semibold text-slate-900 dark:text-white">{generation}</span>
          </div>
          <div>
            Pop: <span className="font-semibold text-slate-900 dark:text-white">{population}</span>
          </div>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs bg-slate-950 flex flex-col items-center justify-center p-2">
        <canvas
          ref={canvasRef}
          width={800}
          height={480}
          onClick={handleCanvasClick}
          className="w-full h-auto cursor-crosshair rounded-lg block"
          title="Click cells to toggle state"
        />
        <div className="pt-2 text-center text-[11px] text-slate-400">
          Click or tap any coordinate on the 50x30 cellular matrix to spawn or extinguish life cells
        </div>
      </div>

      {/* Speed Slider */}
      <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-300 max-w-sm">
        <span className="whitespace-nowrap font-medium">Simulation Clock:</span>
        <input
          type="range"
          min="40"
          max="300"
          step="20"
          value={speedMs}
          onChange={(e) => setSpeedMs(parseInt(e.target.value, 10))}
          className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <span className="font-mono tabular-nums whitespace-nowrap">{speedMs}ms/step</span>
      </div>
    </div>
  );
};
