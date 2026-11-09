import React, { useState } from 'react';
import {
  Image as ImageIcon,
  ZoomIn,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Info
} from 'lucide-react';

interface DefectItem {
  id: string;
  name: string;
  code: string;
  severity: 'Critical' | 'Major' | 'Minor';
  line: string;
  component: string;
  description: string;
  sopCountermeasure: string;
}

export const CelestialGalleryPage: React.FC<{ onAskCopilot: (q: string) => void }> = ({ onAskCopilot }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'Critical' | 'Major' | 'Minor'>('all');
  const [activeDefect, setActiveDefect] = useState<DefectItem | null>(null);

  const defects: DefectItem[] = [
    {
      id: 'IMG-01',
      name: 'Solder Bridge on Fine-Pitch QFP',
      code: 'DEF-01',
      severity: 'Critical',
      line: 'SMT-02',
      component: 'U14 (0.4mm pitch 100-pin MCU)',
      description: 'Excessive solder paste bridging adjacent leads across pins 24-25, causing short circuit.',
      sopCountermeasure: 'Inspect stencil aperture wear; reduce squeegee downforce by 0.4 kg/cm²; verify stencil wiper solvent saturation.',
    },
    {
      id: 'IMG-02',
      name: 'Component Tombstoning (Manhattan Effect)',
      code: 'DEF-02',
      severity: 'Major',
      line: 'SMT-01',
      component: 'C104 (0201 multilayer ceramic capacitor)',
      description: 'One terminal lifted vertically off pad during liquidus reflow stage due to differential wetting surface tension.',
      sopCountermeasure: 'Balance thermal mass of connecting ground trace; reduce preheat ramp slope to 1.5°C/s maximum.',
    },
    {
      id: 'IMG-03',
      name: 'BGA Solder Voiding (> 15% Area)',
      code: 'DEF-04',
      severity: 'Major',
      line: 'SMT-01',
      component: 'BGA-256 (Application Processor SoC)',
      description: 'Air bubble entrapment inside solder ball matrix exceeding IPC-A-610 Class 3 voiding specification.',
      sopCountermeasure: 'Extend reflow soak dwell time at 190°C to allow flux volatile outgassing prior to peak liquidus.',
    },
    {
      id: 'IMG-04',
      name: 'Chip Component Misalignment (> 25% Pad)',
      code: 'DEF-03',
      severity: 'Minor',
      line: 'SMT-02',
      component: 'R42 (0402 thick film resistor)',
      description: 'Angular skew theta = 8.5° exceeding self-alignment surface tension threshold.',
      sopCountermeasure: 'Calibrate pick-and-place optical centering camera; clean vacuum nozzle tip with isopropyl alcohol.',
    },
    {
      id: 'IMG-05',
      name: 'Cold Solder Joint & Incomplete Wetting',
      code: 'DEF-05',
      severity: 'Critical',
      line: 'DIP-01',
      component: 'J2 (Through-hole DC barrel jack terminal)',
      description: 'Granular, non-reflective fillet with poor wetting angle indicating insufficient heat transfer during wave soldering.',
      sopCountermeasure: 'Increase wave solder contact time by 0.5s; verify flux specific gravity at 0.812 g/cm³.',
    },
    {
      id: 'IMG-06',
      name: 'Lifted QFN Ground Terminal',
      code: 'DEF-06',
      severity: 'Critical',
      line: 'SMT-01',
      component: 'U8 (QFN-32 Battery Charger IC)',
      description: 'Center ground pad coplanarity failure resulting in high thermal resistance and ground disconnect.',
      sopCountermeasure: 'Modify stencil center pad aperture to 4x4 window-pane grid (70% total area coverage).',
    },
  ];

  const filteredDefects = selectedFilter === 'all'
    ? defects
    : defects.filter(d => d.severity === selectedFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#242735]">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>3D AOI Optical Defect Visual Inspection Board</span>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-sm">
              IPC-A-610 CLASS 3
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated Optical Inspection (AOI) capture gallery, defect criteria, and root cause SOP countermeasures.
          </p>
        </div>

        {/* Severity Filters */}
        <div className="flex items-center gap-1 p-0.5 bg-[#181a22] border border-[#242735] rounded-md text-xs">
          {(['all', 'Critical', 'Major', 'Minor'] as const).map(sev => (
            <button
              key={sev}
              type="button"
              onClick={() => setSelectedFilter(sev)}
              className={`px-3 py-1 font-semibold rounded-sm transition-colors cursor-pointer text-[11px] ${
                selectedFilter === sev
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {sev === 'all' ? 'All Defects' : sev}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDefects.map((defect) => (
          <div
            key={defect.id}
            onClick={() => setActiveDefect(defect)}
            className="bg-[#181a22] border border-[#242735] hover:border-blue-500/60 rounded-xl p-5 shadow-lg space-y-3 cursor-pointer transition-all hover:scale-[1.01]"
          >
            {/* Visual Canvas Representation */}
            <div className="h-40 w-full bg-[#13151b] border border-[#242735] rounded-lg relative overflow-hidden flex flex-col items-center justify-center p-4 text-center">
              {/* Graphic Icon Display */}
              <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mb-2">
                <ZoomIn className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-xs font-bold text-white">{defect.name}</span>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5">{defect.component}</span>

              {/* Tag Badge */}
              <span className={`absolute top-2.5 right-2.5 px-2 py-0.5 text-[9px] font-bold uppercase rounded ${
                defect.severity === 'Critical'
                  ? 'bg-[#e11d48]/20 text-[#e11d48] border border-[#e11d48]/30'
                  : defect.severity === 'Major'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              }`}>
                {defect.severity}
              </span>

              <span className="absolute bottom-2.5 left-2.5 text-[9px] font-mono text-slate-500">
                Line: {defect.line}
              </span>
            </div>

            {/* Information */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-mono text-blue-400 font-semibold">{defect.code}</span>
                <span className="text-slate-400 text-[10px]">Click to view SOP</span>
              </div>
              <p className="text-slate-300 line-clamp-2 text-[11px] leading-relaxed">
                {defect.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {activeDefect && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#181a22] border border-[#242735] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-[#242735]">
              <div>
                <span className="text-[10px] font-mono text-blue-400 font-bold uppercase">{activeDefect.code} · {activeDefect.line}</span>
                <h3 className="text-base font-bold text-white mt-0.5">{activeDefect.name}</h3>
                <span className="text-xs text-slate-400 font-mono">{activeDefect.component}</span>
              </div>
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                activeDefect.severity === 'Critical'
                  ? 'bg-[#e11d48]/20 text-[#e11d48]'
                  : 'bg-amber-500/20 text-amber-400'
              }`}>
                {activeDefect.severity}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] font-semibold uppercase block mb-1">Optical Inspection Diagnosis:</span>
                <p className="p-3 bg-[#13151b] border border-[#242735] rounded-lg text-slate-200 leading-relaxed">
                  {activeDefect.description}
                </p>
              </div>

              <div>
                <span className="text-emerald-400 text-[10px] font-semibold uppercase block mb-1">Standard Operating Procedure (SOP) Corrective Countermeasure:</span>
                <p className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-lg text-emerald-200 leading-relaxed">
                  {activeDefect.sopCountermeasure}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  onAskCopilot(`How do I troubleshoot ${activeDefect.name} on ${activeDefect.line}?`);
                  setActiveDefect(null);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask AI Deep Troubleshooting</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveDefect(null)}
                className="px-4 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
