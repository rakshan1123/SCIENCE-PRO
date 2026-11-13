import React, { useMemo } from 'react';
import { Award, Flame, Target, TrendingUp } from 'lucide-react';
import { useAppContext } from '../context/AuthContext';

interface ProgressAnalyticsProps {
  onOpenChapter: (slug: string) => void;
}

export const ProgressAnalytics: React.FC<ProgressAnalyticsProps> = ({
  onOpenChapter,
}) => {
  const { chapters, subjects, progress, attempts, profile, achievements, mistakes } =
    useAppContext();

  const analytics = useMemo(() => {
    const statusMap = new Map(progress.map((p) => [p.topicId, p.status]));
    const timeByChapter = new Map<number, number>();
    for (const p of progress) {
      timeByChapter.set(
        p.chapterId,
        (timeByChapter.get(p.chapterId) || 0) + p.timeSpentMinutes
      );
    }

    const chapterStats = chapters.map((ch) => {
      const done = ch.topics.filter((t) => statusMap.get(t.id) === 'completed').length;
      const pct = ch.topics.length > 0 ? Math.round((done / ch.topics.length) * 100) : 0;
      const chAttempts = attempts.filter((a) => a.chapterId === ch.id);
      const avgAcc =
        chAttempts.length > 0
          ? Math.round(
              chAttempts.reduce((acc, a) => acc + a.accuracyPercent, 0) / chAttempts.length
            )
          : null;
      return {
        chapter: ch,
        pct,
        avgAcc,
        minutes: timeByChapter.get(ch.id) || 0,
      };
    });

    const overallAccuracy =
      attempts.length > 0
        ? Math.round(
            attempts.reduce((acc, a) => acc + a.accuracyPercent, 0) / attempts.length
          )
        : 0;

    const strong = chapterStats.filter((c) => c.pct >= 70 || (c.avgAcc !== null && c.avgAcc >= 75));
    const needsWork = chapterStats.filter((c) => c.pct < 50 || (c.avgAcc !== null && c.avgAcc < 60));

    let recommendation =
      'Start with Unit I (Chemical Reactions) or Unit III (Light) to build steady board momentum.';
    if (strong.length > 0 && needsWork.length > 0) {
      recommendation = `You are performing well in ${strong[0].chapter.title}. Revise ${needsWork[0].chapter.title} next.`;
    } else if (strong.length > 0) {
      recommendation = `Great consistency in ${strong[0].chapter.title}. Test yourself with a timed Board Mock Paper next.`;
    }

    return {
      chapterStats,
      overallAccuracy,
      strong,
      needsWork,
      recommendation,
      completedChapters: chapterStats.filter((c) => c.pct === 100).length,
    };
  }, [chapters, progress, attempts]);

  const subjectHours = useMemo(() => {
    const map = new Map<number, number>();
    for (const st of analytics.chapterStats) {
      map.set(st.chapter.subjectId, (map.get(st.chapter.subjectId) || 0) + st.minutes);
    }
    return subjects.map((s) => ({
      name: s.name,
      minutes: map.get(s.id) || 0,
    }));
  }, [subjects, analytics.chapterStats]);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
          Personalised Learning Insights · Gamification & Milestones
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
          My Progress & Analytics
        </h1>
      </div>

      {/* Actionable Recommendation Banner */}
      <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">
            Recommended Next Study Action
          </div>
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            {analytics.recommendation}
          </p>
        </div>
        {analytics.needsWork[0] && (
          <button
            type="button"
            onClick={() => onOpenChapter(analytics.needsWork[0].chapter.slug)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Open Chapter
          </button>
        )}
      </div>

      {/* Core Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5">
          <div className="text-xs text-slate-500 dark:text-slate-400">Chapters Completed</div>
          <div className="font-mono text-2xl font-bold tabular-nums mt-1">
            {analytics.completedChapters} / {chapters.length}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5">
          <div className="text-xs text-slate-500 dark:text-slate-400">Average Quiz Accuracy</div>
          <div className="font-mono text-2xl font-bold tabular-nums mt-1 text-blue-600 dark:text-blue-400">
            {analytics.overallAccuracy}%
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5">
          <div className="text-xs text-slate-500 dark:text-slate-400">Total Time Studied</div>
          <div className="font-mono text-2xl font-bold tabular-nums mt-1">
            {profile?.totalStudyMinutes ?? 0} min
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5">
          <div className="text-xs text-slate-500 dark:text-slate-400">Open Mistakes</div>
          <div className="font-mono text-2xl font-bold tabular-nums mt-1 text-amber-500">
            {mistakes.filter((m) => !m.resolved).length}
          </div>
        </div>
      </div>

      {/* Visual Chapter Mastery Chart + Subject Time */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Chapter Mastery Chart (13 Chapters)</h2>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="space-y-2.5">
            {analytics.chapterStats.map((st) => (
              <div key={st.chapter.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => onOpenChapter(st.chapter.slug)}
                    className="font-medium text-slate-700 dark:text-slate-200 hover:text-blue-500 truncate text-left cursor-pointer"
                  >
                    Ch {st.chapter.chapterNumber}: {st.chapter.title}
                  </button>
                  <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400 shrink-0 ml-2">
                    {st.pct}% {st.avgAcc !== null ? `· Quiz ${st.avgAcc}%` : ''}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      st.pct >= 75 ? 'bg-emerald-500' : st.pct >= 30 ? 'bg-blue-600' : 'bg-slate-400 dark:bg-slate-600'
                    }`}
                    style={{ width: `${Math.max(3, st.pct)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 space-y-3">
            <h2 className="font-display text-base font-semibold">Subject Time Distribution</h2>
            {subjectHours.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <span className="font-medium">{s.name}</span>
                <span className="font-mono tabular-nums text-blue-600 dark:text-blue-400">
                  {s.minutes} min
                </span>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-semibold">Achievement Badges</h2>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            {achievements.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Complete your first NCERT topic or quiz to unlock achievement badges and earn XP.
              </p>
            ) : (
              <div className="space-y-2.5">
                {achievements.map((b) => (
                  <div key={b.id} className="rounded-lg bg-slate-100 dark:bg-slate-800/70 p-3">
                    <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                      {b.title}
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                      {b.description}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Attempt History Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 space-y-4">
        <h2 className="font-display text-lg font-semibold">Quiz & Mock Test History</h2>
        {attempts.length === 0 ? (
          <p className="text-xs text-slate-500">No completed tests recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <th className="py-2 pr-4 font-medium">Mode</th>
                  <th className="py-2 pr-4 font-medium">Date</th>
                  <th className="py-2 pr-4 font-medium text-right">Score</th>
                  <th className="py-2 pr-4 font-medium text-right">Accuracy</th>
                  <th className="py-2 font-medium text-right">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {attempts.map((a) => (
                  <tr key={a.id}>
                    <td className="py-2.5 pr-4 capitalize font-medium">{a.mode.replace('_', ' ')}</td>
                    <td className="py-2.5 pr-4 text-slate-500">
                      {new Date(a.completedAt).toLocaleDateString()}
                    </td>
                    <td className="py-2.5 pr-4 text-right font-mono tabular-nums">
                      {a.scoreMarks}/{a.maxMarks}
                    </td>
                    <td className="py-2.5 pr-4 text-right font-mono tabular-nums text-blue-600 dark:text-blue-400">
                      {a.accuracyPercent}%
                    </td>
                    <td className="py-2.5 text-right font-mono tabular-nums">
                      {Math.round(a.timeSpentSeconds / 60)}m {a.timeSpentSeconds % 60}s
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
