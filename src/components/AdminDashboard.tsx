import React, { useEffect, useState } from 'react';
import { Megaphone, Plus, ShieldAlert, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { user, chapters, questions, apiFetch, refreshCurriculum } = useAppContext();

  const [overview, setOverview] = useState<{
    metrics: {
      studentCount: number;
      attemptCount: number;
      avgAccuracy: number;
      completedTopicsCount: number;
    };
    students: Array<any>;
    announcements: Array<any>;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Add Question Form
  const [qChapterId, setQChapterId] = useState<number>(chapters[0]?.id || 1);
  const [qType, setQType] = useState<string>('mcq');
  const [qDifficulty, setQDifficulty] = useState<string>('intermediate');
  const [qPrompt, setQPrompt] = useState('');
  const [qOptionA, setQOptionA] = useState('');
  const [qOptionB, setQOptionB] = useState('');
  const [qOptionC, setQOptionC] = useState('');
  const [qOptionD, setQOptionD] = useState('');
  const [qCorrectLabel, setQCorrectLabel] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [qExplanation, setQExplanation] = useState('');

  // Announcement Form
  const [annTitle, setAnnTitle] = useState('');
  const [annMessage, setAnnMessage] = useState('');

  // Chapter quick edit
  const [editChId, setEditChId] = useState<number>(chapters[0]?.id || 1);
  const [editIntro, setEditIntro] = useState('');

  const loadAdminOverview = async () => {
    setError(null);
    const res = await apiFetch('/api/admin/overview');
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Educator authorization required.');
      return;
    }
    setOverview(await res.json());
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      loadAdminOverview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-8 text-center space-y-2 max-w-lg mx-auto">
        <ShieldAlert className="w-8 h-8 text-rose-500 mx-auto" />
        <h1 className="font-display text-lg font-semibold">Protected Educator Area</h1>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          This Administration Console is restricted to authorised educators (`role = admin`).
        </p>
      </div>
    );
  }

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qPrompt.trim() || !qExplanation.trim()) return;
    const opts =
      qType === 'mcq'
        ? [
            { label: 'A', optionText: qOptionA, isCorrect: qCorrectLabel === 'A' },
            { label: 'B', optionText: qOptionB, isCorrect: qCorrectLabel === 'B' },
            { label: 'C', optionText: qOptionC, isCorrect: qCorrectLabel === 'C' },
            { label: 'D', optionText: qOptionD, isCorrect: qCorrectLabel === 'D' },
          ]
        : [];
    const correctText =
      opts.find((o) => o.isCorrect)?.optionText || qOptionA || 'See explanation';

    const res = await apiFetch('/api/admin/questions', {
      method: 'POST',
      body: JSON.stringify({
        chapterId: qChapterId,
        questionType: qType,
        difficulty: qDifficulty,
        provenance: 'practice_generated',
        sourceNote: 'Educator-authored item',
        marks: 1,
        prompt: qPrompt,
        correctAnswerText: correctText,
        explanation: qExplanation,
        options: opts,
      }),
    });
    if (res.ok) {
      setQPrompt('');
      setQOptionA('');
      setQOptionB('');
      setQOptionC('');
      setQOptionD('');
      setQExplanation('');
      await refreshCurriculum();
    }
  };

  const handleDeleteQuestion = async (id: number) => {
    const res = await apiFetch(`/api/admin/questions/${id}`, { method: 'DELETE' });
    if (res.ok) {
      await refreshCurriculum();
    }
  };

  const handlePublishAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annMessage.trim()) return;
    const res = await apiFetch('/api/admin/announcements', {
      method: 'POST',
      body: JSON.stringify({ title: annTitle, message: annMessage, priority: 'important' }),
    });
    if (res.ok) {
      setAnnTitle('');
      setAnnMessage('');
      await loadAdminOverview();
      await refreshCurriculum();
    }
  };

  const handleDeleteAnnouncement = async (id: number) => {
    const res = await apiFetch(`/api/admin/announcements/${id}`, { method: 'DELETE' });
    if (res.ok) {
      await loadAdminOverview();
      await refreshCurriculum();
    }
  };

  const handleUpdateChapterIntro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editIntro.trim()) return;
    const res = await apiFetch(`/api/admin/chapters/${editChId}`, {
      method: 'PATCH',
      body: JSON.stringify({ introduction: editIntro }),
    });
    if (res.ok) {
      setEditIntro('');
      await refreshCurriculum();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
          Role-Protected Educator Management Console
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
          Admin & Content Management
        </h1>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-500">
          {error}
        </div>
      )}

      {overview && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5">
            <div className="text-xs text-slate-500">Registered Learners</div>
            <div className="font-mono text-2xl font-bold tabular-nums mt-1">
              {overview.metrics.studentCount}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5">
            <div className="text-xs text-slate-500">Quiz & Mock Attempts</div>
            <div className="font-mono text-2xl font-bold tabular-nums mt-1">
              {overview.metrics.attemptCount}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5">
            <div className="text-xs text-slate-500">Cohort Avg Accuracy</div>
            <div className="font-mono text-2xl font-bold tabular-nums mt-1 text-blue-500">
              {overview.metrics.avgAccuracy}%
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5">
            <div className="text-xs text-slate-500">Topics Mastered</div>
            <div className="font-mono text-2xl font-bold tabular-nums mt-1 text-emerald-500">
              {overview.metrics.completedTopicsCount}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Add Question */}
        <form
          onSubmit={handleCreateQuestion}
          className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 space-y-3"
        >
          <h2 className="font-display text-base font-semibold">Add Question to Bank</h2>
          <div className="grid grid-cols-3 gap-2">
            <select
              value={qChapterId}
              onChange={(e) => setQChapterId(Number(e.target.value))}
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-2.5 py-2 text-xs"
            >
              {chapters.map((c) => (
                <option key={c.id} value={c.id}>
                  Ch {c.chapterNumber}
                </option>
              ))}
            </select>
            <select
              value={qType}
              onChange={(e) => setQType(e.target.value)}
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-2.5 py-2 text-xs"
            >
              <option value="mcq">MCQ</option>
              <option value="numerical">Numerical</option>
              <option value="short_answer">Short Answer</option>
            </select>
            <select
              value={qDifficulty}
              onChange={(e) => setQDifficulty(e.target.value)}
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-2.5 py-2 text-xs"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <textarea
            rows={2}
            value={qPrompt}
            onChange={(e) => setQPrompt(e.target.value)}
            placeholder="Question prompt..."
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-2.5 text-xs"
          />
          {qType === 'mcq' ? (
            <div className="grid grid-cols-2 gap-2">
              <input value={qOptionA} onChange={(e) => setQOptionA(e.target.value)} placeholder="Option A" className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 text-xs" />
              <input value={qOptionB} onChange={(e) => setQOptionB(e.target.value)} placeholder="Option B" className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 text-xs" />
              <input value={qOptionC} onChange={(e) => setQOptionC(e.target.value)} placeholder="Option C" className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 text-xs" />
              <input value={qOptionD} onChange={(e) => setQOptionD(e.target.value)} placeholder="Option D" className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 text-xs" />
              <select value={qCorrectLabel} onChange={(e) => setQCorrectLabel(e.target.value as any)} className="col-span-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 text-xs">
                <option value="A">Correct: Option A</option>
                <option value="B">Correct: Option B</option>
                <option value="C">Correct: Option C</option>
                <option value="D">Correct: Option D</option>
              </select>
            </div>
          ) : (
            <input value={qOptionA} onChange={(e) => setQOptionA(e.target.value)} placeholder="Model answer..." className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 text-xs" />
          )}
          <input
            value={qExplanation}
            onChange={(e) => setQExplanation(e.target.value)}
            placeholder="Step-by-step explanation..."
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 text-xs"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Publish Question
          </button>
        </form>

        {/* Publish Announcements & Edit Chapter Intro */}
        <div className="lg:col-span-6 space-y-6">
          <form
            onSubmit={handlePublishAnnouncement}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 space-y-3"
          >
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-blue-500" />
              <h2 className="font-display text-base font-semibold">Publish Announcement</h2>
            </div>
            <input
              value={annTitle}
              onChange={(e) => setAnnTitle(e.target.value)}
              placeholder="Announcement heading..."
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs"
            />
            <textarea
              rows={2}
              value={annMessage}
              onChange={(e) => setAnnMessage(e.target.value)}
              placeholder="Notice for Class 10 students..."
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-2.5 text-xs"
            />
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 cursor-pointer"
            >
              Broadcast Notice
            </button>
          </form>

          <form
            onSubmit={handleUpdateChapterIntro}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 space-y-3"
          >
            <h2 className="font-display text-base font-semibold">Update Chapter Introduction</h2>
            <select
              value={editChId}
              onChange={(e) => setEditChId(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs"
            >
              {chapters.map((c) => (
                <option key={c.id} value={c.id}>
                  Ch {c.chapterNumber}: {c.title}
                </option>
              ))}
            </select>
            <textarea
              rows={2}
              value={editIntro}
              onChange={(e) => setEditIntro(e.target.value)}
              placeholder="New chapter overview text..."
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-2.5 text-xs"
            />
            <button
              type="submit"
              className="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Save Chapter Update
            </button>
          </form>
        </div>
      </div>

      {/* Manage Question Bank & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 space-y-3">
          <h2 className="font-display text-base font-semibold">
            Question Bank ({questions.length} items)
          </h2>
          <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {questions.slice(0, 15).map((q) => (
              <div key={q.id} className="py-2.5 flex items-start justify-between gap-2 text-xs">
                <span className="line-clamp-2 text-slate-700 dark:text-slate-300">{q.prompt}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(q.id)}
                  className="text-slate-400 hover:text-rose-500 shrink-0 cursor-pointer"
                  aria-label="Delete question"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 space-y-3">
          <h2 className="font-display text-base font-semibold">Active Announcements</h2>
          <div className="space-y-2.5">
            {(overview?.announcements || []).map((a) => (
              <div key={a.id} className="flex items-start justify-between gap-2 text-xs border-b border-slate-100 dark:border-slate-800 pb-2">
                <div>
                  <div className="font-semibold">{a.title}</div>
                  <div className="text-slate-500">{a.message}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteAnnouncement(a.id)}
                  className="text-slate-400 hover:text-rose-500 shrink-0 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
