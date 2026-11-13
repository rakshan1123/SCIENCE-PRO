import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Bot,
  CheckCircle2,
  ChevronRight,
  Clock,
  FlaskConical,
  Lightbulb,
  Target,
} from 'lucide-react';
import physicsOpticsImg from '../assets/images/subject_physics_optics_1794570829420.jpg';
import chemBioImg from '../assets/images/subject_chemistry_biology_1794570830497.jpg';
import { useAppContext } from '../context/AuthContext';
import { ChapterItem, TopicStatus } from '../types';
import { ChapterDiagram } from './ChapterDiagram';

interface LearnCenterProps {
  selectedChapterSlug: string | null;
  onSelectChapter: (slug: string | null) => void;
  onAskTutor: (chapter: ChapterItem) => void;
  onPracticeChapter: (chapterId: number) => void;
}

const STATUS_OPTIONS: Array<{ value: TopicStatus; label: string }> = [
  { value: 'not_started', label: 'Not Started' },
  { value: 'learning', label: 'Learning' },
  { value: 'needs_revision', label: 'Needs Revision' },
  { value: 'completed', label: 'Completed' },
];

export const LearnCenter: React.FC<LearnCenterProps> = ({
  selectedChapterSlug,
  onSelectChapter,
  onAskTutor,
  onPracticeChapter,
}) => {
  const {
    subjects,
    chapters,
    progress,
    bookmarks,
    firebaseUser,
    signInWithGoogle,
    apiFetch,
    refreshUserState,
  } = useAppContext();

  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [chapterTab, setChapterTab] = useState<
    'topics' | 'formulas' | 'diagrams' | 'examples' | 'mistakes' | 'notes'
  >('topics');
  const [savingTopicId, setSavingTopicId] = useState<number | null>(null);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  const progressMap = useMemo(
    () => new Map(progress.map((p) => [p.topicId, p.status])),
    [progress]
  );

  const subjectById = useMemo(
    () => new Map(subjects.map((s) => [s.id, s])),
    [subjects]
  );

  const selectedChapter = useMemo(
    () => chapters.find((c) => c.slug === selectedChapterSlug) || null,
    [chapters, selectedChapterSlug]
  );

  const filteredChapters = useMemo(() => {
    if (subjectFilter === 'all') return chapters;
    const sub = subjects.find((s) => s.slug === subjectFilter);
    if (!sub) return chapters;
    return chapters.filter((c) => c.subjectId === sub.id);
  }, [chapters, subjects, subjectFilter]);

  const handleOpenChapter = (ch: ChapterItem) => {
    onSelectChapter(ch.slug);
    setChapterTab('topics');
    if (firebaseUser) {
      apiFetch('/api/profile', {
        method: 'PATCH',
        body: JSON.stringify({ lastChapterSlug: ch.slug }),
      }).catch(() => {});
    }
  };

  const handleUpdateTopicStatus = async (
    chapterId: number,
    topicId: number,
    status: TopicStatus
  ) => {
    if (!firebaseUser) {
      setStatusFeedback('Sign in with Google to save your topic progress to the cloud.');
      return;
    }
    setSavingTopicId(topicId);
    setStatusFeedback(null);
    try {
      const res = await apiFetch('/api/progress', {
        method: 'PUT',
        body: JSON.stringify({ chapterId, topicId, status, timeSpentMinutes: 10 }),
      });
      if (res.ok) {
        await refreshUserState();
        setStatusFeedback('Progress saved.');
        setTimeout(() => setStatusFeedback(null), 2000);
      }
    } finally {
      setSavingTopicId(null);
    }
  };

  const isChapterBookmarked = (chapterId: number) =>
    bookmarks.some((b) => b.itemType === 'chapter' && b.chapterId === chapterId);

  const handleToggleChapterBookmark = async (chapterId: number) => {
    if (!firebaseUser) {
      await signInWithGoogle();
      return;
    }
    const existing = bookmarks.find(
      (b) => b.itemType === 'chapter' && b.chapterId === chapterId
    );
    if (existing) {
      await apiFetch(`/api/bookmarks/${existing.id}`, { method: 'DELETE' });
    } else {
      await apiFetch('/api/bookmarks', {
        method: 'POST',
        body: JSON.stringify({ itemType: 'chapter', chapterId }),
      });
    }
    await refreshUserState();
  };

  // Chapter Detail View
  if (selectedChapter) {
    const subject = subjectById.get(selectedChapter.subjectId);
    const doneTopics = selectedChapter.topics.filter(
      (t) => progressMap.get(t.id) === 'completed'
    ).length;
    const pct =
      selectedChapter.topics.length > 0
        ? Math.round((doneTopics / selectedChapter.topics.length) * 100)
        : 0;
    const bookmarked = isChapterBookmarked(selectedChapter.id);

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onSelectChapter(null)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All 13 NCERT Chapters</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleToggleChapterBookmark(selectedChapter.id)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {bookmarked ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5 text-blue-500" />
                  <span>Bookmarked</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Bookmark</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => onAskTutor(selectedChapter)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-violet-500/40 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-700 dark:text-violet-300 hover:bg-violet-500/20 transition-colors cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Ask AI Tutor</span>
            </button>
            <button
              type="button"
              onClick={() => onPracticeChapter(selectedChapter.id)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 transition-colors cursor-pointer"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Chapter Practice</span>
            </button>
          </div>
        </div>

        {/* Chapter Header */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
                {subject?.name} · Chapter {selectedChapter.chapterNumber} · {selectedChapter.unitName} ({selectedChapter.unitWeightage} Marks)
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-balance">
                {selectedChapter.title}
              </h1>
            </div>

            <div className="text-right">
              <div className="font-mono text-xl font-bold tabular-nums text-blue-600 dark:text-blue-400">
                {pct}% Complete
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {doneTopics} of {selectedChapter.topics.length} topics mastered
              </div>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 max-w-4xl">
            {selectedChapter.introduction}
          </p>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
            <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Learning Objectives
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
              {selectedChapter.objectives.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Source: {selectedChapter.sourceAttribution}
          </div>
        </div>

        {/* Modular Chapter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-1.5">
          {[
            { id: 'topics' as const, label: 'Topics & Lessons' },
            { id: 'formulas' as const, label: 'Formulas & Equations' },
            { id: 'diagrams' as const, label: 'Diagrams' },
            { id: 'examples' as const, label: 'Solved Examples' },
            { id: 'mistakes' as const, label: 'Common Mistakes' },
            { id: 'notes' as const, label: 'Quick Notes & Terms' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setChapterTab(tab.id)}
              className={`rounded-lg px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                chapterTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {statusFeedback && (
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs text-blue-700 dark:text-blue-300">
            {statusFeedback}
          </div>
        )}

        {/* Tab Content */}
        {chapterTab === 'topics' && (
          <div className="space-y-6">
            {selectedChapter.topics.map((topic, index) => {
              const currentStatus = progressMap.get(topic.id) || 'not_started';
              const lesson = topic.lesson;
              return (
                <article
                  key={topic.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 space-y-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span>Section 0{index + 1}</span>
                        <span>·</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {topic.estimatedMinutes} min
                        </span>
                        {topic.frequentlyTested && (
                          <>
                            <span>·</span>
                            <span className="font-medium text-amber-600 dark:text-amber-400">
                              Frequently Tested in Boards
                            </span>
                          </>
                        )}
                      </div>
                      <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white">
                        {topic.title}
                      </h2>
                    </div>

                    <div className="flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
                      {STATUS_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          disabled={savingTopicId === topic.id}
                          onClick={() =>
                            handleUpdateTopicStatus(selectedChapter.id, topic.id, opt.value)
                          }
                          className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
                            currentStatus === opt.value
                              ? opt.value === 'completed'
                                ? 'bg-emerald-600 text-white'
                                : opt.value === 'needs_revision'
                                ? 'bg-amber-600 text-white'
                                : 'bg-blue-600 text-white'
                              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {lesson && (
                    <div className="space-y-5">
                      <p className="text-sm sm:text-[15px] leading-relaxed text-slate-700 dark:text-slate-200 max-w-4xl">
                        {lesson.explanation}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2.5">
                          <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                            Important Definitions
                          </h3>
                          <dl className="space-y-2">
                            {lesson.importantDefinitions.map((def) => (
                              <div key={def.term} className="text-xs leading-relaxed">
                                <dt className="font-semibold text-blue-600 dark:text-blue-400 inline">
                                  {def.term}:{' '}
                                </dt>
                                <dd className="inline text-slate-600 dark:text-slate-300">
                                  {def.meaning}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        </div>

                        <div className="space-y-2.5">
                          <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                            Real-Life Examples
                          </h3>
                          <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                            {lesson.realLifeExamples.map((ex, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                <span>{ex}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 p-4">
                        <div className="space-y-1">
                          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            Key Takeaways
                          </div>
                          <ul className="text-xs text-slate-700 dark:text-slate-200 space-y-0.5">
                            {lesson.keyConcepts.map((kc, i) => (
                              <li key={i}>• {kc}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="sm:max-w-xs text-xs font-medium text-blue-700 dark:text-blue-300 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-700 pt-2 sm:pt-0 sm:pl-4">
                          Summary: {lesson.summaryCard}
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {chapterTab === 'formulas' && (
          <div className="space-y-6">
            {selectedChapter.formulas.length > 0 && (
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 space-y-4">
                <h2 className="font-display text-lg font-semibold">Formula Sheet</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedChapter.formulas.map((f) => (
                    <div
                      key={f.name}
                      className="rounded-lg border border-slate-200 dark:border-slate-800 p-4 space-y-1.5"
                    >
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {f.name} {f.unit ? `· ${f.unit}` : ''}
                      </div>
                      <div className="font-mono text-base font-semibold text-blue-600 dark:text-blue-400">
                        {f.expression}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300">
                        {f.variables}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedChapter.chemicalEquations.length > 0 && (
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 space-y-4">
                <h2 className="font-display text-lg font-semibold">
                  Important Balanced Chemical Equations
                </h2>
                <div className="space-y-3">
                  {selectedChapter.chemicalEquations.map((eq) => (
                    <div
                      key={eq.title}
                      className="rounded-lg border border-slate-200 dark:border-slate-800 p-4 space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {eq.title}
                        </span>
                        <span className="text-violet-600 dark:text-violet-400 font-medium">
                          {eq.type}
                        </span>
                      </div>
                      <div className="font-mono text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-slate-50 dark:bg-slate-950/60 rounded px-3 py-2">
                        {eq.equation}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">{eq.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedChapter.formulas.length === 0 &&
              selectedChapter.chemicalEquations.length === 0 && (
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-8 text-center text-sm text-slate-500">
                  This Biology chapter emphasizes conceptual mechanisms and labelled diagrams rather than algebraic formulas. Check Topics & Diagrams tabs.
                </div>
              )}
          </div>
        )}

        {chapterTab === 'diagrams' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {selectedChapter.diagrams.map((diag) => (
              <ChapterDiagram key={diag.id} diagram={diag} />
            ))}
          </div>
        )}

        {chapterTab === 'examples' && (
          <div className="space-y-4">
            {selectedChapter.solvedExamples.map((ex, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 space-y-3"
              >
                <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
                  Solved Example {idx + 1}
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {ex.problem}
                </h3>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Given: {ex.given}
                </div>
                <ol className="space-y-1.5 text-xs text-slate-700 dark:text-slate-200 list-decimal list-inside">
                  {ex.solutionSteps.map((step, sIdx) => (
                    <li key={sIdx}>{step}</li>
                  ))}
                </ol>
                <div className="rounded-lg bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  Final Answer: {ex.answer}
                </div>
              </div>
            ))}
          </div>
        )}

        {chapterTab === 'mistakes' && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 space-y-4">
            <h2 className="font-display text-lg font-semibold">
              Common Student Mistakes & How to Avoid Them
            </h2>
            <div className="space-y-4">
              {selectedChapter.commonMistakes.map((m, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 p-4 grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Common Pitfall</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300">{m.mistake}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>NCERT Correction</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300">{m.correction}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {chapterTab === 'notes' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 space-y-3">
              <h2 className="font-display text-lg font-semibold">Quick Revision Notes</h2>
              <ul className="space-y-2.5 text-xs leading-relaxed text-slate-700 dark:text-slate-200">
                {selectedChapter.quickRevisionNotes.map((note, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-mono text-blue-500 font-semibold">0{idx + 1}.</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 space-y-3">
              <h2 className="font-display text-lg font-semibold">NCERT Terminology Glossary</h2>
              <dl className="space-y-3">
                {selectedChapter.ncertTerminology.map((t) => (
                  <div key={t.term} className="border-b border-slate-100 dark:border-slate-800 pb-2 last:border-0">
                    <dt className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {t.term}
                    </dt>
                    <dd className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      {t.definition}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Subject & 13-Chapter Catalog View
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
            NCERT Science Textbook · 2026–27 Rationalized Syllabus
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
            Learn by Subject & Chapter
          </h1>
        </div>

        <div className="flex items-center gap-1 rounded-lg bg-slate-200/70 dark:bg-slate-800/80 p-1 self-start">
          {[
            { slug: 'all', label: 'All 13' },
            { slug: 'chemistry', label: 'Chemistry · 25M' },
            { slug: 'biology', label: 'Biology · 30M' },
            { slug: 'physics', label: 'Physics · 25M' },
          ].map((tab) => (
            <button
              key={tab.slug}
              type="button"
              onClick={() => setSubjectFilter(tab.slug)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                subjectFilter === tab.slug
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Subject Highlight Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 h-40">
          <img
            src={physicsOpticsImg}
            alt="Physics optical lenses and electromagnetic coils schematic"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1120]/95 via-[#0B1120]/70 to-transparent p-5 flex flex-col justify-center">
            <div className="text-xs font-medium text-blue-400">Units III & IV · 25 Marks</div>
            <div className="font-display text-lg font-bold text-white mt-0.5">
              Physics: Optics, Electricity & Magnetism
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xs">
              Ray diagrams, Cartesian sign convention, circuit networks, and solenoids.
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 h-40">
          <img
            src={chemBioImg}
            alt="Molecular carbon lattice and plant cellular structures"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1120]/95 via-[#0B1120]/70 to-transparent p-5 flex flex-col justify-center">
            <div className="text-xs font-medium text-emerald-400">Units I, II & V · 55 Marks</div>
            <div className="font-display text-lg font-bold text-white mt-0.5">
              Chemistry & Biology Complete Modules
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xs">
              Balanced reactions, pH salts, carbon compounds, life processes, heredity & environment.
            </p>
          </div>
        </div>
      </div>

      {/* 13 Chapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredChapters.map((ch) => {
          const subject = subjectById.get(ch.subjectId);
          const done = ch.topics.filter((t) => progressMap.get(t.id) === 'completed').length;
          const total = ch.topics.length;
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;

          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => handleOpenChapter(ch)}
              className="group flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 text-left hover:border-blue-500/70 transition-colors cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>
                    {subject?.name} · Ch {ch.chapterNumber}
                  </span>
                  <span className="font-mono tabular-nums font-medium text-blue-600 dark:text-blue-400">
                    {pct}%
                  </span>
                </div>
                <h3 className="mt-2 font-display text-base font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {ch.title}
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {ch.introduction}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>
                    {total} topics · {ch.unitWeightage}M Unit
                  </span>
                  <span className="inline-flex items-center gap-0.5 font-medium text-blue-600 dark:text-blue-400">
                    Open Lesson <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
