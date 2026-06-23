import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { BarChart2, TrendingUp, PieChart } from 'lucide-react';
Chart.register(...registerables);

const baseFont = { family: 'Inter, sans-serif', size: 11, weight: '500' };
const gridColor = 'rgba(130,120,110,0.10)';
const tickColor = '#A09A93';

export default function Analytics() {
  const { user } = useAuth();
  const [moodData, setMoodData]       = useState([]);
  const [journalData, setJournalData] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [timeRange, setTimeRange]     = useState('7days');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const moodRes    = await axios.get('/mood/analytics/data?timeRange=30');
        setMoodData(moodRes.data.data?.dailyTrends || []);
        const journalRes = await axios.get('/journal/analytics/data?timeRange=30');
        setJournalData(journalRes.data.data?.sentimentTrends || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user, timeRange]);

  const filterData = (data) => {
    if (!data.length) return [];
    const now = new Date();
    let cutoffDate;
    switch (timeRange) {
      case '7days':  cutoffDate = new Date(now.setDate(now.getDate() - 7));  break;
      case '30days': cutoffDate = new Date(now.setDate(now.getDate() - 30)); break;
      default:       return data;
    }
    return data.filter(item => new Date(item.date || item.createdAt) >= cutoffDate);
  };

  const moodLabels       = ['happy', 'sad', 'angry', 'neutral', 'anxious', 'excited', 'tired'];
  const moodDisplayNames = ['Happy', 'Sad', 'Angry', 'Neutral', 'Anxious', 'Excited', 'Tired'];

  const chartData = {
    moodDistribution: {
      labels: moodDisplayNames,
      datasets: [{
        data: moodLabels.map(mood => filterData(moodData).filter(item => item.mood === mood).length),
        backgroundColor: ['#F59E0B','#60A5FA','#FDA4AF','#CBD5E1','#FCD34D','#FB923C','#818CF8'],
        borderWidth: 0,
        hoverOffset: 4,
      }],
    },
    moodTrend: {
      labels: filterData(moodData).map(e =>
        new Date(e.date || e.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      ),
      datasets: [{
        label: 'Mood Score',
        data: filterData(moodData).map(e => e.avgScore || 5),
        borderColor: '#5C6AC4',
        backgroundColor: 'rgba(92,106,196,0.08)',
        fill: true,
        tension: 0.45,
        pointRadius: 3,
        pointBackgroundColor: '#5C6AC4',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        borderWidth: 2,
      }],
    },
    journalSentiment: {
      labels: filterData(journalData).map(e =>
        new Date(e.date || e.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      ),
      datasets: [
        {
          label: 'Positive',
          data: filterData(journalData).map(e => (e.positive || 0) * 100),
          backgroundColor: '#5E8B72',
          borderRadius: 6,
          borderSkipped: false,
        },
        {
          label: 'Negative',
          data: filterData(journalData).map(e => (e.negative || 0) * 100),
          backgroundColor: '#B5606A',
          borderRadius: 6,
          borderSkipped: false,
        },
      ],
    },
  };

  const scaleDefaults = {
    grid: { color: gridColor, drawBorder: false },
    ticks: { color: tickColor, font: baseFont },
    border: { display: false },
  };

  const legendOpts = (position = 'bottom') => ({
    position,
    labels: { padding: 16, usePointStyle: true, pointStyleWidth: 8, font: baseFont, color: tickColor },
  });

  if (loading) return (
    <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="relative w-9 h-9">
          <div className="absolute inset-0 rounded-full border-2 border-accent-100 dark:border-accent-900" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-500 animate-spin" />
        </div>
        <p className="text-sm text-[var(--text-muted)]">Loading your insights…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-base)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="label">Your data</p>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] font-display tracking-tight">Analytics</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Discover patterns in your mental wellness journey.</p>
          </div>

          {/* Time Range Segmented Control */}
          <div className="flex items-center bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-1 shadow-card">
            {[
              { key: '7days',  label: '7 Days'   },
              { key: '30days', label: '30 Days'  },
              { key: 'all',    label: 'All Time' },
            ].map(r => (
              <button
                key={r.key}
                onClick={() => setTimeRange(r.key)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  timeRange === r.key
                    ? 'bg-accent-500 text-white shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {!moodData.length && !journalData.length ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[var(--bg-raised)] flex items-center justify-center mb-4">
              <BarChart2 className="h-7 w-7 text-[var(--border)]" strokeWidth={1.5} />
            </div>
            <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">No data to analyse yet</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-xs">
              Track mood and write journal entries to see meaningful insights here.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="/mood"    className="btn-primary">Track Mood</a>
              <a href="/journal" className="btn-ghost">Write Journal</a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* Mood Distribution */}
            <div className="card p-6">
              <div className="flex items-center gap-2.5 mb-5">
                <PieChart className="h-4 w-4 text-[var(--text-muted)]" strokeWidth={1.75} />
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">Mood Distribution</h3>
              </div>
              <div className="h-64">
                {filterData(moodData).length ? (
                  <Pie
                    data={chartData.moodDistribution}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: legendOpts('bottom') },
                    }}
                  />
                ) : <EmptyChart />}
              </div>
            </div>

            {/* Mood Trend */}
            <div className="card p-6">
              <div className="flex items-center gap-2.5 mb-5">
                <TrendingUp className="h-4 w-4 text-[var(--text-muted)]" strokeWidth={1.75} />
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">Mood Trend</h3>
              </div>
              <div className="h-64">
                {filterData(moodData).length ? (
                  <Line
                    data={chartData.moodTrend}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: {
                        y: { ...scaleDefaults, beginAtZero: true, max: 10 },
                        x: { ...scaleDefaults },
                      },
                    }}
                  />
                ) : <EmptyChart />}
              </div>
            </div>

            {/* Journal Sentiment */}
            <div className="card p-6 lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-5">
                <BarChart2 className="h-4 w-4 text-[var(--text-muted)]" strokeWidth={1.75} />
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">Journal Sentiment</h3>
              </div>
              <div className="h-64">
                {filterData(journalData).length ? (
                  <Bar
                    data={chartData.journalSentiment}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: legendOpts('top') },
                      scales: {
                        y: { ...scaleDefaults, min: 0, max: 100, ticks: { ...scaleDefaults.ticks, callback: v => `${v}%` } },
                        x: { ...scaleDefaults },
                      },
                    }}
                  />
                ) : <EmptyChart />}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-2">
      <BarChart2 className="h-6 w-6 text-[var(--border)]" strokeWidth={1.5} />
      <p className="text-xs text-[var(--text-muted)]">No data for this period</p>
    </div>
  );
}