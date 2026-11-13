import { sql } from 'drizzle-orm';
import { db } from './index.ts';
import {
  announcements,
  chapters,
  diagrams,
  lessons,
  mockTests,
  questionOptions,
  questions,
  subjects,
  topics,
} from './schema.ts';
import { chemistryChapters } from './seedChemistry.ts';
import { biologyChapters } from './seedBiology.ts';
import { physicsChapters } from './seedPhysics.ts';
import { questionSeeds } from './seedQuestions.ts';

let seedPromise: Promise<void> | null = null;

export async function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = runSeed().catch((err) => {
      seedPromise = null;
      throw err;
    });
  }
  return seedPromise;
}

async function runSeed(): Promise<void> {
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(subjects);

  if (count > 0) {
    return;
  }

  const insertedSubjects = await db
    .insert(subjects)
    .values([
      {
        slug: 'chemistry',
        name: 'Chemistry',
        description:
          'Chemical Reactions, Acids-Bases-Salts, Metals & Non-metals, and Carbon Compounds.',
        unitSummary: 'Unit I: Chemical Substances – Nature and Behaviour',
        totalMarks: 25,
        sortOrder: 1,
      },
      {
        slug: 'biology',
        name: 'Biology',
        description:
          'Life Processes, Control & Coordination, Reproduction, Heredity, and Our Environment.',
        unitSummary: 'Unit II: World of Living (25) + Unit V: Natural Resources (5)',
        totalMarks: 30,
        sortOrder: 2,
      },
      {
        slug: 'physics',
        name: 'Physics',
        description:
          'Light Reflection & Refraction, Human Eye, Electricity, and Magnetic Effects of Current.',
        unitSummary: 'Unit III: Natural Phenomena (12) + Unit IV: Effects of Current (13)',
        totalMarks: 25,
        sortOrder: 3,
      },
    ])
    .returning();

  const subjectMap = new Map(insertedSubjects.map((s) => [s.slug, s.id]));
  const allChapters = [...chemistryChapters, ...biologyChapters, ...physicsChapters];
  const chapterIdBySlug = new Map<string, number>();

  for (const ch of allChapters) {
    const subjectId = subjectMap.get(ch.subjectSlug)!;
    const [insertedChapter] = await db
      .insert(chapters)
      .values({
        subjectId,
        chapterNumber: ch.chapterNumber,
        slug: ch.slug,
        title: ch.title,
        unitName: ch.unitName,
        unitWeightage: ch.unitWeightage,
        introduction: ch.introduction,
        objectives: ch.objectives,
        ncertTerminology: ch.ncertTerminology,
        formulas: ch.formulas,
        chemicalEquations: ch.chemicalEquations,
        solvedExamples: ch.solvedExamples,
        commonMistakes: ch.commonMistakes,
        quickRevisionNotes: ch.quickRevisionNotes,
      })
      .returning();

    chapterIdBySlug.set(ch.slug, insertedChapter.id);

    for (let i = 0; i < ch.topics.length; i++) {
      const t = ch.topics[i];
      const [insertedTopic] = await db
        .insert(topics)
        .values({
          chapterId: insertedChapter.id,
          slug: t.slug,
          title: t.title,
          sortOrder: i + 1,
          estimatedMinutes: t.estimatedMinutes,
          frequentlyTested: t.frequentlyTested,
        })
        .returning();

      await db.insert(lessons).values({
        topicId: insertedTopic.id,
        explanation: t.explanation,
        importantDefinitions: t.importantDefinitions,
        realLifeExamples: t.realLifeExamples,
        keyConcepts: t.keyConcepts,
        summaryCard: t.summaryCard,
      });
    }

    for (const d of ch.diagrams) {
      await db.insert(diagrams).values({
        chapterId: insertedChapter.id,
        title: d.title,
        caption: d.caption,
        diagramType: d.diagramType,
        labels: d.labels,
        examTip: d.examTip,
      });
    }
  }

  const insertedQuestionIds: number[] = [];
  for (const q of questionSeeds) {
    const chapterId = chapterIdBySlug.get(q.chapterSlug);
    if (!chapterId) continue;

    const [insertedQ] = await db
      .insert(questions)
      .values({
        chapterId,
        questionType: q.questionType,
        difficulty: q.difficulty,
        provenance: q.provenance,
        sourceNote: q.sourceNote,
        marks: q.marks,
        passageText: q.passageText || null,
        prompt: q.prompt,
        correctAnswerText: q.correctAnswerText,
        explanation: q.explanation,
        markingRubric: q.markingRubric || null,
      })
      .returning();

    insertedQuestionIds.push(insertedQ.id);

    if (q.options && q.options.length > 0) {
      await db.insert(questionOptions).values(
        q.options.map((opt) => ({
          questionId: insertedQ.id,
          label: opt.label,
          optionText: opt.optionText,
          isCorrect: opt.isCorrect,
        }))
      );
    }
  }

  await db.insert(mockTests).values([
    {
      title: 'CBSE Class 10 Science Full-Pattern Mock Paper 1',
      description:
        'Timed 3-hour board-style examination following CBSE 2026–27 Science (086) unit distribution across Chemistry, Biology, Physics, and Our Environment.',
      provenance: 'official_cbse_pattern',
      durationMinutes: 180,
      totalMarks: 80,
      questionIds: insertedQuestionIds,
      isActive: true,
    },
    {
      title: 'Competency & Case-Study Rapid Assessment',
      description:
        'Focused 45-minute competency, assertion–reason, and numerical evaluation modeled on NEP 2026–27 board emphasis.',
      provenance: 'practice_generated',
      durationMinutes: 45,
      totalMarks: 30,
      questionIds: insertedQuestionIds.slice(0, 16),
      isActive: true,
    },
  ]);

  await db.insert(announcements).values([
    {
      title: 'CBSE 2026–27 Syllabus Verified (13 Chapters)',
      message:
        'All 5 Units (80 Marks Theory + 20 Marks Internal Assessment) including Chapter 13: Our Environment are aligned with the latest NCERT rationalized textbook.',
      priority: 'important',
      isActive: true,
    },
    {
      title: 'Weekly Board Prep Focus: Optics & Electricity Numericals',
      message:
        'Practise sign conventions in 1/v + 1/u = 1/f and parallel circuit calculations in the Virtual Science Lab before attempting Mock Paper 1.',
      priority: 'normal',
      isActive: true,
    },
  ]);
}
