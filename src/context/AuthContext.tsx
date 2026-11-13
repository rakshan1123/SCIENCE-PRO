import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut, User } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase';
import {
  AchievementItem,
  AnnouncementItem,
  BookmarkItem,
  ChapterItem,
  MistakeItem,
  MockTestItem,
  ProgressItem,
  QuestionItem,
  QuizAttemptItem,
  RevisionNoteItem,
  StudentProfile,
  SubjectItem,
  UserAccount,
} from '../types';

interface AuthContextValue {
  firebaseUser: User | null;
  authLoading: boolean;
  user: UserAccount | null;
  profile: StudentProfile | null;
  subjects: SubjectItem[];
  chapters: ChapterItem[];
  questions: QuestionItem[];
  mockTests: MockTestItem[];
  announcements: AnnouncementItem[];
  progress: ProgressItem[];
  attempts: QuizAttemptItem[];
  bookmarks: BookmarkItem[];
  mistakes: MistakeItem[];
  notes: RevisionNoteItem[];
  achievements: AchievementItem[];
  curriculumLoading: boolean;
  curriculumError: string | null;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  apiFetch: (url: string, options?: RequestInit) => Promise<Response>;
  refreshUserState: () => Promise<void>;
  refreshCurriculum: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<UserAccount | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [chapters, setChapters] = useState<ChapterItem[]>([]);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [mockTests, setMockTests] = useState<MockTestItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [attempts, setAttempts] = useState<QuizAttemptItem[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [mistakes, setMistakes] = useState<MistakeItem[]>([]);
  const [notes, setNotes] = useState<RevisionNoteItem[]>([]);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [curriculumLoading, setCurriculumLoading] = useState(true);
  const [curriculumError, setCurriculumError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('sciencepro_theme');
      return saved === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('sciencepro_theme', theme);
    } catch {
      // ignore storage errors
    }
  }, [theme]);

  const apiFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const headers = new Headers(options.headers || {});
      if (!headers.has('Content-Type') && options.body) {
        headers.set('Content-Type', 'application/json');
      }
      const current = auth.currentUser;
      if (current) {
        const token = await current.getIdToken();
        headers.set('Authorization', `Bearer ${token}`);
      }
      return fetch(url, { ...options, headers });
    },
    []
  );

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      if (auth.currentUser) {
        apiFetch('/api/profile', {
          method: 'PATCH',
          body: JSON.stringify({ preferredTheme: next }),
        }).catch(() => {});
      }
      return next;
    });
  }, [apiFetch]);

  const refreshCurriculum = useCallback(async () => {
    setCurriculumLoading(true);
    setCurriculumError(null);
    try {
      const [currRes, qRes, mRes] = await Promise.all([
        fetch('/api/curriculum'),
        fetch('/api/questions'),
        fetch('/api/mocks'),
      ]);
      if (!currRes.ok) throw new Error('Could not load NCERT curriculum.');
      const currData = await currRes.json();
      setSubjects(currData.subjects || []);
      setChapters(currData.chapters || []);
      setAnnouncements(currData.announcements || []);

      if (qRes.ok) {
        const qData = await qRes.json();
        setQuestions(qData.questions || []);
      }
      if (mRes.ok) {
        const mData = await mRes.json();
        setMockTests(mData.mockTests || []);
      }
    } catch (err: any) {
      setCurriculumError(err?.message || 'Unable to reach curriculum server.');
    } finally {
      setCurriculumLoading(false);
    }
  }, []);

  const refreshUserState = useCallback(async () => {
    if (!auth.currentUser) {
      setUser(null);
      setProfile(null);
      setProgress([]);
      setAttempts([]);
      setBookmarks([]);
      setMistakes([]);
      setNotes([]);
      setAchievements([]);
      return;
    }

    try {
      const res = await apiFetch('/api/me');
      if (!res.ok) return;
      const data = await res.json();
      setUser(data.user || null);
      setProfile(data.profile || null);
      setProgress(data.progress || []);
      setAttempts(data.attempts || []);
      setBookmarks(data.bookmarks || []);
      setMistakes(data.mistakes || []);
      setNotes(data.notes || []);
      setAchievements(data.achievements || []);
      if (data.profile?.preferredTheme === 'light' || data.profile?.preferredTheme === 'dark') {
        setTheme(data.profile.preferredTheme);
      }
    } catch (err) {
      console.error('Failed to sync student state:', err);
    }
  }, [apiFetch]);

  useEffect(() => {
    refreshCurriculum();
  }, [refreshCurriculum]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        await refreshUserState();
      } else {
        setUser(null);
        setProfile(null);
        setProgress([]);
        setAttempts([]);
        setBookmarks([]);
        setMistakes([]);
        setNotes([]);
        setAchievements([]);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [refreshUserState]);

  const signInWithGoogle = useCallback(async () => {
    await signInWithPopup(auth, googleAuthProvider);
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        authLoading,
        user,
        profile,
        subjects,
        chapters,
        questions,
        mockTests,
        announcements,
        progress,
        attempts,
        bookmarks,
        mistakes,
        notes,
        achievements,
        curriculumLoading,
        curriculumError,
        theme,
        toggleTheme,
        signInWithGoogle,
        signOut,
        apiFetch,
        refreshUserState,
        refreshCurriculum,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAppContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAppContext must be used inside AuthProvider');
  return ctx;
}
