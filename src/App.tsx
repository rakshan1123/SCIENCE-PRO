import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { NavigationShell } from './components/NavigationShell';
import { OfflineIndicator } from './components/OfflineIndicator';
import { HomeDashboard } from './components/HomeDashboard';
import { LearnCenter } from './components/LearnCenter';
import { AITutor } from './components/AITutor';
import { ScienceLab } from './components/ScienceLab';
import { PracticeCenter } from './components/PracticeCenter';
import { BoardPrepCenter } from './components/BoardPrepCenter';
import { RevisionCenter } from './components/RevisionCenter';
import { ProgressAnalytics } from './components/ProgressAnalytics';
import { ProfileView } from './components/ProfileView';
import { AdminDashboard } from './components/AdminDashboard';
import { ChapterItem, NavSection } from './types';

function MainWorkspace() {
  const [activeSection, setActiveSection] = useState<NavSection>('home');
  const [selectedChapterSlug, setSelectedChapterSlug] = useState<string | null>(null);
  const [tutorChapterId, setTutorChapterId] = useState<number | null>(null);
  const [practiceChapterId, setPracticeChapterId] = useState<number | null>(null);

  const handleOpenChapter = (slug: string) => {
    setSelectedChapterSlug(slug);
    setActiveSection('learn');
  };

  const handleAskTutor = (chapter: ChapterItem) => {
    setTutorChapterId(chapter.id);
    setActiveSection('tutor');
  };

  const handlePracticeChapter = (chapterId: number) => {
    setPracticeChapterId(chapterId);
    setActiveSection('practice');
  };

  return (
    <NavigationShell activeSection={activeSection} onNavigate={setActiveSection}>
      {activeSection === 'home' && (
        <HomeDashboard onNavigate={setActiveSection} onOpenChapter={handleOpenChapter} />
      )}
      {activeSection === 'learn' && (
        <LearnCenter
          selectedChapterSlug={selectedChapterSlug}
          onSelectChapter={setSelectedChapterSlug}
          onAskTutor={handleAskTutor}
          onPracticeChapter={handlePracticeChapter}
        />
      )}
      {activeSection === 'tutor' && <AITutor initialChapterId={tutorChapterId} />}
      {activeSection === 'lab' && <ScienceLab />}
      {activeSection === 'practice' && (
        <PracticeCenter initialChapterId={practiceChapterId} />
      )}
      {activeSection === 'board' && (
        <BoardPrepCenter onOpenChapter={handleOpenChapter} />
      )}
      {activeSection === 'revision' && (
        <RevisionCenter onOpenChapter={handleOpenChapter} />
      )}
      {activeSection === 'progress' && (
        <ProgressAnalytics onOpenChapter={handleOpenChapter} />
      )}
      {activeSection === 'profile' && <ProfileView />}
      {activeSection === 'admin' && <AdminDashboard />}
      <OfflineIndicator />
    </NavigationShell>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainWorkspace />
    </AuthProvider>
  );
}
