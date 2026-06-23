import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated, loading } = useAuth();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (data) => { await login(data); };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)] px-4 py-12">
      <div className="w-full max-w-sm">

        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex w-10 h-10 rounded-xl bg-accent-500 items-center justify-center mb-4">
            <span className="text-white font-bold text-sm font-display">M</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] font-display tracking-tight">Welcome back</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Sign in to continue your wellness journey</p>
        </div>

        {/* Card */}
        <div className="card p-7">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Email */}
            <div>
              <label className="label">Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" strokeWidth={1.75} />
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                  })}
                  type="email"
                  className="input pl-10"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-blush-600 dark:text-blush-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" strokeWidth={1.75} />
                <input
                  {...register('password', { required: 'Password is required' })}
                  type={showPassword ? 'text' : 'password'}
                  className="input pl-10 pr-10"
                  placeholder="Your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                >
                  {showPassword
                    ? <EyeOff className="h-4 w-4" strokeWidth={1.75} />
                    : <Eye    className="h-4 w-4" strokeWidth={1.75} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-blush-600 dark:text-blush-400">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="btn-primary w-full justify-center py-3 mt-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {(isSubmitting || loading) ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[var(--text-secondary)] mt-5">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-accent-500 hover:text-accent-600 dark:hover:text-accent-400 hover:underline transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;