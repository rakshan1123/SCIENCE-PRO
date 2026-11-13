export interface ChapterSeed {
  subjectSlug: 'physics' | 'chemistry' | 'biology';
  chapterNumber: number;
  slug: string;
  title: string;
  unitName: string;
  unitWeightage: number;
  introduction: string;
  objectives: string[];
  ncertTerminology: Array<{ term: string; definition: string }>;
  formulas: Array<{ name: string; expression: string; variables: string; unit?: string }>;
  chemicalEquations: Array<{ title: string; equation: string; type: string; notes: string }>;
  solvedExamples: Array<{ problem: string; given: string; solutionSteps: string[]; answer: string }>;
  commonMistakes: Array<{ mistake: string; correction: string }>;
  quickRevisionNotes: string[];
  topics: Array<{
    slug: string;
    title: string;
    estimatedMinutes: number;
    frequentlyTested: boolean;
    explanation: string;
    importantDefinitions: Array<{ term: string; meaning: string }>;
    realLifeExamples: string[];
    keyConcepts: string[];
    summaryCard: string;
  }>;
  diagrams: Array<{
    title: string;
    caption: string;
    diagramType: string;
    labels: string[];
    examTip: string;
  }>;
}

export const chemistryChapters: ChapterSeed[] = [
  {
    subjectSlug: 'chemistry',
    chapterNumber: 1,
    slug: 'chemical-reactions-and-equations',
    title: 'Chemical Reactions and Equations',
    unitName: 'Unit I: Chemical Substances – Nature and Behaviour',
    unitWeightage: 25,
    introduction:
      'Every day we observe transformations such as milk turning sour, iron rusting in humid air, or food being digested. This chapter introduces how chemical changes are represented symbolically through balanced chemical equations, why mass is conserved, and how reactions are classified into combination, decomposition, displacement, double displacement, and redox processes.',
    objectives: [
      'Identify chemical changes using observable indicators such as gas evolution, precipitate formation, colour change, and temperature change.',
      'Write and balance chemical equations following the Law of Conservation of Mass.',
      'Classify chemical reactions into combination, decomposition, displacement, double displacement, precipitation, and oxidation-reduction (redox).',
      'Explain corrosion and rancidity in everyday life and methods used to prevent them.',
    ],
    ncertTerminology: [
      { term: 'Skeletal Chemical Equation', definition: 'An unbalanced chemical equation showing only the formulas of reactants and products.' },
      { term: 'Balanced Chemical Equation', definition: 'An equation where the number of atoms of each element is identical on both reactant and product sides.' },
      { term: 'Precipitate', definition: 'An insoluble solid substance formed when two aqueous solutions react.' },
      { term: 'Exothermic Reaction', definition: 'A reaction that releases heat energy along with the formation of products.' },
      { term: 'Endothermic Reaction', definition: 'A reaction that absorbs energy in the form of heat, light, or electricity.' },
      { term: 'Redox Reaction', definition: 'A reaction in which one reactant gets oxidised while another gets reduced simultaneously.' },
    ],
    formulas: [],
    chemicalEquations: [
      {
        title: 'Burning of Magnesium Ribbon',
        equation: '2Mg(s) + O₂(g) → 2MgO(s)',
        type: 'Combination & Oxidation',
        notes: 'Burns with a dazzling white flame forming white powder magnesium oxide. Ribbon is cleaned with sandpaper to remove the basic magnesium carbonate layer.',
      },
      {
        title: 'Slaking of Lime',
        equation: 'CaO(s) + H₂O(l) → Ca(OH)₂(aq) + Heat',
        type: 'Exothermic Combination',
        notes: 'Quick lime reacts vigorously with water to produce slaked lime used for whitewashing walls.',
      },
      {
        title: 'Thermal Decomposition of Ferrous Sulphate',
        equation: '2FeSO₄(s) —(Heat)→ Fe₂O₃(s) + SO₂(g) + SO₃(g)',
        type: 'Thermal Decomposition',
        notes: 'Pale green crystals lose water of crystallisation and decompose into reddish-brown ferric oxide with the smell of burning sulphur.',
      },
      {
        title: 'Thermal Decomposition of Lead Nitrate',
        equation: '2Pb(NO₃)₂(s) —(Heat)→ 2PbO(s) + 4NO₂(g) + O₂(g)',
        type: 'Thermal Decomposition',
        notes: 'Produces yellow lead(II) oxide residue and brown fumes of nitrogen dioxide.',
      },
      {
        title: 'Photolytic Decomposition of Silver Chloride',
        equation: '2AgCl(s) —(Sunlight)→ 2Ag(s) + Cl₂(g)',
        type: 'Photochemical Decomposition',
        notes: 'White silver chloride turns grey in sunlight; used in black-and-white photography.',
      },
      {
        title: 'Iron Nail in Copper Sulphate Solution',
        equation: 'Fe(s) + CuSO₄(aq) → FeSO₄(aq) + Cu(s)',
        type: 'Single Displacement',
        notes: 'Blue solution fades to pale green and a brownish copper coating deposits on the iron nail.',
      },
      {
        title: 'Precipitation of Barium Sulphate',
        equation: 'Na₂SO₄(aq) + BaCl₂(aq) → BaSO₄(s)↓ + 2NaCl(aq)',
        type: 'Double Displacement / Precipitation',
        notes: 'Forms an immediate white insoluble precipitate of barium sulphate.',
      },
      {
        title: 'Redox Reaction of Copper Oxide with Hydrogen',
        equation: 'CuO(s) + H₂(g) —(Heat)→ Cu(s) + H₂O(l)',
        type: 'Redox Reaction',
        notes: 'CuO is reduced to Cu (oxidising agent); H₂ is oxidised to H₂O (reducing agent).',
      },
    ],
    solvedExamples: [
      {
        problem: 'Balance the chemical equation: Fe(s) + H₂O(g) → Fe₃O₄(s) + H₂(g).',
        given: 'Reactants: Fe, H₂O; Products: Fe₃O₄, H₂.',
        solutionSteps: [
          'Count atoms on both sides: Left has 1 Fe, 2 H, 1 O; Right has 3 Fe, 2 H, 4 O.',
          'Start with oxygen (highest count in Fe₃O₄): place coefficient 4 before H₂O → Fe + 4H₂O → Fe₃O₄ + H₂.',
          'Balance hydrogen atoms: left now has 8 H, so place 4 before H₂ → Fe + 4H₂O → Fe₃O₄ + 4H₂.',
          'Balance iron atoms: right has 3 Fe, so place 3 before Fe → 3Fe(s) + 4H₂O(g) → Fe₃O₄(s) + 4H₂(g).',
        ],
        answer: '3Fe(s) + 4H₂O(g) → Fe₃O₄(s) + 4H₂(g)',
      },
      {
        problem: 'Identify the substance oxidised, substance reduced, oxidising agent, and reducing agent in: MnO₂ + 4HCl → MnCl₂ + 2H₂O + Cl₂.',
        given: 'Equation: MnO₂ + 4HCl → MnCl₂ + 2H₂O + Cl₂.',
        solutionSteps: [
          'HCl loses hydrogen to form Cl₂, so HCl is oxidised to Cl₂.',
          'MnO₂ loses oxygen to form MnCl₂, so MnO₂ is reduced to MnCl₂.',
          'The substance getting reduced (MnO₂) acts as the oxidising agent; HCl acts as the reducing agent.',
        ],
        answer: 'Oxidised: HCl; Reduced: MnO₂; Oxidising agent: MnO₂; Reducing agent: HCl.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Changing subscripts inside chemical formulas while balancing (e.g., turning H₂O into H₂O₂).',
        correction: 'Always place stoichiometric coefficients in front of formulas; never alter chemical subscripts.',
      },
      {
        mistake: 'Confusing the oxidising agent with the substance that gets oxidised.',
        correction: 'The oxidising agent supplies oxygen or removes hydrogen and therefore gets reduced itself.',
      },
      {
        mistake: 'Forgetting state symbols ((s), (l), (g), (aq)) and reaction conditions (Heat, Sunlight) in board answers.',
        correction: 'Include physical states and conditions above the reaction arrow for full CBSE marking-scheme credit.',
      },
    ],
    quickRevisionNotes: [
      'A chemical reaction is confirmed by change in state, colour, temperature, gas evolution, or precipitate formation.',
      'Respiration is an exothermic process because glucose reacts with oxygen inside cells to release energy.',
      'All decomposition reactions require external energy (heat, light, or electricity) and are generally endothermic.',
      'In whitewashing, Ca(OH)₂ reacts slowly with atmospheric CO₂ over 2–3 days to form a shiny layer of CaCO₃.',
      'Chips packets are flushed with unreactive nitrogen gas to prevent oxidation of fats and oils (rancidity).',
    ],
    topics: [
      {
        slug: 'balancing-chemical-equations',
        title: 'Chemical Equations & Balancing',
        estimatedMinutes: 12,
        frequentlyTested: true,
        explanation:
          'A chemical equation represents reactants transforming into products using symbols and formulas. According to the Law of Conservation of Mass, matter can neither be created nor destroyed in a chemical reaction, so the total number of atoms of each element on the reactant side must equal that on the product side. Using the hit-and-trial method, we adjust coefficients in front of formulas—starting with the compound containing the largest number of atoms—and then add physical states: (s), (l), (g), and (aq).',
        importantDefinitions: [
          { term: 'Reactants', meaning: 'Substances that undergo chemical change, written on the left-hand side of the arrow.' },
          { term: 'Products', meaning: 'New substances formed during the reaction, written on the right-hand side.' },
        ],
        realLifeExamples: [
          'Lighting a kitchen LPG stove converts butane/propane with oxygen into carbon dioxide and water vapour.',
          'Cleaning a magnesium ribbon before burning removes the protective MgCO₃ layer so pure Mg reacts with O₂.',
        ],
        keyConcepts: [
          'Total mass of reactants equals total mass of products.',
          'Coefficients multiply the entire formula; subscripts belong to the molecule identity.',
        ],
        summaryCard: 'Balance by adjusting front coefficients only; verify atom counts and add state symbols.',
      },
      {
        slug: 'types-of-chemical-reactions',
        title: 'Types of Chemical Reactions',
        estimatedMinutes: 15,
        frequentlyTested: true,
        explanation:
          'Reactions are grouped into five major types: (1) Combination—two or more reactants form a single product (e.g., CaO + H₂O → Ca(OH)₂); (2) Decomposition—a single reactant breaks down via heat (thermal), electricity (electrolytic), or sunlight (photolytic); (3) Displacement—a more reactive element displaces a less reactive element from its salt solution; (4) Double Displacement—mutual exchange of ions between two aqueous compounds, often forming a precipitate; and (5) Redox—simultaneous oxidation and reduction.',
        importantDefinitions: [
          { term: 'Thermal Decomposition', meaning: 'Breakdown of a single compound into simpler substances on heating.' },
          { term: 'Double Displacement', meaning: 'Reaction involving exchange of ions between two reacting compounds.' },
        ],
        realLifeExamples: [
          'Electrolysis of water produces H₂ at the cathode and O₂ at the anode in a 2:1 volume ratio.',
          'Adding potassium iodide solution to lead nitrate instantly creates a bright yellow precipitate of PbI₂.',
        ],
        keyConcepts: [
          'More reactive metals like Fe and Zn displace Cu from CuSO₄.',
          'Silver halide decomposition in sunlight is used in traditional photography.',
        ],
        summaryCard: 'Combination builds; decomposition splits; displacement swaps by reactivity; double displacement exchanges ions.',
      },
      {
        slug: 'oxidation-corrosion-rancidity',
        title: 'Redox, Corrosion & Rancidity',
        estimatedMinutes: 10,
        frequentlyTested: true,
        explanation:
          'Oxidation is the gain of oxygen or loss of hydrogen; reduction is the loss of oxygen or gain of hydrogen. Because electrons/oxygen transfer involves a partner, oxidation and reduction always occur together in a redox reaction. In daily life, slow oxidation of metals by moisture and air causes corrosion (rusting of iron, green coating on copper, black tarnishing of silver), while oxidation of fats and oils in food leads to rancidity.',
        importantDefinitions: [
          { term: 'Corrosion', meaning: 'Slow degradation of a metal surface due to attack by atmospheric moisture, oxygen, or acids.' },
          { term: 'Rancidity', meaning: 'Spoilage of oil- or fat-containing food due to oxidation, altering smell and taste.' },
        ],
        realLifeExamples: [
          'Black coating of Ag₂S on silver ornaments and green basic copper carbonate on copper vessels.',
          'Nitrogen flushing in sealed snack bags prevents oxidation and keeps food crisp.',
        ],
        keyConcepts: [
          'Prevent rusting via painting, oiling, galvanisation, or alloying.',
          'Prevent rancidity with antioxidants, airtight containers, refrigeration, or nitrogen gas.',
        ],
        summaryCard: 'OIL/RIG in Class 10 terms: Gain O₂ / Lose H₂ = Oxidation; Lose O₂ / Gain H₂ = Reduction.',
      },
    ],
    diagrams: [
      {
        title: 'Electrolysis of Water Apparatus',
        caption: 'Hydrogen gas collects at the cathode (negative electrode) in double the volume of oxygen gas at the anode.',
        diagramType: 'reaction',
        labels: ['Cathode (-): 2H₂', 'Anode (+): O₂', 'Acidulated Water', '6V Battery'],
        examTip: 'Always mention why a few drops of dilute H₂SO₄ are added—to increase water conductivity—and note the 2:1 gas volume ratio.',
      },
    ],
  },
  {
    subjectSlug: 'chemistry',
    chapterNumber: 2,
    slug: 'acids-bases-and-salts',
    title: 'Acids, Bases and Salts',
    unitName: 'Unit I: Chemical Substances – Nature and Behaviour',
    unitWeightage: 25,
    introduction:
      'From the citric acid in lemons to baking soda in kitchens and plaster of Paris in hospitals, acids, bases, and salts shape everyday chemistry. This chapter explores their ionisation in water, the pH scale, and the preparation and uses of industrially important salts.',
    objectives: [
      'Distinguish acids and bases using natural, synthetic, and olfactory indicators.',
      'Explain reactions of acids and bases with metals, metal carbonates, hydrogen carbonates, and metal oxides.',
      'Interpret the pH scale (0–14) and explain pH importance in digestion, soil, tooth decay, and aquatic life.',
      'Describe the chlor-alkali process and preparation/uses of bleaching powder, baking soda, washing soda, and Plaster of Paris.',
    ],
    ncertTerminology: [
      { term: 'Olfactory Indicator', definition: 'A substance whose odour changes in acidic or basic media (e.g., onion, vanilla, clove oil).' },
      { term: 'Alkali', definition: 'A base that dissolves in water to produce hydroxide ions (OH⁻).' },
      { term: 'Neutralisation', definition: 'Reaction between an acid and a base to produce salt and water.' },
      { term: 'Water of Crystallisation', definition: 'Fixed number of water molecules present in one formula unit of a salt.' },
      { term: 'Brine', definition: 'Concentrated aqueous solution of sodium chloride (NaCl).' },
    ],
    formulas: [
      {
        name: 'pH Scale Definition',
        expression: 'pH = -log₁₀[H₃O⁺]',
        variables: 'pH < 7 acidic, pH = 7 neutral, pH > 7 basic (at 298 K)',
        unit: 'Dimensionless (0–14)',
      },
    ],
    chemicalEquations: [
      {
        title: 'Metal + Acid Reaction',
        equation: 'Zn(s) + H₂SO₄(aq) → ZnSO₄(aq) + H₂(g)↑',
        type: 'Metal-Acid Reaction',
        notes: 'Hydrogen gas burns with a characteristic pop sound when tested with a burning splinter.',
      },
      {
        title: 'Sodium Zincate Formation',
        equation: '2NaOH(aq) + Zn(s) → Na₂ZnO₂(aq) + H₂(g)↑',
        type: 'Amphoteric Metal + Base',
        notes: 'Only select metals like Zn and Al react with strong bases to evolve H₂.',
      },
      {
        title: 'Limewater Test for CO₂',
        equation: 'Ca(OH)₂(aq) + CO₂(g) → CaCO₃(s)↓ + H₂O(l)',
        type: 'Carbonate Test',
        notes: 'Limewater turns milky due to insoluble CaCO₃; excess CO₂ forms soluble Ca(HCO₃)₂ and clears milkiness.',
      },
      {
        title: 'Chlor-Alkali Process',
        equation: '2NaCl(aq) + 2H₂O(l) —(Electricity)→ 2NaOH(aq) + Cl₂(g) + H₂(g)',
        type: 'Electrolytic Industrial Process',
        notes: 'Cl₂ is released at anode, H₂ at cathode, and NaOH forms near the cathode.',
      },
      {
        title: 'Bleaching Powder Preparation',
        equation: 'Ca(OH)₂(s) + Cl₂(g) → CaOCl₂(s) + H₂O(l)',
        type: 'Synthesis',
        notes: 'Chlorine from chlor-alkali reacts with dry slaked lime to give calcium oxychloride.',
      },
      {
        title: 'Baking Soda Heating',
        equation: '2NaHCO₃(s) —(Heat)→ Na₂CO₃(s) + H₂O(l) + CO₂(g)',
        type: 'Thermal Decomposition',
        notes: 'Released CO₂ makes cakes and bread soft and spongy.',
      },
      {
        title: 'Plaster of Paris Preparation',
        equation: 'CaSO₄·2H₂O(s) —(373 K)→ CaSO₄·½H₂O(s) + 1½H₂O(g)',
        type: 'Controlled Dehydration',
        notes: 'Heating gypsum carefully at 373 K gives Plaster of Paris; overheating produces dead-burnt plaster (CaSO₄).',
      },
    ],
    solvedExamples: [
      {
        problem: 'Why does dry HCl gas not change the colour of dry blue litmus paper, whereas aqueous HCl turns it red?',
        given: 'Dry HCl(g) vs aqueous HCl(aq).',
        solutionSteps: [
          'Acids show acidic properties only when they dissociate to produce hydrogen ions (H⁺ / H₃O⁺).',
          'Water is required for HCl molecules to ionise: HCl + H₂O → H₃O⁺ + Cl⁻.',
          'Without moisture, dry HCl gas cannot release H⁺ ions, so dry litmus remains unchanged.',
        ],
        answer: 'Ionisation into H₃O⁺ requires water; dry HCl lacks free H⁺ ions.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Adding water directly into concentrated acid while diluting.',
        correction: 'Always add concentrated acid slowly to water with constant stirring; adding water to acid causes violent exothermic splashing.',
      },
      {
        mistake: 'Writing Baking Soda formula as Na₂CO₃ instead of NaHCO₃.',
        correction: 'Baking soda is sodium hydrogencarbonate (NaHCO₃); washing soda is Na₂CO₃·10H₂O.',
      },
    ],
    quickRevisionNotes: [
      'Metallic oxides are basic in nature; non-metallic oxides are acidic in nature.',
      'Tooth enamel (calcium hydroxyapatite) starts corroding when mouth pH drops below 5.5.',
      'Stomach produces HCl for digestion; mild bases like milk of magnesia (Mg(OH)₂) act as antacids.',
      'Plaster of Paris must be stored in moisture-proof containers because it reacts with water to set into hard gypsum.',
    ],
    topics: [
      {
        slug: 'indicators-and-chemical-properties',
        title: 'Indicators & Chemical Properties of Acids and Bases',
        estimatedMinutes: 14,
        frequentlyTested: true,
        explanation:
          'Acids release H⁺(aq) ions in water and turn blue litmus red, while bases release OH⁻(aq) ions and turn red litmus blue. Synthetic indicators like phenolphthalein (colourless in acid, pink in base) and methyl orange (red in acid, yellow in base) allow precise titrations. Acids react with metal carbonates and hydrogencarbonates to yield salt, CO₂, and water.',
        importantDefinitions: [
          { term: 'Acid', meaning: 'A substance that furnishes H⁺(aq) / H₃O⁺ ions in aqueous solution.' },
          { term: 'Base', meaning: 'A substance that furnishes OH⁻(aq) ions in water or neutralises acids.' },
        ],
        realLifeExamples: [
          'Turmeric stain on a shirt turns reddish-brown when washed with basic soap and returns to yellow with lemon juice.',
          'Soda-acid fire extinguishers generate CO₂ by reacting NaHCO₃ with dilute acid.',
        ],
        keyConcepts: [
          'Both acidic and basic aqueous solutions conduct electricity due to mobile ions.',
          'Neutralisation is exothermic: H⁺(aq) + OH⁻(aq) → H₂O(l).',
        ],
        summaryCard: 'Acids give H₃O⁺ in water; bases give OH⁻; acid + base → salt + water.',
      },
      {
        slug: 'ph-scale-and-daily-life',
        title: 'The pH Scale & Importance in Everyday Life',
        estimatedMinutes: 12,
        frequentlyTested: true,
        explanation:
          'The pH scale measures hydrogen ion concentration from 0 (strongly acidic) to 14 (strongly alkaline), with 7 representing pure neutral water. Higher H⁺ concentration corresponds to a lower pH value. Living organisms survive within narrow pH ranges—human blood stays near 7.0–7.8, and acid rain (pH < 5.6) harms aquatic ecosystems.',
        importantDefinitions: [
          { term: 'Universal Indicator', meaning: 'A mixture of several indicators showing distinct colours across the full pH 0–14 range.' },
          { term: 'Acid Rain', meaning: 'Rainwater with pH below 5.6 due to dissolved acidic gases like SO₂ and NO₂.' },
        ],
        realLifeExamples: [
          'Bee stings inject methanoic acid; applying mild baking soda gives relief.',
          'Farmers add quicklime (CaO) or slaked lime to overly acidic soil before sowing crops.',
        ],
        keyConcepts: [
          'Lower pH = stronger acid (higher [H⁺]); higher pH = stronger base.',
          'Toothpaste is mildly basic to neutralise acids produced by oral bacteria.',
        ],
        summaryCard: 'pH 0–6.9 acidic, 7 neutral, 7.1–14 basic; small pH shifts strongly affect biology and soil.',
      },
      {
        slug: 'important-salts-and-chlor-alkali',
        title: 'Family of Salts & Industrial Chemicals',
        estimatedMinutes: 15,
        frequentlyTested: true,
        explanation:
          'Common salt (NaCl) serves as the raw material for sodium hydroxide (chlor-alkali process), bleaching powder (CaOCl₂), baking soda (NaHCO₃), and washing soda (Na₂CO₃·10H₂O). Hydrated crystals like CuSO₄·5H₂O (blue) turn white on heating when water of crystallisation escapes.',
        importantDefinitions: [
          { term: 'Baking Powder', meaning: 'A mixture of baking soda (NaHCO₃) and a mild edible acid such as tartaric acid.' },
          { term: 'Washing Soda', meaning: 'Sodium carbonate decahydrate (Na₂CO₃·10H₂O), used to remove permanent water hardness.' },
        ],
        realLifeExamples: [
          'Doctors use Plaster of Paris (CaSO₄·½H₂O) bandages to immobilise fractured bones.',
          'Bleaching powder disinfects drinking water and bleaches cotton/linen in textile mills.',
        ],
        keyConcepts: [
          'Salt pH depends on parent acid/base strength (strong acid + weak base → acidic salt).',
          'Water of crystallisation is chemically bound, not wet moisture.',
        ],
        summaryCard: 'NaCl brine unlocks NaOH, Cl₂, H₂, CaOCl₂, NaHCO₃, and Na₂CO₃·10H₂O.',
      },
    ],
    diagrams: [
      {
        title: 'Universal Indicator pH Spectrum (0–14)',
        caption: 'Colour transition from deep red (strong acid, pH 0–1) through green (neutral, pH 7) to dark violet (strong alkali, pH 14).',
        diagramType: 'ph_scale',
        labels: ['Strong Acid (0–3)', 'Weak Acid (4–6)', 'Neutral (7)', 'Weak Base (8–11)', 'Strong Alkali (12–14)'],
        examTip: 'Remember that pH is inversely related to [H⁺]: pH 2 has 10× higher [H⁺] than pH 3.',
      },
    ],
  },
  {
    subjectSlug: 'chemistry',
    chapterNumber: 3,
    slug: 'metals-and-non-metals',
    title: 'Metals and Non-metals',
    unitName: 'Unit I: Chemical Substances – Nature and Behaviour',
    unitWeightage: 25,
    introduction:
      'Metals like iron, copper, and aluminium form the backbone of infrastructure and electronics, while non-metals like oxygen, carbon, and nitrogen sustain life. This chapter compares their physical and chemical behaviour, ionic bonding, metallurgical extraction using the reactivity series, and corrosion prevention.',
    objectives: [
      'Compare physical and chemical properties of metals and non-metals including exceptions.',
      'Explain amphoteric oxides and reactions with water, oxygen, and dilute acids.',
      'Draw electron-dot structures and explain properties of ionic compounds.',
      'Describe extraction of metals of low, medium, and high reactivity from their ores, plus electrolytic refining.',
    ],
    ncertTerminology: [
      { term: 'Amphoteric Oxide', definition: 'Metal oxide (such as Al₂O₃ or ZnO) that reacts with both acids and bases to yield salt and water.' },
      { term: 'Mineral & Ore', definition: 'Naturally occurring metal compounds are minerals; those from which a metal can be profitably extracted are ores.' },
      { term: 'Roasting', definition: 'Heating sulphide ores strongly in excess air to convert them into metal oxides.' },
      { term: 'Calcination', definition: 'Heating carbonate ores strongly in limited air to form metal oxides.' },
      { term: 'Galvanisation', definition: 'Coating steel or iron with a thin protective layer of zinc to prevent rusting.' },
    ],
    formulas: [],
    chemicalEquations: [
      {
        title: 'Amphoteric Behaviour of Aluminium Oxide',
        equation: 'Al₂O₃(s) + 6HCl(aq) → 2AlCl₃(aq) + 3H₂O(l); Al₂O₃(s) + 2NaOH(aq) → 2NaAlO₂(aq) + H₂O(l)',
        type: 'Amphoteric Reaction',
        notes: 'Demonstrates dual acidic and basic character of Al₂O₃.',
      },
      {
        title: 'Roasting of Zinc Sulphide (Zinc Blende)',
        equation: '2ZnS(s) + 3O₂(g) —(Heat)→ 2ZnO(s) + 2SO₂(g)',
        type: 'Roasting',
        notes: 'Used for sulphide ores in the middle of the reactivity series.',
      },
      {
        title: 'Calcination of Zinc Carbonate (Calamine)',
        equation: 'ZnCO₃(s) —(Heat)→ ZnO(s) + CO₂(g)',
        type: 'Calcination',
        notes: 'Used for carbonate ores in limited supply of air.',
      },
      {
        title: 'Thermit Reaction (Welding Railway Tracks)',
        equation: 'Fe₂O₃(s) + 2Al(s) → 2Fe(l) + Al₂O₃(s) + Heat',
        type: 'Highly Exothermic Displacement',
        notes: 'Molten iron produced joins cracked railway tracks and heavy machine parts.',
      },
    ],
    solvedExamples: [
      {
        problem: 'Explain why ionic compounds like NaCl conduct electricity in molten or aqueous state, but not in solid state.',
        given: 'Ionic solid NaCl crystal lattice.',
        solutionSteps: [
          'In solid NaCl, Na⁺ and Cl⁻ ions are held rigidly by strong electrostatic forces in fixed positions.',
          'Because ions cannot move freely in the solid lattice, no charge flows.',
          'Upon melting or dissolving in water, electrostatic attraction weakens and free ions carry electric current.',
        ],
        answer: 'Ions are fixed in solid crystals and become mobile only when molten or dissolved.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Writing that all metals react with dilute HNO₃ to produce hydrogen gas.',
        correction: 'HNO₃ is a strong oxidising agent and oxidises H₂ to H₂O; only Mg and Mn evolve H₂ with very dilute HNO₃.',
      },
      {
        mistake: 'Confusing roasting and calcination.',
        correction: 'Roasting = Sulphide ore + Excess O₂; Calcination = Carbonate ore + Limited air.',
      },
    ],
    quickRevisionNotes: [
      'Exceptions: Mercury is liquid metal; Gallium/Caesium melt on palm; Iodine is lustrous non-metal; Diamond is hardest natural substance; Graphite conducts electricity.',
      'Reactivity Series: K > Na > Ca > Mg > Al > Zn > Fe > Pb > [H] > Cu > Hg > Ag > Au.',
      'Highly reactive metals (Na, Mg, Al) are extracted by electrolytic reduction of molten chlorides/oxides.',
      'In electrolytic refining of copper, impure copper is the anode, pure copper strip is the cathode, and anode mud collects precious impurities (Au, Ag).',
    ],
    topics: [
      {
        slug: 'properties-and-reactivity-series',
        title: 'Physical & Chemical Properties and Reactivity Series',
        estimatedMinutes: 14,
        frequentlyTested: true,
        explanation:
          'Metals are typically malleable, ductile, sonorous, lustrous, and good conductors, whereas non-metals are brittle and poor conductors (except graphite). Chemically, metals lose electrons to form cations and basic oxides. Reactivity decreases from potassium down to gold: Na and K react violently with cold water, Mg reacts with hot water, Fe/Al/Zn react with steam, and Cu/Ag/Au do not react with water at all.',
        importantDefinitions: [
          { term: 'Malleability', meaning: 'Property of metals allowing them to be hammered into thin sheets.' },
          { term: 'Aqua Regia', meaning: 'Freshly prepared 3:1 mixture of concentrated HCl and concentrated HNO₃ capable of dissolving gold and platinum.' },
        ],
        realLifeExamples: [
          'Sodium is stored under kerosene oil to prevent vigorous reaction with atmospheric oxygen and moisture.',
          'Copper and aluminium are drawn into long electrical transmission wires due to high ductility and conductivity.',
        ],
        keyConcepts: [
          'Metal + Water → Metal oxide/hydroxide + H₂.',
          'Higher-series metals displace lower-series metals from aqueous salts.',
        ],
        summaryCard: 'Reactivity dictates reaction speed with O₂, H₂O, and dilute acids.',
      },
      {
        slug: 'ionic-bonding-and-metallurgy',
        title: 'Ionic Compounds & Extraction of Metals',
        estimatedMinutes: 16,
        frequentlyTested: true,
        explanation:
          'Metals transfer valence electrons to non-metals, forming crystalline ionic solids held by strong electrostatic attraction. Consequently, ionic compounds have high melting/boiling points and are soluble in water. Metallurgy extracts pure metals based on reactivity: low-reactivity metals (HgS, Cu₂S) are heated in air; medium-reactivity ores undergo roasting/calcination followed by carbon or aluminium reduction; high-reactivity metals require electrolysis.',
        importantDefinitions: [
          { term: 'Gangue', meaning: 'Unwanted earthy impurities like sand and soil present in mined ores.' },
          { term: 'Alloy', meaning: 'Homogeneous mixture of two or more metals, or a metal and a non-metal (e.g., Brass = Cu+Zn, Bronze = Cu+Sn, Solder = Pb+Sn).' },
        ],
        realLifeExamples: [
          'The Iron Pillar near Qutub Minar in Delhi resists rusting due to its unique composition and protective surface oxide film.',
          '22-carat gold alloys copper or silver with pure gold to increase hardness for jewellery.',
        ],
        keyConcepts: [
          'Galvanised iron stays protected even if scratched because zinc is more reactive than iron and corrodes preferentially.',
          'Electrolytic refining yields 99.9% pure copper at the cathode.',
        ],
        summaryCard: 'Low reactivity → heat; Medium → roast/calcine + reduce; High → molten electrolysis.',
      },
    ],
    diagrams: [
      {
        title: 'Electrolytic Refining of Copper',
        caption: 'Impure copper anode dissolves into CuSO₄ electrolyte while pure copper deposits onto the thin cathode.',
        diagramType: 'reaction',
        labels: ['Impure Copper Anode (+)', 'Pure Copper Cathode (-)', 'Acidified CuSO₄ Solution', 'Anode Mud'],
        examTip: 'Always show Cu²⁺ ions moving toward the cathode and label insoluble impurities settling below the anode as anode mud.',
      },
    ],
  },
  {
    subjectSlug: 'chemistry',
    chapterNumber: 4,
    slug: 'carbon-and-its-compounds',
    title: 'Carbon and its Compounds',
    unitName: 'Unit I: Chemical Substances – Nature and Behaviour',
    unitWeightage: 25,
    introduction:
      'Carbon forms millions of organic compounds ranging from DNA and fuels to plastics and soaps. This chapter explains why carbon forms covalent bonds, how catenation and tetravalency create chains and rings, IUPAC nomenclature of functional groups, key reactions of ethanol and ethanoic acid, and how soaps clean dirt.',
    objectives: [
      'Explain covalent bonding in carbon compounds and distinguish ionic vs covalent properties.',
      'Describe versatile nature of carbon: catenation, tetravalency, allotropes, and isomerism.',
      'Identify homologous series and name compounds with halo, alcohol, aldehyde, ketone, and carboxylic acid functional groups.',
      'Explain combustion, oxidation, addition, substitution, esterification, saponification, and micelle formation.',
    ],
    ncertTerminology: [
      { term: 'Catenation', definition: 'Self-linking ability of carbon atoms through covalent bonds to form long chains, branches, or rings.' },
      { term: 'Homologous Series', definition: 'A family of organic compounds having the same functional group where successive members differ by a -CH₂- unit (14 u).' },
      { term: 'Structural Isomers', definition: 'Compounds having the same molecular formula but different structural arrangements.' },
      { term: 'Esterification', definition: 'Reaction of an alcohol with a carboxylic acid in the presence of an acid catalyst to form a sweet-smelling ester.' },
      { term: 'Micelle', definition: 'Spherical cluster of soap molecules with hydrophobic tails facing inward around oil and hydrophilic ionic heads facing water.' },
    ],
    formulas: [
      { name: 'Alkanes (Saturated)', expression: 'CₙH₂ₙ₊₂', variables: 'Single C–C bonds (e.g., Methane CH₄, Ethane C₂H₆)' },
      { name: 'Alkenes (Unsaturated)', expression: 'CₙH₂ₙ', variables: 'At least one C=C double bond (e.g., Ethene C₂H₄)' },
      { name: 'Alkynes (Unsaturated)', expression: 'CₙH₂ₙ₋₂', variables: 'At least one C≡C triple bond (e.g., Ethyne C₂H₂)' },
    ],
    chemicalEquations: [
      {
        title: 'Combustion of Ethanol',
        equation: 'C₂H₅OH(l) + 3O₂(g) → 2CO₂(g) + 3H₂O(g) + Heat & Light',
        type: 'Combustion',
        notes: 'Clean blue flame without soot because ethanol burns completely.',
      },
      {
        title: 'Oxidation of Ethanol to Ethanoic Acid',
        equation: 'CH₃CH₂OH —(Alkaline KMnO₄ or Acidified K₂Cr₂O₇ + Heat)→ CH₃COOH + H₂O',
        type: 'Controlled Oxidation',
        notes: 'Alkaline KMnO₄ acts as an oxidising agent supplying oxygen.',
      },
      {
        title: 'Hydrogenation of Unsaturated Oils',
        equation: 'R₂C=CR₂ + H₂ —(Ni or Pd catalyst)→ R₂CH–CHR₂',
        type: 'Addition Reaction',
        notes: 'Converts liquid vegetable oils into solid vanaspati ghee.',
      },
      {
        title: 'Dehydration of Ethanol',
        equation: 'CH₃CH₂OH —(Hot Conc. H₂SO₄, 443 K)→ CH₂=CH₂ + H₂O',
        type: 'Dehydration',
        notes: 'Concentrated sulphuric acid acts as a dehydrating agent removing water.',
      },
      {
        title: 'Esterification Reaction',
        equation: 'CH₃COOH + CH₃CH₂OH ⇌(Acid) CH₃COOC₂H₅ + H₂O',
        type: 'Esterification',
        notes: 'Produces ethyl ethanoate (fruity-smelling ester used in perfumes/flavourings).',
      },
      {
        title: 'Saponification',
        equation: 'CH₃COOC₂H₅ + NaOH → CH₃COONa + C₂H₅OH',
        type: 'Alkaline Hydrolysis',
        notes: 'Reverses esterification to form sodium salt (soap basis) and alcohol.',
      },
    ],
    solvedExamples: [
      {
        problem: 'Write the molecular formula of the 2nd and 3rd members of the homologous series whose first member is ethyne (C₂H₂).',
        given: 'First member: C₂H₂ (alkyne, CₙH₂ₙ₋₂).',
        solutionSteps: [
          'Each successive member in a homologous series differs by one -CH₂- unit.',
          '2nd member (n = 3, propyne): C₂H₂ + CH₂ = C₃H₄.',
          '3rd member (n = 4, butyne): C₃H₄ + CH₂ = C₄H₆.',
        ],
        answer: 'C₃H₄ (Propyne) and C₄H₆ (Butyne).',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Drawing five bonds around a carbon atom in structural formulas.',
        correction: 'Carbon is strictly tetravalent—every carbon atom must have a total of 4 covalent bond lines.',
      },
      {
        mistake: 'Confusing soap and detergent behaviour in hard water.',
        correction: 'Soaps form insoluble scum with Ca²⁺/Mg²⁺ ions in hard water, whereas detergents remain effective without forming scum.',
      },
    ],
    quickRevisionNotes: [
      'Carbon neither forms C⁴⁺ nor C⁴⁻ ions due to huge energy requirements and nuclear instability; it shares 4 electrons covalently.',
      'Saturated hydrocarbons give a clean blue flame; unsaturated hydrocarbons burn with a yellow sooty flame.',
      '5–8% solution of ethanoic acid in water is vinegar; pure ethanoic acid freezes at 290 K (glacial acetic acid).',
      'Bromine water decolourises when shaken with unsaturated compounds (addition test).',
    ],
    topics: [
      {
        slug: 'covalent-bonding-and-homologous-series',
        title: 'Covalent Bonding, Allotropes & Homologous Series',
        estimatedMinutes: 15,
        frequentlyTested: true,
        explanation:
          'Carbon achieves a noble gas configuration by sharing valence electrons to form single, double, or triple covalent bonds. Crystalline allotropes include diamond (rigid 3D tetrahedral network, hardest, non-conductor), graphite (layered hexagonal sheets with free delocalised electrons, conductor and lubricant), and C₆₀ buckminsterfullerene. Successive members of a homologous series share chemical properties and show a gradual trend in boiling points.',
        importantDefinitions: [
          { term: 'Functional Group', meaning: 'An atom or group of atoms that replaces hydrogen in a hydrocarbon chain and determines its characteristic chemical reactivity.' },
          { term: 'Heteroatom', meaning: 'An atom other than carbon or hydrogen (such as Cl, O, N, S) present in an organic molecule.' },
        ],
        realLifeExamples: [
          'Graphite is used in pencil leads and dry-cell electrodes; diamond tips cut glass and drill rock.',
          'LPG cylinders contain butane and propane—saturated alkanes with structural isomers.',
        ],
        keyConcepts: [
          'Covalent compounds have low melting/boiling points due to weak intermolecular forces.',
          'Benzene (C₆H₆) is an aromatic unsaturated ring with alternating double bonds.',
        ],
        summaryCard: 'Catenation + tetravalency produce vast organic diversity; -CH₂- steps build homologous series.',
      },
      {
        slug: 'reactions-ethanol-ethanoic-soaps',
        title: 'Chemical Properties, Ethanol, Ethanoic Acid & Soaps',
        estimatedMinutes: 16,
        frequentlyTested: true,
        explanation:
          'Key organic reactions include combustion, controlled oxidation, catalytic addition (for unsaturated hydrocarbons), and sunlight-driven substitution (for saturated alkanes). Ethanol reacts with Na to evolve H₂ and dehydrates with hot H₂SO₄ to ethene. Ethanoic acid reacts with NaOH, Na₂CO₃, and NaHCO₃, and forms esters with alcohols. Soap molecules have a hydrocarbon tail (dissolves grease) and ionic -COO⁻Na⁺ head (dissolves in water) to lift dirt as micelles.',
        importantDefinitions: [
          { term: 'Denatured Alcohol', meaning: 'Industrial ethanol mixed with poisonous methanol and dyes to prevent misuse as a beverage.' },
          { term: 'Scum', meaning: 'Insoluble white curdy precipitate formed when soap reacts with calcium or magnesium salts in hard water.' },
        ],
        realLifeExamples: [
          'Detergents are ammonium or sulphonate salts of long-chain carboxylic acids that wash effectively even in hard well water.',
          'Vinegar (dilute ethanoic acid) preserves pickles by inhibiting microbial growth.',
        ],
        keyConcepts: [
          'Sodium ethoxide forms when Na reacts with ethanol: 2Na + 2C₂H₅OH → 2C₂H₅ONa + H₂.',
          'Agitation during washing helps detach micelle-trapped oil droplets from fabric.',
        ],
        summaryCard: 'Addition tests unsaturation; esterification makes sweet esters; micelles emulsify grease.',
      },
    ],
    diagrams: [
      {
        title: 'Soap Micelle Structure',
        caption: 'Hydrophobic hydrocarbon tails point inward into the oil droplet while hydrophilic ionic heads interact with surrounding water.',
        diagramType: 'reaction',
        labels: ['Oil / Grease Droplet (Centre)', 'Hydrophobic Hydrocarbon Tail', 'Hydrophilic Ionic Head (Na⁺)'],
        examTip: 'Always clearly distinguish the oil-soluble tail and water-soluble ionic end when sketching micelles.',
      },
    ],
  },
];
