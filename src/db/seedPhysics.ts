import { ChapterSeed } from './seedChemistry.ts';

export const physicsChapters: ChapterSeed[] = [
  {
    subjectSlug: 'physics',
    chapterNumber: 9,
    slug: 'light-reflection-and-refraction',
    title: 'Light – Reflection and Refraction',
    unitName: 'Unit III: Natural Phenomena',
    unitWeightage: 12,
    introduction:
      'Light travels along straight-line rays and interacts with mirrors and lenses to form images in telescopes, headlights, and cameras. This chapter covers spherical mirrors, refraction through glass slabs, Snell’s law, mirror and lens formulas, New Cartesian Sign Convention, magnification, and lens power.',
    objectives: [
      'State laws of reflection and draw accurate ray diagrams for concave and convex mirrors across all object positions.',
      'Apply the New Cartesian Sign Convention, mirror formula, and magnification formula to numerical problems.',
      'Explain refraction, refractive index, Snell’s law, and lateral displacement in a rectangular glass slab.',
      'Draw ray diagrams for convex and concave lenses and calculate lens power in dioptres.',
    ],
    ncertTerminology: [
      { term: 'Principal Focus (F)', definition: 'Point on the principal axis where rays parallel to the axis converge (or appear to diverge from) after reflection/refraction.' },
      { term: 'Refractive Index (n)', definition: 'Ratio of speed of light in vacuum/air (c) to speed of light in the medium (v): n = c / v.' },
      { term: 'Power of a Lens (P)', definition: 'Degree of convergence or divergence of light rays, equal to the reciprocal of focal length in metres (P = 1/f).' },
      { term: 'Real vs Virtual Image', definition: 'A real image can be obtained on a screen (inverted); a virtual image cannot be caught on a screen (erect).' },
    ],
    formulas: [
      { name: 'Radius & Focal Length', expression: 'R = 2f', variables: 'R = radius of curvature, f = focal length', unit: 'm or cm' },
      { name: 'Mirror Formula', expression: '1/v + 1/u = 1/f', variables: 'u = object distance (always negative), v = image distance, f = focal length', unit: 'cm⁻¹' },
      { name: 'Mirror Magnification', expression: 'm = hᵢ/hₒ = -v/u', variables: 'm < 0 for real/inverted, m > 0 for virtual/erect' },
      { name: 'Snell’s Law of Refraction', expression: 'sin i / sin r = n₂₁ = n₂ / n₁', variables: 'i = angle of incidence, r = angle of refraction' },
      { name: 'Lens Formula', expression: '1/v - 1/u = 1/f', variables: 'f > 0 for convex lens, f < 0 for concave lens' },
      { name: 'Lens Magnification', expression: 'm = hᵢ/hₒ = v/u', variables: 'Positive for virtual/erect, negative for real/inverted' },
      { name: 'Power of Lens', expression: 'P = 1 / f (in metres)', variables: '1 Dioptre (D) = 1 m⁻¹; combined power P = P₁ + P₂', unit: 'Dioptre (D)' },
    ],
    chemicalEquations: [],
    solvedExamples: [
      {
        problem: 'An object 4 cm high is placed at 25 cm in front of a concave mirror of focal length 15 cm. Find the position, nature, and size of the image.',
        given: 'hₒ = +4 cm, u = -25 cm, f = -15 cm (concave mirror).',
        solutionSteps: [
          'Use mirror formula: 1/v + 1/u = 1/f → 1/v = 1/(-15) - 1/(-25) = -1/15 + 1/25.',
          'Take LCM (75): 1/v = (-5 + 3)/75 = -2/75 → v = -37.5 cm (in front of mirror).',
          'Magnification m = -v/u = -(-37.5)/(-25) = -1.5.',
          'Image height hᵢ = m × hₒ = -1.5 × 4 = -6.0 cm.',
        ],
        answer: 'Image forms at 37.5 cm in front of the mirror; Real, Inverted, and Enlarged (6.0 cm tall).',
      },
      {
        problem: 'Find the power of a concave lens of focal length 2 m.',
        given: 'f = -2 m (concave lens).',
        solutionSteps: [
          'Power P = 1 / f(m) = 1 / (-2).',
        ],
        answer: 'P = -0.5 D.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Mixing up the signs in the Mirror Formula (1/v + 1/u = 1/f) and Lens Formula (1/v - 1/u = 1/f).',
        correction: 'Mirror uses PLUS (+); Lens uses MINUS (-), and mirror magnification has a negative sign (-v/u) whereas lens magnification is +v/u.',
      },
      {
        mistake: 'Forgetting to convert focal length from cm to metres before calculating Power in dioptres.',
        correction: 'Always divide by 100 (or use P = 100 / f_cm) when focal length is given in centimetres.',
      },
    ],
    quickRevisionNotes: [
      'Concave mirror forms enlarged virtual image only when object is between P and F (used in shaving/dentist mirrors).',
      'Convex mirror always produces a diminished, virtual, erect image with wider field of view (used in rear-view mirrors).',
      'Light bends toward the normal when entering an optically denser medium and away from normal in a rarer medium.',
      'Diamond has the highest natural refractive index (n = 2.42), meaning light travels at c/2.42 inside it.',
    ],
    topics: [
      {
        slug: 'spherical-mirrors-and-ray-diagrams',
        title: 'Spherical Mirrors, Ray Rules & Mirror Formula',
        estimatedMinutes: 18,
        frequentlyTested: true,
        explanation:
          'Spherical mirrors are sections of hollow spheres: concave mirrors curve inward (converging) while convex mirrors bulge outward (diverging). Standard ray rules trace rays parallel to principal axis, passing through focus F, passing through centre of curvature C, and striking pole P obliquely. Under the New Cartesian Sign Convention, the pole/optical centre is the origin, incident light moves left-to-right, distances opposite to incident light are negative (so u is always negative), and upward heights are positive.',
        importantDefinitions: [
          { term: 'Aperture', meaning: 'Effective diameter of the reflecting surface of a spherical mirror.' },
          { term: 'Magnification', meaning: 'Ratio of image height to object height indicating enlargement and orientation.' },
        ],
        realLifeExamples: [
          'Solar furnaces concentrate sunlight onto a crucible placed at the principal focus of a large concave mirror.',
          'Convex rear-view mirrors give drivers a wider upright field of view behind vehicles.',
        ],
        keyConcepts: [
          'Concave mirror f < 0; Convex mirror f > 0.',
          'm = -1 means same-sized real inverted image (object at C, i.e., u = -2f).',
        ],
        summaryCard: 'Mirror: 1/v + 1/u = 1/f and m = -v/u; always apply Cartesian signs before substituting values.',
      },
      {
        slug: 'refraction-lenses-and-power',
        title: 'Refraction, Refractive Index, Lenses & Power',
        estimatedMinutes: 18,
        frequentlyTested: true,
        explanation:
          'Refraction occurs because light changes speed across transparent media. In a parallel-sided glass slab, emergent rays stay parallel to incident rays with a lateral shift. Spherical lenses form real or virtual images governed by 1/v - 1/u = 1/f. A convex lens converges light (positive power) while a concave lens diverges light (negative power).',
        importantDefinitions: [
          { term: 'Optical Centre (O)', meaning: 'Central point of a lens through which light rays pass without any deviation.' },
          { term: '1 Dioptre', meaning: 'Power of a lens whose focal length is exactly 1 metre.' },
        ],
        realLifeExamples: [
          'A pencil partially dipped in water appears bent at the air-water interface due to refraction.',
          'Opticians prescribe combined lens powers additively: P = P₁ + P₂.',
        ],
        keyConcepts: [
          'No bending occurs if light strikes normally (i = 0°) or if both media have identical refractive index.',
          'Convex lens forms magnified virtual image when object is placed within focal length (magnifying glass).',
        ],
        summaryCard: 'Lens: 1/v - 1/u = 1/f, m = v/u, P = 1/f(m); convex = +P, concave = -P.',
      },
    ],
    diagrams: [
      {
        title: 'Concave Mirror Ray Diagram',
        caption: 'Object beyond C forms a real, inverted, diminished image between F and C.',
        diagramType: 'ray_mirror',
        labels: ['Object (AB)', 'Focus (F)', 'Centre of Curvature (C)', 'Pole (P)', 'Real Image (A’B’)'],
        examTip: 'Always draw arrowheads on BOTH incident and reflected rays—missing arrows lose diagram marks in CBSE board grading.',
      },
      {
        title: 'Convex Lens Ray Diagram',
        caption: 'Ray parallel to principal axis refracts through F₂; ray through optical centre O passes undeviated.',
        diagramType: 'ray_lens',
        labels: ['2F₁', 'F₁', 'Optical Centre (O)', 'F₂', '2F₂'],
        examTip: 'Show refraction happening at the vertical midline inside a thin lens.',
      },
    ],
  },
  {
    subjectSlug: 'physics',
    chapterNumber: 10,
    slug: 'the-human-eye-and-the-colourful-world',
    title: 'The Human Eye and the Colourful World',
    unitName: 'Unit III: Natural Phenomena',
    unitWeightage: 12,
    introduction:
      'The human eye adjusts its crystalline lens thickness to focus objects from 25 cm to infinity. Beyond vision defects and optical correction, this chapter explores prism dispersion, rainbows, atmospheric refraction (twinkling stars, early sunrise), and Tyndall scattering (blue sky).',
    objectives: [
      'Identify parts of the human eye and explain power of accommodation, near point (25 cm), and far point (infinity).',
      'Diagnose myopia, hypermetropia, and presbyopia, draw defect/correction ray diagrams, and compute corrective lens power.',
      'Explain refraction and dispersion of white light through a glass prism and rainbow formation.',
      'Account for atmospheric refraction phenomena and Tyndall/Rayleigh scattering of light.',
    ],
    ncertTerminology: [
      { term: 'Power of Accommodation', definition: 'Ability of the eye lens to adjust its focal length via ciliary muscles to focus near and distant objects sharply on the retina.' },
      { term: 'Least Distance of Distinct Vision', definition: 'Minimum distance (25 cm for a normal young adult eye) at which objects are seen clearly without strain.' },
      { term: 'Dispersion', definition: 'Splitting of white light into its seven constituent colours (VIBGYOR) upon passing through a prism.' },
      { term: 'Tyndall Effect', definition: 'Scattering of a light beam by colloidal particles in its path, making the beam visible.' },
    ],
    formulas: [
      { name: 'Myopia Correction Focal Length', expression: 'f = -(Far point distance)', variables: 'Concave lens needed so object at ∞ forms virtual image at defective far point' },
      { name: 'Hypermetropia Correction', expression: '1/f = 1/v - 1/u', variables: 'u = -25 cm (normal near point), v = -(defective near point); convex lens needed' },
    ],
    chemicalEquations: [],
    solvedExamples: [
      {
        problem: 'A myopic person cannot see distinctly beyond 1.2 m. What is the nature and power of the corrective lens required?',
        given: 'Object at u = -∞, desired virtual image at far point v = -1.2 m.',
        solutionSteps: [
          'Using lens formula: 1/f = 1/v - 1/u = 1/(-1.2) - 1/(-∞) = -1/1.2.',
          'Focal length f = -1.2 m (concave lens).',
          'Power P = 1 / f = -1 / 1.2 = -0.83 D.',
        ],
        answer: 'Concave lens of power -0.83 D.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Saying stars twinkle due to variations in star light output.',
        correction: 'Stars are point sources whose apparent position and brightness fluctuate continuously due to atmospheric refraction through turbulent air layers.',
      },
      {
        mistake: 'Swapping the corrective lenses for myopia and hypermetropia.',
        correction: 'Myopia (near-sightedness, image before retina) → Concave lens (-D). Hypermetropia (far-sightedness, image behind retina) → Convex lens (+D).',
      },
    ],
    quickRevisionNotes: [
      'Iris controls pupil size; ciliary muscles change eye-lens curvature; retina converts light into electrical signals via rods and cones.',
      'Violet bends most and red bends least in a prism because glass slows violet light more than red light.',
      'Newton’s double inverted prism experiment proved sunlight consists of seven colours that recombine into white light.',
      'Planets do not twinkle because they act as extended collections of many point-sized light sources whose variations average to zero.',
      'Danger signals are red because red has the longest wavelength and is scattered least by fog or smoke.',
    ],
    topics: [
      {
        slug: 'human-eye-and-vision-defects',
        title: 'Human Eye Structure, Accommodation & Defects',
        estimatedMinutes: 15,
        frequentlyTested: true,
        explanation:
          'Light enters through the transparent cornea, passes the pupil regulated by the iris, and is focused by the flexible crystalline lens onto the light-sensitive retina. When ciliary muscles relax, the lens thins (larger focal length) for distant viewing; when they contract, it thickens for near objects. Myopia arises from excessive lens curvature or eyeball elongation (corrected by concave lens); hypermetropia arises from too long focal length or short eyeball (corrected by convex lens); presbyopia occurs with ageing (corrected by bifocal lenses).',
        importantDefinitions: [
          { term: 'Cataract', meaning: 'Medical condition where the crystalline lens becomes milky and cloudy in old age, restored via surgery.' },
          { term: 'Presbyopia', meaning: 'Age-related loss of accommodation due to weakening ciliary muscles and reduced lens flexibility.' },
        ],
        realLifeExamples: [
          'Entering a dimly lit cinema from bright sunlight takes seconds as the iris dilates the pupil.',
          'Bifocal spectacles place a concave upper segment for distant boards and convex lower segment for reading books.',
        ],
        keyConcepts: [
          'Image formed on the retina is real and inverted; the brain interprets it upright.',
          'Normal range of vision: 25 cm to infinity.',
        ],
        summaryCard: 'Myopia → Concave (-D); Hypermetropia → Convex (+D); Presbyopia → Bifocal.',
      },
      {
        slug: 'prism-atmospheric-refraction-scattering',
        title: 'Prism Dispersion, Atmospheric Refraction & Scattering',
        estimatedMinutes: 15,
        frequentlyTested: true,
        explanation:
          'A triangular glass prism bends light twice toward its base and disperses white light into VIBGYOR. Water droplets act like tiny prisms to create rainbows opposite the Sun via refraction, dispersion, and internal reflection. Atmospheric refraction makes stars appear slightly higher, causes twinkling, and extends daylight by ~4 minutes (2 min advance sunrise + 2 min delayed sunset). Fine atmospheric molecules scatter short blue wavelengths strongly, making the sky blue from Earth and black to astronauts in space.',
        importantDefinitions: [
          { term: 'Angle of Deviation (D)', meaning: 'Angle between the incident ray and the final emergent ray exiting a prism.' },
          { term: 'Spectrum', meaning: 'Band of seven coloured components obtained when white light disperses.' },
        ],
        realLifeExamples: [
          'Sunlight streaming through a dusty classroom window or forest canopy shows the Tyndall effect.',
          'Without Earth’s atmosphere, the daytime sky would look completely dark.',
        ],
        keyConcepts: [
          'Rainbow always forms in the direction opposite to the Sun.',
          'Shorter wavelengths (blue/violet) scatter much more than longer red wavelengths.',
        ],
        summaryCard: 'Prism splits VIBGYOR; atmosphere bends starlight (twinkling/4-min longer day); fine air scatters blue light.',
      },
    ],
    diagrams: [
      {
        title: 'Human Eye Cross-Section & Defect Correction',
        caption: 'Shows cornea, iris, pupil, crystalline lens, ciliary muscles, retina, and optic nerve.',
        diagramType: 'eye',
        labels: ['Cornea', 'Iris & Pupil', 'Crystalline Lens', 'Ciliary Muscles', 'Retina', 'Optic Nerve'],
        examTip: 'When sketching myopia vs hypermetropia, show clearly whether rays meet IN FRONT OF or BEHIND the retina before adding the corrective lens.',
      },
      {
        title: 'Dispersion of White Light by a Glass Prism',
        caption: 'Red deviates least (top) and Violet deviates most (bottom) due to wavelength-dependent refractive index.',
        diagramType: 'prism',
        labels: ['White Light Incident Ray', 'Angle of Prism (A)', 'Red (Least Deviation)', 'Violet (Most Deviation)'],
        examTip: 'Place Red at the top and Violet at the bottom of the emergent spectrum.',
      },
    ],
  },
  {
    subjectSlug: 'physics',
    chapterNumber: 11,
    slug: 'electricity',
    title: 'Electricity',
    unitName: 'Unit IV: Effects of Current',
    unitWeightage: 13,
    introduction:
      'Electricity powers modern lighting, transport, and computing. This chapter builds quantitative mastery over electric charge, current, potential difference, Ohm’s law, resistivity, series and parallel resistor networks, Joule’s law of heating, electric power, and kilowatt-hour energy billing.',
    objectives: [
      'Relate charge, current, time, potential difference, and work done with proper SI units.',
      'Verify Ohm’s law (V = IR) and explain factors affecting resistance and resistivity (ρ).',
      'Derive and solve equivalent resistance, current, and voltage problems for series and parallel circuits.',
      'Calculate Joule heating (H = I²Rt), electric power (P = VI), and household energy cost in kWh.',
    ],
    ncertTerminology: [
      { term: '1 Ampere', definition: 'Flow of 1 coulomb of electric charge per second through a conductor cross-section.' },
      { term: '1 Volt', definition: '1 joule of work done in moving 1 coulomb of positive charge between two points.' },
      { term: 'Resistivity (ρ)', definition: 'Intrinsic property of a material equal to resistance of a unit length and unit cross-sectional area (SI unit: Ω·m).' },
      { term: '1 Kilowatt-Hour (kWh)', definition: 'Commercial unit of electrical energy equal to 3.6 × 10⁶ joules (1 Unit on electricity meters).' },
    ],
    formulas: [
      { name: 'Charge & Electrons', expression: 'Q = n · e', variables: 'e = 1.6 × 10⁻¹⁹ C; 1 C ≈ 6.25 × 10¹⁸ electrons', unit: 'Coulomb (C)' },
      { name: 'Electric Current', expression: 'I = Q / t', variables: 'Measured by ammeter connected in series', unit: 'Ampere (A)' },
      { name: 'Potential Difference', expression: 'V = W / Q', variables: 'Measured by high-resistance voltmeter connected in parallel', unit: 'Volt (V)' },
      { name: 'Ohm’s Law', expression: 'V = I · R', variables: 'At constant temperature, R = V / I', unit: 'Ohm (Ω)' },
      { name: 'Resistance & Resistivity', expression: 'R = ρ · (L / A)', variables: 'Proportional to length L, inversely proportional to area A', unit: 'Ω (ρ in Ω·m)' },
      { name: 'Series Combination', expression: 'Rₛ = R₁ + R₂ + R₃', variables: 'Current I is same; total V splits across resistors' },
      { name: 'Parallel Combination', expression: '1/Rₚ = 1/R₁ + 1/R₂ + 1/R₃', variables: 'Voltage V is same; total I splits across branches' },
      { name: 'Joule Heating & Power', expression: 'H = I²Rt = VIt ; P = VI = I²R = V²/R', variables: 'Power in Watts; Energy E = P × t', unit: 'Joule (J) / Watt (W)' },
    ],
    chemicalEquations: [],
    solvedExamples: [
      {
        problem: 'Three resistors of 5 Ω, 10 Ω, and 30 Ω are connected in parallel across a 12 V battery. Find total resistance and total current.',
        given: 'R₁ = 5 Ω, R₂ = 10 Ω, R₃ = 30 Ω, V = 12 V.',
        solutionSteps: [
          '1/Rₚ = 1/5 + 1/10 + 1/30 = (6 + 3 + 1)/30 = 10/30 = 1/3.',
          'Therefore, equivalent resistance Rₚ = 3 Ω.',
          'Total current I = V / Rₚ = 12 / 3 = 4 A.',
        ],
        answer: 'Rₚ = 3 Ω, Total Current = 4 A.',
      },
      {
        problem: 'An electric refrigerator rated 400 W operates 8 hours/day. What is the cost of energy to operate it for 30 days at ₹3.00 per kWh?',
        given: 'P = 400 W = 0.4 kW, t = 8 h/day × 30 days = 240 h.',
        solutionSteps: [
          'Total Energy E = P × t = 0.4 kW × 240 h = 96 kWh.',
          'Total Cost = 96 × ₹3.00 = ₹288.00.',
        ],
        answer: '₹288.00 (96 units).',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Forgetting to invert 1/Rₚ at the final step of parallel resistance calculations.',
        correction: 'After summing 1/R₁ + 1/R₂, always take the reciprocal to get Rₚ, and verify Rₚ is smaller than the smallest individual resistor.',
      },
      {
        mistake: 'Stretching a wire to double its length and assuming resistance only doubles.',
        correction: 'When a wire is stretched to 2L with constant volume, its cross-sectional area halves (A/2), so R becomes 4 times!',
      },
    ],
    quickRevisionNotes: [
      'Conventional current flows from positive to negative terminal (opposite to electron flow).',
      'Alloys like nichrome have higher resistivity than pure metals and do not oxidise readily at high temperature—ideal for heating elements.',
      'Tungsten (melting point 3380 °C) is used for bulb filaments; bulbs are filled with inert N₂/Ar gas.',
      'Domestic appliances are wired in parallel so each gets full 220 V, operates independently, and total circuit resistance stays low.',
    ],
    topics: [
      {
        slug: 'ohms-law-and-resistance',
        title: 'Current, Potential Difference, Ohm’s Law & Resistivity',
        estimatedMinutes: 16,
        frequentlyTested: true,
        explanation:
          'Electric current is charge flow per second driven by potential difference maintained by a cell. Ohm’s law states V ∝ I at constant temperature, yielding a straight-line V–I graph whose slope gives resistance (or I–V graph slope = 1/R). Resistance increases with conductor length, decreases with cross-sectional area, depends on temperature, and varies strongly by material resistivity ρ.',
        importantDefinitions: [
          { term: 'Rheostat', meaning: 'Variable resistor used to regulate circuit current without altering source voltage.' },
          { term: 'Ohmic Conductor', meaning: 'Conductor whose V–I graph is linear through the origin at constant temperature.' },
        ],
        realLifeExamples: [
          'Copper and aluminium power lines use low resistivity (~10⁻⁸ Ω·m) to minimise transmission losses.',
          'A 100 W bulb has lower resistance than a 40 W bulb at the same 220 V rating (R = V²/P).',
        ],
        keyConcepts: [
          'Resistivity ρ depends ONLY on material and temperature—never on wire length or thickness.',
          'Ammeter is always in series (low resistance); voltmeter is in parallel (high resistance).',
        ],
        summaryCard: 'V = IR and R = ρL/A; resistivity is material-specific while resistance depends on dimensions.',
      },
      {
        slug: 'circuit-combinations-heating-and-power',
        title: 'Series/Parallel Circuits, Joule Heating & Power',
        estimatedMinutes: 16,
        frequentlyTested: true,
        explanation:
          'In series circuits, total resistance equals the sum of individual resistances and failure of one component breaks the whole loop. In parallel circuits, reciprocal resistances sum, each branch gets full supply voltage, and appliances run independently. Current flowing through resistance generates heat H = I²Rt—applied usefully in irons, toasters, and safety fuses (low melting-point Pb-Sn alloy wired in series with the live wire).',
        importantDefinitions: [
          { term: 'Electric Fuse', meaning: 'Safety device that melts and breaks the circuit when current exceeds a safe rated value.' },
          { term: 'Electric Power', meaning: 'Rate at which electrical energy is dissipated or consumed in a circuit (P = VI).' },
        ],
        realLifeExamples: [
          'A 1000 W electric iron on a 220 V line draws I = 1000/220 ≈ 4.54 A, requiring a 5 A fuse.',
          'Festive fairy lights in series go out completely if one bulb fuses.',
        ],
        keyConcepts: [
          'Total series R > largest R; total parallel R < smallest R.',
          '1 kWh = 3.6 × 10⁶ Joules.',
        ],
        summaryCard: 'Series shares I; Parallel shares V; H = I²Rt; 1 kWh = 3.6 × 10⁶ J.',
      },
    ],
    diagrams: [
      {
        title: 'Ohm’s Law Verification Circuit',
        caption: 'Series ammeter, parallel voltmeter across resistor R, rheostat, key, and battery.',
        diagramType: 'circuit',
        labels: ['Battery & Key', 'Rheostat (Rh)', 'Ammeter (Series)', 'Resistor (R)', 'Voltmeter (Parallel)'],
        examTip: 'Ensure + terminal of ammeter and voltmeter connect toward the positive terminal of the battery.',
      },
    ],
  },
  {
    subjectSlug: 'physics',
    chapterNumber: 12,
    slug: 'magnetic-effects-of-electric-current',
    title: 'Magnetic Effects of Electric Current',
    unitName: 'Unit IV: Effects of Current',
    unitWeightage: 13,
    introduction:
      'Oersted discovered in 1820 that electric currents create magnetic fields, uniting electricity and magnetism. This chapter covers magnetic field lines, Right-Hand Thumb Rule, circular loops and solenoids, electromagnets, Fleming’s Left-Hand Rule for force on a conductor, AC vs DC, and safe domestic electric circuits.',
    objectives: [
      'Draw and state properties of magnetic field lines around a bar magnet, straight wire, circular loop, and solenoid.',
      'Apply the Right-Hand Thumb Rule and Fleming’s Left-Hand Rule to find field and force directions.',
      'Explain how a solenoid creates a uniform internal field and forms an electromagnet.',
      'Distinguish alternating current (AC) from direct current (DC) and describe domestic live, neutral, and earth wiring, overloading, and short-circuiting.',
    ],
    ncertTerminology: [
      { term: 'Magnetic Field Lines', definition: 'Closed continuous curves tangent to the magnetic field direction, emerging from North and entering South outside a magnet.' },
      { term: 'Solenoid', definition: 'Long cylindrical coil of many circular turns of insulated copper wire producing a bar-magnet-like field when carrying current.' },
      { term: 'Electromagnet', definition: 'Temporary strong magnet formed by placing a soft iron core inside a current-carrying solenoid.' },
      { term: 'Short Circuiting', definition: 'Fault occurring when bare live and neutral wires touch directly, dropping resistance near zero and causing dangerously high current.' },
    ],
    formulas: [],
    chemicalEquations: [],
    solvedExamples: [
      {
        problem: 'An electron enters a magnetic field at right angles from left to right, and the magnetic field is directed vertically downward. What is the direction of force on the electron?',
        given: 'Electron motion: Left → Right; Magnetic field (B): Downward.',
        solutionSteps: [
          'Conventional current direction is OPPOSITE to electron motion, so Current (I) is Right → Left.',
          'Apply Fleming’s Left-Hand Rule: Forefinger (Field B) points downward, Middle finger (Current I) points left.',
          'The Thumb (Force) points OUT OF THE PAGE toward the observer.',
        ],
        answer: 'Out of the page (toward the viewer).',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Using electron direction instead of conventional current direction in Fleming’s Left-Hand Rule.',
        correction: 'Positive alpha/proton motion = current direction; negative electron motion = opposite to current direction.',
      },
      {
        mistake: 'Saying magnetic field lines intersect each other.',
        correction: 'Two field lines NEVER intersect because at an intersection point a compass needle would have to point in two directions simultaneously, which is impossible.',
      },
    ],
    quickRevisionNotes: [
      'Inside a magnet or solenoid, field lines run from South pole to North pole, forming closed loops; inside a solenoid they are parallel and uniform.',
      'Magnetic field strength around a straight wire increases with current (I) and decreases with distance (r); in a loop it increases with number of turns (n).',
      'Maximum force acts on a current-carrying conductor when current and magnetic field are perpendicular (90°); zero force when parallel.',
      'In India, domestic AC supply is 220 V at 50 Hz (reverses direction 100 times per second).',
      'Colour code: Live = Red (220 V), Neutral = Black (0 V), Earth = Green (safety leakage path).',
    ],
    topics: [
      {
        slug: 'magnetic-fields-and-solenoid',
        title: 'Magnetic Field Lines, Right-Hand Thumb Rule & Solenoid',
        estimatedMinutes: 15,
        frequentlyTested: true,
        explanation:
          'A magnetic field has both magnitude and direction; closer field lines indicate stronger field (strongest near magnet poles). Holding a current-carrying straight conductor in your right hand with the thumb pointing along current shows fingers curling along concentric magnetic field lines. Coiling wire into a solenoid concentrates and aligns the field inside into nearly uniform parallel lines, turning a soft iron core into a controllable electromagnet.',
        importantDefinitions: [
          { term: 'Right-Hand Thumb Rule', meaning: 'Thumb points along current; curled fingers indicate direction of magnetic field lines.' },
          { term: 'Permanent vs Electromagnet', meaning: 'Electromagnets have adjustable strength and reversible poles; permanent magnets keep fixed polarity.' },
        ],
        realLifeExamples: [
          'Scrapyard electromagnetic cranes lift tonnes of iron scrap and release it by switching off current.',
          'MRI scanners and loudspeaker coils rely on controlled electromagnetism.',
        ],
        keyConcepts: [
          'Clock face rule: clockwise current face acts as South pole; anticlockwise acts as North pole.',
          'Soft iron core demagnetises easily when current stops, whereas steel retains magnetism.',
        ],
        summaryCard: 'Right-Hand Thumb Rule maps field around currents; solenoids create uniform fields and electromagnets.',
      },
      {
        slug: 'force-on-conductor-and-domestic-circuits',
        title: 'Force on Conductor (Fleming’s Left-Hand Rule) & Domestic Circuits',
        estimatedMinutes: 15,
        frequentlyTested: true,
        explanation:
          'A current-carrying conductor placed in an external magnetic field experiences a mechanical force perpendicular to both current and field—described by Fleming’s Left-Hand Rule (Thumb = Force/Motion, Forefinger = Field, Middle = Current). At home, electricity enters via main fuse and meter into parallel 5 A (lighting) and 15 A (heavy appliances) circuits. Earthing connects metallic appliance bodies to the ground so leakage current trips the fuse instead of shocking users.',
        importantDefinitions: [
          { term: 'Overloading', meaning: 'Drawing excess current beyond circuit wire capacity by connecting too many high-power appliances to one socket or voltage surge.' },
          { term: 'Earthing', meaning: 'Low-resistance green safety wire connecting metallic appliance casings to a buried metal plate in Earth.' },
        ],
        realLifeExamples: [
          'Alternating Current (AC) travels long distances efficiently across power grids with minimal energy loss compared to DC.',
          'Electric fuses and MCBs sit on the Live wire before appliances to cut high voltage immediately during faults.',
        ],
        keyConcepts: [
          'Fleming’s Left-Hand Rule: F (Thumb) – B (Forefinger) – I (Middle finger) mutually perpendicular.',
          'Live-to-Neutral potential difference in India = 220 V, frequency = 50 Hz.',
        ],
        summaryCard: 'Left-Hand Rule gives force direction; domestic circuits use parallel 220 V/50 Hz wiring with fuse & earth safety.',
      },
    ],
    diagrams: [
      {
        title: 'Magnetic Field Around a Current-Carrying Solenoid',
        caption: 'Parallel uniform field lines inside the solenoid and bar-magnet-like loops outside.',
        diagramType: 'solenoid',
        labels: ['North Pole', 'South Pole', 'Uniform Internal Field Lines', 'DC Source & Key'],
        examTip: 'Show parallel equidistant lines inside the solenoid to explicitly indicate a uniform magnetic field.',
      },
    ],
  },
];
