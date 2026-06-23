import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { ExternalLink, Video, BookOpen, Users, Sparkles, Phone, MessageSquare, ArrowUpRight } from 'lucide-react';

const Resources = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading]                 = useState(true);

  useEffect(() => { if (user) fetchRecommendations(); }, [user]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/ai/recommendations');
      setRecommendations(res.data.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setRecommendations({
        recommendations: {
          videos: [
            { title: '5-Minute Daily Meditation', url: 'https://youtube.com/watch?v=inpok4MKVLM', type: 'Meditation' },
            { title: 'Breathing Exercises for Anxiety', url: 'https://youtube.com/watch?v=YRPh_GaiL8s', type: 'Breathing' },
          ],
          articles: [
            { title: 'Understanding Mental Health', url: '#', category: 'Education' },
            { title: 'Coping with Stress', url: '#', category: 'Techniques' },
          ],
          activities: ['Meditation', 'Exercise', 'Journaling', 'Nature walks'],
        },
        basedOn: { dominantMood: 'general' },
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="relative w-9 h-9">
          <div className="absolute inset-0 rounded-full border-2 border-accent-100 dark:border-accent-900" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-500 animate-spin" />
        </div>
        <p className="text-sm text-[var(--text-muted)]">Curating your resources…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-base)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div>
          <p className="label">Personalised for you</p>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] font-display tracking-tight">Wellness Resources</h1>
          {recommendations?.basedOn && (
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Curated based on your{' '}
              <span className="font-medium text-[var(--text-primary)]">{recommendations.basedOn.dominantMood}</span>{' '}
              mood pattern.
            </p>
          )}
        </div>

        {/* ── Resource Sections ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Videos */}
          <div className="card p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <Video className="h-4 w-4 text-blush-500" strokeWidth={1.75} />
              <div>
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">Guided Videos</h2>
                <p className="text-2xs text-[var(--text-muted)]">Visual wellness content</p>
              </div>
            </div>
            <div className="space-y-2">
              {recommendations?.recommendations?.videos?.length > 0 ? (
                recommendations.recommendations.videos.map((video, i) => (
                  <a
                    key={i}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-3 rounded-xl border border-[var(--border)] hover:border-blush-200 dark:hover:border-blush-800/50 hover:shadow-card transition-all"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[var(--text-primary)] group-hover:text-blush-600 dark:group-hover:text-blush-400 line-clamp-1 transition-colors">
                        {video.title}
                      </p>
                      <p className="text-2xs text-[var(--text-muted)] mt-0.5">{video.type}</p>
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[var(--text-muted)] group-hover:text-blush-500 flex-shrink-0 ml-2 transition-colors" strokeWidth={2} />
                  </a>
                ))
              ) : (
                <p className="text-xs text-[var(--text-muted)] py-4 text-center">No videos available</p>
              )}
            </div>
          </div>

          {/* Articles */}
          <div className="card p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <BookOpen className="h-4 w-4 text-accent-500" strokeWidth={1.75} />
              <div>
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">Articles</h2>
                <p className="text-2xs text-[var(--text-muted)]">In-depth wellness guides</p>
              </div>
            </div>
            <div className="space-y-2">
              {recommendations?.recommendations?.articles?.length > 0 ? (
                recommendations.recommendations.articles.map((article, i) => (
                  <a
                    key={i}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-3 rounded-xl border border-[var(--border)] hover:border-accent-200 dark:hover:border-accent-800/50 hover:shadow-card transition-all"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[var(--text-primary)] group-hover:text-accent-600 dark:group-hover:text-accent-400 line-clamp-1 transition-colors">
                        {article.title}
                      </p>
                      <p className="text-2xs text-[var(--text-muted)] mt-0.5">{article.category}</p>
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[var(--text-muted)] group-hover:text-accent-500 flex-shrink-0 ml-2 transition-colors" strokeWidth={2} />
                  </a>
                ))
              ) : (
                <p className="text-xs text-[var(--text-muted)] py-4 text-center">No articles available</p>
              )}
            </div>
          </div>

          {/* Activities */}
          <div className="card p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <Sparkles className="h-4 w-4 text-sage-500" strokeWidth={1.75} />
              <div>
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">Activities</h2>
                <p className="text-2xs text-[var(--text-muted)]">Practical self-care</p>
              </div>
            </div>
            <div className="space-y-1.5">
              {recommendations?.recommendations?.activities?.length > 0 ? (
                recommendations.recommendations.activities.map((activity, i) => (
                  <div key={i} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[var(--bg-raised)] border border-[var(--border-soft)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-sage-500 flex-shrink-0" />
                    <span className="text-sm text-[var(--text-secondary)] font-medium">{activity}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[var(--text-muted)] py-4 text-center">No activities available</p>
              )}
            </div>
          </div>
        </div>

        {/* ── Crisis Resources ── */}
        <div className="bg-blush-50 dark:bg-blush-950/20 border border-blush-200 dark:border-blush-900/40 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-blush-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Phone className="h-4.5 w-4.5 text-white" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-blush-800 dark:text-blush-300">Crisis Support</h2>
              <p className="text-2xs text-blush-600 dark:text-blush-400">Immediate help when you need it most</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white dark:bg-[#1A1D27] rounded-xl p-4 border border-blush-100 dark:border-blush-900/40">
              <p className="text-2xs font-semibold text-blush-600 dark:text-blush-400 uppercase tracking-wider mb-1">Suicide Prevention Lifeline</p>
              <p className="text-2xl font-bold text-blush-700 dark:text-blush-400 font-display mb-1">988</p>
              <p className="text-2xs text-blush-500 dark:text-blush-500">Available 24/7 · Free · Confidential</p>
            </div>
            <div className="bg-white dark:bg-[#1A1D27] rounded-xl p-4 border border-blush-100 dark:border-blush-900/40">
              <p className="text-2xs font-semibold text-blush-600 dark:text-blush-400 uppercase tracking-wider mb-1">Crisis Text Line</p>
              <p className="text-base font-bold text-blush-700 dark:text-blush-400 font-display mb-1">Text HOME to 741741</p>
              <p className="text-2xs text-blush-500 dark:text-blush-500">24/7 · Trained counselors</p>
            </div>
          </div>
          <p className="text-xs text-blush-600 dark:text-blush-400 text-center">
            If you're in crisis, please reach out for professional help immediately. You are not alone.
          </p>
        </div>

        {/* ── Professional Help ── */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Find Professional Help</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { label: 'Find a Therapist', href: 'https://www.psychologytoday.com/us/therapists' },
              { label: 'SAMHSA Helpline',  href: 'https://www.samhsa.gov/find-help/national-helpline' },
              { label: 'NAMI Support',     href: 'https://www.nami.org/help' },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between px-4 py-3 rounded-xl border border-[var(--border)] hover:border-accent-300 dark:hover:border-accent-700 hover:bg-accent-50 dark:hover:bg-accent-900/10 transition-all"
              >
                <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors">
                  {label}
                </span>
                <ExternalLink className="h-3.5 w-3.5 text-[var(--text-muted)] group-hover:text-accent-500 flex-shrink-0 transition-colors" strokeWidth={2} />
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Resources;