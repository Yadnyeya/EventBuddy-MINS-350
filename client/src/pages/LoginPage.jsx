// Login Page - Student authentication
// Maps to: Login/Authentication flow

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signIn } from '../services/supabase';

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    setStatus(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);

    if (!formData.email || !formData.password) {
      setStatus({ type: 'error', message: 'Fill in your email and password to continue.' });
      return;
    }

    if (!formData.email.includes('@')) {
      setStatus({ type: 'error', message: 'Make sure your email is valid (include the @ symbol).' });
      return;
    }

    try {
      setLoading(true);
      await signIn(formData.email, formData.password);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setStatus({ type: 'error', message: error.message || 'Invalid credentials. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth__wrapper">
        <div className="auth__header">
          <h1 className="auth__title">EventBuddy</h1>
          <p className="auth__subtitle">Log in to unlock your campus circle.</p>
        </div>

        <div className="form-card">
          <div className="form-card__header">
            <h2 className="form-card__title">Welcome back</h2>
            <p className="form-card__subtitle">Enter your details to continue.</p>
          </div>

          {status && status.type === 'error' && <div className="form-error">{status.message}</div>}

          <form className="form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@university.edu"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                autoComplete="email"
              />
            </div>

            <div className="form-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            <div>
              <Link to="/forgot-password" className="button button--ghost" style={{ width: '100%' }}>
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="button button--primary"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Logging in…' : 'Log in'}
            </button>
          </form>
        </div>

        <div className="auth__footer">
          <p>
            No account yet?{' '}
            <Link to="/signup">Sign up to get started</Link>
          </p>
        </div>

        <div className="auth__hint">
          <strong>Demo credentials</strong>
          <br />john.doe@university.edu / demo123
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
