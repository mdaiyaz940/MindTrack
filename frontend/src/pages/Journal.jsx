import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Edit2, Trash2, Plus, BookOpen, Calendar, AlignLeft, X } from 'lucide-react';

const moodColors = {
  happy:   'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
  sad:     'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  angry:   'bg-blush-50 text-blush-700 dark:bg-blush-900/20 dark:text-blush-400',
  neutral: 'bg-stone-100 text-stone-600 dark:bg-stone-700/40 dark:text-stone-400',
  anxious: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
  excited: 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
  tired:   'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400',
  stressed:'bg-blush-50 text-blush-700 dark:bg-blush-900/20 dark:text-blush-400',
};

const Journal = () => {
  const { user } = useAuth();
  const [journals, setJournals]       = useState([]);
  const [loading, setLoading]         = useState(false);
  const [editingId, setEditingId]     = useState(null);
  const [showForm, setShowForm]       = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm();
  const contentValue = watch('content') || '';

  useEffect(() => { if (user) fetchJournals(); }, [user]);

  const fetchJournals = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/journal');
      setJournals(res.data.data || []);
    } catch (error) {
      console.error('Error fetching journals:', error);
      toast.error('Failed to load journal entries');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await axios.put(`/journal/${editingId}`, data);
        toast.success('Entry updated');
      } else {
        await axios.post('/journal', data);
        toast.success('Entry saved');
      }
      reset();
      setEditingId(null);
      setShowForm(false);
      fetchJournals();
    } catch (error) {
      console.error('Error saving journal:', error);
      if (error.response?.status === 429) toast.error('Too many requests. Please wait.');
      else toast.error('Failed to save entry');
    }
  };

  const editJournal = (journal) => {
    setEditingId(journal._id);
    setValue('title', journal.title);
    setValue('content', journal.content);
    setValue('mood', journal.mood);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteJournal = async (id) => {
    if (!confirm('Delete this journal entry?')) return;
    try {
      await axios.delete(`/journal/${id}`);
      toast.success('Entry deleted');
      fetchJournals();
    } catch (error) {
      console.error('Error deleting journal:', error);
      toast.error('Failed to delete');
    }
  };

  const cancelEdit = () => {
    reset();
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <p className="label">Your writing space</p>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] font-display tracking-tight">Journal</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {journals.length > 0
                ? `${journals.length} ${journals.length === 1 ? 'entry' : 'entries'} written`
                : 'A quiet space to express yourself freely.'}
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              New Entry
            </button>
          )}
        </div>

        {/* ── Journal Form ── */}
        {showForm && (
          <div className="card overflow-hidden animate-fade-up">
            {/* Form Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-soft)]">
              <div className="flex items-center gap-2.5">
                <Edit2 className="h-4 w-4 text-accent-500" strokeWidth={2} />
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                  {editingId ? 'Edit Entry' : 'New Journal Entry'}
                </h2>
              </div>
              <button
                onClick={cancelEdit}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-raised)] transition-colors"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="label">Title</label>
                <input
                  {...register('title', { required: 'Please give your entry a title' })}
                  type="text"
                  className="input mt-1"
                  placeholder="What's this entry about?"
                />
                {errors.title && (
                  <p className="mt-1.5 text-xs text-blush-600 dark:text-blush-400">{errors.title.message}</p>
                )}
              </div>

              {/* Content */}
              <div>
                <label className="label">Your thoughts</label>
                <div className="relative mt-1">
                  <textarea
                    {...register('content', { required: 'Please share your thoughts' })}
                    rows={9}
                    className="input resize-none leading-relaxed"
                    placeholder="Write freely — this is your space. No pressure, no judgment…"
                  />
                  <span className="absolute bottom-3 right-4 text-2xs text-[var(--text-muted)] select-none">
                    {contentValue.length} chars
                  </span>
                </div>
                {errors.content && (
                  <p className="mt-1.5 text-xs text-blush-600 dark:text-blush-400">{errors.content.message}</p>
                )}
              </div>

              {/* Mood */}
              <div>
                <label className="label">
                  Mood <span className="normal-case font-normal text-[var(--text-muted)]">(optional)</span>
                </label>
                <select {...register('mood')} className="input mt-1">
                  <option value="">— Not specified —</option>
                  <option value="happy">Happy</option>
                  <option value="sad">Sad</option>
                  <option value="angry">Angry</option>
                  <option value="neutral">Neutral</option>
                  <option value="anxious">Anxious</option>
                  <option value="excited">Excited</option>
                  <option value="tired">Tired</option>
                  <option value="stressed">Stressed</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex-1 justify-center py-3 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving…
                    </>
                  ) : (
                    editingId ? 'Update Entry' : 'Save Entry'
                  )}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={isSubmitting}
                  className="btn-ghost px-5"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Entries ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-full border-2 border-accent-100 dark:border-accent-900" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-500 animate-spin" />
            </div>
            <p className="text-xs text-[var(--text-muted)]">Loading your journal…</p>
          </div>
        ) : journals.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {journals.map((journal) => (
              <div
                key={journal._id}
                className="group card-hover p-5 flex flex-col gap-3"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] line-clamp-1 leading-snug">
                      {journal.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2.5 mt-1.5">
                      <span className="flex items-center gap-1 text-2xs text-[var(--text-muted)] font-medium">
                        <Calendar className="h-3 w-3" strokeWidth={2} />
                        {new Date(journal.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      {journal.wordCount > 0 && (
                        <span className="flex items-center gap-1 text-2xs text-[var(--text-muted)] font-medium">
                          <AlignLeft className="h-3 w-3" strokeWidth={2} />
                          {journal.wordCount} words
                        </span>
                      )}
                      {journal.mood && (
                        <span className={`text-2xs font-semibold px-2 py-0.5 rounded-md capitalize ${moodColors[journal.mood] || 'bg-stone-100 text-stone-600'}`}>
                          {journal.mood}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                      onClick={() => editJournal(journal)}
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-accent-500 hover:bg-accent-50 dark:hover:bg-accent-900/20 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="h-3.5 w-3.5" strokeWidth={2} />
                    </button>
                    <button
                      onClick={() => deleteJournal(journal._id)}
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-blush-500 hover:bg-blush-50 dark:hover:bg-blush-900/20 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                    </button>
                  </div>
                </div>

                {/* Content Preview */}
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                  {journal.content}
                </p>

                {/* Sentiment Analysis */}
                {journal.sentiment && (
                  <div className="pt-2.5 border-t border-[var(--border-soft)]">
                    <p className="text-2xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2.5">
                      Sentiment
                    </p>
                    <div className="space-y-1.5">
                      {[
                        { label: 'Positive', value: journal.sentiment.positive, color: 'bg-sage-500' },
                        { label: 'Neutral',  value: journal.sentiment.neutral,  color: 'bg-stone-400' },
                        { label: 'Negative', value: journal.sentiment.negative, color: 'bg-blush-400' },
                      ].map(({ label, value, color }) => (
                        <div key={label} className="flex items-center gap-3">
                          <span className="text-2xs text-[var(--text-muted)] w-14 flex-shrink-0">{label}</span>
                          <div className="flex-1 bg-[var(--bg-raised)] rounded-full h-1 overflow-hidden">
                            <div
                              className={`h-full ${color} rounded-full transition-all duration-700`}
                              style={{ width: `${Math.round(value * 100)}%` }}
                            />
                          </div>
                          <span className="text-2xs text-[var(--text-muted)] font-medium w-7 text-right">
                            {Math.round(value * 100)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-sage-50 dark:bg-sage-900/20 flex items-center justify-center mb-4">
              <BookOpen className="h-7 w-7 text-sage-500" strokeWidth={1.5} />
            </div>
            <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">Your journal awaits</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-xs">
              Start writing your thoughts to track your mental wellness journey.
            </p>
            <button onClick={() => setShowForm(true)} className="btn-primary">
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Write First Entry
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Journal;