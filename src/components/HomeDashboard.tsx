import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  Bot,
  CheckCircle2,
  Flame,
  FlaskConical,
  Megaphone,
  Sparkles,
  Target,
} from 'lucide-react';
import heroScienceLabImg from '../assets/images/hero_science_lab_1794570829114.jpg';
import { useAppContext } from '../context/AuthContext';
import { NavSection } from '../types';

interface HomeDashboardProps {
  onNavigate: (section: NavSection) => void;
  onOpenChapter: (slug: string) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onNavigate,
  onOpenChapter,
}) => {
  const {
    user,
    profile,
    firebaseUser,
    signInWithGoogle,
    chapters,
    questions,
    progress,
    attempts,
    mistakes,
    announcements,
    curriculumLoading,
    curriculumError,
    refreshCurriculum,
  } = useAppContext();

  const [challengeAnswer, setChallengeAnswer] = useState<string>('');
  const [challengeSubmitted, setChallengeSubmitted] = useState(false);

  const chapterCompletion = useMemo(() => {
    const statusByTopic = new Map(progress.map((p) => [p.topicId, p.status]));
    let completedChapters = 0;
    let totalTopics = 0;
    let completedTopics = 0;

    const perChapter = chapters.map((ch) => {
      const chTopics = ch.topics || [];
      totalTopics += chTopics.length;
      const doneCount = chTopics.filter(
        (t) => statusByTopic.get(t.id) === 'completed'
      ).length;
      completedTopics += doneCount;
      const pct = chTopics.length > 0 ? Math.round((doneCount / chTopics.length) * 100) : 0;
      if (chTopics.length > 0 && doneCount === chTopics.length) {
        completedChapters += 1;
      }
      return { chapter: ch, doneCount, total: chTopics.length, pct };
    });

    const overallPct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    return { completedChapters, overallPct, perChapter };
  }, [chapters, progress]);

  const continueChapter = useMemo(() => {
    if (profile?.lastChapterSlug) {
      const found = chapters.find((c) => c.slug === profile.lastChapterSlug);
      if (found) return found;
    }
    const incomplete = chapterCompletion.perChapter.find((c) => c.pct < 100);
    return incomplete?.chapter || chapters[0] || null;
  }, [chapters, profile, chapterCompletion]);

  const weakTopics = useMemo(() => {
    const needsRevIds = new Set(
      progress.filter((p) => p.status === 'needs_revision').map((p) => p.topicId)
    );
    const mistakeChapterIds = new Set(
      mistakes
        .filter((m) => !m.resolved)
        .map((m) => questions.find((q) => q.id === m.questionId)?.chapterId)
        .filter(Boolean)
    );

    const list: Array<{ chapterSlug: string; chapterTitle: string; reason: string }> = [];
    for (const ch of chapters) {
      const flaggedTopic = ch.topics.find((t) => needsRevIds.has(t.id));
      if (flaggedTopic) {
        list.push({
          chapterSlug: ch.slug,
          chapterTitle: ch.title,
          reason: `Marked "Needs Revision": ${flaggedTopic.title}`,
        });
      } else if (mistakeChapterIds.has(ch.id)) {
        list.push({
          chapterSlug: ch.slug,
          chapterTitle: ch.title,
          reason: 'Unresolved questions in Mistake Notebook',
        });
      }
    }

    if (list.length === 0 && chapters.length > 0) {
      return [
        {
          chapterSlug: 'light-reflection-and-refraction',
          chapterTitle: 'Light – Reflection and Refraction',
          reason: 'High-weightage Unit III numericals & ray sign conventions',
        },
        {
          chapterSlug: 'electricity',
          chapterTitle: 'Electricity',
          reason: 'Core Unit IV series/parallel circuits & Joule heating',
        },
      ];
    }
    return list.slice(0, 3);
  }, [chapters, progress, mistakes, questions]);

  const dailyChallenge = useMemo(() => {
    const objectiveQs = questions.filter((q) => q.options && q.options.length >= 2);
    if (objectiveQs.length === 0) return null;
    const dayIndex = new Date().getDate() % objectiveQs.length;
    return objectiveQs[dayIndex];
  }, [questions]);

  const dailyGoalPct = profile
    ? Math.min(100, Math.round((profile.todayStudyMinutes / Math.max(1, profile.dailyGoalMinutes)) * 100))
    : 0;

  if (curriculumLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-52 rounded-xl bg-slate-200 dark:bg-slate-800/70" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-slate-200 dark:bg-slate-800/70" />
          ))}
        </div>
      </div>
    );
  }

  if (curriculumError) {
    return (
      <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-6 text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
        <h2 className="font-display text-lg font-semibold">Unable to Load Curriculum</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">{curriculumError}</p>
        <button
          type="button"
          onClick={refreshCurriculum}
          className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition-colors cursor-pointer"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero & Student Profile Welcome Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 sm:p-8">
          <div className="space-y-3">
            <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
              CBSE Class 10 Science · Code 086 · 2026–27 Syllabus
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white text-balance">
              {firebaseUser
                ? `Welcome back, ${user?.displayName || firebaseUser.displayName || 'Scholar'}`
                : 'Master NCERT Class 10 Science with Precision'}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Study all 13 verified NCERT chapters across Physics, Chemistry, and Biology with interactive lab simulations, step-by-step AI tutoring, and 80-mark board mocks.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {continueChapter && (
              <button
                type="button"
                onClick={() => onOpenChapter(continueChapter.slug)}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Continue Ch {continueChapter.chapterNumber}: {continueChapter.title}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            {!firebaseUser && (
              <button
                type="button"
                onClick={signInWithGoogle}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Sign in with Google to Sync Progress</span>
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 min-h-[220px]">
          <img
            src={heroScienceLabImg}
            alt="Optical glass prism refracting light on a dark slate laboratory bench"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120]/90 via-[#0B1120]/30 to-transparent flex flex-col justify-end p-5">
            <div className="text-xs font-medium text-blue-300">Interactive Science Lab</div>
            <div className="mt-1 font-display text-lg font-semibold text-white">
              7 Hands-On Physics, Chemistry & Biology Simulations
            </div>
            <button
              type="button"
              onClick={() => onNavigate('lab')}
              className="mt-3 self-start inline-flex items-center gap-1.5 rounded-lg bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/25 transition-colors cursor-pointer"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Open Virtual Lab</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4 Core KPI Strip */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Overall Syllabus Progress</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
              {chapterCompletion.overallPct}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              ({chapterCompletion.completedChapters}/{chapters.length} chapters)
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{ width: `${chapterCompletion.overallPct}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Daily Study Goal</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
              {profile?.todayStudyMinutes ?? 0}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              / {profile?.dailyGoalMinutes ?? 45} min
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-violet-500 transition-all"
              style={{ width: `${dailyGoalPct}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Learning Streak</div>
          <div className="mt-2 flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <span className="font-mono text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
              {profile?.currentStreak ?? 0} {profile?.currentStreak === 1 ? 'day' : 'days'}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Best streak: {profile?.longestStreak ?? 0} days
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Mastery Points</div>
          <div className="mt-2 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-500" />
            <span className="font-mono text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
              {profile?.learningPoints ?? 0} XP
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Weekly target: {profile?.weeklyChallengeProgress ?? 0}% complete
          </div>
        </div>
      </section>

      {/* Main Content Grid: Daily Challenge + Weak Topics + Recent Scores + Targets */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily Science Challenge */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-violet-600 dark:text-violet-400">
                Daily Science Challenge
              </div>
              <h2 className="font-display text-lg font-semibold mt-0.5">
                Quick Concept Check
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('practice')}
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              More Questions →
            </button>
          </div>

          {dailyChallenge ? (
            <div className="space-y-4">
              {dailyChallenge.passageText && (
                <p className="rounded-lg bg-slate-100 dark:bg-slate-800/70 p-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  {dailyChallenge.passageText}
                </p>
              )}
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 whitespace-pre-line">
                {dailyChallenge.prompt}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {dailyChallenge.options.map((opt) => {
                  const selected = challengeAnswer === opt.optionText;
                  const showCorrect = challengeSubmitted && opt.isCorrect;
                  const showWrong = challengeSubmitted && selected && !opt.isCorrect;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={challengeSubmitted}
                      onClick={() => setChallengeAnswer(opt.optionText)}
                      className={`flex items-start gap-2.5 rounded-lg border p-3 text-left text-xs transition-colors cursor-pointer ${
                        showCorrect
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                          : showWrong
                          ? 'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300'
                          : selected
                          ? 'border-blue-500 bg-blue-600/10 text-blue-700 dark:text-blue-300'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600'
                      }`}
                    >
                      <span className="font-mono font-semibold shrink-0">{opt.label}.</span>
                      <span>{opt.optionText}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  disabled={!challengeAnswer || challengeSubmitted}
                  onClick={() => setChallengeSubmitted(true)}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-40 hover:bg-blue-500 transition-colors cursor-pointer"
                >
                  Check Answer
                </button>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {dailyChallenge.sourceNote}
                </span>
              </div>

              {challengeSubmitted && (
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3.5 text-xs space-y-1">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    Explanation: {dailyChallenge.correctAnswerText}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">{dailyChallenge.explanation}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Challenge loading from question bank...</p>
          )}
        </div>

        {/* Weak-Topic Radar & Recommended Revision */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">
                Weak-Topic & Revision Radar
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('revision')}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Revision Centre →
              </button>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {weakTopics.map((item) => (
                <div key={item.chapterSlug} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                      {item.chapterTitle}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {item.reason}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenChapter(item.chapterSlug)}
                    className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0 cursor-pointer"
                  >
                    Revise
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Quiz Scores & Upcoming Targets */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Recent Quiz Scores</h2>
              <button
                type="button"
                onClick={() => onNavigate('progress')}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Analytics →
              </button>
            </div>
            {attempts.length > 0 ? (
              <div className="space-y-2.5">
                {attempts.slice(0, 3).map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between text-xs border-b border-slate-100 dark:border-slate-800/80 pb-2 last:border-0 last:pb-0"
                  >
                    <div>
                      <span className="font-medium text-slate-800 dark:text-slate-200 capitalize">
                        {att.mode.replace('_', ' ')}
                      </span>
                      <span className="text-slate-400 mx-1.5">·</span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {new Date(att.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="font-mono font-semibold tabular-nums text-blue-600 dark:text-blue-400">
                      {att.scoreMarks}/{att.maxMarks} ({att.accuracyPercent}%)
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-500 dark:text-slate-400 space-y-2">
                <p>No quiz attempts recorded yet. Take a 5-question chapter check or board mock to build your accuracy profile.</p>
                <button
                  type="button"
                  onClick={() => onNavigate('practice')}
                  className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Start First Practice Quiz</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CBSE Unit Weightage Chart + Upcoming Study Targets & Announcements */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold">
                CBSE 2026–27 Unit Blueprint (80 Marks Theory)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click any chapter below to open notes, formulas, equations, and diagrams.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('learn')}
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              All 13 Chapters →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {chapterCompletion.perChapter.slice(0, 6).map(({ chapter, pct }) => (
              <button
                key={chapter.id}
                type="button"
                onClick={() => onOpenChapter(chapter.slug)}
                className="flex flex-col justify-between rounded-lg border border-slate-200 dark:border-slate-800 p-3.5 text-left hover:border-blue-500/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>Ch {chapter.chapterNumber} · {chapter.unitWeightage}M Unit</span>
                  <span className="font-mono tabular-nums font-medium text-blue-600 dark:text-blue-400">
                    {pct}%
                  </span>
                </div>
                <div className="mt-1.5 text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                  {chapter.title}
                </div>
                <div className="mt-2.5 h-1 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 space-y-5">
          <div>
            <h2 className="font-display text-lg font-semibold">Upcoming Study Targets</h2>
            <ul className="mt-3 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Complete 2 NCERT topic lessons to maintain your daily study goal.</span>
              </li>
              <li className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-violet-500 shrink-0" />
                <span>Ask the AI Science Tutor to walk through a numerical sign-convention problem.</span>
              </li>
              <li className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Review Chapter 13: Our Environment (5-Mark Unit V) quick notes.</span>
              </li>
            </ul>
          </div>

          {announcements.length > 0 && (
            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-slate-100">
                <Megaphone className="w-3.5 h-3.5 text-blue-500" />
                <span>Educator Announcements</span>
              </div>
              {announcements.map((ann) => (
                <div key={ann.id} className="text-xs space-y-0.5">
                  <div className="font-medium text-slate-800 dark:text-slate-200">
                    {ann.title}
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                    {ann.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
