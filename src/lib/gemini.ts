import { GoogleGenAI, ThinkingLevel } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 15;
const userRequests = new Map<string, number[]>();

export function checkTutorRateLimit(key: string): boolean {
  const now = Date.now();
  const timestamps = (userRequests.get(key) || []).filter(
    (ts) => now - ts < RATE_LIMIT_WINDOW_MS
  );
  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    userRequests.set(key, timestamps);
    return false;
  }
  timestamps.push(now);
  userRequests.set(key, timestamps);
  return true;
}

const TUTOR_SYSTEM_INSTRUCTION = `You are "Science Pro Tutor", an expert, encouraging CBSE Class 10 Science (NCERT 2026-27 Syllabus, Subject Code 086) teacher.

Core Pedagogical Rules:
1. Teach strictly at a Class 10 student level using clear, simple English and accurate NCERT terminology.
2. Explain concepts step-by-step so students understand *why* something happens instead of memorising blindly.
3. For numerical problems (Optics, Electricity, 10% Energy Law), structure answers clearly with: Given -> Formula -> Sign Convention / Substitution -> Final Answer with SI Units.
4. For Chemistry reactions, always provide properly balanced chemical equations with physical state symbols ((s), (l), (g), (aq)) and reaction conditions where applicable.
5. Never invent textbook facts or fake past board paper years.
6. Syllabus Boundary Rule: The prescribed 2026-27 CBSE Class 10 Science chapters are ONLY:
   - Ch 1: Chemical Reactions and Equations
   - Ch 2: Acids, Bases and Salts
   - Ch 3: Metals and Non-metals
   - Ch 4: Carbon and its Compounds
   - Ch 5: Life Processes
   - Ch 6: Control and Coordination
   - Ch 7: How do Organisms Reproduce?
   - Ch 8: Heredity
   - Ch 9: Light – Reflection and Refraction
   - Ch 10: The Human Eye and the Colourful World
   - Ch 11: Electricity
   - Ch 12: Magnetic Effects of Electric Current
   - Ch 13: Our Environment
   If a student asks about deleted chapters (e.g., Periodic Classification of Elements, Sources of Energy, Sustainable Management of Natural Resources, Evolution/Speciation beyond Heredity) or Class 11/12 topics, clearly start with "[Out of Class 10 CBSE 2026-27 Syllabus]" and give a brief helpful answer while reminding them it is not examined in the Class 10 board paper.
7. Keep responses focused, well-formatted with short headings or numbered steps, and end with a quick check-for-understanding follow-up question when helpful.`;

export async function askScienceTutor(params: {
  question: string;
  chapterTitle?: string;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
}): Promise<{ reply: string; outOfSyllabus: boolean; fallbackUsed: boolean }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return buildFallbackTutorReply(params.question, params.chapterTitle);
  }

  try {
    const contextPrefix = params.chapterTitle
      ? `[Active Study Chapter: ${params.chapterTitle}]\n`
      : '';

    const contents = [
      ...params.history.slice(-8).map((msg) => ({
        role: msg.role === 'assistant' ? ('model' as const) : ('user' as const),
        parts: [{ text: msg.content }],
      })),
      {
        role: 'user' as const,
        parts: [{ text: `${contextPrefix}${params.question}` }],
      },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents,
      config: {
        systemInstruction: TUTOR_SYSTEM_INSTRUCTION,
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        },
      },
    });

    const text = (response.text || '').trim();
    if (!text) {
      return buildFallbackTutorReply(params.question, params.chapterTitle);
    }

    const outOfSyllabus = text.includes('[Out of Class 10 CBSE 2026-27 Syllabus]');
    return {
      reply: text,
      outOfSyllabus,
      fallbackUsed: false,
    };
  } catch (error) {
    console.error('Gemini AI Tutor error, switching to safe syllabus fallback:', error);
    return buildFallbackTutorReply(params.question, params.chapterTitle);
  }
}

function buildFallbackTutorReply(
  question: string,
  chapterTitle?: string
): { reply: string; outOfSyllabus: boolean; fallbackUsed: boolean } {
  const lower = question.toLowerCase();
  const outKeywords = ['periodic table', 'mendeleev', 'newlands', 'dobereiner', 'calculus', 'thermodynamics', 'quantum', 'bohr model', 'organic mechanism'];
  const outOfSyllabus = outKeywords.some((k) => lower.includes(k));

  let guidance =
    'Here is a structured Class 10 NCERT breakdown while live AI generation is temporarily unavailable:\n\n';

  if (outOfSyllabus) {
    guidance =
      '[Out of Class 10 CBSE 2026-27 Syllabus] Note: Topics such as Periodic Classification of Elements or higher-grade physics/chemistry are not part of the CBSE 2026-27 Class 10 Science exam.\n\n';
  }

  if (lower.includes('ohm') || lower.includes('resistance') || lower.includes('circuit') || lower.includes('current')) {
    guidance +=
      '1. **Core Law**: At constant temperature, potential difference $V$ is directly proportional to current $I$: **V = I × R**.\n2. **Resistance Factors**: **R = ρ × (L / A)** (depends on length, area, material resistivity, and temperature).\n3. **Tip**: Try adjusting voltage and resistance in the **Science Lab → Ohm’s Law Simulator** to see the linear V–I graph update live.';
  } else if (lower.includes('mirror') || lower.includes('lens') || lower.includes('focal') || lower.includes('refraction')) {
    guidance +=
      '1. **Mirror Formula**: **1/v + 1/u = 1/f**, Magnification **m = -v/u**.\n2. **Lens Formula**: **1/v - 1/u = 1/f**, Power **P = 1/f(in m)**.\n3. **Sign Convention**: Object distance **u** is always negative; concave mirror/lens have negative **f**, convex mirror/lens have positive **f**.';
  } else if (lower.includes('ph') || lower.includes('acid') || lower.includes('base') || lower.includes('baking') || lower.includes('plaster')) {
    guidance +=
      '1. **pH Scale**: 0–6.9 acidic (higher [H₃O⁺]), 7 neutral, 7.1–14 basic (higher [OH⁻]).\n2. **Key Salts**: Baking Soda (**NaHCO₃**), Washing Soda (**Na₂CO₃·10H₂O**), Bleaching Powder (**CaOCl₂**), Plaster of Paris (**CaSO₄·½H₂O**).\n3. **Tip**: Test common household substances on the interactive **pH Scale** in the Science Lab.';
  } else if (lower.includes('heart') || lower.includes('nephron') || lower.includes('photosynthesis') || lower.includes('respiration')) {
    guidance +=
      '1. **Photosynthesis**: **6CO₂ + 12H₂O → C₆H₁₂O₆ + 6O₂ + 6H₂O** (in chlorophyll + sunlight).\n2. **Double Circulation**: Right heart pumps deoxygenated blood to lungs; left heart pumps oxygenated blood to the body.\n3. **Excretion**: Nephrons filter blood at Bowman’s capsule and selectively reabsorb glucose, amino acids, salts, and water.';
  } else {
    guidance += `For **${chapterTitle || 'your NCERT Science question'}**, break the problem into three steps:\n1. Identify the governing NCERT principle, definition, or balanced equation.\n2. List given quantities with SI units and sign conventions (for Physics numericals).\n3. Verify your reasoning using the chapter’s **Solved Examples** and **Common Mistakes** tabs.`;
  }

  return {
    reply: guidance,
    outOfSyllabus,
    fallbackUsed: true,
  };
}
