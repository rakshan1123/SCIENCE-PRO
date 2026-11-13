import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// 1. Users & Authentication
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  displayName: text('display_name').notNull().default('Student'),
  photoUrl: text('photo_url'),
  role: text('role').notNull().default('student'), // 'student' | 'admin'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 2. Student Profiles & Gamification
export const studentProfiles = pgTable('student_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  board: text('board').notNull().default('CBSE Class 10'),
  academicYear: text('academic_year').notNull().default('2026-27'),
  dailyGoalMinutes: integer('daily_goal_minutes').notNull().default(45),
  todayStudyMinutes: integer('today_study_minutes').notNull().default(0),
  totalStudyMinutes: integer('total_study_minutes').notNull().default(0),
  learningPoints: integer('learning_points').notNull().default(0),
  currentStreak: integer('current_streak').notNull().default(1),
  longestStreak: integer('longest_streak').notNull().default(1),
  lastActiveDate: text('last_active_date'), // YYYY-MM-DD
  preferredTheme: text('preferred_theme').notNull().default('dark'), // 'dark' | 'light'
  weeklyChallengeProgress: integer('weekly_challenge_progress').notNull().default(0),
  lastChapterSlug: text('last_chapter_slug'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 3. Subjects (Physics, Chemistry, Biology)
export const subjects = pgTable('subjects', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  unitSummary: text('unit_summary').notNull(),
  totalMarks: integer('total_marks').notNull(),
  sortOrder: integer('sort_order').notNull().default(1),
});

// 4. Chapters (13 Verified NCERT Class 10 2026-27 Chapters)
export const chapters = pgTable('chapters', {
  id: serial('id').primaryKey(),
  subjectId: integer('subject_id')
    .references(() => subjects.id, { onDelete: 'cascade' })
    .notNull(),
  chapterNumber: integer('chapter_number').notNull(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  unitName: text('unit_name').notNull(),
  unitWeightage: integer('unit_weightage').notNull(),
  introduction: text('introduction').notNull(),
  objectives: jsonb('objectives').$type<string[]>().notNull(),
  ncertTerminology: jsonb('ncert_terminology')
    .$type<Array<{ term: string; definition: string }>>()
    .notNull(),
  formulas: jsonb('formulas')
    .$type<Array<{ name: string; expression: string; variables: string; unit?: string }>>()
    .notNull(),
  chemicalEquations: jsonb('chemical_equations')
    .$type<Array<{ title: string; equation: string; type: string; notes: string }>>()
    .notNull(),
  solvedExamples: jsonb('solved_examples')
    .$type<Array<{ problem: string; given: string; solutionSteps: string[]; answer: string }>>()
    .notNull(),
  commonMistakes: jsonb('common_mistakes')
    .$type<Array<{ mistake: string; correction: string }>>()
    .notNull(),
  quickRevisionNotes: jsonb('quick_revision_notes').$type<string[]>().notNull(),
  sourceAttribution: text('source_attribution')
    .notNull()
    .default('NCERT Class 10 Science Textbook (2026-27 Rationalized Edition) & CBSE Curriculum 086'),
  isPublished: boolean('is_published').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 5. Topics (Micro-learning sections inside each chapter)
export const topics = pgTable('topics', {
  id: serial('id').primaryKey(),
  chapterId: integer('chapter_id')
    .references(() => chapters.id, { onDelete: 'cascade' })
    .notNull(),
  slug: text('slug').notNull(),
  title: text('title').notNull(),
  sortOrder: integer('sort_order').notNull().default(1),
  estimatedMinutes: integer('estimated_minutes').notNull().default(10),
  frequentlyTested: boolean('frequently_tested').notNull().default(false),
});

// 6. Lessons (Detailed topic content)
export const lessons = pgTable('lessons', {
  id: serial('id').primaryKey(),
  topicId: integer('topic_id')
    .references(() => topics.id, { onDelete: 'cascade' })
    .notNull(),
  explanation: text('explanation').notNull(),
  importantDefinitions: jsonb('important_definitions')
    .$type<Array<{ term: string; meaning: string }>>()
    .notNull(),
  realLifeExamples: jsonb('real_life_examples').$type<string[]>().notNull(),
  keyConcepts: jsonb('key_concepts').$type<string[]>().notNull(),
  summaryCard: text('summary_card').notNull(),
});

// 7. Diagrams
export const diagrams = pgTable('diagrams', {
  id: serial('id').primaryKey(),
  chapterId: integer('chapter_id')
    .references(() => chapters.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title').notNull(),
  caption: text('caption').notNull(),
  diagramType: text('diagram_type').notNull(), // 'ray_mirror' | 'ray_lens' | 'prism' | 'eye' | 'circuit' | 'solenoid' | 'reaction' | 'ph_scale' | 'heart' | 'nephron' | 'reflex' | 'flower' | 'food_web'
  labels: jsonb('labels').$type<string[]>().notNull(),
  examTip: text('exam_tip').notNull(),
});

// 8. Questions (10 CBSE formats + strict provenance)
export const questions = pgTable('questions', {
  id: serial('id').primaryKey(),
  chapterId: integer('chapter_id')
    .references(() => chapters.id, { onDelete: 'cascade' })
    .notNull(),
  topicId: integer('topic_id').references(() => topics.id, { onDelete: 'set null' }),
  questionType: text('question_type').notNull(),
  // 'mcq' | 'true_false' | 'fill_blank' | 'match' | 'assertion_reason' | 'case_based' | 'competency' | 'short_answer' | 'long_answer' | 'numerical'
  difficulty: text('difficulty').notNull().default('intermediate'), // 'beginner' | 'intermediate' | 'advanced'
  provenance: text('provenance').notNull().default('practice_generated'),
  // 'official_cbse_pattern' | 'verified_pyq_reference' | 'practice_generated'
  sourceNote: text('source_note').notNull().default('Author-crafted NCERT competency item'),
  marks: integer('marks').notNull().default(1),
  passageText: text('passage_text'),
  prompt: text('prompt').notNull(),
  correctAnswerText: text('correct_answer_text').notNull(),
  explanation: text('explanation').notNull(),
  markingRubric: jsonb('marking_rubric').$type<string[]>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 9. Question Options (For MCQ, Assertion-Reason, True/False, Match)
export const questionOptions = pgTable('question_options', {
  id: serial('id').primaryKey(),
  questionId: integer('question_id')
    .references(() => questions.id, { onDelete: 'cascade' })
    .notNull(),
  label: text('label').notNull(), // A, B, C, D
  optionText: text('option_text').notNull(),
  isCorrect: boolean('is_correct').notNull().default(false),
});

// 10. Mock Tests (Board Exam Prep)
export const mockTests = pgTable('mock_tests', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  provenance: text('provenance').notNull().default('official_cbse_pattern'),
  durationMinutes: integer('duration_minutes').notNull().default(180),
  totalMarks: integer('total_marks').notNull().default(80),
  questionIds: jsonb('question_ids').$type<number[]>().notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 11. Quiz & Mock Attempts
export const quizAttempts = pgTable('quiz_attempts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  mode: text('mode').notNull(), // 'chapter_quiz' | 'topic_quiz' | 'mock_test' | 'daily_challenge'
  chapterId: integer('chapter_id').references(() => chapters.id, { onDelete: 'set null' }),
  mockTestId: integer('mock_test_id').references(() => mockTests.id, { onDelete: 'set null' }),
  difficulty: text('difficulty').default('mixed'),
  totalQuestions: integer('total_questions').notNull(),
  correctCount: integer('correct_count').notNull().default(0),
  scoreMarks: integer('score_marks').notNull().default(0),
  maxMarks: integer('max_marks').notNull().default(0),
  accuracyPercent: integer('accuracy_percent').notNull().default(0),
  timeSpentSeconds: integer('time_spent_seconds').notNull().default(0),
  completedAt: timestamp('completed_at').defaultNow().notNull(),
});

// 12. Quiz Results (Per-question response detail)
export const quizResults = pgTable('quiz_results', {
  id: serial('id').primaryKey(),
  attemptId: integer('attempt_id')
    .references(() => quizAttempts.id, { onDelete: 'cascade' })
    .notNull(),
  questionId: integer('question_id')
    .references(() => questions.id, { onDelete: 'cascade' })
    .notNull(),
  userAnswer: text('user_answer').notNull(),
  isCorrect: boolean('is_correct').notNull(),
  markedForReview: boolean('marked_for_review').notNull().default(false),
});

// 13. Learning Progress (Topic status tracker)
export const learningProgress = pgTable(
  'learning_progress',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    chapterId: integer('chapter_id')
      .references(() => chapters.id, { onDelete: 'cascade' })
      .notNull(),
    topicId: integer('topic_id')
      .references(() => topics.id, { onDelete: 'cascade' })
      .notNull(),
    status: text('status').notNull().default('not_started'), // 'not_started' | 'learning' | 'needs_revision' | 'completed'
    timeSpentMinutes: integer('time_spent_minutes').notNull().default(0),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [uniqueIndex('user_topic_progress_idx').on(table.userId, table.topicId)]
);

// 14. Bookmarks
export const bookmarks = pgTable('bookmarks', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  itemType: text('item_type').notNull(), // 'question' | 'topic' | 'chapter'
  questionId: integer('question_id').references(() => questions.id, { onDelete: 'cascade' }),
  chapterId: integer('chapter_id').references(() => chapters.id, { onDelete: 'cascade' }),
  topicId: integer('topic_id').references(() => topics.id, { onDelete: 'cascade' }),
  note: text('note'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 15. Mistake Notebook
export const mistakeNotebook = pgTable(
  'mistake_notebook',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    questionId: integer('question_id')
      .references(() => questions.id, { onDelete: 'cascade' })
      .notNull(),
    wrongAnswer: text('wrong_answer').notNull(),
    resolved: boolean('resolved').notNull().default(false),
    attemptCount: integer('attempt_count').notNull().default(1),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [uniqueIndex('user_mistake_question_idx').on(table.userId, table.questionId)]
);

// 16. Student Revision Notes
export const revisionNotes = pgTable('revision_notes', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  chapterId: integer('chapter_id')
    .references(() => chapters.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 17. Achievements & Badges
export const achievements = pgTable(
  'achievements',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    badgeKey: text('badge_key').notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    unlockedAt: timestamp('unlocked_at').defaultNow().notNull(),
  },
  (table) => [uniqueIndex('user_badge_idx').on(table.userId, table.badgeKey)]
);

// 18. AI Tutor Conversations & Messages
export const aiConversations = pgTable('ai_conversations', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  chapterId: integer('chapter_id').references(() => chapters.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const aiMessages = pgTable('ai_messages', {
  id: serial('id').primaryKey(),
  conversationId: integer('conversation_id')
    .references(() => aiConversations.id, { onDelete: 'cascade' })
    .notNull(),
  role: text('role').notNull(), // 'user' | 'assistant'
  content: text('content').notNull(),
  outOfSyllabusFlag: boolean('out_of_syllabus_flag').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 19. Admin Announcements
export const announcements = pgTable('announcements', {
  id: serial('id').primaryKey(),
  authorId: integer('author_id').references(() => users.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  message: text('message').notNull(),
  priority: text('priority').notNull().default('normal'), // 'normal' | 'important'
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const subjectsRelations = relations(subjects, ({ many }) => ({
  chapters: many(chapters),
}));

export const chaptersRelations = relations(chapters, ({ one, many }) => ({
  subject: one(subjects, {
    fields: [chapters.subjectId],
    references: [subjects.id],
  }),
  topics: many(topics),
  diagrams: many(diagrams),
  questions: many(questions),
}));

export const topicsRelations = relations(topics, ({ one, many }) => ({
  chapter: one(chapters, {
    fields: [topics.chapterId],
    references: [chapters.id],
  }),
  lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one }) => ({
  topic: one(topics, {
    fields: [lessons.topicId],
    references: [topics.id],
  }),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  chapter: one(chapters, {
    fields: [questions.chapterId],
    references: [chapters.id],
  }),
  topic: one(topics, {
    fields: [questions.topicId],
    references: [topics.id],
  }),
  options: many(questionOptions),
}));

export const questionOptionsRelations = relations(questionOptions, ({ one }) => ({
  question: one(questions, {
    fields: [questionOptions.questionId],
    references: [questions.id],
  }),
}));
