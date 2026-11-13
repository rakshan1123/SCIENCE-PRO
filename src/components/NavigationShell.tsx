import React, { useState } from 'react';
import {
  Award,
  BarChart3,
  BookOpen,
  Bot,
  CheckCircle2,
  FlaskConical,
  Home,
  Layers,
  LogIn,
  Menu,
  Moon,
  ShieldCheck,
  Sun,
  Target,
  User,
  X,
} from 'lucide-react';
import { useAppContext } from '../context/AuthContext';
import { NavSection } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface NavigationShellProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  children: React.ReactNode;
}

const ALL_NAV_ITEMS: Array<{
  id: NavSection;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'home', label: 'Home', shortLabel: 'Home', icon: Home },
  { id: 'learn', label: 'Learn', shortLabel: 'Learn', icon: BookOpen },
  { id: 'tutor', label: 'AI Tutor', shortLabel: 'Tutor', icon: Bot },
  { id: 'lab', label: 'Science Lab', shortLabel: 'Lab', icon: FlaskConical },
  { id: 'practice', label: 'Practice', shortLabel: 'Practice', icon: CheckCircle2 },
  { id: 'board', label: 'Board Preparation', shortLabel: 'Board Prep', icon: Target },
  { id: 'revision', label: 'Revision', shortLabel: 'Revision', icon: Layers },
  { id: 'progress', label: 'My Progress', shortLabel: 'Progress', icon: BarChart3 },
  { id: 'profile', label: 'Profile', shortLabel: 'Profile', icon: User },
];

const MOBILE_CORE_IDS: NavSection[] = ['home', 'learn', 'tutor', 'lab', 'practice'];

export const NavigationShell: React.FC<NavigationShellProps> = ({
  activeSection,
  onNavigate,
  children,
}) => {
  const { user, firebaseUser, signInWithGoogle, theme, toggleTheme } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems =
    user?.role === 'admin'
      ? [
          ...ALL_NAV_ITEMS,
          { id: 'admin' as NavSection, label: 'Admin Console', shortLabel: 'Admin', icon: ShieldCheck },
        ]
      : ALL_NAV_ITEMS;

  const handleNav = (id: NavSection) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-[#0B1120] dark:text-slate-100">
      {/* Clean 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 h-14 border-b border-slate-200 dark:border-slate-800/90 bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between gap-8 px-4 sm:px-6">
          {/* Zone 1: Single text wordmark */}
          <button
            type="button"
            onClick={() => handleNav('home')}
            className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Science Pro
          </button>

          {/* Zone 2: Concise single-line desktop links */}
          <nav
            aria-label="Primary sections"
            className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300"
          >
            {[
              { id: 'learn' as NavSection, label: 'Learn' },
              { id: 'lab' as NavSection, label: 'Science Lab' },
              { id: 'tutor' as NavSection, label: 'AI Tutor' },
              { id: 'practice' as NavSection, label: 'Practice' },
              { id: 'board' as NavSection, label: 'Board Prep' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeSection === item.id
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            {firebaseUser ? (
              <button
                type="button"
                onClick={() => handleNav('profile')}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {user?.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt={user.displayName}
                    referrerPolicy="no-referrer"
                    className="h-5 w-5 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-3.5 h-3.5 text-blue-500" />
                )}
                <span className="max-w-[120px] truncate">{user?.displayName || 'Profile'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={signInWithGoogle}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace Layout: Desktop Sidebar + Content Viewport */}
      <div className="mx-auto flex w-full max-w-[1440px] flex-1">
        <aside
          aria-label="Workspace navigation"
          className="hidden md:flex w-60 shrink-0 flex-col justify-between border-r border-slate-200 dark:border-slate-800/90 bg-white dark:bg-[#0F172A]/60 p-4"
        >
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Appearance
              </span>
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Toggle light or dark theme"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-blue-600" />
                    <span>Dark</span>
                  </>
                )}
              </button>
            </div>
            <div className="px-2">
              <PWAInstallButton />
            </div>
            <div className="px-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              CBSE Class 10 Science · 2026–27
            </div>
          </div>
        </aside>

        {/* Scrollable Content Viewport */}
        <main className="flex-1 min-w-0 px-4 py-6 pb-24 sm:px-6 lg:px-8 md:pb-10">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation (< 15% sticky height cap) */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-30 h-14 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-sm grid grid-cols-6"
      >
        {ALL_NAV_ITEMS.filter((item) => MOBILE_CORE_IDS.includes(item.id)).map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="truncate max-w-full px-1">{item.shortLabel}</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
            !MOBILE_CORE_IDS.includes(activeSection)
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Menu className="w-4 h-4" />
          <span>More</span>
        </button>
      </nav>

      {/* Mobile Full Accessible Drawer for remaining sections */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/60">
          <div className="rounded-t-2xl border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-display text-base font-semibold">Workspace Menu</span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                aria-label="Close navigation drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {navItems
                .filter((i) => !MOBILE_CORE_IDS.includes(i.id))
                .map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNav(item.id)}
                      className={`flex items-center gap-2.5 rounded-lg border px-3 py-3 text-sm font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'border-blue-500 bg-blue-600/10 text-blue-600 dark:text-blue-400'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4">
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-medium"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span>Switch to Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-blue-600" />
                    <span>Switch to Dark Navy</span>
                  </>
                )}
              </button>
              <PWAInstallButton compact />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
