// src/pages/Landing.jsx
import { Link } from 'react-router-dom';
import { Brain, Heart, BookOpen, BarChart3, Shield, Users, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';

const features = [
  {
    icon: Heart,
    title: 'Mood Tracking',
    description: 'Log your emotional state daily and visualise patterns over time.',
    color: 'text-terracotta-500',
    bg: 'bg-terracotta-50 dark:bg-terracotta-500/10',
  },
  {
    icon: BookOpen,
    title: 'Digital Journal',
    description: 'Express your thoughts privately in a distraction-free writing space.',
    color: 'text-sage-500',
    bg: 'bg-sage-50 dark:bg-sage-500/10',
  },
  {
    icon: Brain,
    title: 'AI Assistant',
    description: 'A supportive companion available anytime for guidance and reflection.',
    color: 'text-accent-500',
    bg: 'bg-accent-50 dark:bg-accent-500/10',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Uncover meaningful patterns in your mood and journal data.',
    color: 'text-slate-400',
    bg: 'bg-slate-100 dark:bg-slate-500/10',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)]">

      {/* ── Minimal Top Bar ── */}
      <nav className="border-b border-[var(--border)] bg-[var(--bg-surface)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs font-display">M</span>
            </div>
            <span className="text-sm font-semibold text-[var(--text-primary)]">MindTrack</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login"    className="btn-ghost py-2 px-4 text-xs">Sign in</Link>
            <Link to="/register" className="btn-primary py-2 px-4 text-xs">Get started</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-accent-50 dark:bg-accent-900/20 border border-accent-100 dark:border-accent-800 text-accent-600 dark:text-accent-400 px-3 py-1.5 rounded-full text-xs font-medium mb-7">
          <CheckCircle className="h-3.5 w-3.5" strokeWidth={2} />
          Trusted by 10,000+ people worldwide
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] font-display tracking-tight leading-tight mb-4">
          Your mental health journey,<br />
          <span className="text-accent-500">guided with care.</span>
        </h1>

        <p className="text-base text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed mb-9">
          Track your mood, write freely, and receive gentle AI-powered insights —
          all in one calm, private space built for your wellbeing.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
          <Link
            to="/register"
            className="btn-primary px-7 py-3 text-sm group"
          >
            Start for free
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
          </Link>
          <Link
            to="/login"
            className="btn-ghost px-7 py-3 text-sm"
          >
            Sign in to your account
          </Link>
        </div>

        {/* Trust row */}
        <div className="flex flex-wrap justify-center gap-6 text-xs text-[var(--text-muted)] font-medium">
          {[
            { icon: Shield,   text: '100% private & secure'   },
            { icon: Users,    text: '10,000+ active users'    },
            { icon: Sparkles, text: 'AI-powered insights'     },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-1.5">
              <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
              {text}
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-[var(--bg-surface)] border-y border-[var(--border)] py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="label mb-2">What's inside</p>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] font-display tracking-tight">
              Everything you need, nothing you don't.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map(({ icon: Icon, title, description, color, bg }) => (
              <div key={title} className="p-5 rounded-2xl border border-[var(--border)] hover:border-[var(--border-soft)] hover:shadow-card transition-all duration-200 bg-[var(--bg-base)]">
                <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`h-5 w-5 ${color}`} strokeWidth={1.75} />
                </div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1.5">{title}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="label mb-3">Begin your journey</p>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] font-display tracking-tight mb-3">
          Ready to take care of your mind?
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mb-8 max-w-md mx-auto leading-relaxed">
          Join thousands of people building healthier mental habits every day.
        </p>
        <Link to="/register" className="btn-primary px-8 py-3 text-sm">
          Create a free account
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--border)] py-6">
        <p className="text-center text-2xs text-[var(--text-muted)]">
          © {new Date().getFullYear()} MindTrack · Built for your wellbeing
        </p>
      </footer>
    </div>
  );
}
