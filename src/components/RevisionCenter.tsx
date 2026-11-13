import React, { useMemo, useState } from 'react';
import {
  Bookmark,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Plus,
  RotateCw,
  Trash2,
} from 'lucide-react';
import { useAppContext } from '../context/AuthContext';
import { ChapterDiagram } from './ChapterDiagram';

interface RevisionCenterProps {
  onOpenChapter: (slug: string) => void;
}

export const RevisionCenter: React.FC<RevisionCenterProps> = ({ onOpenChapter }) => {
  const {
    chapters,
    questions,
    progress,
    bookmarks,
    mistakes,
    notes,
    firebaseUser,
    signInWithGoogle,
    apiFetch,
    refreshUserState,
  } = useAppContext();

  const [activeTab, setActiveTab] = useState<
    'flashcards' | 'formulas' | 'mistakes' | 'bookmarks' | 'notes' | 'diagrams'
  >('flashcards');
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const [noteChapterId, setNoteChapterId] = useState<number>(chapters[0]?.id || 1);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  const flashcards = useMemo(() => {
    const cards: Array<{ front: string; back: string; category: string }> = [];
    for (const ch of chapters) {
      for (const term of ch.ncertTerminology.slice(0, 2)) {
        cards.push({
          category: `Ch ${ch.chapterNumber} · Definition`,
          front: term.term,
          back: term.definition,
        });
      }
      for (const eq of ch.chemicalEquations.slice(0, 1)) {
        cards.push({
          category: `Ch ${ch.chapterNumber} · Balanced Equation`,
          front: eq.title,
          back: `${eq.equation} (${eq.type})`,
        });
      }
      for (const f of ch.formulas.slice(0, 1)) {
        cards.push({
          category: `Ch ${ch.chapterNumber} · Formula`,
          front: f.name,
          back: `${f.expression} — ${f.variables}`,
        });
      }
    }
    return cards;
  }, [chapters]);

  const currentCard = flashcards[cardIndex] || null;
  const questionById = useMemo(
    () => new Map(questions.map((q) => [q.id, q])),
    [questions]
  );
  const chapterById = useMemo(
    () => new Map(chapters.map((c) => [c.id, c])),
    [chapters]
  );

  const handleResolveMistake = async (id: number, resolved: boolean) => {
    await apiFetch(`/api/mistakes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ resolved }),
    });
    await refreshUserState();
  };

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser) {
      await signInWithGoogle();
      return;
    }
    if (!noteTitle.trim() || !noteContent.trim()) return;
    const res = await apiFetch('/api/notes', {
      method: 'POST',
      body: JSON.stringify({
        chapterId: noteChapterId || chapters[0]?.id,
        title: noteTitle,
        content: noteContent,
      }),
    });
    if (res.ok) {
      setNoteTitle('');
      setNoteContent('');
      await refreshUserState();
    }
  };

  const handleDeleteNote = async (id: number) => {
    await apiFetch(`/api/notes/${id}`, { method: 'DELETE' });
    await refreshUserState();
  };

  const handleRemoveBookmark = async (id: number) => {
    await apiFetch(`/api/bookmarks/${id}`, { method: 'DELETE' });
    await refreshUserState();
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
          Flashcards · Mistake Notebook · Formulas & Equations · Personal Notes
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
          Smart Revision Centre
        </h1>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-1.5">
        {[
          { id: 'flashcards' as const, label: 'Flashcards' },
          { id: 'formulas' as const, label: 'Formulas & Equations' },
          { id: 'mistakes' as const, label: `Mistake Notebook (${mistakes.filter((m) => !m.resolved).length})` },
          { id: 'bookmarks' as const, label: `Bookmarks (${bookmarks.length})` },
          { id: 'notes' as const, label: 'Personal Notes' },
          { id: 'diagrams' as const, label: 'Diagram Revision' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`rounded-lg px-3.5 py-2 text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === t.id
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'flashcards' && currentCard && (
        <div className="max-w-2xl mx-auto space-y-4">
          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            className="w-full min-h-[240px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-8 text-center flex flex-col items-center justify-center gap-4 hover:border-blue-500/60 transition-colors cursor-pointer"
          >
            <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
              {currentCard.category} · {flipped ? 'Answer / Definition' : 'Click Card to Flip'}
            </div>
            <div className="font-display text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white max-w-lg">
              {flipped ? currentCard.back : currentCard.front}
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <RotateCw className="w-3.5 h-3.5" />
              <span>Tap to flip</span>
            </div>
          </button>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setFlipped(false);
                setCardIndex((i) => (i - 1 + flashcards.length) % flashcards.length);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 px-3.5 py-2 text-xs font-medium cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <span className="font-mono text-xs tabular-nums text-slate-500">
              Card {cardIndex + 1} / {flashcards.length}
            </span>
            <button
              type="button"
              onClick={() => {
                setFlipped(false);
                setCardIndex((i) => (i + 1) % flashcards.length);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-500 cursor-pointer"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {activeTab === 'formulas' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 space-y-4">
            <h2 className="font-display text-lg font-semibold">Physics & Environment Formula Bank</h2>
            <div className="space-y-3">
              {chapters.flatMap((ch) =>
                ch.formulas.map((f) => (
                  <div key={`${ch.id}-${f.name}`} className="border-b border-slate-100 dark:border-slate-800 pb-2.5 last:border-0">
                    <div className="text-[11px] text-slate-500">Ch {ch.chapterNumber} · {f.name}</div>
                    <div className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {f.expression}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300">{f.variables}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 space-y-4">
            <h2 className="font-display text-lg font-semibold">Balanced Chemical Equations</h2>
            <div className="space-y-3">
              {chapters.flatMap((ch) =>
                ch.chemicalEquations.map((eq) => (
                  <div key={`${ch.id}-${eq.title}`} className="border-b border-slate-100 dark:border-slate-800 pb-2.5 last:border-0">
                    <div className="text-[11px] text-slate-500">Ch {ch.chapterNumber} · {eq.title}</div>
                    <div className="font-mono text-xs sm:text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      {eq.equation}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'mistakes' && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 space-y-4">
          <h2 className="font-display text-lg font-semibold">Mistake Notebook</h2>
          {!firebaseUser ? (
            <div className="text-xs text-slate-500 space-y-2">
              <p>Sign in with Google so wrong quiz answers are automatically captured here for targeted revision.</p>
              <button
                type="button"
                onClick={signInWithGoogle}
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white cursor-pointer"
              >
                Sign In with Google
              </button>
            </div>
          ) : mistakes.length === 0 ? (
            <p className="text-xs text-slate-500">
              No unresolved mistakes yet. Any incorrect answers from Practice or Board Mocks will appear here automatically.
            </p>
          ) : (
            <div className="space-y-3">
              {mistakes.map((m) => {
                const q = questionById.get(m.questionId);
                if (!q) return null;
                return (
                  <div
                    key={m.id}
                    className="rounded-lg border border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-slate-500">
                        Attempts: {m.attemptCount} · {m.resolved ? 'Resolved' : 'Needs Review'}
                      </div>
                      <p className="text-sm font-medium">{q.prompt}</p>
                      <div className="text-xs text-rose-500">Your mistake: {m.wrongAnswer}</div>
                      <div className="text-xs text-emerald-500">Correct: {q.correctAnswerText}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleResolveMistake(m.id, !m.resolved)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium shrink-0 cursor-pointer ${
                        m.resolved
                          ? 'bg-emerald-600 text-white'
                          : 'border border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{m.resolved ? 'Mastered' : 'Mark Resolved'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'bookmarks' && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 space-y-4">
          <h2 className="font-display text-lg font-semibold">Saved Bookmarks</h2>
          {bookmarks.length === 0 ? (
            <p className="text-xs text-slate-500">
              Bookmark chapters during lessons or tricky questions during practice to collect them here.
            </p>
          ) : (
            <div className="space-y-3">
              {bookmarks.map((b) => {
                const q = b.questionId ? questionById.get(b.questionId) : null;
                const ch = b.chapterId ? chapterById.get(b.chapterId) : null;
                return (
                  <div
                    key={b.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-medium capitalize">
                        {b.itemType} Bookmark
                      </div>
                      <div className="text-sm font-medium truncate">
                        {q ? q.prompt : ch ? `Ch ${ch.chapterNumber}: ${ch.title}` : 'Saved Item'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {ch && (
                        <button
                          type="button"
                          onClick={() => onOpenChapter(ch.slug)}
                          className="rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-xs cursor-pointer"
                        >
                          Open
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveBookmark(b.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 cursor-pointer"
                        aria-label="Remove bookmark"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={handleSaveNote}
            className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 space-y-4"
          >
            <h2 className="font-display text-base font-semibold">Add Personal Revision Note</h2>
            <select
              value={noteChapterId}
              onChange={(e) => setNoteChapterId(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs"
            >
              {chapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  Ch {ch.chapterNumber}: {ch.title}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="Note title (e.g., Sign Convention Checklist)"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs"
            />
            <textarea
              rows={4}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Write your concise summary or memory aid..."
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-3 text-xs"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Save Note</span>
            </button>
          </form>

          <div className="lg:col-span-7 space-y-3">
            {notes.length === 0 ? (
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 text-xs text-slate-500">
                No personal notes saved yet. Create chapter reminders or formula shortcuts on the left.
              </div>
            ) : (
              notes.map((n) => (
                <div
                  key={n.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-sm">{n.title}</div>
                    <button
                      type="button"
                      onClick={() => handleDeleteNote(n.id)}
                      className="text-slate-400 hover:text-rose-500 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                    {n.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'diagrams' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {chapters.flatMap((ch) =>
            ch.diagrams.map((d) => <ChapterDiagram key={d.id} diagram={d} />)
          )}
        </div>
      )}

      {/* Chapter Topic Mastery Matrix */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 space-y-3">
        <h2 className="font-display text-base font-semibold">Topic Status Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          {[
            { key: 'completed', label: 'Completed', color: 'text-emerald-500' },
            { key: 'learning', label: 'Learning', color: 'text-blue-500' },
            { key: 'needs_revision', label: 'Needs Revision', color: 'text-amber-500' },
            {
              key: 'not_started',
              label: 'Not Started',
              color: 'text-slate-500 dark:text-slate-400',
            },
          ].map((stat) => {
            const totalTopics = chapters.reduce((acc, c) => acc + c.topics.length, 0);
            const count =
              stat.key === 'not_started'
                ? Math.max(0, totalTopics - progress.filter((p) => p.status !== 'not_started').length)
                : progress.filter((p) => p.status === stat.key).length;
            return (
              <div key={stat.key} className="rounded-lg bg-slate-100 dark:bg-slate-800/60 p-3">
                <div className={`font-mono text-xl font-bold tabular-nums ${stat.color}`}>
                  {count}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
