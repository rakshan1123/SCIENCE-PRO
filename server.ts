import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { db } from './src/db/index.ts';
import { ensureSeeded } from './src/db/seed.ts';
import {
  achievements,
  aiConversations,
  aiMessages,
  announcements,
  bookmarks,
  chapters,
  diagrams,
  learningProgress,
  lessons,
  mistakeNotebook,
  mockTests,
  questionOptions,
  questions,
  quizAttempts,
  quizResults,
  revisionNotes,
  studentProfiles,
  subjects,
  topics,
  users,
} from './src/db/schema.ts';
import { AuthRequest, requireAdmin, requireAuth } from './src/middleware/auth.ts';
import { askScienceTutor, checkTutorRateLimit } from './src/lib/gemini.ts';
import { adminAuth } from './src/lib/firebase-admin.ts';
import { getOrCreateUser } from './src/db/users.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '1mb' }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

// Helper: unlock badge safely
async function unlockBadge(
  userId: number,
  badgeKey: string,
  title: string,
  description: string
) {
  await db
    .insert(achievements)
    .values({ userId, badgeKey, title, description })
    .onConflictDoNothing({ target: [achievements.userId, achievements.badgeKey] });
}

// Helper: update daily streak and study minutes
async function recordStudyActivity(userId: number, addedMinutes: number, addedPoints: number) {
  const today = new Date().toISOString().slice(0, 10);
  const yesterdayDate = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);

  const [profile] = await db
    .select()
    .from(studentProfiles)
    .where(eq(studentProfiles.userId, userId))
    .limit(1);

  if (!profile) {
    await db.insert(studentProfiles).values({
      userId,
      todayStudyMinutes: addedMinutes,
      totalStudyMinutes: addedMinutes,
      learningPoints: addedPoints,
      currentStreak: 1,
      longestStreak: 1,
      lastActiveDate: today,
    });
    return;
  }

  let nextStreak = profile.currentStreak;
  let nextTodayMinutes = profile.todayStudyMinutes;

  if (profile.lastActiveDate !== today) {
    nextTodayMinutes = 0;
    if (profile.lastActiveDate === yesterdayDate) {
      nextStreak = profile.currentStreak + 1;
    } else if (profile.lastActiveDate) {
      nextStreak = 1;
    }
  }

  const longestStreak = Math.max(profile.longestStreak, nextStreak);
  await db
    .update(studentProfiles)
    .set({
      todayStudyMinutes: nextTodayMinutes + addedMinutes,
      totalStudyMinutes: profile.totalStudyMinutes + addedMinutes,
      learningPoints: profile.learningPoints + addedPoints,
      currentStreak: nextStreak,
      longestStreak,
      lastActiveDate: today,
      updatedAt: new Date(),
    })
    .where(eq(studentProfiles.userId, userId));
}

// 1. Public Curriculum Endpoint (Subjects, 13 Chapters, Topics, Lessons, Diagrams, Announcements)
app.get('/api/curriculum', async (_req, res) => {
  try {
    await ensureSeeded();

    const allSubjects = await db
      .select()
      .from(subjects)
      .orderBy(subjects.sortOrder);

    const allChapters = await db
      .select()
      .from(chapters)
      .where(eq(chapters.isPublished, true))
      .orderBy(chapters.chapterNumber);

    const allTopics = await db
      .select()
      .from(topics)
      .orderBy(topics.sortOrder);

    const allLessons = await db.select().from(lessons);
    const allDiagrams = await db.select().from(diagrams);
    const activeAnnouncements = await db
      .select()
      .from(announcements)
      .where(eq(announcements.isActive, true))
      .orderBy(desc(announcements.createdAt))
      .limit(5);

    const lessonByTopic = new Map(allLessons.map((l) => [l.topicId, l]));
    const topicsByChapter = new Map<number, Array<any>>();
    for (const t of allTopics) {
      const list = topicsByChapter.get(t.chapterId) || [];
      list.push({
        ...t,
        lesson: lessonByTopic.get(t.id) || null,
      });
      topicsByChapter.set(t.chapterId, list);
    }

    const diagramsByChapter = new Map<number, Array<any>>();
    for (const d of allDiagrams) {
      const list = diagramsByChapter.get(d.chapterId) || [];
      list.push(d);
      diagramsByChapter.set(d.chapterId, list);
    }

    const enrichedChapters = allChapters.map((c) => ({
      ...c,
      topics: topicsByChapter.get(c.id) || [],
      diagrams: diagramsByChapter.get(c.id) || [],
    }));

    res.json({
      subjects: allSubjects,
      chapters: enrichedChapters,
      announcements: activeAnnouncements,
    });
  } catch (error) {
    console.error('Error loading curriculum:', error);
    res.status(500).json({ error: 'Failed to load NCERT curriculum.' });
  }
});

// 2. Question Bank Endpoint
app.get('/api/questions', async (req, res) => {
  try {
    await ensureSeeded();

    const chapterId = req.query.chapterId ? Number(req.query.chapterId) : null;
    const questionType = req.query.questionType ? String(req.query.questionType) : null;
    const difficulty = req.query.difficulty ? String(req.query.difficulty) : null;

    const conditions = [];
    if (chapterId && !Number.isNaN(chapterId)) {
      conditions.push(eq(questions.chapterId, chapterId));
    }
    if (questionType && questionType !== 'all') {
      conditions.push(eq(questions.questionType, questionType));
    }
    if (difficulty && difficulty !== 'all') {
      conditions.push(eq(questions.difficulty, difficulty));
    }

    const rows =
      conditions.length > 0
        ? await db
            .select()
            .from(questions)
            .where(and(...conditions))
            .orderBy(questions.id)
        : await db.select().from(questions).orderBy(questions.id);

    const qIds = rows.map((q) => q.id);
    const opts =
      qIds.length > 0
        ? await db
            .select()
            .from(questionOptions)
            .where(inArray(questionOptions.questionId, qIds))
            .orderBy(questionOptions.label)
        : [];

    const optsByQuestion = new Map<number, typeof opts>();
    for (const o of opts) {
      const list = optsByQuestion.get(o.questionId) || [];
      list.push(o);
      optsByQuestion.set(o.questionId, list);
    }

    res.json({
      questions: rows.map((q) => ({
        ...q,
        options: optsByQuestion.get(q.id) || [],
      })),
    });
  } catch (error) {
    console.error('Error loading questions:', error);
    res.status(500).json({ error: 'Failed to load practice questions.' });
  }
});

// 3. Mock Tests Endpoint
app.get('/api/mocks', async (_req, res) => {
  try {
    await ensureSeeded();

    const tests = await db
      .select()
      .from(mockTests)
      .where(eq(mockTests.isActive, true))
      .orderBy(mockTests.id);

    const allQuestions = await db.select().from(questions).orderBy(questions.id);
    const allOptions = await db.select().from(questionOptions).orderBy(questionOptions.label);

    const optsByQuestion = new Map<number, typeof allOptions>();
    for (const o of allOptions) {
      const list = optsByQuestion.get(o.questionId) || [];
      list.push(o);
      optsByQuestion.set(o.questionId, list);
    }

    const qById = new Map(
      allQuestions.map((q) => [q.id, { ...q, options: optsByQuestion.get(q.id) || [] }])
    );

    res.json({
      mockTests: tests.map((t) => ({
        ...t,
        questions: (t.questionIds || [])
          .map((id) => qById.get(id))
          .filter(Boolean),
      })),
    });
  } catch (error) {
    console.error('Error loading mock tests:', error);
    res.status(500).json({ error: 'Failed to load board mock tests.' });
  }
});

// 4. Authenticated Student State Endpoint
app.get('/api/me', requireAuth, async (req: AuthRequest, res) => {
  try {
    await ensureSeeded();
    const userId = req.dbUser!.id;

    const [profile] = await db
      .select()
      .from(studentProfiles)
      .where(eq(studentProfiles.userId, userId))
      .limit(1);

    const progress = await db
      .select()
      .from(learningProgress)
      .where(eq(learningProgress.userId, userId));

    const attempts = await db
      .select()
      .from(quizAttempts)
      .where(eq(quizAttempts.userId, userId))
      .orderBy(desc(quizAttempts.completedAt))
      .limit(20);

    const savedBookmarks = await db
      .select()
      .from(bookmarks)
      .where(eq(bookmarks.userId, userId))
      .orderBy(desc(bookmarks.createdAt));

    const mistakes = await db
      .select()
      .from(mistakeNotebook)
      .where(eq(mistakeNotebook.userId, userId))
      .orderBy(desc(mistakeNotebook.updatedAt));

    const notes = await db
      .select()
      .from(revisionNotes)
      .where(eq(revisionNotes.userId, userId))
      .orderBy(desc(revisionNotes.updatedAt));

    const badges = await db
      .select()
      .from(achievements)
      .where(eq(achievements.userId, userId))
      .orderBy(desc(achievements.unlockedAt));

    res.json({
      user: req.dbUser,
      profile,
      progress,
      attempts,
      bookmarks: savedBookmarks,
      mistakes,
      notes,
      achievements: badges,
    });
  } catch (error) {
    console.error('Error loading user dashboard state:', error);
    res.status(500).json({ error: 'Failed to load student progress.' });
  }
});

// 5. Update Student Profile Preferences & Goals
app.patch('/api/profile', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.dbUser!.id;
    const { dailyGoalMinutes, preferredTheme, lastChapterSlug, addedStudyMinutes } = req.body;

    const updates: Record<string, any> = { updatedAt: new Date() };
    if (typeof dailyGoalMinutes === 'number' && dailyGoalMinutes >= 10 && dailyGoalMinutes <= 300) {
      updates.dailyGoalMinutes = Math.round(dailyGoalMinutes);
    }
    if (preferredTheme === 'dark' || preferredTheme === 'light') {
      updates.preferredTheme = preferredTheme;
    }
    if (typeof lastChapterSlug === 'string') {
      updates.lastChapterSlug = lastChapterSlug;
    }

    await db
      .update(studentProfiles)
      .set(updates)
      .where(eq(studentProfiles.userId, userId));

    if (typeof addedStudyMinutes === 'number' && addedStudyMinutes > 0) {
      await recordStudyActivity(userId, Math.min(addedStudyMinutes, 120), addedStudyMinutes * 2);
    }

    const [profile] = await db
      .select()
      .from(studentProfiles)
      .where(eq(studentProfiles.userId, userId))
      .limit(1);

    res.json({ profile });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update student profile.' });
  }
});

// 6. Update Topic Learning Progress (Not Started | Learning | Needs Revision | Completed)
app.put('/api/progress', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.dbUser!.id;
    const { chapterId, topicId, status, timeSpentMinutes } = req.body;

    const allowed = ['not_started', 'learning', 'needs_revision', 'completed'];
    if (!chapterId || !topicId || !allowed.includes(status)) {
      return res.status(400).json({ error: 'Invalid topic progress payload.' });
    }

    const [existing] = await db
      .select()
      .from(learningProgress)
      .where(
        and(
          eq(learningProgress.userId, userId),
          eq(learningProgress.topicId, Number(topicId))
        )
      )
      .limit(1);

    const addedMins = typeof timeSpentMinutes === 'number' && timeSpentMinutes > 0 ? timeSpentMinutes : 5;

    const [saved] = await db
      .insert(learningProgress)
      .values({
        userId,
        chapterId: Number(chapterId),
        topicId: Number(topicId),
        status,
        timeSpentMinutes: addedMins,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [learningProgress.userId, learningProgress.topicId],
        set: {
          status,
          timeSpentMinutes: (existing?.timeSpentMinutes || 0) + addedMins,
          updatedAt: new Date(),
        },
      })
      .returning();

    const xpEarned = status === 'completed' && existing?.status !== 'completed' ? 25 : 5;
    await recordStudyActivity(userId, addedMins, xpEarned);

    if (status === 'completed') {
      const completedRows = await db
        .select()
        .from(learningProgress)
        .where(
          and(
            eq(learningProgress.userId, userId),
            eq(learningProgress.status, 'completed')
          )
        );
      if (completedRows.length >= 1) {
        await unlockBadge(
          userId,
          'first_topic_mastered',
          'First Concept Mastered',
          'Completed your first NCERT Class 10 Science topic.'
        );
      }
      if (completedRows.length >= 10) {
        await unlockBadge(
          userId,
          'ncert_scholar_10',
          'NCERT Scholar',
          'Mastered 10 or more NCERT Science topics.'
        );
      }
    }

    res.json({ progress: saved });
  } catch (error) {
    console.error('Error saving progress:', error);
    res.status(500).json({ error: 'Failed to save learning progress.' });
  }
});

// 7. Submit Quiz or Mock Test Attempt
app.post('/api/quiz-attempts', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.dbUser!.id;
    const { mode, chapterId, mockTestId, difficulty, timeSpentSeconds, answers } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: 'Quiz answers are required.' });
    }

    const questionIds = answers.map((a: any) => Number(a.questionId)).filter(Boolean);
    const dbQuestions = await db
      .select()
      .from(questions)
      .where(inArray(questions.id, questionIds));

    const dbOptions = await db
      .select()
      .from(questionOptions)
      .where(inArray(questionOptions.questionId, questionIds));

    const qMap = new Map(dbQuestions.map((q) => [q.id, q]));
    const optsByQ = new Map<number, typeof dbOptions>();
    for (const o of dbOptions) {
      const list = optsByQ.get(o.questionId) || [];
      list.push(o);
      optsByQ.set(o.questionId, list);
    }

    let correctCount = 0;
    let scoreMarks = 0;
    let maxMarks = 0;
    const evaluatedRows: Array<{
      questionId: number;
      userAnswer: string;
      isCorrect: boolean;
      markedForReview: boolean;
      marksAwarded: number;
      correctAnswer: string;
      explanation: string;
    }> = [];

    for (const item of answers) {
      const q = qMap.get(Number(item.questionId));
      if (!q) continue;

      const userAnswer = String(item.userAnswer || '').trim();
      const markedForReview = Boolean(item.markedForReview);
      maxMarks += q.marks;

      let isCorrect = false;
      const opts = optsByQ.get(q.id) || [];

      if (opts.length > 0) {
        const correctOpt = opts.find((o) => o.isCorrect);
        isCorrect =
          Boolean(correctOpt) &&
          (userAnswer === correctOpt!.optionText ||
            userAnswer.toLowerCase() === correctOpt!.label.toLowerCase());
      } else if (q.questionType === 'fill_blank') {
        isCorrect =
          userAnswer.toLowerCase().replace(/\s+/g, '') ===
          q.correctAnswerText.toLowerCase().replace(/\s+/g, '');
      } else {
        // Subjective short_answer / long_answer self-evaluation flag or keyword check
        isCorrect = Boolean(item.selfVerifiedCorrect) || userAnswer.length >= 25;
      }

      if (isCorrect) {
        correctCount += 1;
        scoreMarks += q.marks;
      } else if (userAnswer.length > 0) {
        // Auto-capture incorrect answer into Mistake Notebook
        const [existingMistake] = await db
          .select()
          .from(mistakeNotebook)
          .where(
            and(
              eq(mistakeNotebook.userId, userId),
              eq(mistakeNotebook.questionId, q.id)
            )
          )
          .limit(1);

        await db
          .insert(mistakeNotebook)
          .values({
            userId,
            questionId: q.id,
            wrongAnswer: userAnswer,
            resolved: false,
            attemptCount: 1,
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: [mistakeNotebook.userId, mistakeNotebook.questionId],
            set: {
              wrongAnswer: userAnswer,
              resolved: false,
              attemptCount: (existingMistake?.attemptCount || 0) + 1,
              updatedAt: new Date(),
            },
          });
      }

      evaluatedRows.push({
        questionId: q.id,
        userAnswer,
        isCorrect,
        markedForReview,
        marksAwarded: isCorrect ? q.marks : 0,
        correctAnswer: q.correctAnswerText,
        explanation: q.explanation,
      });
    }

    const totalQuestions = evaluatedRows.length;
    const accuracyPercent =
      totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    const [attempt] = await db
      .insert(quizAttempts)
      .values({
        userId,
        mode: mode || 'chapter_quiz',
        chapterId: chapterId ? Number(chapterId) : null,
        mockTestId: mockTestId ? Number(mockTestId) : null,
        difficulty: difficulty || 'mixed',
        totalQuestions,
        correctCount,
        scoreMarks,
        maxMarks,
        accuracyPercent,
        timeSpentSeconds: Math.max(1, Number(timeSpentSeconds) || 30),
      })
      .returning();

    if (evaluatedRows.length > 0) {
      await db.insert(quizResults).values(
        evaluatedRows.map((r) => ({
          attemptId: attempt.id,
          questionId: r.questionId,
          userAnswer: r.userAnswer || '(Unanswered)',
          isCorrect: r.isCorrect,
          markedForReview: r.markedForReview,
        }))
      );
    }

    const studyMinutes = Math.max(2, Math.round((Number(timeSpentSeconds) || 60) / 60));
    const xpGained = Math.max(15, correctCount * 10 + (accuracyPercent >= 80 ? 25 : 0));
    await recordStudyActivity(userId, studyMinutes, xpGained);

    // Weekly challenge progress bump
    await db
      .update(studentProfiles)
      .set({
        weeklyChallengeProgress: sql`LEAST(100, ${studentProfiles.weeklyChallengeProgress} + 25)`,
      })
      .where(eq(studentProfiles.userId, userId));

    await unlockBadge(
      userId,
      'first_quiz_completed',
      'Quiz Challenger',
      'Completed your first Science Pro practice assessment.'
    );
    if (accuracyPercent >= 80 && totalQuestions >= 4) {
      await unlockBadge(
        userId,
        'accuracy_ace_80',
        'Precision Thinker',
        'Scored 80% or higher on a practice quiz.'
      );
    }
    if (mode === 'mock_test') {
      await unlockBadge(
        userId,
        'board_mock_finisher',
        'Board Exam Ready',
        'Completed a timed CBSE pattern Mock Examination.'
      );
    }

    res.json({
      attempt,
      results: evaluatedRows,
      xpGained,
    });
  } catch (error) {
    console.error('Error submitting quiz attempt:', error);
    res.status(500).json({ error: 'Failed to submit assessment attempt.' });
  }
});

// 8. Bookmarks CRUD
app.post('/api/bookmarks', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.dbUser!.id;
    const { itemType, questionId, chapterId, topicId, note } = req.body;

    const [created] = await db
      .insert(bookmarks)
      .values({
        userId,
        itemType: itemType || 'question',
        questionId: questionId ? Number(questionId) : null,
        chapterId: chapterId ? Number(chapterId) : null,
        topicId: topicId ? Number(topicId) : null,
        note: note || null,
      })
      .returning();

    res.json({ bookmark: created });
  } catch (error) {
    console.error('Error creating bookmark:', error);
    res.status(500).json({ error: 'Failed to save bookmark.' });
  }
});

app.delete('/api/bookmarks/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.dbUser!.id;
    const id = Number(req.params.id);
    await db
      .delete(bookmarks)
      .where(and(eq(bookmarks.id, id), eq(bookmarks.userId, userId)));
    res.json({ ok: true });
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    res.status(500).json({ error: 'Failed to remove bookmark.' });
  }
});

// 9. Mistake Notebook Update
app.patch('/api/mistakes/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.dbUser!.id;
    const id = Number(req.params.id);
    const { resolved } = req.body;

    const [updated] = await db
      .update(mistakeNotebook)
      .set({ resolved: Boolean(resolved), updatedAt: new Date() })
      .where(and(eq(mistakeNotebook.id, id), eq(mistakeNotebook.userId, userId)))
      .returning();

    res.json({ mistake: updated });
  } catch (error) {
    console.error('Error updating mistake notebook:', error);
    res.status(500).json({ error: 'Failed to update mistake status.' });
  }
});

// 10. Student Revision Notes CRUD
app.post('/api/notes', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.dbUser!.id;
    const { chapterId, title, content } = req.body;
    if (!chapterId || !title || !content) {
      return res.status(400).json({ error: 'Chapter, title, and note content are required.' });
    }

    const [created] = await db
      .insert(revisionNotes)
      .values({
        userId,
        chapterId: Number(chapterId),
        title: String(title).trim(),
        content: String(content).trim(),
      })
      .returning();

    res.json({ note: created });
  } catch (error) {
    console.error('Error saving note:', error);
    res.status(500).json({ error: 'Failed to save revision note.' });
  }
});

app.delete('/api/notes/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.dbUser!.id;
    const id = Number(req.params.id);
    await db
      .delete(revisionNotes)
      .where(and(eq(revisionNotes.id, id), eq(revisionNotes.userId, userId)));
    res.json({ ok: true });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete revision note.' });
  }
});

// 11. AI Science Tutor (Conversations + Server-side Gemini 4 Hydrogen)
app.get('/api/tutor/conversations', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.dbUser!.id;
    const convos = await db
      .select()
      .from(aiConversations)
      .where(eq(aiConversations.userId, userId))
      .orderBy(desc(aiConversations.createdAt))
      .limit(15);

    const convoIds = convos.map((c) => c.id);
    const msgs =
      convoIds.length > 0
        ? await db
            .select()
            .from(aiMessages)
            .where(inArray(aiMessages.conversationId, convoIds))
            .orderBy(aiMessages.createdAt)
        : [];

    const msgsByConvo = new Map<number, typeof msgs>();
    for (const m of msgs) {
      const list = msgsByConvo.get(m.conversationId) || [];
      list.push(m);
      msgsByConvo.set(m.conversationId, list);
    }

    res.json({
      conversations: convos.map((c) => ({
        ...c,
        messages: msgsByConvo.get(c.id) || [],
      })),
    });
  } catch (error) {
    console.error('Error loading AI tutor conversations:', error);
    res.status(500).json({ error: 'Failed to load AI tutor history.' });
  }
});

app.post('/api/tutor/ask', async (req: AuthRequest, res) => {
  try {
    const { message, chapterId, chapterTitle, conversationId, history } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Please enter a Science question.' });
    }

    // Check optional auth header so authenticated users persist chat history
    let authenticatedUserId: number | null = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const decoded = await adminAuth.verifyIdToken(authHeader.split('Bearer ')[1]);
        const dbUser = await getOrCreateUser(
          decoded.uid,
          decoded.email || 'student@sciencepro.edu',
          decoded.name || 'Class 10 Student',
          decoded.picture || null
        );
        authenticatedUserId = dbUser.id;
      } catch {
        // Ignore invalid optional token and continue as rate-limited guest
      }
    }

    const rateKey = authenticatedUserId ? `user:${authenticatedUserId}` : `ip:${req.ip}`;
    if (!checkTutorRateLimit(rateKey)) {
      return res.status(429).json({
        error: 'You are asking questions very quickly. Please wait a minute and try again.',
      });
    }

    const safeHistory = Array.isArray(history)
      ? history
          .filter((h: any) => h && (h.role === 'user' || h.role === 'assistant') && typeof h.content === 'string')
          .slice(-10)
      : [];

    const result = await askScienceTutor({
      question: message.trim(),
      chapterTitle: typeof chapterTitle === 'string' ? chapterTitle : undefined,
      history: safeHistory,
    });

    let activeConversationId = conversationId ? Number(conversationId) : null;

    if (authenticatedUserId) {
      if (!activeConversationId) {
        const [newConvo] = await db
          .insert(aiConversations)
          .values({
            userId: authenticatedUserId,
            chapterId: chapterId ? Number(chapterId) : null,
            title: message.trim().slice(0, 60),
          })
          .returning();
        activeConversationId = newConvo.id;
      }

      await db.insert(aiMessages).values([
        {
          conversationId: activeConversationId,
          role: 'user',
          content: message.trim(),
          outOfSyllabusFlag: false,
        },
        {
          conversationId: activeConversationId,
          role: 'assistant',
          content: result.reply,
          outOfSyllabusFlag: result.outOfSyllabus,
        },
      ]);

      await recordStudyActivity(authenticatedUserId, 2, 5);
    }

    res.json({
      conversationId: activeConversationId,
      reply: result.reply,
      outOfSyllabus: result.outOfSyllabus,
      fallbackUsed: result.fallbackUsed,
    });
  } catch (error) {
    console.error('Error in /api/tutor/ask:', error);
    res.status(500).json({ error: 'AI Tutor encountered an unexpected error.' });
  }
});

// 12. Admin Educator Routes (Strictly Role-Protected)
app.get('/api/admin/overview', requireAuth, requireAdmin, async (_req: AuthRequest, res) => {
  try {
    await ensureSeeded();

    const [{ studentCount }] = await db
      .select({ studentCount: sql<number>`count(*)::int` })
      .from(users);

    const [{ attemptCount, avgAccuracy }] = await db
      .select({
        attemptCount: sql<number>`count(*)::int`,
        avgAccuracy: sql<number>`COALESCE(round(avg(${quizAttempts.accuracyPercent})), 0)::int`,
      })
      .from(quizAttempts);

    const [{ completedTopicsCount }] = await db
      .select({ completedTopicsCount: sql<number>`count(*)::int` })
      .from(learningProgress)
      .where(eq(learningProgress.status, 'completed'));

    const allStudents = await db
      .select({
        id: users.id,
        displayName: users.displayName,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        learningPoints: studentProfiles.learningPoints,
        currentStreak: studentProfiles.currentStreak,
        totalStudyMinutes: studentProfiles.totalStudyMinutes,
      })
      .from(users)
      .leftJoin(studentProfiles, eq(users.id, studentProfiles.userId))
      .orderBy(desc(users.createdAt))
      .limit(50);

    const allAnnouncements = await db
      .select()
      .from(announcements)
      .orderBy(desc(announcements.createdAt));

    res.json({
      metrics: {
        studentCount,
        attemptCount,
        avgAccuracy,
        completedTopicsCount,
      },
      students: allStudents,
      announcements: allAnnouncements,
    });
  } catch (error) {
    console.error('Error loading admin overview:', error);
    res.status(500).json({ error: 'Failed to load educator overview.' });
  }
});

app.patch('/api/admin/chapters/:id', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    const { title, introduction, quickRevisionNotes, isPublished } = req.body;

    const updates: Record<string, any> = {};
    if (typeof title === 'string' && title.trim()) updates.title = title.trim();
    if (typeof introduction === 'string' && introduction.trim()) updates.introduction = introduction.trim();
    if (Array.isArray(quickRevisionNotes)) updates.quickRevisionNotes = quickRevisionNotes;
    if (typeof isPublished === 'boolean') updates.isPublished = isPublished;

    const [updated] = await db
      .update(chapters)
      .set(updates)
      .where(eq(chapters.id, id))
      .returning();

    res.json({ chapter: updated });
  } catch (error) {
    console.error('Error updating chapter:', error);
    res.status(500).json({ error: 'Failed to update chapter.' });
  }
});

app.post('/api/admin/questions', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const {
      chapterId,
      questionType,
      difficulty,
      provenance,
      sourceNote,
      marks,
      prompt,
      correctAnswerText,
      explanation,
      options,
    } = req.body;

    if (!chapterId || !prompt || !correctAnswerText || !explanation) {
      return res.status(400).json({ error: 'Chapter, prompt, answer, and explanation are required.' });
    }

    const [created] = await db
      .insert(questions)
      .values({
        chapterId: Number(chapterId),
        questionType: questionType || 'mcq',
        difficulty: difficulty || 'intermediate',
        provenance: provenance || 'practice_generated',
        sourceNote: sourceNote || 'Educator-authored item',
        marks: Number(marks) || 1,
        prompt: String(prompt).trim(),
        correctAnswerText: String(correctAnswerText).trim(),
        explanation: String(explanation).trim(),
      })
      .returning();

    if (Array.isArray(options) && options.length > 0) {
      await db.insert(questionOptions).values(
        options.map((o: any, idx: number) => ({
          questionId: created.id,
          label: o.label || String.fromCharCode(65 + idx),
          optionText: String(o.optionText),
          isCorrect: Boolean(o.isCorrect),
        }))
      );
    }

    res.json({ question: created });
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'Failed to create question.' });
  }
});

app.delete('/api/admin/questions/:id', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(questions).where(eq(questions.id, id));
    res.json({ ok: true });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ error: 'Failed to delete question.' });
  }
});

app.post('/api/admin/announcements', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { title, message, priority } = req.body;
    if (!title || !message) {
      return res.status(400).json({ error: 'Announcement title and message are required.' });
    }

    const [created] = await db
      .insert(announcements)
      .values({
        authorId: req.dbUser!.id,
        title: String(title).trim(),
        message: String(message).trim(),
        priority: priority === 'important' ? 'important' : 'normal',
        isActive: true,
      })
      .returning();

    res.json({ announcement: created });
  } catch (error) {
    console.error('Error publishing announcement:', error);
    res.status(500).json({ error: 'Failed to publish announcement.' });
  }
});

app.delete('/api/admin/announcements/:id', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(announcements).where(eq(announcements.id, id));
    res.json({ ok: true });
  } catch (error) {
    console.error('Error removing announcement:', error);
    res.status(500).json({ error: 'Failed to remove announcement.' });
  }
});

app.post('/api/admin/mocks', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { title, description, durationMinutes, totalMarks, questionIds } = req.body;
    if (!title || !description || !Array.isArray(questionIds) || questionIds.length === 0) {
      return res.status(400).json({ error: 'Mock test title, description, and question IDs are required.' });
    }

    const [created] = await db
      .insert(mockTests)
      .values({
        title: String(title).trim(),
        description: String(description).trim(),
        provenance: 'practice_generated',
        durationMinutes: Number(durationMinutes) || 60,
        totalMarks: Number(totalMarks) || 30,
        questionIds: questionIds.map(Number),
        isActive: true,
      })
      .returning();

    res.json({ mockTest: created });
  } catch (error) {
    console.error('Error creating mock test:', error);
    res.status(500).json({ error: 'Failed to create mock test.' });
  }
});

// Vite / Static Asset Serving
async function startServer() {
  const PORT = Number(process.env.PORT || 3000);

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });

    // When HMR is disabled, Vite 8 still serves /@vite/client with a WebSocket connect call
    // that fails behind reverse proxies. Strip only the connect call while keeping CSS helpers intact.
    app.get('/@vite/client', async (_req, res, next) => {
      try {
        const result = await vite.transformRequest('/@vite/client');
        if (!result) return next();
        const code = result.code.replace(
          'transport.connect(createHMRHandler(handleMessage));',
          '/* HMR disabled */'
        );
        res.type('application/javascript').send(code);
      } catch (err) {
        next(err);
      }
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Science Pro server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
