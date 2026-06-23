import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Send, Bot, User, Trash2, Plus, Heart, Lightbulb, MessageSquare } from 'lucide-react';

const AIChat = () => {
  const { user } = useAuth();
  const [sessions, setSessions]               = useState([]);
  const [currentSession, setCurrentSession]   = useState(null);
  const [messages, setMessages]               = useState([]);
  const [inputMessage, setInputMessage]       = useState('');
  const [isLoading, setIsLoading]             = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages]);
  useEffect(() => { fetchSessions(); }, []);

  const fetchSessions = async () => {
    try {
      setLoadingSessions(true);
      const res = await axios.get('/ai/sessions');
      setSessions(res.data.data || []);
      if (res.data.data?.length > 0) loadSession(res.data.data[0]._id);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Failed to load chat sessions');
    } finally {
      setLoadingSessions(false);
    }
  };

  const loadSession = async (sessionId) => {
    try {
      const res = await axios.get(`/ai/sessions/${sessionId}`);
      const session = res.data.data;
      setCurrentSession(session);
      setMessages(session.messages || []);
    } catch (error) {
      console.error('Error loading session:', error);
      toast.error('Failed to load session');
    }
  };

  const createNewSession = () => {
    setCurrentSession(null);
    setMessages([]);
    setInputMessage('');
  };

  const deleteSession = async (sessionId) => {
    if (!confirm('Delete this chat session?')) return;
    try {
      await axios.delete(`/ai/sessions/${sessionId}`);
      toast.success('Session deleted');
      setSessions(prev => prev.filter(s => s._id !== sessionId));
      if (currentSession?._id === sessionId) createNewSession();
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Failed to delete session');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;
    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: new Date() }]);
    try {
      const res = await axios.post('/ai/chat', { message: userMessage, sessionId: currentSession?._id });
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res.data.data.message,
        timestamp: new Date(res.data.data.timestamp),
      }]);
      if (!currentSession) {
        setCurrentSession({ _id: res.data.data.sessionId });
        fetchSessions();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to get response');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (ts) =>
    new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="h-screen bg-[var(--bg-base)] flex overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className="w-64 bg-[var(--bg-surface)] border-r border-[var(--border)] flex flex-col flex-shrink-0">
        <div className="p-3 border-b border-[var(--border-soft)]">
          <button
            onClick={createNewSession}
            className="btn-primary w-full justify-center py-2.5 text-xs"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            New Conversation
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2 px-2">
          {loadingSessions ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <div className="relative w-6 h-6">
                <div className="absolute inset-0 rounded-full border-2 border-accent-100 dark:border-accent-900" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-500 animate-spin" />
              </div>
              <p className="text-2xs text-[var(--text-muted)]">Loading…</p>
            </div>
          ) : sessions.length > 0 ? (
            <div className="space-y-0.5">
              {sessions.map(session => (
                <div
                  key={session._id}
                  onClick={() => loadSession(session._id)}
                  className={`group flex items-start gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    currentSession?._id === session._id
                      ? 'bg-accent-500/10 text-accent-600 dark:text-accent-400'
                      : 'hover:bg-[var(--bg-raised)] text-[var(--text-secondary)]'
                  }`}
                >
                  <MessageSquare className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 opacity-60" strokeWidth={1.75} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{session.title}</p>
                    <p className="text-2xs text-[var(--text-muted)] mt-0.5">
                      {session.messageCount} msgs · {new Date(session.lastActivity).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); deleteSession(session._id); }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-[var(--text-muted)] hover:text-blush-500 hover:bg-blush-50 dark:hover:bg-blush-900/20 transition-all flex-shrink-0"
                  >
                    <Trash2 className="h-3 w-3" strokeWidth={2} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-3 py-6 text-center">
              <div className="w-10 h-10 bg-accent-50 dark:bg-accent-900/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="h-5 w-5 text-accent-500" strokeWidth={1.75} />
              </div>
              <p className="text-xs font-medium text-[var(--text-secondary)] mb-1">No conversations yet</p>
              <p className="text-2xs text-[var(--text-muted)] mb-4">Start chatting to begin</p>
              <div className="space-y-1.5 text-left">
                {[
                  { icon: Heart,      label: 'Emotional support'   },
                  { icon: Lightbulb,  label: 'Coping strategies'   },
                  { icon: Bot,        label: 'Available 24/7'      },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-2xs text-[var(--text-muted)]">
                    <Icon className="h-3 w-3 flex-shrink-0" strokeWidth={1.75} />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main Area ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="flex-shrink-0 bg-[var(--bg-surface)] border-b border-[var(--border)] px-5 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-accent-500/15 dark:bg-accent-500/20 flex items-center justify-center">
                <Bot className="h-4.5 w-4.5 text-accent-500 dark:text-accent-400" strokeWidth={1.75} />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-[var(--text-primary)] leading-none">AI Wellness Companion</h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-sage-500 rounded-full" />
                  <p className="text-2xs text-[var(--text-muted)]">Online · Ready to help</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-full py-8 text-center">
              <div className="w-12 h-12 bg-accent-500/10 rounded-2xl flex items-center justify-center mb-4">
                <Bot className="h-6 w-6 text-accent-500" strokeWidth={1.75} />
              </div>
              <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">
                Hi {user?.name}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] max-w-sm mb-8">
                I'm here to listen and support your mental wellness journey. What's on your mind?
              </p>
              <div className="w-full max-w-xl">
                <p className="text-2xs text-[var(--text-muted)] uppercase tracking-widest font-semibold mb-3">
                  Start with a topic
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-5">
                  {[
                    { text: "I'm feeling anxious",           message: "I'm feeling anxious today. Can you help me cope?" },
                    { text: "I need stress relief",          message: "I'm dealing with a lot of stress. Any suggestions?" },
                    { text: "Trouble sleeping",              message: "I've been having trouble sleeping. Any advice?" },
                    { text: "Lift my mood",                  message: "How can I boost my mood today?" },
                    { text: "I need motivation",             message: "I'm feeling unmotivated. How can I regain energy?" },
                    { text: "Guide me through mindfulness",  message: "Can you guide me through a mindfulness exercise?" },
                  ].map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => setInputMessage(opt.message)}
                      className="p-3 text-left bg-[var(--bg-surface)] rounded-xl border border-[var(--border)] hover:border-accent-300 dark:hover:border-accent-700 hover:shadow-card text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-150"
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
                <p className="text-2xs text-[var(--text-muted)] italic">
                  The more specific you are, the better I can support you.
                </p>
              </div>
            </div>
          ) : (
            messages.map((message, i) => (
              <div key={i} className={`flex gap-2.5 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-accent-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="h-3.5 w-3.5 text-accent-500" strokeWidth={2} />
                  </div>
                )}
                <div className={`max-w-xs lg:max-w-lg xl:max-w-2xl px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  message.role === 'user'
                    ? 'bg-accent-500 text-white rounded-br-sm'
                    : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border)] shadow-card rounded-bl-sm'
                }`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-2xs mt-1.5 ${message.role === 'user' ? 'text-accent-200' : 'text-[var(--text-muted)]'}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
                {message.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-[var(--bg-raised)] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="h-3.5 w-3.5 text-[var(--text-secondary)]" strokeWidth={2} />
                  </div>
                )}
              </div>
            ))
          )}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex gap-2.5 justify-start">
              <div className="w-7 h-7 rounded-lg bg-accent-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="h-3.5 w-3.5 text-accent-500" strokeWidth={2} />
              </div>
              <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl rounded-bl-sm px-4 py-3 shadow-card">
                <div className="flex items-center gap-1.5">
                  {[0, 0.15, 0.3].map((delay, i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 bg-accent-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${delay}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 bg-[var(--bg-surface)] border-t border-[var(--border)] p-4">
          {messages.length > 0 && !isLoading && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {['Tell me more', "That's helpful!", 'Give me an example', 'What else can I try?'].map(s => (
                <button
                  key={s}
                  onClick={() => setInputMessage(s)}
                  className="px-3 py-1 text-2xs bg-[var(--bg-raised)] text-[var(--text-secondary)] hover:bg-[var(--bg-inset)] hover:text-[var(--text-primary)] rounded-full border border-[var(--border)] transition-colors font-medium"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              placeholder="Share what's on your mind…"
              className="input flex-1"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="btn-primary px-4 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send className="h-4 w-4" strokeWidth={2} />
            </button>
          </form>
          <p className="mt-2 text-2xs text-center text-[var(--text-muted)]">
            Here to support you · Not a substitute for professional care
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIChat;