import React from 'react';
import { DiagramItem } from '../types';

export const ChapterDiagram: React.FC<{ diagram: DiagramItem }> = ({ diagram }) => {
  const renderSchematic = () => {
    switch (diagram.diagramType) {
      case 'ray_mirror':
        return (
          <svg viewBox="0 0 420 180" className="w-full h-44 text-slate-800 dark:text-slate-200">
            <line x1="20" y1="115" x2="390" y2="115" stroke="currentColor" strokeOpacity="0.4" strokeDasharray="4 4" />
            <path d="M 330 30 Q 360 95 330 160" fill="none" stroke="#3B82F6" strokeWidth="4" />
            <line x1="336" y1="32" x2="344" y2="38" stroke="#64748B" strokeWidth="1.5" />
            <line x1="340" y1="62" x2="348" y2="68" stroke="#64748B" strokeWidth="1.5" />
            <line x1="340" y1="122" x2="348" y2="128" stroke="#64748B" strokeWidth="1.5" />
            {/* Object AB */}
            <line x1="90" y1="115" x2="90" y2="60" stroke="#10B981" strokeWidth="3" />
            <polygon points="90,54 85,64 95,64" fill="#10B981" />
            {/* Rays */}
            <line x1="90" y1="60" x2="342" y2="60" stroke="#F59E0B" strokeWidth="2" />
            <line x1="342" y1="60" x2="180" y2="148" stroke="#F59E0B" strokeWidth="2" />
            <line x1="90" y1="60" x2="338" y2="142" stroke="#8B5CF6" strokeWidth="1.5" />
            <line x1="338" y1="142" x2="170" y2="142" stroke="#8B5CF6" strokeWidth="1.5" />
            {/* Image A'B' */}
            <line x1="196" y1="115" x2="196" y2="140" stroke="#EF4444" strokeWidth="2.5" />
            <circle cx="150" cy="115" r="3" fill="currentColor" />
            <circle cx="245" cy="115" r="3" fill="currentColor" />
            <text x="145" y="132" fontSize="11" fill="currentColor">C</text>
            <text x="241" y="132" fontSize="11" fill="currentColor">F</text>
            <text x="348" y="128" fontSize="11" fill="currentColor">P</text>
            <text x="80" y="48" fontSize="11" fill="#10B981">Object</text>
            <text x="180" y="156" fontSize="11" fill="#EF4444">Image</text>
          </svg>
        );
      case 'ray_lens':
        return (
          <svg viewBox="0 0 420 180" className="w-full h-44 text-slate-800 dark:text-slate-200">
            <line x1="20" y1="95" x2="400" y2="95" stroke="currentColor" strokeOpacity="0.4" strokeDasharray="4 4" />
            <path d="M 210 25 Q 232 95 210 165 Q 188 95 210 25 Z" fill="#3B82F6" fillOpacity="0.18" stroke="#3B82F6" strokeWidth="2.5" />
            <line x1="80" y1="95" x2="80" y2="50" stroke="#10B981" strokeWidth="3" />
            <line x1="80" y1="50" x2="210" y2="50" stroke="#F59E0B" strokeWidth="2" />
            <line x1="210" y1="50" x2="340" y2="140" stroke="#F59E0B" strokeWidth="2" />
            <line x1="80" y1="50" x2="340" y2="140" stroke="#8B5CF6" strokeWidth="1.5" />
            <line x1="330" y1="95" x2="330" y2="136" stroke="#EF4444" strokeWidth="2.5" />
            <text x="140" y="112" fontSize="11" fill="currentColor">F₁</text>
            <text x="275" y="112" fontSize="11" fill="currentColor">F₂</text>
            <text x="204" y="112" fontSize="11" fill="currentColor">O</text>
          </svg>
        );
      case 'prism':
        return (
          <svg viewBox="0 0 420 180" className="w-full h-44 text-slate-800 dark:text-slate-200">
            <polygon points="150,150 215,35 280,150" fill="#3B82F6" fillOpacity="0.14" stroke="#3B82F6" strokeWidth="2.5" />
            <line x1="40" y1="115" x2="178" y2="95" stroke="#F8FAFC" strokeWidth="3" />
            <line x1="40" y1="115" x2="178" y2="95" stroke="#94A3B8" strokeWidth="1" />
            <line x1="178" y1="95" x2="246" y2="85" stroke="#EF4444" strokeWidth="2" />
            <line x1="178" y1="95" x2="256" y2="108" stroke="#8B5CF6" strokeWidth="2" />
            <line x1="246" y1="85" x2="365" y2="95" stroke="#EF4444" strokeWidth="2.5" />
            <line x1="250" y1="94" x2="365" y2="112" stroke="#F59E0B" strokeWidth="2.5" />
            <line x1="253" y1="101" x2="365" y2="128" stroke="#10B981" strokeWidth="2.5" />
            <line x1="256" y1="108" x2="365" y2="146" stroke="#8B5CF6" strokeWidth="2.5" />
            <text x="45" y="102" fontSize="11" fill="currentColor">White Light</text>
            <text x="370" y="98" fontSize="10" fill="#EF4444">Red</text>
            <text x="370" y="150" fontSize="10" fill="#8B5CF6">Violet</text>
          </svg>
        );
      case 'eye':
        return (
          <svg viewBox="0 0 420 180" className="w-full h-44 text-slate-800 dark:text-slate-200">
            <ellipse cx="220" cy="90" rx="100" ry="68" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <path d="M 122 55 Q 98 90 122 125" fill="none" stroke="#38BDF8" strokeWidth="3" />
            <ellipse cx="145" cy="90" rx="10" ry="30" fill="#3B82F6" fillOpacity="0.3" stroke="#3B82F6" strokeWidth="2" />
            <line x1="35" y1="75" x2="145" y2="75" stroke="#F59E0B" strokeWidth="1.5" />
            <line x1="35" y1="105" x2="145" y2="105" stroke="#F59E0B" strokeWidth="1.5" />
            <line x1="145" y1="75" x2="318" y2="90" stroke="#F59E0B" strokeWidth="1.5" />
            <line x1="145" y1="105" x2="318" y2="90" stroke="#F59E0B" strokeWidth="1.5" />
            <circle cx="318" cy="90" r="4" fill="#10B981" />
            <text x="82" y="45" fontSize="10" fill="#38BDF8">Cornea</text>
            <text x="135" y="42" fontSize="10" fill="#3B82F6">Lens</text>
            <text x="295" y="45" fontSize="10" fill="#10B981">Retina</text>
          </svg>
        );
      case 'circuit':
        return (
          <svg viewBox="0 0 420 180" className="w-full h-44 text-slate-800 dark:text-slate-200">
            <rect x="85" y="40" width="250" height="105" fill="none" stroke="currentColor" strokeWidth="2" rx="4" />
            <rect x="165" y="28" width="90" height="24" fill="#0F172A" stroke="#3B82F6" strokeWidth="2" rx="3" />
            <text x="210" y="44" textAnchor="middle" fontSize="11" fill="#60A5FA">Resistor R</text>
            <circle cx="115" cy="40" r="14" fill="#0F172A" stroke="#10B981" strokeWidth="2" />
            <text x="115" y="44" textAnchor="middle" fontSize="12" fill="#34D399">A</text>
            <path d="M 165 40 L 165 82 L 255 82 L 255 40" fill="none" stroke="#8B5CF6" strokeWidth="1.5" />
            <circle cx="210" cy="82" r="14" fill="#0F172A" stroke="#8B5CF6" strokeWidth="2" />
            <text x="210" y="86" textAnchor="middle" fontSize="12" fill="#A78BFA">V</text>
            <rect x="192" y="132" width="36" height="24" fill="#0F172A" stroke="none" />
            <line x1="202" y1="130" x2="202" y2="160" stroke="#F59E0B" strokeWidth="3" />
            <line x1="218" y1="137" x2="218" y2="153" stroke="#F59E0B" strokeWidth="3" />
            <text x="210" y="172" textAnchor="middle" fontSize="10" fill="currentColor">DC Source (+ / -)</text>
          </svg>
        );
      case 'solenoid':
        return (
          <svg viewBox="0 0 420 180" className="w-full h-44 text-slate-800 dark:text-slate-200">
            {[110, 140, 170, 200, 230, 260, 290].map((x) => (
              <ellipse key={x} cx={x} cy="90" rx="10" ry="34" fill="none" stroke="#F59E0B" strokeWidth="2.5" />
            ))}
            <line x1="60" y1="80" x2="360" y2="80" stroke="#3B82F6" strokeWidth="1.8" />
            <line x1="60" y1="90" x2="360" y2="90" stroke="#3B82F6" strokeWidth="1.8" />
            <line x1="60" y1="100" x2="360" y2="100" stroke="#3B82F6" strokeWidth="1.8" />
            <path d="M 300 55 C 340 18, 80 18, 110 55" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="4 3" />
            <path d="M 300 125 C 340 162, 80 162, 110 125" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="4 3" />
            <text x="68" y="72" fontSize="12" fontWeight="bold" fill="#10B981">S</text>
            <text x="342" y="72" fontSize="12" fontWeight="bold" fill="#EF4444">N</text>
          </svg>
        );
      case 'ph_scale':
        return (
          <svg viewBox="0 0 420 140" className="w-full h-36">
            {[
              '#DC2626','#EA580C','#F59E0B','#EAB308','#A3E635','#4ADE80','#22C55E',
              '#10B981','#14B8A6','#06B6D4','#0EA5E9','#3B82F6','#6366F1','#7C3AED','#5B21B6',
            ].map((color, idx) => (
              <g key={idx}>
                <rect x={24 + idx * 25} y="42" width="23" height="42" rx="3" fill={color} />
                <text x={35.5 + idx * 25} y="102" textAnchor="middle" fontSize="10" fill="currentColor">
                  {idx}
                </text>
              </g>
            ))}
            <text x="24" y="28" fontSize="11" fill="#EF4444">Acidic ([H⁺] ↑)</text>
            <text x="200" y="28" textAnchor="middle" fontSize="11" fill="#10B981">Neutral (7)</text>
            <text x="396" y="28" textAnchor="end" fontSize="11" fill="#8B5CF6">Alkaline ([OH⁻] ↑)</text>
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 420 160" className="w-full h-40 text-slate-700 dark:text-slate-300">
            <rect x="30" y="24" width="110" height="44" rx="8" fill="#3B82F6" fillOpacity="0.14" stroke="#3B82F6" strokeWidth="2" />
            <rect x="160" y="24" width="110" height="44" rx="8" fill="#8B5CF6" fillOpacity="0.14" stroke="#8B5CF6" strokeWidth="2" />
            <rect x="290" y="24" width="105" height="44" rx="8" fill="#10B981" fillOpacity="0.14" stroke="#10B981" strokeWidth="2" />
            <line x1="140" y1="46" x2="160" y2="46" stroke="currentColor" strokeWidth="2" />
            <line x1="270" y1="46" x2="290" y2="46" stroke="currentColor" strokeWidth="2" />
            <text x="85" y="50" textAnchor="middle" fontSize="10" fill="currentColor">
              {diagram.labels[0] || 'Stage 1'}
            </text>
            <text x="215" y="50" textAnchor="middle" fontSize="10" fill="currentColor">
              {diagram.labels[1] || 'Stage 2'}
            </text>
            <text x="342" y="50" textAnchor="middle" fontSize="10" fill="currentColor">
              {diagram.labels[2] || 'Stage 3'}
            </text>
            <text x="210" y="112" textAnchor="middle" fontSize="11" fill="currentColor" opacity="0.8">
              {diagram.labels.join('  →  ')}
            </text>
          </svg>
        );
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-5 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h4 className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100">
          {diagram.title}
        </h4>
        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
          NCERT Schematic
        </span>
      </div>
      <div className="rounded-lg bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 p-3">
        {renderSchematic()}
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-300">{diagram.caption}</p>
      <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        {diagram.labels.map((lbl, idx) => (
          <span key={lbl}>
            {idx > 0 && <span className="mr-2">·</span>}
            {lbl}
          </span>
        ))}
      </div>
      <div className="rounded-lg bg-blue-600/10 px-3 py-2 text-xs text-blue-700 dark:text-blue-300">
        Board Exam Tip: {diagram.examTip}
      </div>
    </div>
  );
};
