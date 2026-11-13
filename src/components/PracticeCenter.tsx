import React, { useEffect, useMemo, useState } from 'react';
import {
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
  Shuffle,
  XCircle,
} from 'lucide-react';
import { useAppContext } from '../context/AuthContext';
import { QuestionItem } from '../types';

interface PracticeCenterProps {
  initialChapterId?: number | null;
}

const QUESTION_TYPES = [
  { id: 'all', label: 'All 10 Formats' },
  { id: 'mcq', label: 'Multiple Choice' },
  { id: 'true_false', label: 'True / False' },
  { id: 'fill_blank', label: 'Fill in Blanks' },
  { id: 'match', label: 'Match Following' },
  { id: 'assertion_reason', label: 'Assertion & Reason' },
  { id: 'case_based', label: 'Case-Based' },
  { id: 'competency', label: 'Competency' },
  { id: 'short_answer', label: 'Short Answer' },
  { id: 'long_answer', label: 'Long Answer' },
  { id: 'numerical', label: 'Numericals' },
];

export const PracticeCenter: React.FC<PracticeCenterProps> = ({
  initialChapterId = null,
}) => {
  const {
    chapters,
    questions,
    bookmarks,
    firebaseUser,
    signInWithGoogle,
    apiFetch,
    refreshUserState,
  } = useAppContext();

  const [chapterFilter, setChapterFilter] = useState<number | 'all'>(
    initialChapterId || 'all'
  );
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [timedMode, setTimedMode] = useState<boolean>(false);
  const [randomize, setRandomize] = useState<boolean>(true);

  const [quizActive, setQuizActive] = useState<boolean>(false);
  const [quizQuestions, setQuizQuestions] = useState<QuestionItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checkedMap, setCheckedMap] = useState<Record<number, boolean>>({});
  const [selfCorrectMap, setSelfCorrectMap] = useState<Record<number, boolean>>({});
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialChapterId) {
      setChapterFilter(initialChapterId);
    }
  }, [initialChapterId]);

  useEffect(() => {
    if (!quizActive || quizFinished) return;
    const timer = setInterval(() => {
      setSecondsElapsed((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [quizActive, quizFinished]);

  const filteredPool = useMemo(() => {
    return questions.filter((q) => {
      if (chapterFilter !== 'all' && q.chapterId !== Number(chapterFilter)) return false;
      if (typeFilter !== 'all' && q.questionType !== typeFilter) return false;
      if (difficultyFilter !== 'all' && q.difficulty !== difficultyFilter) return false;
      return true;
    });
  }, [questions, chapterFilter, typeFilter, difficultyFilter]);

  const startQuiz = () => {
    const pool = [...filteredPool];
    if (randomize) {
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
    }
    setQuizQuestions(pool);
    setCurrentIdx(0);
    setAnswers({});
    setCheckedMap({});
    setSelfCorrectMap({});
    setQuizFinished(false);
    setSecondsElapsed(0);
    setSubmitMessage(null);
    setQuizActive(true);
  };

  const evaluateObjective = (q: QuestionItem, userAnswer: string) => {
    const trimmed = (userAnswer || '').trim();
    if (q.options && q.options.length > 0) {
      const correct = q.options.find((o) => o.isCorrect);
      return Boolean(correct && trimmed === correct.optionText);
    }
    if (q.questionType === 'fill_blank') {
      return (
        trimmed.toLowerCase().replace(/\s+/g, '') ===
        q.correctAnswerText.toLowerCase().replace(/\s+/g, '')
      );
    }
    return Boolean(selfCorrectMap[q.id]);
  };

  const finishQuiz = async () => {
    setQuizFinished(true);
    if (!firebaseUser) {
      setSubmitMessage('Sign in with Google to save scores and sync wrong answers to your Mistake Notebook.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiFetch('/api/quiz-attempts', {
        method: 'POST',
        body: JSON.stringify({
          mode: chapterFilter === 'all' ? 'topic_quiz' : 'chapter_quiz',
          chapterId: chapterFilter === 'all' ? null : Number(chapterFilter),
          difficulty: difficultyFilter,
          timeSpentSeconds: Math.max(5, secondsElapsed),
          answers: quizQuestions.map((q) => ({
            questionId: q.id,
            userAnswer: answers[q.id] || '',
            selfVerifiedCorrect: Boolean(selfCorrectMap[q.id]),
          })),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        await refreshUserState();
        setSubmitMessage(
          `Saved to your profile! Earned +${data.xpGained} XP · Accuracy ${data.attempt.accuracyPercent}%.`
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const toggleBookmark = async (questionId: number) => {
    if (!firebaseUser) {
      await signInWithGoogle();
      return;
    }
    const existing = bookmarks.find((b) => b.questionId === questionId);
    if (existing) {
      await apiFetch(`/api/bookmarks/${existing.id}`, { method: 'DELETE' });
    } else {
      await apiFetch('/api/bookmarks', {
        method: 'POST',
        body: JSON.stringify({ itemType: 'question', questionId }),
      });
    }
    await refreshUserState();
  };

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const currentQuestion = quizQuestions[currentIdx] || null;
  const chapterNameById = useMemo(
    () => new Map(chapters.map((c) => [c.id, `Ch ${c.chapterNumber}: ${c.title}`])),
    [chapters]
  );

  // Quiz Summary Screen
  if (quizActive && quizFinished) {
    const correctCount = quizQuestions.filter((q) =>
      evaluateObjective(q, answers[q.id] || '')
    ).length;
    const accuracy =
      quizQuestions.length > 0
        ? Math.round((correctCount / quizQuestions.length) * 100)
        : 0;

    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
                Practice Complete
              </div>
              <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                Quiz Performance Summary
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={startQuiz}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Quiz</span>
              </button>
              <button
                type="button"
                onClick={() => setQuizActive(false)}
                className="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Change Filters
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="rounded-lg bg-slate-100 dark:bg-slate-800/70 p-4">
              <div className="text-xs text-slate-500 dark:text-slate-400">Score</div>
              <div className="font-mono text-xl font-bold tabular-nums mt-1">
                {correctCount} / {quizQuestions.length}
              </div>
            </div>
            <div className="rounded-lg bg-slate-100 dark:bg-slate-800/70 p-4">
              <div className="text-xs text-slate-500 dark:text-slate-400">Accuracy</div>
              <div className="font-mono text-xl font-bold tabular-nums mt-1 text-blue-600 dark:text-blue-400">
                {accuracy}%
              </div>
            </div>
            <div className="rounded-lg bg-slate-100 dark:bg-slate-800/70 p-4">
              <div className="text-xs text-slate-500 dark:text-slate-400">Time Taken</div>
              <div className="font-mono text-xl font-bold tabular-nums mt-1">
                {formatDuration(secondsElapsed)}
              </div>
            </div>
          </div>

          {submitting && (
            <p className="text-xs text-slate-500">Saving attempt to Cloud SQL...</p>
          )}
          {submitMessage && (
            <div className="rounded-lg bg-blue-600/10 px-4 py-2.5 text-xs text-blue-700 dark:text-blue-300">
              {submitMessage}
            </div>
          )}
        </div>

        <div className="space-y-4">
          {quizQuestions.map((q, idx) => {
            const ok = evaluateObjective(q, answers[q.id] || '');
            return (
              <div
                key={q.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">
                    Q{idx + 1} · {q.questionType.replace('_', ' ')} · {q.marks}M
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 font-semibold ${
                      ok ? 'text-emerald-500' : 'text-rose-500'
                    }`}
                  >
                    {ok ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    <span>{ok ? 'Correct' : 'Review Needed'}</span>
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 whitespace-pre-line">
                  {q.prompt}
                </p>
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  Your answer: <span className="font-medium">{answers[q.id] || '(Skipped)'}</span>
                </div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  Model Answer: {q.correctAnswerText}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{q.explanation}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Active Question Runner
  if (quizActive && currentQuestion) {
    const isChecked = Boolean(checkedMap[currentQuestion.id]);
    const userVal = answers[currentQuestion.id] || '';
    const isObjective =
      (currentQuestion.options && currentQuestion.options.length > 0) ||
      currentQuestion.questionType === 'fill_blank';
    const isBookmarked = bookmarks.some((b) => b.questionId === currentQuestion.id);

    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Question <span className="font-mono tabular-nums">{currentIdx + 1} / {quizQuestions.length}</span>
            <span className="mx-2">·</span>
            <span>{chapterNameById.get(currentQuestion.chapterId)}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-mono text-xs tabular-nums text-slate-600 dark:text-slate-300">
              <Clock className="w-3.5 h-3.5" />
              {formatDuration(secondsElapsed)}
              {timedMode ? ' (Timed)' : ''}
            </span>
            <button
              type="button"
              onClick={() => toggleBookmark(currentQuestion.id)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-3.5 h-3.5 text-blue-500" />
              ) : (
                <Bookmark className="w-3.5 h-3.5" />
              )}
              <span>{isBookmarked ? 'Saved' : 'Bookmark'}</span>
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 space-y-5">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="capitalize">
              {currentQuestion.questionType.replace('_', ' ')} · {currentQuestion.difficulty} · {currentQuestion.marks} Mark(s)
            </span>
            <span>{currentQuestion.sourceNote}</span>
          </div>

          {currentQuestion.passageText && (
            <div className="rounded-lg bg-slate-100 dark:bg-slate-800/70 p-4 text-xs leading-relaxed text-slate-700 dark:text-slate-200">
              {currentQuestion.passageText}
            </div>
          )}

          <p className="text-base font-medium text-slate-900 dark:text-white whitespace-pre-line leading-relaxed">
            {currentQuestion.prompt}
          </p>

          {currentQuestion.options && currentQuestion.options.length > 0 ? (
            <div className="space-y-2.5">
              {currentQuestion.options.map((opt) => {
                const selected = userVal === opt.optionText;
                const showRight = isChecked && opt.isCorrect;
                const showWrong = isChecked && selected && !opt.isCorrect;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={isChecked}
                    onClick={() =>
                      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: opt.optionText }))
                    }
                    className={`w-full flex items-start gap-3 rounded-lg border p-3.5 text-left text-sm transition-colors cursor-pointer ${
                      showRight
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                        : showWrong
                        ? 'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300'
                        : selected
                        ? 'border-blue-500 bg-blue-600/10 text-blue-700 dark:text-blue-300'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                    }`}
                  >
                    <span className="font-mono font-semibold">{opt.label}.</span>
                    <span>{opt.optionText}</span>
                  </button>
                );
              })}
            </div>
          ) : currentQuestion.questionType === 'fill_blank' ? (
            <input
              type="text"
              disabled={isChecked}
              value={userVal}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, [currentQuestion.id]: e.target.value }))
              }
              placeholder="Type the exact word or chemical formula..."
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm"
            />
          ) : (
            <div className="space-y-3">
              <textarea
                rows={4}
                value={userVal}
                onChange={(e) =>
                  setAnswers((prev) => ({ ...prev, [currentQuestion.id]: e.target.value }))
                }
                placeholder="Write your board-style structured answer here (include equations/units)..."
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-3.5 text-sm"
              />
              {isChecked && (
                <div className="flex items-center gap-3 text-xs">
                  <span>Self-check against CBSE rubric below:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setSelfCorrectMap((m) => ({ ...m, [currentQuestion.id]: true }))
                    }
                    className={`rounded px-2.5 py-1 font-medium cursor-pointer ${
                      selfCorrectMap[currentQuestion.id]
                        ? 'bg-emerald-600 text-white'
                        : 'border border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    Covered Key Points
                  </button>
                </div>
              )}
            </div>
          )}

          {isChecked && (
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-4 space-y-2 text-xs">
              <div className="font-semibold text-slate-900 dark:text-white">
                {isObjective
                  ? evaluateObjective(currentQuestion, userVal)
                    ? 'Correct Answer!'
                    : `Incorrect — Expected: ${currentQuestion.correctAnswerText}`
                  : `Model Answer: ${currentQuestion.correctAnswerText}`}
              </div>
              <p className="text-slate-600 dark:text-slate-300">{currentQuestion.explanation}</p>
              {currentQuestion.markingRubric && (
                <ul className="pt-1 space-y-1 text-slate-500 dark:text-slate-400">
                  {currentQuestion.markingRubric.map((r, i) => (
                    <li key={i}>• {r}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              disabled={isChecked}
              onClick={() =>
                setCheckedMap((prev) => ({ ...prev, [currentQuestion.id]: true }))
              }
              className="rounded-lg border border-blue-500 text-blue-600 dark:text-blue-400 px-4 py-2 text-xs font-semibold disabled:opacity-40 hover:bg-blue-600/10 cursor-pointer"
            >
              Check Feedback
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                className="rounded-lg border border-slate-300 dark:border-slate-700 px-3.5 py-2 text-xs font-medium disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              {currentIdx < quizQuestions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIdx((i) => i + 1)}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 cursor-pointer"
                >
                  Next Question
                </button>
              ) : (
                <button
                  type="button"
                  onClick={finishQuiz}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 cursor-pointer"
                >
                  Submit Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Configuration View
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
          10 CBSE Question Formats · Beginner to Advanced
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
          Quiz & Practice Centre
        </h1>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="practice-ch" className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Chapter Selection
            </label>
            <select
              id="practice-ch"
              value={chapterFilter}
              onChange={(e) =>
                setChapterFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs"
            >
              <option value="all">All 13 NCERT Chapters</option>
              {chapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  Ch {ch.chapterNumber}: {ch.title}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="practice-type" className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Question Format
            </label>
            <select
              id="practice-type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs"
            >
              {QUESTION_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="practice-diff" className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Difficulty Level
            </label>
            <select
              id="practice-diff"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs"
            >
              <option value="all">All Difficulty Levels</option>
              <option value="beginner">Beginner (Concept Recall)</option>
              <option value="intermediate">Intermediate (Application)</option>
              <option value="advanced">Advanced (Board HOTS / Numericals)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800 pt-4">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={randomize}
                onChange={(e) => setRandomize(e.target.checked)}
                className="accent-blue-600"
              />
              <Shuffle className="w-3.5 h-3.5 text-slate-400" />
              <span>Randomise Question Order</span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={timedMode}
                onChange={(e) => setTimedMode(e.target.checked)}
                className="accent-blue-600"
              />
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Track Speed Timer</span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              {filteredPool.length} matching questions
            </span>
            <button
              type="button"
              disabled={filteredPool.length === 0}
              onClick={startQuiz}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Start Practice Quiz</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
