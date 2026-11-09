import React, { useState } from 'react';
import {
  FileText,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Search,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const CelestialDocumentationPage: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState('sop-01');

  const docs = [
    {
      id: 'sop-01',
      title: 'SOP-042: SMT Stencil Printing & Solder Paste Handling',
      category: 'SMT Printing',
      version: 'v4.2',
      updated: '15 Oct 2026',
      content: `### 1. Purpose & Scope
This Standard Operating Procedure (SOP) defines the mandatory parameters and quality verification steps for solder paste deposition onto high-density printed circuit boards (PCBs) at FIH Foxconn manufacturing facilities.

### 2. Solder Paste Refrigeration & Thawing Protocol
- Solder paste jars (SAC305 Type 4 / Type 5) must be stored at 2°C to 10°C.
- Paste must be naturally thawed at ambient room temperature (22°C ± 2°C) for at least 4 hours before breaking the factory foil seal.
- NEVER heat solder paste artificially under lamps or ovens.
- Centrifugal jar mixer cycle: 3 minutes counter-rotation, 1 minute de-airing.

### 3. Stencil Printer Setup Parameters
- Squeegee Blade: Stainless steel 60° angle.
- Downforce Pressure: 0.18 - 0.22 kg/cm of blade length.
- Printing Speed: 35 mm/sec (fine pitch 0.35mm components: 25 mm/sec).
- Separation Speed: 0.8 mm/sec (slow release prevents aperture bridging).
- Auto-Wiping Interval: Every 5 PCB cycles (Dry wipe -> Vacuum -> Solvent wipe).

### 4. 3D SPI Inspection Acceptance Criteria
- Solder Volume: 80% to 140% of nominal aperture volume.
- Solder Height: 100μm - 150μm (Target 130μm).
- Area Offset: Maximum 15% deviation from nominal pad center.
- Bridging Defect: 0 occurrences permitted (Immediate line hold if detected).`,
    },
    {
      id: 'sop-02',
      title: 'SOP-108: Reflow Oven Thermal Profiling & N2 Atmosphere',
      category: 'Reflow Soldering',
      version: 'v3.8',
      updated: '02 Nov 2026',
      content: `### 1. Convection Reflow Atmosphere Control
- Nitrogen (N2) purity must be maintained at residual O2 < 500 PPM throughout Zones 5 through 9.
- Check thermal mass balance on ground planes prior to profile sign-off.

### 2. Thermal Profile Specifications (SAC305 Alloy)
- Ramp to Soak: 1.0°C - 2.5°C / second.
- Soak Zone (150°C - 200°C): Duration 60 - 90 seconds.
- Time Above Liquidus (TAL > 217°C): 45 - 75 seconds.
- Peak Temperature: 238°C - 248°C (Ideal 243°C ± 2°C).
- Cooling Gradient: -2.0°C to -4.0°C / second to ensure fine grain structure.`,
    },
    {
      id: 'sop-03',
      title: 'SOP-215: IPC-A-610 Class 3 AOI Inspection Criteria',
      category: 'Quality Assurance',
      version: 'v5.0',
      updated: '28 Oct 2026',
      content: `### 1. General Optical Inspection Rules
- Class 3 High-Reliability Electronic Products (Automotive & Telecommunications).
- End-joint minimum wetting: 100% circumferential fillet on leaded packages.
- BGA voiding threshold: Any void exceeding 15% of total ball projection area is non-conforming.
- Tombstoning / component lift: Maximum allowable angle < 5° with zero pad separation.`,
    },
  ];

  const activeDoc = docs.find(d => d.id === selectedDoc) || docs[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#242735]">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Foxconn MES Documentation & Standard Operating Procedures (SOP)</span>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-sm">
              SOP MANUAL
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Process guidelines, reflow thermal tolerances, stencil printing rules, and IPC-A-610 Class 3 specifications.
          </p>
        </div>
      </div>

      {/* Two Column Layout: Doc Index & Content Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Index (Col 4) */}
        <div className="lg:col-span-4 bg-[#181a22] border border-[#242735] rounded-xl p-4 shadow-lg space-y-2">
          <h3 className="text-xs font-bold uppercase text-slate-400 px-2 pb-2 border-b border-[#242735]">
            Available Factory SOP Documents
          </h3>

          <div className="space-y-1">
            {docs.map(doc => (
              <button
                key={doc.id}
                onClick={() => setSelectedDoc(doc.id)}
                className={`w-full text-left p-3 rounded-lg text-xs transition-all cursor-pointer flex items-center justify-between ${
                  selectedDoc === doc.id
                    ? 'bg-[#242838] border border-blue-500/40 text-white shadow-xs'
                    : 'bg-[#13151b] border border-[#242735] text-slate-300 hover:text-white hover:bg-[#1a1d26]'
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono text-blue-400 block">{doc.category}</span>
                  <span className="font-semibold block truncate mt-0.5">{doc.title.split(':')[0]}</span>
                  <span className="text-[10px] text-slate-500">{doc.version} · {doc.updated}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>

        {/* Reader (Col 8) */}
        <div className="lg:col-span-8 bg-[#181a22] border border-[#242735] rounded-xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#242735]">
            <div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">{activeDoc.category}</span>
              <h3 className="text-base font-bold text-white mt-0.5">{activeDoc.title}</h3>
              <span className="text-[11px] text-slate-400">Version: {activeDoc.version} · Last Approved: {activeDoc.updated}</span>
            </div>
          </div>

          <div className="prose prose-invert prose-xs max-w-none text-slate-300 space-y-3 leading-relaxed">
            {activeDoc.content.split('\n\n').map((paragraph, i) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h4 key={i} className="text-sm font-bold text-blue-400 pt-2 border-b border-[#242735] pb-1">
                    {paragraph.replace('### ', '')}
                  </h4>
                );
              }
              if (paragraph.startsWith('- ')) {
                return (
                  <ul key={i} className="list-disc pl-5 space-y-1 text-xs text-slate-300">
                    {paragraph.split('\n').map((li, j) => (
                      <li key={j}>{li.replace('- ', '')}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={i} className="text-xs text-slate-300">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
