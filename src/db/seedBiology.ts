import { ChapterSeed } from './seedChemistry.ts';

export const biologyChapters: ChapterSeed[] = [
  {
    subjectSlug: 'biology',
    chapterNumber: 5,
    slug: 'life-processes',
    title: 'Life Processes',
    unitName: 'Unit II: World of Living',
    unitWeightage: 25,
    introduction:
      'Living organisms constantly perform maintenance functions even while asleep. This chapter explores the four vital life processes—nutrition, respiration, transportation, and excretion—across plants and humans.',
    objectives: [
      'Compare autotrophic and heterotrophic nutrition and trace human digestion along the alimentary canal.',
      'Differentiate aerobic and anaerobic respiration pathways and explain human gas exchange.',
      'Explain double circulation in humans and xylem/phloem transport in plants.',
      'Describe the structure and urine-forming function of a nephron and excretion in plants.',
    ],
    ncertTerminology: [
      { term: 'Peristalsis', definition: 'Rhythmic muscular contraction and relaxation along the gut that pushes food forward.' },
      { term: 'Villi', definition: 'Millions of finger-like projections on the small intestine wall that vastly increase surface area for nutrient absorption.' },
      { term: 'ATP', definition: 'Adenosine triphosphate—the energy currency produced during cellular respiration.' },
      { term: 'Double Circulation', definition: 'Pathway in which blood passes through the heart twice during one complete cycle of the body.' },
      { term: 'Translocation', definition: 'Active transport of soluble products of photosynthesis through phloem using ATP.' },
    ],
    formulas: [],
    chemicalEquations: [
      {
        title: 'Photosynthesis Overall Equation',
        equation: '6CO₂ + 12H₂O —(Chlorophyll, Sunlight)→ C₆H₁₂O₆ + 6O₂ + 6H₂O',
        type: 'Autotrophic Nutrition',
        notes: 'Occurs in three steps: light absorption, photolysis of water to H₂/O₂, and reduction of CO₂ to carbohydrates.',
      },
      {
        title: 'Aerobic Respiration of Glucose',
        equation: 'C₆H₁₂O₆ —(Cytoplasm)→ Pyruvate —(Mitochondria + O₂)→ 6CO₂ + 6H₂O + Energy (ATP)',
        type: 'Cellular Respiration',
        notes: 'Releases much more ATP than anaerobic breakdown.',
      },
      {
        title: 'Anaerobic Respiration in Muscle Cells',
        equation: 'Glucose → Pyruvate —(Lack of O₂)→ Lactic Acid + Energy',
        type: 'Anaerobic Pathway',
        notes: 'Accumulation of lactic acid during sudden vigorous exercise causes muscle cramps.',
      },
    ],
    solvedExamples: [
      {
        problem: 'Why is it necessary to separate oxygenated and deoxygenated blood in mammals and birds?',
        given: 'Four-chambered heart in warm-blooded animals.',
        solutionSteps: [
          'Mammals and birds are warm-blooded and maintain a constant body temperature.',
          'This requires high, continuous energy output via rapid aerobic respiration.',
          'Complete separation prevents mixing of oxygenated and deoxygenated blood, ensuring efficient oxygen delivery.',
        ],
        answer: 'To supply sufficient oxygen for the high energy demand needed to maintain constant body temperature.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Writing that bile juice contains digestive enzymes.',
        correction: 'Bile has no enzymes; it creates an alkaline medium for pancreatic enzymes and emulsifies large fat globules.',
      },
      {
        mistake: 'Confusing xylem and phloem transport directions.',
        correction: 'Xylem moves water/minerals only upward via transpiration pull; phloem translocates food both upward and downward.',
      },
    ],
    quickRevisionNotes: [
      'Salivary amylase digests starch into maltose in the mouth; pepsin digests proteins in acidic stomach (pH ~1.5–2).',
      'Small intestine receives bile (liver) and trypsin/lipase (pancreas) and is the site of complete digestion.',
      'Alveoli in lungs and nephrons in kidneys share thin walls and rich capillary networks for exchange.',
      'Normal human systolic/diastolic blood pressure is 120/80 mmHg measured by a sphygmomanometer.',
    ],
    topics: [
      {
        slug: 'nutrition-and-digestion',
        title: 'Nutrition & Human Alimentary Canal',
        estimatedMinutes: 16,
        frequentlyTested: true,
        explanation:
          'Autotrophs synthesise glucose via photosynthesis (desert plants take up CO₂ at night to minimise water loss). In humans, digestion starts with salivary amylase, continues in the stomach where HCl activates pepsin and mucus protects the lining, and finishes in the small intestine via bile emulsification and pancreatic/intestinal enzymes before villi absorb digested nutrients.',
        importantDefinitions: [
          { term: 'Emulsification', meaning: 'Breaking large fat globules into tiny droplets by bile salts to increase lipase surface area.' },
          { term: 'Stomata', meaning: 'Microscopic leaf pores flanked by guard cells that regulate gas exchange and transpiration.' },
        ],
        realLifeExamples: [
          'Herbivores like cows have a longer small intestine than tigers because cellulose takes longer to digest.',
          'Guard cells swell and open stomata when water enters osmotically during daytime.',
        ],
        keyConcepts: [
          'Trypsin digests proteins; lipase breaks down emulsified fats.',
          'Herbivore gut length > carnivore gut length.',
        ],
        summaryCard: 'Mouth (starch) → Stomach (protein/HCl) → Small Intestine (complete digestion & villi absorption).',
      },
      {
        slug: 'respiration-and-transportation',
        title: 'Respiration & Transport in Humans and Plants',
        estimatedMinutes: 16,
        frequentlyTested: true,
        explanation:
          'Glucose breaks down into 3-carbon pyruvate in cytoplasm, then enters mitochondria (aerobic), yeast (ethanol + CO₂), or oxygen-starved muscle (lactic acid). In humans, haemoglobin carries O₂ while CO₂ dissolves mostly in plasma. The 4-chambered heart pumps deoxygenated blood to lungs (pulmonary circuit) and oxygenated blood to the body (systemic circuit). Plants rely on transpiration pull and root pressure in xylem, and ATP-driven translocation in phloem.',
        importantDefinitions: [
          { term: 'Residual Volume', meaning: 'Air always remaining in the lungs after forceful exhalation to prevent alveolar collapse.' },
          { term: 'Transpiration', meaning: 'Loss of water as vapour from aerial plant parts, creating suction pull.' },
        ],
        realLifeExamples: [
          'Fish open and close gill covers rapidly because dissolved oxygen in water is much lower than in air.',
          'Platelets plug minor skin cuts by forming a blood clot.',
        ],
        keyConcepts: [
          'Left ventricle has thicker muscular walls than atria because it pumps blood across the entire body.',
          'Lymph (tissue fluid) returns drained proteins and absorbed intestinal fats back to blood.',
        ],
        summaryCard: 'Aerobic mitochondria yield maximum ATP; 4-chambered heart separates oxygenated and deoxygenated blood.',
      },
      {
        slug: 'excretion-in-humans-and-plants',
        title: 'Excretion & Nephron Function',
        estimatedMinutes: 12,
        frequentlyTested: true,
        explanation:
          'Metabolic nitrogenous wastes like urea are filtered out by millions of nephrons inside kidneys. Each nephron filters blood at Bowman’s capsule/glomerulus, selectively reabsorbs useful glucose, amino acids, salts, and water along the tubule based on body hydration, and sends urine via ureters to the urinary bladder. Plants excrete O₂, CO₂, excess water, resins, gums, and store wastes in vacuoles or falling leaves.',
        importantDefinitions: [
          { term: 'Nephron', meaning: 'Basic structural and functional filtration unit of the kidney.' },
          { term: 'Haemodialysis', meaning: 'Artificial blood filtration process used when both kidneys fail.' },
        ],
        realLifeExamples: [
          'Reabsorption of water in kidney tubules increases on hot days when we sweat heavily.',
          'Old xylem of trees accumulates waste products as resins and gums.',
        ],
        keyConcepts: [
          'Three urine formation stages: Ultrafiltration, Selective Reabsorption, Tubular Secretion.',
          'Healthy nephrons never let glucose pass into urine.',
        ],
        summaryCard: 'Glomerulus filters blood; tubule reabsorbs glucose, amino acids, and regulated water.',
      },
    ],
    diagrams: [
      {
        title: 'Human Heart Double Circulation',
        caption: 'Right side pumps deoxygenated blood to lungs; left side pumps oxygenated blood to body organs.',
        diagramType: 'heart',
        labels: ['Right Atrium & Ventricle', 'Pulmonary Artery', 'Left Atrium & Ventricle', 'Aorta', 'Vena Cava'],
        examTip: 'Remember arteries carry blood AWAY from the heart and veins carry blood TOWARD the heart—pulmonary artery is the exception carrying deoxygenated blood.',
      },
      {
        title: 'Structure of a Nephron',
        caption: 'Cup-shaped Bowman’s capsule encloses the glomerulus capillary cluster leading into the coiled renal tubule.',
        diagramType: 'nephron',
        labels: ['Glomerulus', 'Bowman’s Capsule', 'Tubular Region (Reabsorption)', 'Collecting Duct'],
        examTip: 'Always list glucose, amino acids, salts, and major water as selectively reabsorbed substances.',
      },
    ],
  },
  {
    subjectSlug: 'biology',
    chapterNumber: 6,
    slug: 'control-and-coordination',
    title: 'Control and Coordination',
    unitName: 'Unit II: World of Living',
    unitWeightage: 25,
    introduction:
      'Pulling a hand away from a hot flame in milliseconds or a sunflower turning toward light both rely on coordinated signalling. This chapter covers neurons, reflex arcs, the human brain, plant tropic movements and phytohormones, and the endocrine system.',
    objectives: [
      'Trace nerve impulse transmission across a neuron and synapse.',
      'Explain reflex arc pathways and functions of forebrain, midbrain, and hindbrain.',
      'Differentiate tropic and nastic movements in plants and roles of auxin, gibberellin, cytokinin, and abscisic acid.',
      'Identify major human endocrine glands, their hormones, and feedback regulation (e.g., insulin).',
    ],
    ncertTerminology: [
      { term: 'Synapse', definition: 'Microscopic gap between the axon terminal of one neuron and the dendrite of the next where chemical neurotransmitters cross.' },
      { term: 'Reflex Arc', definition: 'Fast automatic neural pathway connecting receptor, sensory neuron, spinal cord relay neuron, motor neuron, and effector.' },
      { term: 'Phototropism', definition: 'Directional growth of plant parts (shoots toward light, roots away) mediated by auxin redistribution.' },
      { term: 'Feedback Mechanism', definition: 'Self-regulating control loop that adjusts hormone secretion rate based on blood concentration.' },
    ],
    formulas: [],
    chemicalEquations: [],
    solvedExamples: [
      {
        problem: 'How does auxin promote bending of a plant shoot toward sunlight?',
        given: 'Unilateral light falling on a shoot tip.',
        solutionSteps: [
          'Auxin is synthesised at the growing shoot tip.',
          'When light comes from one side, auxin diffuses toward the shaded side of the shoot.',
          'Higher auxin concentration stimulates faster cell elongation on the shaded side, causing the shoot to bend toward light.',
        ],
        answer: 'Auxin accumulates on the shaded side, elongating shaded cells faster and bending the stem toward light.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Stating that electrical impulses jump directly across a synapse.',
        correction: 'At the synapse, electrical signals convert into chemical neurotransmitters that diffuse across the gap.',
      },
      {
        mistake: 'Confusing cerebrum and cerebellum roles.',
        correction: 'Cerebrum (forebrain) handles thinking, memory, and voluntary decisions; cerebellum (hindbrain) coordinates posture and balance.',
      },
    ],
    quickRevisionNotes: [
      'Medulla oblongata controls involuntary actions like blood pressure, salivation, and vomiting.',
      'Touch-me-not (Mimosa pudica) folds leaves via turgor water changes—a fast nastic movement independent of growth.',
      'Abscisic acid (ABA) is a growth-inhibiting plant hormone causing wilting of leaves.',
      'Iodine is essential for thyroxine synthesis; deficiency causes goitre.',
    ],
    topics: [
      {
        slug: 'nervous-system-and-brain',
        title: 'Neurons, Reflex Arc & Human Brain',
        estimatedMinutes: 15,
        frequentlyTested: true,
        explanation:
          'Dendrites receive environmental stimuli, triggering electrical impulses along the axon to nerve endings where chemicals cross the synapse. Reflex actions route through the spinal cord for instant protection before the brain even finishes processing pain. The skull protects the brain (forebrain = thinking/sensory centres; midbrain + hindbrain = involuntary & posture control) while the vertebral column shields the spinal cord.',
        importantDefinitions: [
          { term: 'Neuromuscular Junction', meaning: 'Point where a motor neuron axon contacts a muscle fibre to trigger contraction.' },
          { term: 'Cerebellum', meaning: 'Hindbrain region maintaining body posture, equilibrium, and precision of voluntary movements.' },
        ],
        realLifeExamples: [
          'Withdrawing your foot instantly after stepping on a sharp thorn before conscious pain registers.',
          'Riding a bicycle smoothly relies on cerebellum coordination.',
        ],
        keyConcepts: [
          'Receptor → Sensory Neuron → Spinal Cord → Motor Neuron → Effector.',
          'Cerebrospinal fluid cushions the brain against mechanical shocks.',
        ],
        summaryCard: 'Neurons transmit fast electrochemical signals; spinal reflex arcs protect against immediate danger.',
      },
      {
        slug: 'plant-and-animal-hormones',
        title: 'Plant Movements & Endocrine Hormones',
        estimatedMinutes: 14,
        frequentlyTested: true,
        explanation:
          'Unlike nervous signals, chemical hormones travel throughout the organism to sustain slower, widespread responses. Plants use auxin (cell elongation), gibberellins (stem growth), cytokinins (cell division), and abscisic acid (growth inhibition). In humans, endocrine glands secrete hormones directly into blood: adrenaline prepares for fight-or-flight, insulin lowers blood sugar, growth hormone regulates stature, and thyroxine governs metabolism.',
        importantDefinitions: [
          { term: 'Chemotropism', meaning: 'Directional growth in response to a chemical stimulus, such as pollen tube growth toward the ovule.' },
          { term: 'Endocrine Gland', meaning: 'Ductless gland that pours hormones directly into the bloodstream.' },
        ],
        realLifeExamples: [
          'During an exam or sudden fright, adrenaline increases heart rate and diverts blood to skeletal muscles.',
          'Diabetes patients take insulin injections when pancreatic beta cells produce insufficient insulin.',
        ],
        keyConcepts: [
          'Testosterone (testes) and oestrogen (ovaries) drive pubertal secondary sexual changes.',
          'Feedback inhibition turns down insulin release once blood glucose normalises.',
        ],
        summaryCard: 'Auxin/Gibberellin/Cytokinin promote growth; ABA inhibits; Endocrine glands regulate body via feedback.',
      },
    ],
    diagrams: [
      {
        title: 'Reflex Arc Pathway',
        caption: 'Stimulus detected by skin receptors travels via sensory neuron to spinal cord relay neuron and back through motor neuron to muscle.',
        diagramType: 'reflex',
        labels: ['Heat Receptor (Skin)', 'Sensory Neuron', 'Spinal Cord (Relay Neuron)', 'Motor Neuron', 'Effector Muscle'],
        examTip: 'Draw arrows showing one-way impulse flow from receptor to effector and note message relay to brain.',
      },
    ],
  },
  {
    subjectSlug: 'biology',
    chapterNumber: 7,
    slug: 'how-do-organisms-reproduce',
    title: 'How do Organisms Reproduce?',
    unitName: 'Unit II: World of Living',
    unitWeightage: 25,
    introduction:
      'Reproduction ensures continuity of species and introduces heritable variation through DNA copying. This chapter examines asexual reproduction methods, sexual reproduction in flowering plants, human reproductive anatomy, and reproductive health.',
    objectives: [
      'Explain why DNA copying produces both similarity and subtle variations vital for species survival.',
      'Compare fission, fragmentation, regeneration, budding, vegetative propagation, and spore formation.',
      'Trace pollination, double-path pollen tube fertilisation, and seed/fruit formation in angiosperms.',
      'Describe male and female human reproductive systems, menstruation, placenta role, and contraception methods.',
    ],
    ncertTerminology: [
      { term: 'Vegetative Propagation', definition: 'Asexual reproduction in plants using roots, stems, or leaves (e.g., Bryophyllum leaf buds).' },
      { term: 'Pollination', definition: 'Transfer of pollen grains from anther to stigma (self or cross pollination).' },
      { term: 'Placenta', definition: 'Disc-like vascular tissue embedded in the uterine wall supplying glucose/oxygen to the embryo and removing wastes.' },
      { term: 'Menstruation', definition: 'Monthly shedding of the thickened uterine lining with blood when fertilisation does not occur.' },
    ],
    formulas: [],
    chemicalEquations: [],
    solvedExamples: [
      {
        problem: 'Why are testes located outside the abdominal cavity inside the scrotum?',
        given: 'Human male reproductive system.',
        solutionSteps: [
          'Sperm formation (spermatogenesis) requires a temperature 2–3 °C lower than normal internal body temperature (37 °C).',
          'The external scrotal pouch keeps testes cooler than the abdominal cavity.',
        ],
        answer: 'To maintain a temperature 2–3 °C lower than body temperature required for healthy sperm production.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Assuming regeneration in Planaria is identical to reproduction in all organisms.',
        correction: 'Regeneration is not a normal mode of reproduction for complex animals because specialised tissues cannot regrow whole organisms from fragments.',
      },
      {
        mistake: 'Confusing pollination with fertilisation.',
        correction: 'Pollination is only pollen transfer to stigma; fertilisation is fusion of male gamete with egg inside the ovule.',
      },
    ],
    quickRevisionNotes: [
      'Amoeba divides by binary fission in any plane; Leishmania divides along a definite longitudinal plane; Plasmodium shows multiple fission.',
      'Ovule develops into seed; ovary ripens into fruit after fertilisation.',
      'Fertilisation in humans occurs in the oviduct (fallopian tube); implantation happens in the uterus.',
      'Only barrier methods like condoms prevent transmission of STDs (HIV, gonorrhoea, syphilis) alongside pregnancy.',
    ],
    topics: [
      {
        slug: 'asexual-reproduction-and-dna',
        title: 'DNA Copying & Modes of Asexual Reproduction',
        estimatedMinutes: 13,
        frequentlyTested: true,
        explanation:
          'Before cell division, DNA replicates with high—but not absolute—biochemical accuracy, creating slight variations that help populations survive changing niches. Asexual modes include binary/multiple fission (Amoeba, Plasmodium), fragmentation (Spirogyra), budding (Hydra, yeast), spore formation (Rhizopus), and vegetative propagation (potato, sugarcane, rose, Bryophyllum).',
        importantDefinitions: [
          { term: 'Spore Formation', meaning: 'Production of thick-walled microscopic reproductive units inside sporangia that survive harsh conditions.' },
          { term: 'Tissue Culture', meaning: 'Growing disease-free ornamental plants rapidly from small tissue tips (callus) in nutrient medium.' },
        ],
        realLifeExamples: [
          'Seedless bananas and grafted mangoes preserve desirable parent traits via vegetative propagation.',
          'Bread mould (Rhizopus) spreads quickly via airborne spores.',
        ],
        keyConcepts: [
          'Vegetative propagation produces flowers and fruits earlier than seed-grown plants.',
          'Spores carry protective coats against heat and dryness.',
        ],
        summaryCard: 'Asexual reproduction yields genetically similar offspring rapidly from a single parent.',
      },
      {
        slug: 'sexual-reproduction-plants-humans',
        title: 'Sexual Reproduction in Flowering Plants & Humans',
        estimatedMinutes: 17,
        frequentlyTested: true,
        explanation:
          'Sexual reproduction combines haploid gametes from two parents to restore chromosome number in the zygote and amplify genetic diversity. In flowers, pollen lands on the stigma and grows a pollen tube through the style to the ovule. In humans, puberty activates gamete production. Contraceptive methods include mechanical barriers (condoms), hormonal oral pills, IUCDs (Copper-T), and surgical procedures (vasectomy/tubectomy).',
        importantDefinitions: [
          { term: 'Zygote', meaning: 'Diploid single cell formed by fusion of male and female gametes.' },
          { term: 'Gestation', meaning: 'Approximately 9-month period of embryonic and foetal development inside the uterus.' },
        ],
        realLifeExamples: [
          'Pollen grains of hibiscus show bright yellow dust; pea flowers self-pollinate.',
          'Seminal vesicles and prostate gland add fluid to nourish and ease sperm transport.',
        ],
        keyConcepts: [
          'Unisexual flowers (papaya, watermelon) vs bisexual flowers (hibiscus, mustard).',
          'Balanced sex ratio requires avoiding prenatal sex determination.',
        ],
        summaryCard: 'Meiosis halves chromosomes in gametes; fertilisation restores diploidy and creates variation.',
      },
    ],
    diagrams: [
      {
        title: 'Longitudinal Section of a Bisexual Flower',
        caption: 'Shows stamen (anther + filament), carpel/pistil (stigma, style, ovary with ovules), petals, and sepals.',
        diagramType: 'flower',
        labels: ['Stigma', 'Style', 'Ovary & Ovule', 'Anther & Filament', 'Petal & Sepal'],
        examTip: 'Clearly trace the pollen tube growing from stigma down the style into the ovule micropyle.',
      },
    ],
  },
  {
    subjectSlug: 'biology',
    chapterNumber: 8,
    slug: 'heredity',
    title: 'Heredity',
    unitName: 'Unit II: World of Living',
    unitWeightage: 25,
    introduction:
      'Why do pea plants show distinct tall or dwarf heights and why do human children resemble both parents with unique differences? This chapter covers accumulation of variations, Mendel’s monohybrid and dihybrid laws of inheritance, gene-to-protein expression, and sex determination.',
    objectives: [
      'Explain why sexual reproduction creates greater variation than asexual reproduction.',
      'Perform and interpret Mendel’s monohybrid (3:1 / 1:2:1) and dihybrid (9:3:3:1) crosses.',
      'Describe how DNA segments (genes) control traits by coding for proteins/enzymes.',
      'Explain XY chromosomal sex determination in humans versus environmental sex determination in some reptiles.',
    ],
    ncertTerminology: [
      { term: 'Allele', definition: 'Alternative forms of a gene occupying the same position on homologous chromosomes (e.g., T and t).' },
      { term: 'Phenotype', definition: 'Observable physical appearance of a trait (e.g., tall or dwarf).' },
      { term: 'Genotype', definition: 'Genetic constitution of an organism (e.g., TT, Tt, tt).' },
      { term: 'Dominant Trait', definition: 'Trait expressed in the F₁ heterozygous generation, masking the recessive allele.' },
    ],
    formulas: [
      { name: 'Monohybrid F₂ Phenotypic Ratio', expression: '3 : 1', variables: '3 Dominant : 1 Recessive (Genotypic 1 TT : 2 Tt : 1 tt)' },
      { name: 'Dihybrid F₂ Phenotypic Ratio', expression: '9 : 3 : 3 : 1', variables: 'Demonstrates Law of Independent Assortment' },
    ],
    chemicalEquations: [],
    solvedExamples: [
      {
        problem: 'In a pea cross between pure tall (TT) and pure dwarf (tt), find the F₁ and F₂ progeny ratios.',
        given: 'P₁: TT × tt.',
        solutionSteps: [
          'Gametes from TT are T; gametes from tt are t.',
          'F₁ generation: All offspring are Tt (100% phenotypically tall).',
          'Selfing F₁ (Tt × Tt) gives gametes T, t from each parent.',
          'Punnett square combinations: 1 TT, 2 Tt, 1 tt.',
        ],
        answer: 'F₁: 100% Tall (Tt). F₂ Phenotype: 3 Tall : 1 Dwarf; Genotype: 1 TT : 2 Tt : 1 tt.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Claiming the mother determines the sex of a human child.',
        correction: 'Mothers always contribute an X chromosome; fathers contribute either X (girl, XX) or Y (boy, XY), so the father’s sperm determines sex.',
      },
      {
        mistake: 'Thinking dominant alleles are always more common in a population.',
        correction: 'Dominance only describes expression in heterozygotes, not population frequency.',
      },
    ],
    quickRevisionNotes: [
      'Mendel chose garden pea (Pisum sativum) for short life cycle, clear contrasting traits, and ease of self/cross pollination.',
      'Genes code for enzymes; efficient enzyme makes more growth hormone → tall plant.',
      'Human somatic cells contain 23 pairs (46 chromosomes): 22 autosome pairs + 1 sex chromosome pair.',
      'In turtles and some lizards, egg incubation temperature determines offspring sex.',
    ],
    topics: [
      {
        slug: 'mendel-laws-of-inheritance',
        title: 'Mendel’s Crosses & Gene Expression',
        estimatedMinutes: 15,
        frequentlyTested: true,
        explanation:
          'Gregor Mendel studied 7 contrasting traits in garden peas. Crossing tall (TT) and dwarf (tt) plants yielded only tall plants in F₁, proving dwarfness was recessive rather than blended away. Self-pollinating F₁ restored dwarfness in 25% of F₂ plants. In dihybrid crosses (Round-Yellow RRYY × Wrinkled-Green rryy), new recombinant traits (Round-Green and Wrinkled-Yellow) appeared in F₂, proving traits are inherited independently.',
        importantDefinitions: [
          { term: 'Independent Assortment', meaning: 'Inheritance of two different trait pairs occurs independently of one another during gamete formation.' },
          { term: 'Recessive Trait', meaning: 'Trait expressed only when both inherited alleles are identical (homozygous, e.g., tt).' },
        ],
        realLifeExamples: [
          'Free vs attached earlobes in humans follow Mendelian dominant/recessive inheritance.',
          'Blood group A, B, AB, O alleles illustrate multiple alleles and co-dominance.',
        ],
        keyConcepts: [
          'Each parent contributes one copy of every gene pair via meiosis.',
          'New trait combinations in dihybrid F₂ demonstrate independent gene assortment.',
        ],
        summaryCard: 'Monohybrid F₂ = 3:1; Dihybrid F₂ = 9:3:3:1; genes act via protein/enzyme synthesis.',
      },
      {
        slug: 'sex-determination-in-humans',
        title: 'Sex Determination & Chromosomes',
        estimatedMinutes: 10,
        frequentlyTested: true,
        explanation:
          'Humans have 22 pairs of matched autosomes and one sex chromosome pair. Females have XX (homogametic) and produce only X-bearing ova. Males have XY (heterogametic, where Y is shorter) and produce 50% X-sperms and 50% Y-sperms. Therefore, every pregnancy has an equal 50% chance of producing a girl (XX) or a boy (XY).',
        importantDefinitions: [
          { term: 'Autosomes', meaning: 'The 22 pairs of non-sex chromosomes identical in both males and females.' },
          { term: 'Sex Chromosomes', meaning: 'The 23rd chromosome pair (XX or XY) governing biological sex in humans.' },
        ],
        realLifeExamples: [
          'Snails can change sex within their lifetime, showing sex is not always strictly genetic across all animals.',
        ],
        keyConcepts: [
          '50% probability of XX (female) and 50% probability of XY (male) at fertilisation.',
        ],
        summaryCard: 'Mother gives X; Father gives X or Y → Father’s gamete determines child’s biological sex.',
      },
    ],
    diagrams: [
      {
        title: 'Human Sex Determination Cross',
        caption: 'XX female gametes (X, X) combined with XY male gametes (X, Y) yield 50% XX girls and 50% XY boys.',
        diagramType: 'flower',
        labels: ['Mother (44 + XX)', 'Father (44 + XY)', 'Gametes: X vs X, Y', 'Offspring: 50% XX, 50% XY'],
        examTip: 'Always draw the branching cross diagram showing 50%-50% probability clearly.',
      },
    ],
  },
  {
    subjectSlug: 'biology',
    chapterNumber: 13,
    slug: 'our-environment',
    title: 'Our Environment',
    unitName: 'Unit V: Natural Resources',
    unitWeightage: 5,
    introduction:
      'Ecosystems link sunlight, soil, plants, herbivores, carnivores, and decomposers into delicate energy and nutrient flows. This chapter (Unit V of the CBSE 2026–27 syllabus) explains food chains, the 10% energy law, biological magnification, ozone depletion, and sustainable waste management.',
    objectives: [
      'Differentiate biotic and abiotic ecosystem components and roles of producers, consumers, and decomposers.',
      'Apply Lindeman’s 10% law to calculate energy across trophic levels and explain why food chains stay short.',
      'Explain biological magnification of non-biodegradable pesticides along food chains.',
      'Describe stratospheric ozone formation, CFC-driven depletion, and biodegradable vs non-biodegradable waste practices.',
    ],
    ncertTerminology: [
      { term: 'Trophic Level', definition: 'Each feeding step or energy transfer position in a food chain.' },
      { term: '10% Law', definition: 'Only about 10% of the energy at one trophic level is transferred to the next higher level; 90% is lost as heat/life processes.' },
      { term: 'Biological Magnification', definition: 'Progressive increase in concentration of non-biodegradable toxic chemicals at each successive trophic level.' },
      { term: 'Decomposers', definition: 'Bacteria and fungi that break down dead organic matter into simple inorganic nutrients for soil.' },
    ],
    formulas: [
      { name: 'Energy Transfer (10% Law)', expression: 'Eₙ₊₁ = 0.10 × Eₙ', variables: 'Only 1% of incident sunlight is captured by green plants; 10% passes per trophic step' },
    ],
    chemicalEquations: [
      {
        title: 'Stratospheric Ozone Formation',
        equation: 'O₂ —(UV)→ O + O;   O + O₂ → O₃ (Ozone)',
        type: 'Photochemical Synthesis',
        notes: 'Ozone shields Earth from harmful ultraviolet radiation that causes skin cancer and cataracts.',
      },
    ],
    solvedExamples: [
      {
        problem: 'In a food chain Grass → Grasshopper → Frog → Snake → Peacock, if 20,000 J of solar energy falls on grass, how much energy reaches the snake?',
        given: 'Incident sunlight = 20,000 J.',
        solutionSteps: [
          'Green plants capture only 1% of incident solar energy: Grass energy = 1% of 20,000 J = 200 J.',
          'Grasshopper (10% of grass) = 20 J.',
          'Frog (10% of grasshopper) = 2 J.',
          'Snake (10% of frog) = 0.2 J.',
        ],
        answer: '0.2 J reaches the snake (note the 1% sunlight-to-plant capture rule first!).',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Taking 10% of solar energy directly instead of 1% for plants.',
        correction: 'Terrestrial plants capture ~1% of sunlight energy; the 10% law applies between subsequent trophic levels.',
      },
      {
        mistake: 'Thinking energy flow in an ecosystem is cyclic like nutrients.',
        correction: 'Energy flow is strictly unidirectional (Sun → Producers → Consumers → Heat) and never returns to the Sun.',
      },
    ],
    quickRevisionNotes: [
      'Food webs provide greater ecosystem stability than isolated food chains because consumers have alternative food sources.',
      'Humans occupy the top trophic level and therefore accumulate the highest concentrations of pesticides via biomagnification.',
      'Chlorofluorocarbons (CFCs) from old refrigerators/aerosols caused ozone depletion; the 1987 UNEP Montreal Protocol froze CFC production.',
      'Enzymes are specific in action—microbial enzymes break down paper and food scraps (biodegradable) but not plastics (non-biodegradable).',
    ],
    topics: [
      {
        slug: 'ecosystems-food-chains-10-percent-law',
        title: 'Ecosystems, Food Webs & 10% Energy Law',
        estimatedMinutes: 12,
        frequentlyTested: true,
        explanation:
          'An ecosystem combines biotic organisms (producers, primary/secondary/tertiary consumers, decomposers) with abiotic factors (temperature, rain, soil). Because 90% of chemical energy is spent in respiration, movement, and heat at every trophic step, very little usable energy remains after 3–4 levels, keeping food chains short. Toxic chemicals like DDT enter water/soil, resist breakdown, and magnify exponentially toward top carnivores.',
        importantDefinitions: [
          { term: 'Ecosystem', meaning: 'Self-sustaining functional unit where living organisms interact with each other and their physical environment.' },
          { term: 'Food Web', meaning: 'Interconnected network of multiple food chains within an ecosystem.' },
        ],
        realLifeExamples: [
          'A garden or aquarium is an ecosystem; aquariums need manual cleaning because they lack sufficient natural decomposers compared to ponds.',
          'Disposable clay kulhads consumed fertile topsoil; paper cups are preferred as biodegradable alternatives.',
        ],
        keyConcepts: [
          'Unidirectional energy flow vs cyclic mineral flow.',
          'Decomposers prevent waste accumulation and replenish soil nitrates/phosphates.',
        ],
        summaryCard: 'Plants capture 1% sunlight; each trophic transfer retains ~10%; toxins biomagnify upward.',
      },
      {
        slug: 'ozone-layer-and-waste-management',
        title: 'Ozone Depletion & Waste Management',
        estimatedMinutes: 10,
        frequentlyTested: true,
        explanation:
          'At ground level ozone is a toxic pollutant, but in the upper stratosphere O₃ absorbs damaging UV-B/UV-C radiation. Synthetic CFCs release chlorine radicals that destroy ozone molecules. On land, segregrating biodegradable kitchen waste (composting) from non-biodegradable plastics (recycling/reuse) reduces landfill burden and soil toxicity.',
        importantDefinitions: [
          { term: 'Biodegradable Waste', meaning: 'Substances broken down into harmless simpler forms by biological microbial enzymes over time.' },
          { term: 'Non-Biodegradable Waste', meaning: 'Man-made materials like plastics and glass that resist enzymatic breakdown and persist in ecosystems.' },
        ],
        realLifeExamples: [
          'Using cloth bags instead of single-use polythene bags and composting vegetable peels at home.',
        ],
        keyConcepts: [
          'Follow the 5 Rs: Refuse, Reduce, Reuse, Repurpose, Recycle.',
          'Ozone shield thinning raises UV skin cancer and crop damage risks.',
        ],
        summaryCard: 'Protect stratospheric O₃ by phasing out CFCs; segregate biodegradable vs recyclable waste.',
      },
    ],
    diagrams: [
      {
        title: 'Trophic Pyramid & 10% Energy Flow',
        caption: 'Producers form the wide energy base; energy decreases by 90% at each ascending trophic level.',
        diagramType: 'food_web',
        labels: ['Producers (1000 J)', 'Primary Consumers (100 J)', 'Secondary Consumers (10 J)', 'Tertiary Consumers (1 J)'],
        examTip: 'Always state that energy flow is unidirectional and cannot revert back to lower trophic levels.',
      },
    ],
  },
];
