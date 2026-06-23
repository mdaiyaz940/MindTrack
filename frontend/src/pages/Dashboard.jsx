import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import {
  Brain, BookOpen, BarChart3, MessageCircle,
  Heart, TrendingUp, Calendar, Target, ArrowRight
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalMoodEntries: 0,
    totalJournalEntries: 0,
    avgMoodScore: 0,
    streakDays: 0
  });
  const [recentMoods, setRecentMoods] = useState([]);
  const [recentJournals, setRecentJournals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const moodRes       = await axios.get('/mood/analytics/data?timeRange=30');
      const moodData      = moodRes.data.data;
      const journalRes    = await axios.get('/journal/analytics/data?timeRange=30');
      const journalData   = journalRes.data.data;
      const recentMoodsRes    = await axios.get('/mood?timeRange=7');
      setRecentMoods(recentMoodsRes.data.data.slice(0, 5));
      const recentJournalsRes = await axios.get('/journal');
      setRecentJournals(recentJournalsRes.data.data.slice(0, 3));

      const today = new Date();
      let streakDays = 0;
      const allEntries = [...recentMoodsRes.data.data, ...recentJournalsRes.data.data]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const uniqueDays = [...new Set(allEntries.map(e => new Date(e.createdAt).toDateString()))];
      for (let i = 0; i < uniqueDays.length; i++) {
        const entryDate    = new Date(uniqueDays[i]);
        const expectedDate = new Date(today);
        expectedDate.setDate(today.getDate() - i);
        if (entryDate.toDateString() === expectedDate.toDateString()) streakDays++;
        else break;
      }

      setStats({
        totalMoodEntries:   moodData.totalEntries    || 0,
        totalJournalEntries: journalData.totalEntries || 0,
        avgMoodScore:        moodData.avgMoodScore    || 0,
        streakDays
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Track Mood',
      description: 'Log today\'s emotional state',
      icon: Heart,
      href: '/mood',
      accent: 'text-terracotta-500',
      accentBg: 'bg-terracotta-50 dark:bg-terracotta-500/10',
    },
    {
      title: 'Write Journal',
      description: 'Reflect and express freely',
      icon: BookOpen,
      href: '/journal',
      accent: 'text-sage-500',
      accentBg: 'bg-sage-50 dark:bg-sage-500/10',
    },
    {
      title: 'AI Assistant',
      description: 'Chat with your companion',
      icon: MessageCircle,
      href: '/ai-chat',
      accent: 'text-accent-500',
      accentBg: 'bg-accent-50 dark:bg-accent-500/10',
    },
    {
      title: 'View Analytics',
      description: 'Understand your patterns',
      icon: BarChart3,
      href: '/analytics',
      accent: 'text-slate-400',
      accentBg: 'bg-slate-100 dark:bg-slate-500/10',
    },
  ];

  const moodLabels = {
    happy:   'Happy',
    sad:     'Sad',
    angry:   'Angry',
    neutral: 'Neutral',
    anxious: 'Anxious',
    excited: 'Excited',
    tired:   'Tired',
    stressed:'Stressed',
  };

  const moodColors = {
    happy:   'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    sad:     'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    angry:   'bg-blush-100 text-blush-700 dark:bg-blush-900/30 dark:text-blush-400',
    neutral: 'bg-stone-100 text-stone-600 dark:bg-stone-700/40 dark:text-stone-400',
    anxious: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    excited: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    tired:   'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    stressed:'bg-blush-100 text-blush-700 dark:bg-blush-900/30 dark:text-blush-400',
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-9 h-9">
            <div className="absolute inset-0 rounded-full border-2 border-accent-100 dark:border-accent-900" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-500 animate-spin" />
          </div>
          <p className="text-sm text-[var(--text-muted)]">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ── Welcome ── */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm text-[var(--text-muted)] font-medium mb-1">
              {greeting()},
            </p>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] font-display tracking-tight">
              {user?.name}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Here&apos;s a gentle snapshot of your wellness today.
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-[var(--text-primary)]">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            {stats.streakDays > 0 && (
              <p className="text-xs text-terracotta-500 dark:text-terracotta-400 font-semibold mt-0.5">
                {stats.streakDays}-day streak
              </p>
            )}
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Mood Entries',   value: stats.totalMoodEntries,              icon: Heart,      color: 'text-terracotta-500', bg: 'bg-terracotta-50 dark:bg-terracotta-500/10' },
            { label: 'Journal Entries',value: stats.totalJournalEntries,           icon: BookOpen,   color: 'text-sage-500',       bg: 'bg-sage-50 dark:bg-sage-500/10'             },
            { label: 'Avg Mood',       value: `${stats.avgMoodScore.toFixed(1)}/10`,icon: TrendingUp, color: 'text-accent-500',     bg: 'bg-accent-50 dark:bg-accent-500/10'         },
            { label: 'Day Streak',     value: stats.streakDays,                   icon: Target,     color: 'text-amber-600',      bg: 'bg-amber-50 dark:bg-amber-500/10'           },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="card p-5 hover:shadow-card-md hover:-translate-y-px transition-all duration-200">
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`h-4.5 w-4.5 ${color}`} strokeWidth={1.75} />
              </div>
              <p className="text-2xs label">{label}</p>
              <p className="text-2xl font-bold text-[var(--text-primary)] font-display mt-0.5">{value}</p>
            </div>
          ))}
        </div>

        {/* ── Quick Actions ── */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map(({ title, description, icon: Icon, href, accent, accentBg }) => (
              <Link
                key={title}
                to={href}
                className="group card p-5 hover:shadow-card-md hover:-translate-y-px transition-all duration-200 flex flex-col gap-3"
              >
                <div className={`w-9 h-9 rounded-xl ${accentBg} flex items-center justify-center`}>
                  <Icon className={`h-4.5 w-4.5 ${accent}`} strokeWidth={1.75} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-accent-500 dark:group-hover:text-accent-400 transition-colors">
                    {title}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed">{description}</p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-[var(--text-muted)] group-hover:text-accent-500 dark:group-hover:text-accent-400 group-hover:translate-x-0.5 transition-all" strokeWidth={2} />
              </Link>
            ))}
          </div>
        </div>

        {/* ── Recent Activity ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Recent Moods */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Recent Moods</h3>
              <Link to="/mood" className="text-xs text-accent-500 dark:text-accent-400 hover:underline font-medium flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {recentMoods.length > 0 ? (
              <div className="space-y-2">
                {recentMoods.map((mood) => (
                  <div key={mood._id} className="flex items-center justify-between py-2.5 border-b border-[var(--border-soft)] last:border-0">
                    <div className="flex items-center gap-3">
                      <span className={`text-2xs font-semibold px-2.5 py-1 rounded-lg capitalize ${moodColors[mood.mood] || 'bg-stone-100 text-stone-600'}`}>
                        {moodLabels[mood.mood] || mood.mood}
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">Intensity {mood.intensity}/10</span>
                    </div>
                    <span className="text-2xs text-[var(--text-muted)] font-medium">
                      {new Date(mood.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center">
                <Heart className="h-8 w-8 text-[var(--border)] mx-auto mb-3" strokeWidth={1.5} />
                <p className="text-sm text-[var(--text-secondary)] mb-2">No mood entries yet</p>
                <Link to="/mood" className="text-xs text-accent-500 hover:underline font-medium">
                  Track your first mood
                </Link>
              </div>
            )}
          </div>

          {/* Recent Journals */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Recent Journal</h3>
              <Link to="/journal" className="text-xs text-accent-500 dark:text-accent-400 hover:underline font-medium flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {recentJournals.length > 0 ? (
              <div className="space-y-1">
                {recentJournals.map((journal) => (
                  <div key={journal._id} className="group py-3 border-b border-[var(--border-soft)] last:border-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h4 className="text-sm font-medium text-[var(--text-primary)] truncate leading-snug">
                        {journal.title}
                      </h4>
                      <span className="text-2xs text-[var(--text-muted)] bg-[var(--bg-raised)] px-2 py-0.5 rounded-md flex-shrink-0 font-medium">
                        {journal.wordCount}w
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-1 leading-relaxed mb-1.5">
                      {journal.content}
                    </p>
                    <span className="text-2xs text-[var(--text-muted)] font-medium">
                      {new Date(journal.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center">
                <BookOpen className="h-8 w-8 text-[var(--border)] mx-auto mb-3" strokeWidth={1.5} />
                <p className="text-sm text-[var(--text-secondary)] mb-2">No journal entries yet</p>
                <Link to="/journal" className="text-xs text-accent-500 hover:underline font-medium">
                  Write your first entry
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;