import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, X, Sun, Moon, LogOut, User,
  LayoutDashboard, Heart, BookOpen, MessageSquare,
  BarChart2, Library, ChevronDown
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const navItems = [
  { name: 'Dashboard',  href: '/dashboard', icon: LayoutDashboard },
  { name: 'Mood',       href: '/mood',       icon: Heart          },
  { name: 'Journal',    href: '/journal',    icon: BookOpen       },
  { name: 'AI Chat',    href: '/ai-chat',    icon: MessageSquare  },
  { name: 'Analytics',  href: '/analytics',  icon: BarChart2      },
  { name: 'Resources',  href: '/resources',  icon: Library        },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen]     = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout }  = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (href) => location.pathname === href;

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <header className="sticky top-0 z-40 bg-[var(--bg-surface)]/95 backdrop-blur-md border-b border-[var(--border)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[60px]">

          {/* ── Brand ── */}
          <Link to="/dashboard" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-accent-500 flex items-center justify-center shadow-sm group-hover:bg-accent-600 transition-colors">
              <span className="text-white font-bold text-xs tracking-wider font-display">M</span>
            </div>
            <span className="hidden sm:block text-sm font-semibold text-[var(--text-primary)] tracking-tight">
              MindTrack
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navItems.map(({ name, href, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  to={href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    active
                      ? 'bg-accent-500/10 text-accent-500 dark:text-accent-400'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-stone-75 dark:hover:bg-stone-800/40'
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" strokeWidth={active ? 2 : 1.75} />
                  <span>{name}</span>
                </Link>
              );
            })}
          </nav>

          {/* ── Right Controls ── */}
          <div className="flex items-center gap-1.5">

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-stone-75 dark:hover:bg-stone-800/40 transition-all"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light'
                ? <Moon className="h-4 w-4" strokeWidth={1.75} />
                : <Sun  className="h-4 w-4" strokeWidth={1.75} />}
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl hover:bg-stone-75 dark:hover:bg-stone-800/40 border border-transparent hover:border-[var(--border)] transition-all"
              >
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-semibold text-[var(--text-primary)] leading-tight">{user?.name}</p>
                  <p className="text-2xs text-[var(--text-muted)] leading-tight truncate max-w-[120px]">{user?.email}</p>
                </div>
                <div className="w-7 h-7 rounded-lg bg-accent-500/15 dark:bg-accent-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-accent-600 dark:text-accent-400 text-2xs font-bold">{initials}</span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-[var(--text-muted)] hidden sm:block" strokeWidth={2} />
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-52 bg-[var(--bg-surface)] rounded-xl shadow-card-md border border-[var(--border)] z-50 overflow-hidden animate-scale-in">
                    <div className="px-4 py-3 border-b border-[var(--border-soft)]">
                      <p className="text-2xs text-[var(--text-muted)] mb-0.5">Signed in as</p>
                      <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{user?.name}</p>
                      <p className="text-xs text-[var(--text-secondary)] truncate">{user?.email}</p>
                    </div>
                    <div className="p-1.5">
                      <button
                        onClick={() => { logout(); setIsProfileOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-blush-600 dark:text-blush-400 hover:bg-blush-50 dark:hover:bg-blush-900/20 rounded-lg transition-colors"
                      >
                        <LogOut className="h-3.5 w-3.5" strokeWidth={2} />
                        Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-stone-75 dark:hover:bg-stone-800/40 transition-all"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Nav ── */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-[var(--border)] py-3 space-y-0.5 animate-fade-up">
            {navItems.map(({ name, href, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  to={href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-accent-500/10 text-accent-500 dark:text-accent-400'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-stone-75 dark:hover:bg-stone-800/40'
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" strokeWidth={active ? 2 : 1.75} />
                  {name}
                </Link>
              );
            })}
            <div className="pt-2 mt-2 border-t border-[var(--border-soft)] px-3">
              <button
                onClick={() => { logout(); setIsMenuOpen(false); }}
                className="flex items-center gap-2.5 text-sm text-blush-600 dark:text-blush-400 py-2"
              >
                <LogOut className="h-4 w-4" strokeWidth={2} />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;