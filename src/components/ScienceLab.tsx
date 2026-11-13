import React, { useMemo, useState } from 'react';
import { AlertTriangle, FlaskConical, Play, RotateCcw } from 'lucide-react';

type LabId =
  | 'optics'
  | 'circuit'
  | 'magnetism'
  | 'reactions'
  | 'ph_scale'
  | 'human_eye'
  | 'body_systems';

const LAB_LIST: Array<{ id: LabId; title: string; chapter: string }> = [
  { id: 'optics', title: 'Reflection & Refraction', chapter: 'Ch 9 · Physics' },
  { id: 'circuit', title: "Ohm's Law & Circuits", chapter: 'Ch 11 · Physics' },
  { id: 'magnetism', title: 'Magnetic Field & Solenoid', chapter: 'Ch 12 · Physics' },
  { id: 'reactions', title: 'Chemical Reactions Studio', chapter: 'Ch 1 · Chemistry' },
  { id: 'ph_scale', title: 'pH Scale & Indicators', chapter: 'Ch 2 · Chemistry' },
  { id: 'human_eye', title: 'Human Eye & Defects', chapter: 'Ch 10 · Physics' },
  { id: 'body_systems', title: 'Human Body Systems', chapter: 'Ch 5–6 · Biology' },
];

export const ScienceLab: React.FC = () => {
  const [activeLab, setActiveLab] = useState<LabId>('optics');

  // 1. Optics State
  const [opticsMode, setOpticsMode] = useState<'concave_mirror' | 'convex_lens' | 'refraction'>('concave_mirror');
  const [objectDist, setObjectDist] = useState<number>(30); // magnitude in cm
  const [focalLen, setFocalLen] = useState<number>(15);
  const [incidentAngle, setIncidentAngle] = useState<number>(40);
  const [refractiveIndex, setRefractiveIndex] = useState<number>(1.5);

  // 2. Ohm's Law & Circuit State
  const [voltage, setVoltage] = useState<number>(12);
  const [r1, setR1] = useState<number>(6);
  const [r2, setR2] = useState<number>(12);
  const [circuitType, setCircuitType] = useState<'series' | 'parallel'>('parallel');

  // 3. Magnetic Field State
  const [coilCurrent, setCoilCurrent] = useState<number>(4);
  const [coilTurns, setCoilTurns] = useState<number>(6);
  const [reversePolarity, setReversePolarity] = useState<boolean>(false);

  // 4. Chemical Reactions State
  const [reactionIndex, setReactionIndex] = useState<number>(0);
  const [reactionTriggered, setReactionTriggered] = useState<boolean>(true);

  // 5. pH Scale State
  const [phValue, setPhValue] = useState<number>(7.0);

  // 6. Human Eye State
  const [eyeCondition, setEyeCondition] = useState<'normal' | 'myopia' | 'hypermetropia'>('myopia');
  const [useCorrectiveLens, setUseCorrectiveLens] = useState<boolean>(false);

  // 7. Body Systems State
  const [bodySystem, setBodySystem] = useState<'circulation' | 'nephron' | 'reflex'>('circulation');
  const [systemStage, setSystemStage] = useState<number>(1);

  // Optics Math
  const opticsReadout = useMemo(() => {
    if (opticsMode === 'refraction') {
      const sinI = Math.sin((incidentAngle * Math.PI) / 180);
      const sinR = Math.min(1, sinI / refractiveIndex);
      const rDeg = (Math.asin(sinR) * 180) / Math.PI;
      return {
        label: `Angle of Refraction r = ${rDeg.toFixed(1)}°`,
        detail: `n = sin(${incidentAngle}°) / sin(${rDeg.toFixed(1)}°) = ${refractiveIndex.toFixed(2)}. Light bends ${refractiveIndex > 1 ? 'toward' : 'away from'} the normal.`,
        rDeg,
      };
    }

    const u = -objectDist;
    const f = opticsMode === 'concave_mirror' ? -focalLen : focalLen;
    let v: number;
    if (opticsMode === 'concave_mirror') {
      // 1/v = 1/f - 1/u
      const invV = 1 / f - 1 / u;
      v = Math.abs(invV) < 0.0001 ? 9999 : 1 / invV;
      const m = -v / u;
      const isVirtual = v > 0;
      return {
        label: Math.abs(v) > 500 ? 'Image at Infinity (∞)' : `v = ${v.toFixed(1)} cm · m = ${m.toFixed(2)}`,
        detail: Math.abs(v) > 500 ? 'Object is at Focus F; reflected rays emerge parallel.' : `${isVirtual ? 'Virtual & Erect (behind mirror)' : 'Real & Inverted (in front of mirror)'}, ${Math.abs(m) > 1 ? 'Enlarged' : Math.abs(m) < 0.99 ? 'Diminished' : 'Same Size'}.`,
        v,
        m,
      };
    } else {
      // Lens: 1/v = 1/f + 1/u
      const invV = 1 / f + 1 / u;
      v = Math.abs(invV) < 0.0001 ? 9999 : 1 / invV;
      const m = v / u;
      const isVirtual = v < 0;
      return {
        label: Math.abs(v) > 500 ? 'Image at Infinity (∞)' : `v = ${v.toFixed(1)} cm · m = ${m.toFixed(2)}`,
        detail: Math.abs(v) > 500 ? 'Object at F₁; refracted rays emerge parallel.' : `${isVirtual ? 'Virtual & Erect (same side)' : 'Real & Inverted (opposite side)'}, Lens Power P = ${(100 / f).toFixed(2)} D.`,
        v,
        m,
      };
    }
  }, [opticsMode, objectDist, focalLen, incidentAngle, refractiveIndex]);

  // Circuit Math
  const circuitReadout = useMemo(() => {
    const req = circuitType === 'series' ? r1 + r2 : (r1 * r2) / (r1 + r2);
    const current = voltage / req;
    const power = voltage * current;
    return { req, current, power };
  }, [voltage, r1, r2, circuitType]);

  // Chemical Reactions Data
  const REACTIONS = [
    {
      name: 'Single Displacement: Iron + Copper Sulphate',
      equation: 'Fe(s) + CuSO₄(aq) → FeSO₄(aq) + Cu(s)',
      beforeColor: '#2563EB',
      afterColor: '#6EE7B7',
      precipitate: 'Reddish-brown Cu deposits on nail',
      explanation: 'Iron is higher than copper in the reactivity series, displacing Cu²⁺ ions from blue CuSO₄ into pale green FeSO₄.',
    },
    {
      name: 'Double Displacement: Precipitation of BaSO₄',
      equation: 'Na₂SO₄(aq) + BaCl₂(aq) → BaSO₄(s)↓ + 2NaCl(aq)',
      beforeColor: '#E2E8F0',
      afterColor: '#F8FAFC',
      precipitate: 'Insoluble white BaSO₄ precipitate settles',
      explanation: 'Mutual exchange of Ba²⁺ and SO₄²⁻ ions forms an immediate white precipitate.',
    },
    {
      name: 'Thermal Decomposition: Ferrous Sulphate',
      equation: '2FeSO₄(s) —(Heat)→ Fe₂O₃(s) + SO₂(g) + SO₃(g)',
      beforeColor: '#86EFAC',
      afterColor: '#991B1B',
      precipitate: 'Reddish-brown Fe₂O₃ + pungent SO₂/SO₃ gas',
      explanation: 'Heating green FeSO₄ crystals drives out water and splits the salt into ferric oxide and sulphur oxides.',
    },
  ];
  const currentReaction = REACTIONS[reactionIndex];

  // pH Substance Info
  const phInfo = useMemo(() => {
    const colorMap = [
      '#DC2626', '#EA580C', '#F97316', '#F59E0B', '#EAB308', '#A3E635', '#4ADE80',
      '#16A34A', '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1', '#7C3AED', '#5B21B6',
    ];
    const idx = Math.min(14, Math.max(0, Math.round(phValue)));
    const nature = phValue < 6.8 ? 'Acidic' : phValue > 7.2 ? 'Basic / Alkaline' : 'Neutral';
    const litmus = phValue < 7 ? 'Turns Blue Litmus Red' : phValue > 7 ? 'Turns Red Litmus Blue' : 'No Change on Litmus';
    const example =
      phValue <= 2 ? 'Gastric Juice / Dilute HCl'
      : phValue <= 3.5 ? 'Lemon Juice / Vinegar'
      : phValue <= 6.5 ? 'Black Coffee / Rainwater'
      : phValue <= 7.4 ? 'Pure Water / Human Blood'
      : phValue <= 9.5 ? 'Baking Soda Solution'
      : phValue <= 11.5 ? 'Milk of Magnesia (Antacid)'
      : 'Concentrated NaOH';
    return { color: colorMap[idx], nature, litmus, example };
  }, [phValue]);

  const currentMeta = useMemo(() => {
    switch (activeLab) {
      case 'optics':
        return {
          instructions: 'Choose mirror, lens, or slab mode and drag sliders to observe image position, orientation, and Snell bending.',
          explanation: 'Spherical mirrors obey 1/v + 1/u = 1/f while thin lenses obey 1/v - 1/u = 1/f. Refractive index n = sin i / sin r determines bending.',
          outcome: 'Predict real vs virtual image formation and apply Cartesian sign conventions accurately.',
        };
      case 'circuit':
        return {
          instructions: 'Switch between Series and Parallel wiring and adjust battery voltage V and resistors R₁, R₂.',
          explanation: 'In series, total resistance adds (Rₛ = R₁ + R₂) reducing current. In parallel, reciprocal resistances sum (Rₚ < R₁, R₂), raising current and power P = VI.',
          outcome: 'Verify Ohm’s Law V = IR and compare household parallel wiring vs series circuits.',
        };
      case 'magnetism':
        return {
          instructions: 'Adjust coil current, number of turns, and polarity to observe internal uniform field strength and pole reversal.',
          explanation: 'Inside a solenoid, magnetic field lines are parallel and proportional to current I and turns N. Reversing current flips North and South poles.',
          outcome: 'Apply Right-Hand Thumb Rule and explain how electromagnets are controlled.',
        };
      case 'reactions':
        return {
          instructions: 'Select an NCERT chemical reaction and click Run Reaction to observe colour shift, gas evolution, or precipitate formation.',
          explanation: 'Atoms are conserved across every balanced chemical equation while chemical bonds rearrange to form new products.',
          outcome: 'Distinguish single displacement, double displacement precipitation, and thermal decomposition.',
        };
      case 'ph_scale':
        return {
          instructions: 'Drag the pH slider from 0 to 14 or select everyday solutions to inspect indicator colour and ion balance.',
          explanation: 'Every 1-unit drop in pH multiplies [H₃O⁺] concentration tenfold. Antacids neutralise excess stomach HCl.',
          outcome: 'Interpret universal indicator colours and relate pH to digestion, soil, and tooth decay.',
        };
      case 'human_eye':
        return {
          instructions: 'Toggle between Normal Eye, Myopia, and Hypermetropia, then apply the corrective lens.',
          explanation: 'Myopia focuses distant light in front of the retina (fixed by diverging concave lens); hypermetropia focuses behind the retina (fixed by converging convex lens).',
          outcome: 'Visualise accommodation defects and select positive vs negative dioptre lenses.',
        };
      case 'body_systems':
        return {
          instructions: 'Switch between Heart Double Circulation, Nephron Filtration, and Spinal Reflex Arc and step through stages.',
          explanation: 'Human systems separate oxygenated/deoxygenated blood via 4 chambers, filter urea via nephrons, and protect tissues via spinal reflex arcs.',
          outcome: 'Trace physiological pathways accurately for Class 10 Biology board diagrams.',
        };
    }
  }, [activeLab]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
            Interactive Virtual Apparatus · Safe Educational Simulations
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
            Virtual Science Lab
          </h1>
        </div>
      </div>

      {/* Lab Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {LAB_LIST.map((lab) => (
          <button
            key={lab.id}
            type="button"
            onClick={() => setActiveLab(lab.id)}
            className={`rounded-lg border px-3.5 py-2 text-left transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeLab === lab.id
                ? 'border-blue-500 bg-blue-600 text-white'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:border-slate-400'
            }`}
          >
            <div className="text-xs font-semibold">{lab.title}</div>
            <div className={`text-[10px] ${activeLab === lab.id ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
              {lab.chapter}
            </div>
          </button>
        ))}
      </div>

      {/* Two-Zone Sandbox Layout (Left Visual Stage + Right Control Deck) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Interactive Stage */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-5 space-y-4">
          {activeLab === 'optics' && (
            <>
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-semibold">Optical Bench Stage</span>
                <span className="font-mono text-xs text-blue-600 dark:text-blue-400 tabular-nums">
                  {opticsReadout.label}
                </span>
              </div>
              <div className="rounded-lg bg-slate-950 border border-slate-800 p-3">
                {opticsMode === 'refraction' ? (
                  <svg viewBox="0 0 440 240" className="w-full h-60">
                    <rect x="0" y="120" width="440" height="120" fill="#1E293B" fillOpacity="0.65" />
                    <line x1="0" y1="120" x2="440" y2="120" stroke="#38BDF8" strokeWidth="1.5" />
                    <line x1="220" y1="15" x2="220" y2="225" stroke="#94A3B8" strokeDasharray="4 4" strokeWidth="1" />
                    {(() => {
                      const radI = (incidentAngle * Math.PI) / 180;
                      const radR = (opticsReadout.rDeg! * Math.PI) / 180;
                      const x1 = 220 - 110 * Math.sin(radI);
                      const y1 = 120 - 110 * Math.cos(radI);
                      const x2 = 220 + 110 * Math.sin(radR);
                      const y2 = 120 + 110 * Math.cos(radR);
                      return (
                        <>
                          <line x1={x1} y1={y1} x2="220" y2="120" stroke="#F59E0B" strokeWidth="3" />
                          <line x1="220" y1="120" x2={x2} y2={y2} stroke="#10B981" strokeWidth="3" />
                        </>
                      );
                    })()}
                    <text x="16" y="26" fontSize="11" fill="#E2E8F0">Air (n₁ = 1.00)</text>
                    <text x="16" y="226" fontSize="11" fill="#38BDF8">Medium (n₂ = {refractiveIndex.toFixed(2)})</text>
                  </svg>
                ) : (
                  <svg viewBox="0 0 440 240" className="w-full h-60">
                    <line x1="15" y1="120" x2="425" y2="120" stroke="#475569" strokeDasharray="4 4" />
                    {/* Optical Element at x=240 (mirror) or x=220 (lens) */}
                    {opticsMode === 'concave_mirror' ? (
                      <path d="M 330 35 Q 360 120 330 205" fill="none" stroke="#3B82F6" strokeWidth="4" />
                    ) : (
                      <path d="M 220 30 Q 242 120 220 210 Q 198 120 220 30 Z" fill="#3B82F6" fillOpacity="0.25" stroke="#3B82F6" strokeWidth="2.5" />
                    )}
                    {(() => {
                      const originX = opticsMode === 'concave_mirror' ? 342 : 220;
                      const scale = 3.2;
                      const objX = Math.max(25, originX - objectDist * scale);
                      const fPx = focalLen * scale;
                      const imgV = opticsReadout.v || 0;
                      const imgX = Math.min(415, Math.max(25, originX + (opticsMode === 'concave_mirror' ? imgV * scale : imgV * scale)));
                      const m = Math.max(-2.2, Math.min(2.2, opticsReadout.m || 1));
                      const imgTopY = 120 - 42 * m;
                      return (
                        <>
                          {/* Object */}
                          <line x1={objX} y1="120" x2={objX} y2="78" stroke="#10B981" strokeWidth="3" />
                          <polygon points={`${objX},72 ${objX - 4},81 ${objX + 4},81`} fill="#10B981" />
                          {/* Rays */}
                          <line x1={objX} y1="78" x2={originX} y2="78" stroke="#F59E0B" strokeWidth="1.8" />
                          {Math.abs(imgV) < 300 && (
                            <>
                              <line x1={originX} y1="78" x2={imgX} y2={imgTopY} stroke="#F59E0B" strokeWidth="1.8" />
                              <line x1={objX} y1="78" x2={imgX} y2={imgTopY} stroke="#8B5CF6" strokeWidth="1.5" />
                              <line x1={imgX} y1="120" x2={imgX} y2={imgTopY} stroke="#EF4444" strokeWidth="3" />
                            </>
                          )}
                          <circle cx={originX - fPx} cy="120" r="3" fill="#94A3B8" />
                          <text x={originX - fPx - 4} y="135" fontSize="10" fill="#94A3B8">F</text>
                        </>
                      );
                    })()}
                  </svg>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">{opticsReadout.detail}</p>
            </>
          )}

          {activeLab === 'circuit' && (
            <>
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-semibold">Live Circuit & V–I Graph</span>
                <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 tabular-nums">
                  I = {circuitReadout.current.toFixed(2)} A · R_eq = {circuitReadout.req.toFixed(2)} Ω
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-lg bg-slate-950 border border-slate-800 p-3">
                  <svg viewBox="0 0 240 200" className="w-full h-48">
                    <rect x="35" y="35" width="170" height="130" fill="none" stroke="#64748B" strokeWidth="2" rx="4" />
                    {circuitType === 'series' ? (
                      <>
                        <rect x="65" y="23" width="46" height="24" fill="#0F172A" stroke="#3B82F6" strokeWidth="2" rx="3" />
                        <text x="88" y="39" textAnchor="middle" fontSize="10" fill="#93C5FD">{r1}Ω</text>
                        <rect x="130" y="23" width="46" height="24" fill="#0F172A" stroke="#8B5CF6" strokeWidth="2" rx="3" />
                        <text x="153" y="39" textAnchor="middle" fontSize="10" fill="#C4B5FD">{r2}Ω</text>
                      </>
                    ) : (
                      <>
                        <path d="M 75 35 L 75 18 L 165 18 L 165 35" fill="none" stroke="#64748B" strokeWidth="2" />
                        <path d="M 75 35 L 75 56 L 165 56 L 165 35" fill="none" stroke="#64748B" strokeWidth="2" />
                        <rect x="97" y="8" width="46" height="20" fill="#0F172A" stroke="#3B82F6" strokeWidth="2" rx="3" />
                        <text x="120" y="21" textAnchor="middle" fontSize="10" fill="#93C5FD">{r1}Ω</text>
                        <rect x="97" y="46" width="46" height="20" fill="#0F172A" stroke="#8B5CF6" strokeWidth="2" rx="3" />
                        <text x="120" y="59" textAnchor="middle" fontSize="10" fill="#C4B5FD">{r2}Ω</text>
                      </>
                    )}
                    <circle cx="120" cy="165" r="18" fill="#0F172A" stroke="#F59E0B" strokeWidth="2" />
                    <text x="120" y="169" textAnchor="middle" fontSize="11" fill="#FCD34D">{voltage}V</text>
                    <circle cx="205" cy="100" r="16" fill="#0F172A" stroke="#10B981" strokeWidth="2" />
                    <text x="205" y="104" textAnchor="middle" fontSize="10" fill="#34D399">{circuitReadout.current.toFixed(1)}A</text>
                  </svg>
                </div>

                {/* V-I Ohm Graph */}
                <div className="rounded-lg bg-slate-950 border border-slate-800 p-3">
                  <svg viewBox="0 0 240 200" className="w-full h-48">
                    <line x1="35" y1="165" x2="215" y2="165" stroke="#94A3B8" strokeWidth="1.5" />
                    <line x1="35" y1="20" x2="35" y2="165" stroke="#94A3B8" strokeWidth="1.5" />
                    <line
                      x1="35"
                      y1="165"
                      x2={Math.min(210, 35 + circuitReadout.current * 28)}
                      y2={Math.max(25, 165 - voltage * 5.2)}
                      stroke="#3B82F6"
                      strokeWidth="3"
                    />
                    <circle
                      cx={Math.min(210, 35 + circuitReadout.current * 28)}
                      cy={Math.max(25, 165 - voltage * 5.2)}
                      r="4.5"
                      fill="#10B981"
                    />
                    <text x="125" y="186" textAnchor="middle" fontSize="10" fill="#CBD5E1">Current I (A)</text>
                    <text x="15" y="95" textAnchor="middle" fontSize="10" fill="#CBD5E1" transform="rotate(-90 15 95)">Voltage V</text>
                  </svg>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs tabular-nums">
                <div className="rounded-lg bg-slate-100 dark:bg-slate-800/70 p-2.5">
                  R_eq: {circuitReadout.req.toFixed(2)} Ω
                </div>
                <div className="rounded-lg bg-slate-100 dark:bg-slate-800/70 p-2.5">
                  Current: {circuitReadout.current.toFixed(2)} A
                </div>
                <div className="rounded-lg bg-slate-100 dark:bg-slate-800/70 p-2.5">
                  Power: {circuitReadout.power.toFixed(1)} W
                </div>
              </div>
            </>
          )}

          {activeLab === 'magnetism' && (
            <>
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-semibold">Solenoid Magnetic Field Visualizer</span>
                <span className="font-mono text-xs text-blue-500 tabular-nums">
                  Relative Field Strength: {(coilCurrent * coilTurns).toFixed(0)} units
                </span>
              </div>
              <div className="rounded-lg bg-slate-950 border border-slate-800 p-4">
                <svg viewBox="0 0 420 200" className="w-full h-52">
                  {Array.from({ length: coilTurns }).map((_, idx) => {
                    const x = 110 + idx * (190 / Math.max(1, coilTurns - 1));
                    return (
                      <ellipse key={idx} cx={x} cy="100" rx="10" ry="38" fill="none" stroke="#F59E0B" strokeWidth="2.5" />
                    );
                  })}
                  <line x1="50" y1="86" x2="370" y2="86" stroke="#3B82F6" strokeWidth={1 + coilCurrent * 0.25} />
                  <line x1="50" y1="100" x2="370" y2="100" stroke="#3B82F6" strokeWidth={1 + coilCurrent * 0.25} />
                  <line x1="50" y1="114" x2="370" y2="114" stroke="#3B82F6" strokeWidth={1 + coilCurrent * 0.25} />
                  <path d="M 305 62 C 350 15, 70 15, 110 62" fill="none" stroke="#60A5FA" strokeDasharray="5 3" strokeWidth="1.5" />
                  <path d="M 305 138 C 350 185, 70 185, 110 138" fill="none" stroke="#60A5FA" strokeDasharray="5 3" strokeWidth="1.5" />
                  <text x="64" y="76" fontSize="14" fontWeight="bold" fill={reversePolarity ? '#EF4444' : '#10B981'}>
                    {reversePolarity ? 'N' : 'S'}
                  </text>
                  <text x="348" y="76" fontSize="14" fontWeight="bold" fill={reversePolarity ? '#10B981' : '#EF4444'}>
                    {reversePolarity ? 'S' : 'N'}
                  </text>
                </svg>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Field lines inside the solenoid are uniform and parallel. Reversing DC polarity swaps the North and South poles immediately.
              </p>
            </>
          )}

          {activeLab === 'reactions' && (
            <>
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-semibold">{currentReaction.name}</span>
              </div>
              <div className="rounded-lg bg-slate-950 border border-slate-800 p-6 flex flex-col items-center gap-4">
                <div className="flex items-center justify-center gap-10">
                  <div className="text-center space-y-2">
                    <div className="text-[11px] text-slate-400">Before Mixing</div>
                    <div
                      className="w-20 h-24 rounded-b-xl border-2 border-slate-500 mx-auto transition-colors"
                      style={{ backgroundColor: currentReaction.beforeColor }}
                    />
                  </div>
                  <div className="text-slate-400 font-mono text-lg">→</div>
                  <div className="text-center space-y-2">
                    <div className="text-[11px] text-slate-400">Observed Product State</div>
                    <div
                      className="w-20 h-24 rounded-b-xl border-2 border-slate-500 mx-auto flex items-end justify-center p-1 transition-all duration-500"
                      style={{
                        backgroundColor: reactionTriggered
                          ? currentReaction.afterColor
                          : currentReaction.beforeColor,
                      }}
                    >
                      {reactionTriggered && (
                        <div className="w-full h-3 rounded-b bg-amber-700/80" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="font-mono text-sm text-emerald-400 text-center">
                  {currentReaction.equation}
                </div>
                <div className="text-xs text-slate-300 text-center">
                  {reactionTriggered ? currentReaction.precipitate : 'Click Run Reaction to observe transformation'}
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">{currentReaction.explanation}</p>
            </>
          )}

          {activeLab === 'ph_scale' && (
            <>
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-semibold">Universal Indicator Lab</span>
                <span className="font-mono text-sm font-bold tabular-nums" style={{ color: phInfo.color }}>
                  pH {phValue.toFixed(1)} · {phInfo.nature}
                </span>
              </div>
              <div className="rounded-lg bg-slate-950 border border-slate-800 p-6 space-y-5">
                <div className="flex items-center justify-center gap-6">
                  <div
                    className="w-24 h-28 rounded-b-2xl border-2 border-slate-600 transition-colors duration-200 flex items-center justify-center text-white font-mono font-bold text-lg shadow-inner"
                    style={{ backgroundColor: phInfo.color }}
                  >
                    {phValue.toFixed(1)}
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-200">
                    <div><span className="text-slate-400">Sample Match:</span> {phInfo.example}</div>
                    <div><span className="text-slate-400">Litmus Test:</span> {phInfo.litmus}</div>
                    <div><span className="text-slate-400">Relative [H₃O⁺]:</span> 10^(-{phValue.toFixed(1)}) mol/L</div>
                  </div>
                </div>
                <div className="grid grid-cols-[repeat(15,minmax(0,1fr))] gap-1 h-4 rounded overflow-hidden">
                  {['#DC2626','#EA580C','#F97316','#F59E0B','#EAB308','#A3E635','#4ADE80','#16A34A','#14B8A6','#06B6D4','#0EA5E9','#3B82F6','#6366F1','#7C3AED','#5B21B6'].map((c, idx) => (
                    <div key={idx} style={{ backgroundColor: c }} className="h-full" />
                  ))}
                </div>
              </div>
            </>
          )}

          {activeLab === 'human_eye' && (
            <>
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-semibold">Retinal Focus Simulator</span>
                <span className="text-xs font-medium text-blue-500">
                  {eyeCondition === 'normal'
                    ? 'Sharp Focus on Retina'
                    : useCorrectiveLens
                    ? 'Corrected onto Retina'
                    : eyeCondition === 'myopia'
                    ? 'Focuses IN FRONT of Retina'
                    : 'Focuses BEHIND Retina'}
                </span>
              </div>
              <div className="rounded-lg bg-slate-950 border border-slate-800 p-4">
                <svg viewBox="0 0 420 200" className="w-full h-52">
                  <ellipse cx="265" cy="100" rx="95" ry="64" fill="none" stroke="#CBD5E1" strokeWidth="2.5" />
                  <ellipse cx="195" cy="100" rx="10" ry="30" fill="#3B82F6" fillOpacity="0.3" stroke="#3B82F6" strokeWidth="2" />
                  {useCorrectiveLens && eyeCondition === 'myopia' && (
                    <path d="M 125 60 Q 137 100 125 140 L 143 140 Q 131 100 143 60 Z" fill="#38BDF8" fillOpacity="0.3" stroke="#38BDF8" strokeWidth="1.5" />
                  )}
                  {useCorrectiveLens && eyeCondition === 'hypermetropia' && (
                    <path d="M 134 60 Q 150 100 134 140 Q 118 100 134 60 Z" fill="#8B5CF6" fillOpacity="0.3" stroke="#8B5CF6" strokeWidth="1.5" />
                  )}
                  {(() => {
                    const focalX =
                      eyeCondition === 'normal' || useCorrectiveLens
                        ? 358
                        : eyeCondition === 'myopia'
                        ? 295
                        : 395;
                    return (
                      <>
                        <line x1="25" y1="80" x2="195" y2="80" stroke="#F59E0B" strokeWidth="2" />
                        <line x1="25" y1="120" x2="195" y2="120" stroke="#F59E0B" strokeWidth="2" />
                        <line x1="195" y1="80" x2={focalX} y2="100" stroke="#F59E0B" strokeWidth="2" />
                        <line x1="195" y1="120" x2={focalX} y2="100" stroke="#F59E0B" strokeWidth="2" />
                        <circle cx={focalX} cy="100" r="4.5" fill={focalX === 358 ? '#10B981' : '#EF4444'} />
                      </>
                    );
                  })()}
                  <text x="355" y="34" fontSize="10" fill="#10B981">Retina</text>
                </svg>
              </div>
            </>
          )}

          {activeLab === 'body_systems' && (
            <>
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-semibold">
                  {bodySystem === 'circulation'
                    ? 'Heart Double Circulation'
                    : bodySystem === 'nephron'
                    ? 'Nephron Ultrafiltration'
                    : 'Spinal Reflex Arc'}
                </span>
                <span className="font-mono text-xs text-blue-500">Stage {systemStage} / 3</span>
              </div>
              <div className="rounded-lg bg-slate-950 border border-slate-800 p-5 space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  {(bodySystem === 'circulation'
                    ? [
                        '1. Right Atrium & Ventricle pump deoxygenated blood to Lungs',
                        '2. Alveoli oxygenate blood & return via Pulmonary Vein',
                        '3. Left Ventricle pumps oxygenated blood via Aorta to Body',
                      ]
                    : bodySystem === 'nephron'
                    ? [
                        '1. Glomerulus filters water, glucose, amino acids & urea',
                        '2. Renal Tubule selectively reabsorbs glucose & needed water',
                        '3. Collecting Duct sends concentrated urine to Ureter',
                      ]
                    : [
                        '1. Skin receptor detects heat & fires Sensory Neuron',
                        '2. Spinal Cord relay neuron routes signal directly',
                        '3. Motor Neuron contracts arm muscle before pain finishes',
                      ]
                  ).map((text, idx) => (
                    <div
                      key={idx}
                      className={`rounded-lg border p-3 text-xs transition-all ${
                        systemStage === idx + 1
                          ? 'border-blue-500 bg-blue-600/20 text-white'
                          : 'border-slate-800 bg-slate-900 text-slate-400'
                      }`}
                    >
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Control & Concept Deck */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 space-y-4">
            <h2 className="font-display text-base font-semibold">Experiment Controls</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{currentMeta.instructions}</p>

            {activeLab === 'optics' && (
              <div className="space-y-4">
                <div className="flex gap-1.5">
                  {[
                    { id: 'concave_mirror' as const, label: 'Concave Mirror' },
                    { id: 'convex_lens' as const, label: 'Convex Lens' },
                    { id: 'refraction' as const, label: 'Snell Slab' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setOpticsMode(m.id)}
                      className={`flex-1 rounded-lg py-1.5 text-xs font-medium cursor-pointer ${
                        opticsMode === m.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {opticsMode === 'refraction' ? (
                  <>
                    <label className="block space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Angle of Incidence (i)</span>
                        <span className="font-mono tabular-nums">{incidentAngle}°</span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={75}
                        value={incidentAngle}
                        onChange={(e) => setIncidentAngle(Number(e.target.value))}
                        className="w-full accent-blue-600"
                      />
                    </label>
                    <label className="block space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Refractive Index (n)</span>
                        <span className="font-mono tabular-nums">{refractiveIndex.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min={1.1}
                        max={2.42}
                        step={0.05}
                        value={refractiveIndex}
                        onChange={(e) => setRefractiveIndex(Number(e.target.value))}
                        className="w-full accent-blue-600"
                      />
                    </label>
                  </>
                ) : (
                  <>
                    <label className="block space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Object Distance |u|</span>
                        <span className="font-mono tabular-nums">{objectDist} cm</span>
                      </div>
                      <input
                        type="range"
                        min={8}
                        max={60}
                        value={objectDist}
                        onChange={(e) => setObjectDist(Number(e.target.value))}
                        className="w-full accent-blue-600"
                      />
                    </label>
                    <label className="block space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Focal Length |f|</span>
                        <span className="font-mono tabular-nums">{focalLen} cm</span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={25}
                        value={focalLen}
                        onChange={(e) => setFocalLen(Number(e.target.value))}
                        className="w-full accent-blue-600"
                      />
                    </label>
                  </>
                )}
              </div>
            )}

            {activeLab === 'circuit' && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  {(['series', 'parallel'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setCircuitType(mode)}
                      className={`flex-1 rounded-lg py-1.5 text-xs font-medium capitalize cursor-pointer ${
                        circuitType === mode
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
                <label className="block space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Battery Voltage (V)</span>
                    <span className="font-mono tabular-nums">{voltage} V</span>
                  </div>
                  <input type="range" min={2} max={24} value={voltage} onChange={(e) => setVoltage(Number(e.target.value))} className="w-full accent-blue-600" />
                </label>
                <label className="block space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Resistor R₁</span>
                    <span className="font-mono tabular-nums">{r1} Ω</span>
                  </div>
                  <input type="range" min={2} max={30} value={r1} onChange={(e) => setR1(Number(e.target.value))} className="w-full accent-blue-600" />
                </label>
                <label className="block space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Resistor R₂</span>
                    <span className="font-mono tabular-nums">{r2} Ω</span>
                  </div>
                  <input type="range" min={2} max={30} value={r2} onChange={(e) => setR2(Number(e.target.value))} className="w-full accent-blue-600" />
                </label>
              </div>
            )}

            {activeLab === 'magnetism' && (
              <div className="space-y-4">
                <label className="block space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Current (I)</span>
                    <span className="font-mono tabular-nums">{coilCurrent} A</span>
                  </div>
                  <input type="range" min={1} max={10} value={coilCurrent} onChange={(e) => setCoilCurrent(Number(e.target.value))} className="w-full accent-blue-600" />
                </label>
                <label className="block space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Solenoid Turns</span>
                    <span className="font-mono tabular-nums">{coilTurns} loops</span>
                  </div>
                  <input type="range" min={4} max={12} value={coilTurns} onChange={(e) => setCoilTurns(Number(e.target.value))} className="w-full accent-blue-600" />
                </label>
                <button
                  type="button"
                  onClick={() => setReversePolarity((p) => !p)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 py-2 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Reverse Battery Polarity
                </button>
              </div>
            )}

            {activeLab === 'reactions' && (
              <div className="space-y-3">
                {REACTIONS.map((rx, idx) => (
                  <button
                    key={rx.name}
                    type="button"
                    onClick={() => {
                      setReactionIndex(idx);
                      setReactionTriggered(false);
                    }}
                    className={`w-full rounded-lg border p-2.5 text-left text-xs cursor-pointer ${
                      reactionIndex === idx
                        ? 'border-blue-500 bg-blue-600/10 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {rx.name}
                  </button>
                ))}
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setReactionTriggered(true)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-2 text-xs font-semibold text-white hover:bg-blue-500 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" /> Run Reaction
                  </button>
                  <button
                    type="button"
                    onClick={() => setReactionTriggered(false)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset
                  </button>
                </div>
              </div>
            )}

            {activeLab === 'ph_scale' && (
              <div className="space-y-4">
                <label className="block space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Solution pH</span>
                    <span className="font-mono tabular-nums">{phValue.toFixed(1)}</span>
                  </div>
                  <input type="range" min={0} max={14} step={0.5} value={phValue} onChange={(e) => setPhValue(Number(e.target.value))} className="w-full accent-blue-600" />
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'Gastric HCl (1.5)', val: 1.5 },
                    { label: 'Lemon (2.5)', val: 2.5 },
                    { label: 'Pure Water (7.0)', val: 7.0 },
                    { label: 'Baking Soda (9.0)', val: 9.0 },
                    { label: 'Antacid (10.5)', val: 10.5 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setPhValue(preset.val)}
                      className="rounded-md border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-[11px] hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeLab === 'human_eye' && (
              <div className="space-y-4">
                <div className="flex gap-1.5">
                  {([
                    { id: 'normal', label: 'Normal' },
                    { id: 'myopia', label: 'Myopia' },
                    { id: 'hypermetropia', label: 'Hypermetropia' },
                  ] as const).map((cond) => (
                    <button
                      key={cond.id}
                      type="button"
                      onClick={() => {
                        setEyeCondition(cond.id);
                        setUseCorrectiveLens(false);
                      }}
                      className={`flex-1 rounded-lg py-1.5 text-xs font-medium cursor-pointer ${
                        eyeCondition === cond.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {cond.label}
                    </button>
                  ))}
                </div>
                {eyeCondition !== 'normal' && (
                  <button
                    type="button"
                    onClick={() => setUseCorrectiveLens((v) => !v)}
                    className="w-full rounded-lg bg-blue-600 py-2 text-xs font-semibold text-white hover:bg-blue-500 cursor-pointer"
                  >
                    {useCorrectiveLens
                      ? 'Remove Corrective Lens'
                      : `Place ${eyeCondition === 'myopia' ? 'Concave (-D)' : 'Convex (+D)'} Lens`}
                  </button>
                )}
              </div>
            )}

            {activeLab === 'body_systems' && (
              <div className="space-y-4">
                <div className="flex gap-1.5">
                  {([
                    { id: 'circulation', label: 'Heart' },
                    { id: 'nephron', label: 'Nephron' },
                    { id: 'reflex', label: 'Reflex Arc' },
                  ] as const).map((sys) => (
                    <button
                      key={sys.id}
                      type="button"
                      onClick={() => {
                        setBodySystem(sys.id);
                        setSystemStage(1);
                      }}
                      className={`flex-1 rounded-lg py-1.5 text-xs font-medium cursor-pointer ${
                        bodySystem === sys.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {sys.label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setSystemStage((s) => (s % 3) + 1)}
                  className="w-full rounded-lg bg-blue-600 py-2 text-xs font-semibold text-white hover:bg-blue-500 cursor-pointer"
                >
                  Step to Next Stage ({systemStage}/3)
                </button>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 space-y-2.5">
            <div className="text-xs font-semibold text-slate-900 dark:text-white">
              Scientific Explanation
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentMeta.explanation}
            </p>
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 pt-1">
              Learning Outcome: <span className="font-normal text-slate-600 dark:text-slate-300">{currentMeta.outcome}</span>
            </div>
            <div className="flex items-start gap-2 rounded-lg bg-amber-500/10 p-2.5 text-[11px] text-amber-800 dark:text-amber-300 mt-2">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>
                Educational simulation only: virtual experiments reinforce NCERT theory and do not replace supervised school science laboratory practicals.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
