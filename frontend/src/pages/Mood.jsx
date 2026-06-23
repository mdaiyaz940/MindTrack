import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Trash2, Filter, SlidersHorizontal, CheckCircle2 } from 'lucide-react';

const moods = [
  { label: 'Happy',   value: 'happy',   color: 'bg-amber-400',     ring: 'ring-amber-400',  text: 'text-amber-700 dark:text-amber-300',  bg: 'bg-amber-50 dark:bg-amber-900/20'  },
  { label: 'Sad',     value: 'sad',     color: 'bg-blue-400',      ring: 'ring-blue-400',   text: 'text-blue-700 dark:text-blue-300',    bg: 'bg-blue-50 dark:bg-blue-900/20'    },
  { label: 'Angry',   value: 'angry',   color: 'bg-rose-500',      ring: 'ring-rose-500',   text: 'text-rose-700 dark:text-rose-300',    bg: 'bg-rose-50 dark:bg-rose-900/20'    },
  { label: 'Neutral', value: 'neutral', color: 'bg-stone-400',     ring: 'ring-stone-400',  text: 'text-stone-600 dark:text-stone-400',  bg: 'bg-stone-100 dark:bg-stone-700/30' },
  { label: 'Anxious', value: 'anxious', color: 'bg-yellow-400',    ring: 'ring-yellow-400', text: 'text-yellow-700 dark:text-yellow-300',bg: 'bg-yellow-50 dark:bg-yellow-900/20'},
  { label: 'Excited', value: 'excited', color: 'bg-orange-400',    ring: 'ring-orange-400', text: 'text-orange-700 dark:text-orange-300',bg: 'bg-orange-50 dark:bg-orange-900/20'},
  { label: 'Tired',   value: 'tired',   color: 'bg-indigo-400',    ring: 'ring-indigo-400', text: 'text-indigo-700 dark:text-indigo-300',bg: 'bg-indigo-50 dark:bg-indigo-900/20'},
  { label: 'Stressed',value: 'stressed',color: 'bg-blush-500',     ring: 'ring-blush-500',  text: 'text-blush-700 dark:text-blush-300',  bg: 'bg-blush-50 dark:bg-blush-900/20'  },
];

export default function Mood() {
  const { user } = useAuth();
  const [moodHistory, setMoodHistory]     = useState([]);
  const [loading, setLoading]             = useState(false);
  const [filterMood, setFilterMood]       = useState('all');
  const [filterRecent, setFilterRecent]   = useState(false);

  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { mood: '', intensity: 5, note: '', triggers: [], activities: [] }
  });

  const selectedMood = watch('mood');
  const intensity    = watch('intensity');

  const fetchMoods = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterMood !== 'all') params.append('mood', filterMood);
      if (filterRecent) params.append('timeRange', '7');
      const res = await axios.get(`/mood?${params}`);
      setMoodHistory(res.data.data || []);
    } catch (error) {
      console.error('Error fetching moods:', error);
      toast.error('Failed to load mood history');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      await axios.post('/mood', {
        ...data,
        triggers:   data.triggers.filter(t => t.trim()),
        activities: data.activities.filter(a => a.trim()),
      });
      toast.success('Mood saved');
      reset();
      fetchMoods();
    } catch (error) {
      console.error('Error saving mood:', error);
      toast.error('Failed to save mood');
    }
  };

  const deleteMood = async (id) => {
    if (!confirm('Delete this mood entry?')) return;
    try {
      await axios.delete(`/mood/${id}`);
      toast.success('Deleted');
      fetchMoods();
    } catch (error) {
      console.error('Error deleting mood:', error);
      toast.error('Failed to delete');
    }
  };

  useEffect(() => { if (user) fetchMoods(); }, [user, filterMood, filterRecent]);

  const selectedMoodData = moods.find(m => m.value === selectedMood);

  // Intensity label
  const intensityLabel = intensity <= 3 ? 'Mild' : intensity <= 6 ? 'Moderate' : intensity <= 8 ? 'Strong' : 'Intense';

  return (
    <div className="min-h-screen bg-[var(--bg-base)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* ── Page Header ── */}
        <div>
          <p className="label">Daily Check-in</p>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] font-display tracking-tight">
            How are you feeling?
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1 leading-relaxed">
            Take a moment to check in with yourself. Daily tracking builds self-awareness over time.
          </p>
        </div>

        {/* ── Mood Entry Form ── */}
        <div className="card p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">

            {/* Mood Selection — horizontal wrap chips */}
            <div>
              <p className="label mb-4">Select your mood</p>
              <div className="flex flex-wrap gap-2.5">
                {moods.map((mood) => (
                  <label key={mood.value} className="cursor-pointer">
                    <input
                      {...register('mood', { required: 'Please select a mood' })}
                      type="radio"
                      value={mood.value}
                      className="sr-only"
                    />
                    <div className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-150 select-none ${
                      selectedMood === mood.value
                        ? `border-transparent ${mood.bg} ring-2 ${mood.ring} ring-offset-1 ring-offset-white dark:ring-offset-[#1A1D27]`
                        : 'border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--border-soft)] hover:bg-[var(--bg-raised)]'
                    }`}>
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${mood.color}`} />
                      <span className={`text-sm font-medium ${
                        selectedMood === mood.value ? mood.text : 'text-[var(--text-secondary)]'
                      }`}>
                        {mood.label}
                      </span>
                      {selectedMood === mood.value && (
                        <CheckCircle2 className={`h-3.5 w-3.5 flex-shrink-0 ${mood.text}`} strokeWidth={2.5} />
                      )}
                    </div>
                  </label>
                ))}
              </div>
              {errors.mood && (
                <p className="mt-3 text-xs text-blush-600 dark:text-blush-400 font-medium">{errors.mood.message}</p>
              )}
            </div>

            {/* Intensity Slider */}
            {selectedMood && (
              <div className="bg-[var(--bg-raised)] rounded-xl p-5 border border-[var(--border-soft)]">
                <div className="flex items-center justify-between mb-4">
                  <p className="label">Intensity</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-bold text-[var(--text-primary)] font-display">{intensity}</span>
                    <span className="text-xs text-[var(--text-muted)]">/ 10</span>
                    <span className={`ml-1.5 text-2xs font-semibold px-2 py-0.5 rounded-md ${
                      intensity <= 3 ? 'bg-sage-50 text-sage-600 dark:bg-sage-900/30 dark:text-sage-400' :
                      intensity <= 6 ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                      'bg-blush-50 text-blush-700 dark:bg-blush-900/30 dark:text-blush-400'
                    }`}>
                      {intensityLabel}
                    </span>
                  </div>
                </div>
                <input
                  {...register('intensity', { min: 1, max: 10 })}
                  type="range"
                  min="1"
                  max="10"
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${(intensity - 1) * 11.11}%, #E2DDD6 ${(intensity - 1) * 11.11}%, #E2DDD6 100%)`
                  }}
                />
                <div className="flex justify-between mt-2 text-2xs text-[var(--text-muted)] font-medium">
                  <span>Mild</span>
                  <span>Moderate</span>
                  <span>Intense</span>
                </div>
              </div>
            )}

            {/* Note */}
            <div>
              <p className="label">Notes <span className="normal-case font-normal text-[var(--text-muted)]">(optional)</span></p>
              <textarea
                {...register('note')}
                rows={3}
                className="input resize-none mt-1"
                placeholder="What's on your mind? Any events or thoughts that shaped this feeling?"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !selectedMood}
              className="btn-primary w-full justify-center py-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                'Save Mood Entry'
              )}
            </button>
          </form>
        </div>

        {/* ── Mood History ── */}
        <div className="card p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base font-semibold text-[var(--text-primary)]">Mood History</h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Your emotional journey over time</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-[var(--bg-raised)] border border-[var(--border)] rounded-xl px-3 py-2">
                <Filter className="h-3.5 w-3.5 text-[var(--text-muted)]" strokeWidth={2} />
                <select
                  value={filterMood}
                  onChange={(e) => setFilterMood(e.target.value)}
                  className="bg-transparent border-none text-xs font-medium text-[var(--text-secondary)] focus:ring-0 cursor-pointer p-0 outline-none"
                >
                  <option value="all">All moods</option>
                  {moods.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-2 bg-[var(--bg-raised)] border border-[var(--border)] rounded-xl px-3 py-2 cursor-pointer hover:bg-[var(--bg-inset)] transition-colors">
                <input
                  type="checkbox"
                  checked={filterRecent}
                  onChange={(e) => setFilterRecent(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-[var(--border)] text-accent-500 focus:ring-accent-500/30"
                />
                <span className="text-xs font-medium text-[var(--text-secondary)]">Last 7 days</span>
              </label>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-14 gap-3">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 rounded-full border-2 border-accent-100 dark:border-accent-900" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-500 animate-spin" />
              </div>
              <p className="text-xs text-[var(--text-muted)]">Loading your journey…</p>
            </div>
          ) : moodHistory.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[520px] overflow-y-auto pr-1">
              {moodHistory.map((entry) => {
                const mood = moods.find(m => m.value === entry.mood);
                return (
                  <div
                    key={entry._id}
                    className="group bg-[var(--bg-surface)] rounded-xl border border-[var(--border)] hover:border-accent-200 dark:hover:border-accent-800/50 hover:shadow-card transition-all duration-200 p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2.5 mb-2">
                          <span className={`text-2xs font-semibold px-2.5 py-1 rounded-lg capitalize ${mood?.bg || 'bg-stone-100 text-stone-600'} ${mood?.text || ''}`}>
                            {mood?.label || entry.mood}
                          </span>
                          <div className={`flex items-center gap-1 text-2xs font-semibold px-2 py-0.5 rounded-md ${
                            entry.intensity <= 3 ? 'bg-sage-50 text-sage-600 dark:bg-sage-900/30 dark:text-sage-400' :
                            entry.intensity <= 6 ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                            'bg-blush-50 text-blush-700 dark:bg-blush-900/30 dark:text-blush-400'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              entry.intensity <= 3 ? 'bg-sage-500' :
                              entry.intensity <= 6 ? 'bg-amber-500' : 'bg-blush-500'
                            }`} />
                            {entry.intensity}/10
                          </div>
                        </div>
                        {entry.note && (
                          <p className="text-xs text-[var(--text-secondary)] italic leading-relaxed mt-1.5 line-clamp-2">
                            "{entry.note}"
                          </p>
                        )}
                        <p className="text-2xs text-[var(--text-muted)] mt-2 font-medium">
                          {new Date(entry.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteMood(entry._id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-[var(--text-muted)] hover:text-blush-500 hover:bg-blush-50 dark:hover:bg-blush-900/20 rounded-lg transition-all shrink-0 ml-2"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-14 text-center border border-dashed border-[var(--border)] rounded-xl">
              <SlidersHorizontal className="h-8 w-8 text-[var(--border)] mx-auto mb-3" strokeWidth={1.5} />
              <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">No entries yet</p>
              <p className="text-xs text-[var(--text-muted)]">Log your first mood above to get started.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
