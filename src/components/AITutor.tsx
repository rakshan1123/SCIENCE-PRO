import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, Bot, Plus, Send, User } from 'lucide-react';
import { useAppContext } from '../context/AuthContext';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  outOfSyllabus?: boolean;
}

interface AITutorProps {
  initialChapterId?: number | null;
}

const DEFAULT_SUGGESTIONS = [
  'Explain Ohm’s Law with an everyday circuit example and V-I graph.',
  'How do I balance Fe + H₂O → Fe₃O₄ + H₂ step by step?',
  'Why does a concave mirror form a virtual image only between P and F?',
  'Explain double circulation in the human heart in simple steps.',
  'Solve: An object is 20 cm from a convex lens of focal length 10 cm.',
];

export const AITutor: React.FC<AITutorProps> = ({ initialChapterId = null }) => {
  const { chapters, firebaseUser, apiFetch } = useAppContext();
  const [selectedChapterId, setSelectedChapterId] = useState<number | ''>(
    initialChapterId || ''
  );
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Hello! I am your Science Pro Class 10 NCERT Tutor. Pick any chapter above or ask a question below—I will explain concepts step-by-step, solve numericals with proper sign conventions, and check balanced chemical equations.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [savedConvos, setSavedConvos] = useState<
    Array<{ id: number; title: string; chapterId: number | null; messages: ChatMessage[] }>
  >([]);

  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (initialChapterId) {
      setSelectedChapterId(initialChapterId);
    }
  }, [initialChapterId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (!firebaseUser) return;
    apiFetch('/api/tutor/conversations')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.conversations) {
          setSavedConvos(data.conversations);
        }
      })
      .catch(() => {});
  }, [firebaseUser, apiFetch]);

  const activeChapter = useMemo(
    () => chapters.find((c) => c.id === Number(selectedChapterId)) || null,
    [chapters, selectedChapterId]
  );

  const chapterSuggestions = useMemo(() => {
    if (!activeChapter) return DEFAULT_SUGGESTIONS;
    return [
      `Give me a simple 5-point summary of ${activeChapter.title}.`,
      `What are the most common board exam mistakes in ${activeChapter.title}?`,
      `Give me 2 practice questions with step-by-step solutions from ${activeChapter.title}.`,
      `Explain a real-life example from ${activeChapter.title}.`,
    ];
  }, [activeChapter]);

  const sendQuestion = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    setError(null);
    const nextHistory = [...messages, { role: 'user' as const, content: trimmed }];
    setMessages(nextHistory);
    setInput('');
    setLoading(true);

    try {
      const res = await apiFetch('/api/tutor/ask', {
        method: 'POST',
        body: JSON.stringify({
          message: trimmed,
          chapterId: activeChapter?.id || null,
          chapterTitle: activeChapter?.title || null,
          conversationId,
          history: messages.slice(-8),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Tutor request failed.');
      }

      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply,
          outOfSyllabus: Boolean(data.outOfSyllabus),
        },
      ]);
    } catch (err: any) {
      setError(err?.message || 'Unable to contact AI Tutor right now.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setConversationId(null);
    setError(null);
    setMessages([
      {
        role: 'assistant',
        content: activeChapter
          ? `Started a new study session for Chapter ${activeChapter.chapterNumber}: ${activeChapter.title}. What concept or numerical would you like to work through?`
          : 'Started a fresh Class 10 Science tutoring session. Ask any Physics, Chemistry, or Biology question.',
      },
    ]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Context & Saved History */}
      <div className="lg:col-span-4 space-y-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-xl font-bold text-slate-900 dark:text-white">
              AI Science Tutor
            </h1>
            <button
              type="button"
              onClick={handleNewChat}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Chat</span>
            </button>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="tutor-chapter-select" className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Focus Chapter Context
            </label>
            <select
              id="tutor-chapter-select"
              value={selectedChapterId}
              onChange={(e) => setSelectedChapterId(e.target.value ? Number(e.target.value) : '')}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-slate-100"
            >
              <option value="">All CBSE Class 10 Chapters</option>
              {chapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  Ch {ch.chapterNumber}: {ch.title}
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Grounded in the CBSE Class 10 NCERT 2026–27 curriculum. Out-of-syllabus queries are explicitly flagged.
          </div>
        </div>

        {firebaseUser && savedConvos.length > 0 && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 space-y-3">
            <h2 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              Recent Tutor Sessions
            </h2>
            <div className="space-y-1.5">
              {savedConvos.slice(0, 6).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setConversationId(c.id);
                    setSelectedChapterId(c.chapterId || '');
                    setMessages(
                      c.messages.length > 0
                        ? c.messages
                        : [{ role: 'assistant', content: 'Loaded conversation.' }]
                    );
                  }}
                  className={`w-full rounded-lg px-3 py-2 text-left text-xs truncate transition-colors cursor-pointer ${
                    conversationId === c.id
                      ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400 font-medium'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {c.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Chat Workspace */}
      <div className="lg:col-span-8 flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 overflow-hidden min-h-[540px]">
        <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[520px]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-violet-600/15 text-violet-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/80'
                }`}
              >
                {msg.outOfSyllabus && (
                  <div className="mb-2 inline-flex items-center gap-1.5 rounded bg-amber-500/20 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                    <AlertCircle className="w-3 h-3" />
                    <span>Contains context outside CBSE Class 10 2026–27 Syllabus</span>
                  </div>
                )}
                <div className="space-y-1.5">
                  {msg.content.split('\n').map((line, lineIdx) => {
                    const trimmedLine = line.trim();
                    if (!trimmedLine) return <div key={lineIdx} className="h-1" />;
                    const headingMatch = trimmedLine.match(/^#{1,4}\s+(.*)$/);
                    const renderInline = (text: string) =>
                      text.split(/(\*\*[^*]+\*\*)/g).map((part, pIdx) =>
                        part.startsWith('**') && part.endsWith('**') ? (
                          <strong key={pIdx} className="font-semibold">
                            {part.slice(2, -2)}
                          </strong>
                        ) : (
                          <React.Fragment key={pIdx}>{part}</React.Fragment>
                        )
                      );
                    if (headingMatch) {
                      return (
                        <div key={lineIdx} className="font-display font-semibold text-sm pt-1">
                          {renderInline(headingMatch[1])}
                        </div>
                      );
                    }
                    return <div key={lineIdx}>{renderInline(line)}</div>;
                  })}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-blue-600/15 text-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Bot className="w-4 h-4 text-violet-500 animate-pulse" />
              <span>Preparing step-by-step NCERT explanation...</span>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {error && (
          <div className="mx-5 mb-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-600 dark:text-rose-300">
            {error}
          </div>
        )}

        {/* Input & Suggested Questions Below Chat */}
        <div className="border-t border-slate-200 dark:border-slate-800 p-4 space-y-3 bg-slate-50/70 dark:bg-slate-950/40">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendQuestion(input);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a Physics numerical, Chemistry equation, or Biology concept..."
              className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </button>
          </form>

          <div className="space-y-1.5">
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Suggested Questions
            </div>
            <div className="flex flex-wrap gap-1.5">
              {chapterSuggestions.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendQuestion(prompt)}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-left text-[11px] text-slate-700 dark:text-slate-300 hover:border-blue-500/60 transition-colors cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
