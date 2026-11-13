import React, { useState } from 'react';
import { LogIn, LogOut, Moon, Shield, Sun, User } from 'lucide-react';
import { useAppContext } from '../context/AuthContext';
import { PWAInstallButton } from './PWAInstallButton';

export const ProfileView: React.FC = () => {
  const {
    user,
    profile,
    firebaseUser,
    signInWithGoogle,
    signOut,
    theme,
    toggleTheme,
    apiFetch,
    refreshUserState,
  } = useAppContext();

  const [goalMinutes, setGoalMinutes] = useState<number>(profile?.dailyGoalMinutes || 45);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser) return;
    const res = await apiFetch('/api/profile', {
      method: 'PATCH',
      body: JSON.stringify({ dailyGoalMinutes: goalMinutes }),
    });
    if (res.ok) {
      await refreshUserState();
      setSavedNotice('Daily study goal updated.');
      setTimeout(() => setSavedNotice(null), 2500);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
          Account · Study Preferences · Child-Safe Privacy
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
          Student Profile & Settings
        </h1>
      </div>

      {/* Account Card */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 space-y-5">
        {firebaseUser ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {user?.photoUrl ? (
                <img
                  src={user.photoUrl}
                  alt={user.displayName}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-blue-600/15 text-blue-500 flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
              )}
              <div>
                <div className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                  {user?.displayName || firebaseUser.displayName}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {user?.email || firebaseUser.email} · {profile?.board || 'CBSE Class 10'} ({profile?.academicYear || '2026-27'})
                </div>
                <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-0.5 capitalize">
                  Account Role: {user?.role || 'student'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 self-start sm:self-center cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="font-display text-lg font-semibold">Sign in to Synchronise Progress</h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl">
              Use Google Sign-In to save your 13-chapter completion status, quiz scores, Mistake Notebook, revision notes, streaks, and AI tutor chats securely to Cloud SQL.
            </p>
            <button
              type="button"
              onClick={signInWithGoogle}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with Google</span>
            </button>
          </div>
        )}
      </div>

      {/* Preferences & Study Goal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form
          onSubmit={handleSaveGoal}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 space-y-4"
        >
          <h2 className="font-display text-base font-semibold">Daily Study Goal</h2>
          <label className="block space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-300">Target Minutes / Day</span>
              <span className="font-mono font-semibold tabular-nums text-blue-600 dark:text-blue-400">
                {goalMinutes} min
              </span>
            </div>
            <input
              type="range"
              min={15}
              max={180}
              step={15}
              value={goalMinutes}
              onChange={(e) => setGoalMinutes(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </label>
          <button
            type="submit"
            disabled={!firebaseUser}
            className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-40 hover:bg-blue-500 cursor-pointer"
          >
            Save Daily Goal
          </button>
          {savedNotice && <div className="text-xs text-emerald-500">{savedNotice}</div>}
        </form>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 space-y-4">
          <h2 className="font-display text-base font-semibold">Appearance & App Installation</h2>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-300">Theme Mode</span>
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-1.5 font-medium cursor-pointer"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Switch to Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-blue-600" />
                  <span>Switch to Dark Navy</span>
                </>
              )}
            </button>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 dark:border-slate-800">
            <span className="text-slate-600 dark:text-slate-300">Installable Web App (PWA)</span>
            <PWAInstallButton />
          </div>
        </div>
      </div>

      {/* Student Data Protection Notice */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
        <Shield className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-slate-900 dark:text-white">
            Student Privacy & Minimal Data Policy
          </div>
          <p>
            Science Pro collects only essential Google Sign-In identifiers (name, email, avatar) and academic learning records. No phone numbers, home addresses, or sensitive personal data are requested from school-age learners.
          </p>
        </div>
      </div>
    </div>
  );
};
