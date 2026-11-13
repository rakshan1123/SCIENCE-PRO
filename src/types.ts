export type NavSection =
  | 'home'
  | 'learn'
  | 'tutor'
  | 'lab'
  | 'practice'
  | 'board'
  | 'revision'
  | 'progress'
  | 'profile'
  | 'admin';

export type TopicStatus = 'not_started' | 'learning' | 'needs_revision' | 'completed';

export interface SubjectItem {
  id: number;
  slug: string;
  name: string;
  description: string;
  unitSummary: string;
  totalMarks: number;
  sortOrder: number;
}

export interface LessonItem {
  id: number;
  topicId: number;
  explanation: string;
  importantDefinitions: Array<{ term: string; meaning: string }>;
  realLifeExamples: string[];
  keyConcepts: string[];
  summaryCard: string;
}

export interface TopicItem {
  id: number;
  chapterId: number;
  slug: string;
  title: string;
  sortOrder: number;
  estimatedMinutes: number;
  frequentlyTested: boolean;
  lesson: LessonItem | null;
}

export interface DiagramItem {
  id: number;
  chapterId: number;
  title: string;
  caption: string;
  diagramType: string;
  labels: string[];
  examTip: string;
}

export interface ChapterItem {
  id: number;
  subjectId: number;
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
  sourceAttribution: string;
  isPublished: boolean;
  topics: TopicItem[];
  diagrams: DiagramItem[];
}

export interface QuestionOptionItem {
  id: number;
  questionId: number;
  label: string;
  optionText: string;
  isCorrect: boolean;
}

export interface QuestionItem {
  id: number;
  chapterId: number;
  topicId: number | null;
  questionType: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  provenance: 'official_cbse_pattern' | 'verified_pyq_reference' | 'practice_generated';
  sourceNote: string;
  marks: number;
  passageText: string | null;
  prompt: string;
  correctAnswerText: string;
  explanation: string;
  markingRubric: string[] | null;
  options: QuestionOptionItem[];
}

export interface MockTestItem {
  id: number;
  title: string;
  description: string;
  provenance: string;
  durationMinutes: number;
  totalMarks: number;
  questionIds: number[];
  questions: QuestionItem[];
}

export interface AnnouncementItem {
  id: number;
  title: string;
  message: string;
  priority: 'normal' | 'important';
  createdAt: string;
}

export interface UserAccount {
  id: number;
  uid: string;
  email: string;
  displayName: string;
  photoUrl: string | null;
  role: 'student' | 'admin';
}

export interface StudentProfile {
  id: number;
  userId: number;
  board: string;
  academicYear: string;
  dailyGoalMinutes: number;
  todayStudyMinutes: number;
  totalStudyMinutes: number;
  learningPoints: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  preferredTheme: 'dark' | 'light';
  weeklyChallengeProgress: number;
  lastChapterSlug: string | null;
}

export interface ProgressItem {
  id: number;
  chapterId: number;
  topicId: number;
  status: TopicStatus;
  timeSpentMinutes: number;
  updatedAt: string;
}

export interface QuizAttemptItem {
  id: number;
  mode: string;
  chapterId: number | null;
  mockTestId: number | null;
  difficulty: string | null;
  totalQuestions: number;
  correctCount: number;
  scoreMarks: number;
  maxMarks: number;
  accuracyPercent: number;
  timeSpentSeconds: number;
  completedAt: string;
}

export interface BookmarkItem {
  id: number;
  itemType: string;
  questionId: number | null;
  chapterId: number | null;
  topicId: number | null;
  note: string | null;
  createdAt: string;
}

export interface MistakeItem {
  id: number;
  questionId: number;
  wrongAnswer: string;
  resolved: boolean;
  attemptCount: number;
  updatedAt: string;
}

export interface RevisionNoteItem {
  id: number;
  chapterId: number;
  title: string;
  content: string;
  updatedAt: string;
}

export interface AchievementItem {
  id: number;
  badgeKey: string;
  title: string;
  description: string;
  unlockedAt: string;
}
