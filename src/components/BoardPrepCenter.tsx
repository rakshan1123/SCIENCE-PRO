import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock, Flag, Info, Play, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../context/AuthContext';
import { MockTestItem, QuestionItem } from '../types';

interface BoardPrepCenterProps {
  onOpenChapter: (slug: string) => void;
}

export const BoardPrepCenter: React.FC<BoardPrepCenterProps> = ({ onOpenChapter }) => {
  const { mockTests, chapters, firebaseUser, apiFetch, refreshUserState } = useAppContext();
  const [activeMock, setActiveMock] = useState<MockTestItem | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [markedReview, setMarkedReview] = useState<Record<number, boolean>>({});
  const [visited, setVisited] = useState<Record<number, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [resultSummary, setResultSummary] = useState<any>(null);

  useEffect(() => {
    if (!activeMock || submitted) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          handleSubmitMock();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMock, submitted]);

  const startMock = (mock: MockTestItem) => {
    setActiveMock(mock);
    setCurrentIdx(0);
    setAnswers({});
    setMarkedReview({});
    setVisited({ [mock.questions[0]?.id || 0]: true });
    setSecondsLeft(mock.durationMinutes * 60);
    setSubmitted(false);
    setResultSummary(null);
  };

  const selectQuestion = (idx: number, qId: number) => {
    setCurrentIdx(idx);
    setVisited((v) => ({ ...v, [qId]: true }));
  };

  const handleSubmitMock = async () => {
    if (!activeMock || submitted) return;
    setSubmitted(true);

    const qs = activeMock.questions;
    let correct = 0;
    let marksObtained = 0;
    let totalMarks = 0;

    const weakChapterIds = new Set<number>();

    for (const q of qs) {
      totalMarks += q.marks;
      const ans = (answers[q.id] || '').trim();
      let ok = false;
      if (q.options && q.options.length > 0) {
        const right = q.options.find((o) => o.isCorrect);
        ok = Boolean(right && ans === right.optionText);
      } else if (q.questionType === 'fill_blank') {
        ok = ans.toLowerCase() === q.correctAnswerText.toLowerCase();
      } else {
        ok = ans.length >= 25;
      }

      if (ok) {
        correct += 1;
        marksObtained += q.marks;
      } else {
        weakChapterIds.add(q.chapterId);
      }
    }

    const totalSec = activeMock.durationMinutes * 60 - secondsLeft;
    if (firebaseUser) {
      await apiFetch('/api/quiz-attempts', {
        method: 'POST',
        body: JSON.stringify({
          mode: 'mock_test',
          mockTestId: activeMock.id,
          difficulty: 'mixed',
          timeSpentSeconds: Math.max(10, totalSec),
          answers: qs.map((q) => ({
            questionId: q.id,
            userAnswer: answers[q.id] || '',
            markedForReview: Boolean(markedReview[q.id]),
          })),
        }),
      }).catch(() => {});
      await refreshUserState();
    }

    setResultSummary({
      correct,
      total: qs.length,
      marksObtained,
      totalMarks,
      accuracy: qs.length > 0 ? Math.round((correct / qs.length) * 100) : 0,
      weakChapters: chapters.filter((c) => weakChapterIds.has(c.id)),
    });
  };

  const formatCountdown = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const provenanceLabel = (prov: string) => {
    if (prov === 'official_cbse_pattern') return 'CBSE 2026–27 Official Pattern Model';
    if (prov === 'verified_pyq_reference') return 'Verified Past-Year Reference';
    return 'Practice / Author-Generated Set';
  };

  // Submitted Mock Result Analysis
  if (activeMock && submitted && resultSummary) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
                Mock Examination Completed
              </div>
              <h1 className="font-display text-2xl font-bold">{activeMock.title}</h1>
            </div>
            <button
              type="button"
              onClick={() => setActiveMock(null)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 cursor-pointer"
            >
              Back to Board Prep Centre
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-lg bg-slate-100 dark:bg-slate-800/70 p-4">
              <div className="text-xs text-slate-500 dark:text-slate-400">Mock Score</div>
              <div className="font-mono text-2xl font-bold tabular-nums mt-1">
                {resultSummary.marksObtained} / {resultSummary.totalMarks} M
              </div>
            </div>
            <div className="rounded-lg bg-slate-100 dark:bg-slate-800/70 p-4">
              <div className="text-xs text-slate-500 dark:text-slate-400">Questions Correct</div>
              <div className="font-mono text-2xl font-bold tabular-nums mt-1">
                {resultSummary.correct} / {resultSummary.total}
              </div>
            </div>
            <div className="rounded-lg bg-slate-100 dark:bg-slate-800/70 p-4">
              <div className="text-xs text-slate-500 dark:text-slate-400">Accuracy</div>
              <div className="font-mono text-2xl font-bold tabular-nums mt-1 text-blue-600 dark:text-blue-400">
                {resultSummary.accuracy}%
              </div>
            </div>
          </div>

          {resultSummary.weakChapters.length > 0 && (
            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2">
              <div className="text-xs font-semibold text-slate-900 dark:text-white">
                Suggested Revision Chapters Based on Mock Mistakes
              </div>
              <div className="flex flex-wrap gap-2">
                {resultSummary.weakChapters.map((ch: any) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => onOpenChapter(ch.slug)}
                    className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 cursor-pointer"
                  >
                    Revise Ch {ch.chapterNumber}: {ch.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {activeMock.questions.map((q: QuestionItem, idx: number) => (
            <div
              key={q.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 space-y-2"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Q{idx + 1} · {q.marks} Marks · {q.sourceNote}</span>
                <span>Your answer: {answers[q.id] || 'Unanswered'}</span>
              </div>
              <p className="text-sm font-medium whitespace-pre-line">{q.prompt}</p>
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Answer: {q.correctAnswerText}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">{q.explanation}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Active Exam-Style Mock Interface
  if (activeMock) {
    const currentQ = activeMock.questions[currentIdx];
    return (
      <div className="space-y-5">
        {/* Exam Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 px-5 py-3.5">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {provenanceLabel(activeMock.provenance)}
            </div>
            <div className="font-display text-base font-semibold">{activeMock.title}</div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 font-mono text-sm font-bold tabular-nums text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4" />
              <span>{formatCountdown(secondsLeft)}</span>
            </div>
            <button
              type="button"
              onClick={handleSubmitMock}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 cursor-pointer"
            >
              Submit Examination
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Question Workspace */}
          {currentQ && (
            <div className="lg:col-span-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 space-y-5">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>
                  Question {currentIdx + 1} of {activeMock.questions.length} · {currentQ.marks} Mark(s)
                </span>
                <span>{currentQ.sourceNote}</span>
              </div>

              {currentQ.passageText && (
                <div className="rounded-lg bg-slate-100 dark:bg-slate-800/70 p-4 text-xs leading-relaxed">
                  {currentQ.passageText}
                </div>
              )}

              <p className="text-base font-medium whitespace-pre-line leading-relaxed">
                {currentQ.prompt}
              </p>

              {currentQ.options && currentQ.options.length > 0 ? (
                <div className="space-y-2.5">
                  {currentQ.options.map((opt) => {
                    const selected = answers[currentQ.id] === opt.optionText;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() =>
                          setAnswers((prev) => ({ ...prev, [currentQ.id]: opt.optionText }))
                        }
                        className={`w-full flex items-start gap-3 rounded-lg border p-3.5 text-left text-sm cursor-pointer ${
                          selected
                            ? 'border-blue-500 bg-blue-600/10 text-blue-600 dark:text-blue-300'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                        }`}
                      >
                        <span className="font-mono font-semibold">{opt.label}.</span>
                        <span>{opt.optionText}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <textarea
                  rows={5}
                  value={answers[currentQ.id] || ''}
                  onChange={(e) =>
                    setAnswers((prev) => ({ ...prev, [currentQ.id]: e.target.value }))
                  }
                  placeholder="Write your board-examination response with clear steps, balanced equations, or units..."
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-3.5 text-sm"
                />
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() =>
                    setMarkedReview((prev) => ({
                      ...prev,
                      [currentQ.id]: !prev[currentQ.id],
                    }))
                  }
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-medium cursor-pointer ${
                    markedReview[currentQ.id]
                      ? 'border-violet-500 bg-violet-500/15 text-violet-600 dark:text-violet-300'
                      : 'border-slate-300 dark:border-slate-700'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{markedReview[currentQ.id] ? 'Marked for Review' : 'Mark for Review'}</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={currentIdx === 0}
                    onClick={() =>
                      selectQuestion(currentIdx - 1, activeMock.questions[currentIdx - 1].id)
                    }
                    className="rounded-lg border border-slate-300 dark:border-slate-700 px-3.5 py-2 text-xs font-medium disabled:opacity-40 cursor-pointer"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={currentIdx >= activeMock.questions.length - 1}
                    onClick={() =>
                      selectQuestion(currentIdx + 1, activeMock.questions[currentIdx + 1].id)
                    }
                    className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-40 hover:bg-blue-500 cursor-pointer"
                  >
                    Save & Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Question Navigation Palette */}
          <div className="lg:col-span-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 space-y-4">
            <h2 className="font-display text-sm font-semibold">Question Palette</h2>
            <div className="grid grid-cols-5 gap-2">
              {activeMock.questions.map((q, idx) => {
                const isAnswered = Boolean(answers[q.id]?.trim());
                const isReview = Boolean(markedReview[q.id]);
                const isCurrent = idx === currentIdx;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => selectQuestion(idx, q.id)}
                    className={`h-9 rounded-lg font-mono text-xs font-semibold tabular-nums transition-colors cursor-pointer ${
                      isCurrent
                        ? 'ring-2 ring-blue-500 bg-blue-600 text-white'
                        : isReview
                        ? 'bg-violet-600 text-white'
                        : isAnswered
                        ? 'bg-emerald-600 text-white'
                        : visited[q.id]
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        : 'border border-slate-300 dark:border-slate-700 text-slate-500'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-600 inline-block" /> Answered
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-violet-600 inline-block" /> Marked Review
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-blue-600 inline-block" /> Current
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded border border-slate-400 inline-block" /> Unvisited
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Board Prep Hub
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
          CBSE Class 10 Science (086) · 2026–27 Examination Blueprint
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
          Board Exam Preparation Centre
        </h1>
      </div>

      {/* Transparency / Provenance Notice */}
      <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 flex items-start gap-3 text-xs text-slate-700 dark:text-slate-200">
        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold">Content Provenance & Integrity Standard</div>
          <p className="text-slate-600 dark:text-slate-300">
            Science Pro clearly labels <strong>CBSE 2026–27 Pattern Blueprints</strong> separately from <strong>Author-Crafted Practice Questions</strong>. Newly authored competency items are never mislabeled as past official CBSE board papers. Official sample papers and curriculum circulars are published at cbseacademic.nic.in.
          </p>
        </div>
      </div>

      {/* Mock Test Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockTests.map((mock) => (
          <div
            key={mock.id}
            className="flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-medium">
                <span>{provenanceLabel(mock.provenance)}</span>
                <span className="font-mono tabular-nums">
                  {mock.durationMinutes} min · {mock.totalMarks} Marks
                </span>
              </div>
              <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                {mock.title}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {mock.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {mock.questions.length} interactive questions
              </span>
              <button
                type="button"
                onClick={() => startMock(mock)}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Launch Mock Exam</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CBSE 2026-27 Question Paper Pattern Guide */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <h2 className="font-display text-lg font-semibold">
            CBSE 2026–27 Board Question Paper Structure (80 Marks Theory)
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {[
            { sec: 'Section A', desc: '16 MCQs + 4 Assertion–Reason', marks: '20 × 1M = 20M' },
            { sec: 'Section B', desc: '6 Very Short Answer Questions', marks: '6 × 2M = 12M' },
            { sec: 'Section C', desc: '7 Short Answer Questions', marks: '7 × 3M = 21M' },
            { sec: 'Section D', desc: '3 Long Answer Questions', marks: '3 × 5M = 15M' },
            { sec: 'Section E', desc: '3 Case / Competency Units', marks: '3 × 4M = 12M' },
          ].map((s) => (
            <div key={s.sec} className="rounded-lg border border-slate-200 dark:border-slate-800 p-3.5 space-y-1">
              <div className="font-semibold text-blue-600 dark:text-blue-400">{s.sec}</div>
              <div className="text-slate-700 dark:text-slate-200">{s.desc}</div>
              <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                {s.marks}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
