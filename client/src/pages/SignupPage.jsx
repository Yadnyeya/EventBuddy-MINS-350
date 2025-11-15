// Signup Page - New user registration
// Maps to: Signup/Registration flow

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../services/supabase';

function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    setStatus(null);
  };

  const validate = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      return 'Fill in every field to continue.';
    }
    if (!formData.email.includes('@')) {
      return 'Enter a valid university email address.';
    }
    const emailLower = formData.email.toLowerCase();
    if (!emailLower.includes('.edu')) {
      return 'EventBuddy is for students—use your .edu email.';
    }
    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords need to match exactly.';
    }
    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setStatus({ type: 'error', message: validationError });
      return;
    }

    try {
      setLoading(true);
      await signUp(formData.email, formData.password);
      setSuccess(true);
      setStatus({ type: 'success', message: 'Account created! Check your inbox to verify.' });
      setTimeout(() => navigate('/profile-setup'), 2200);
    } catch (error) {
      console.error('Signup error:', error);
      if (error.message.includes('already registered')) {
        setStatus({ type: 'error', message: 'This email already exists. Try logging in instead.' });
      } else {
        setStatus({ type: 'error', message: error.message || 'Unable to create your account right now.' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth">
        <div className="auth__wrapper">
          <div className="form-card">
            <div className="form-card__header">
              <h2 className="form-card__title">You’re in</h2>
              <p className="form-card__subtitle">Verification email sent — next stop, profile setup.</p>
            </div>
            <div className="form-success" style={{ marginTop: 0 }}>
              ✅ Account created! Redirecting you to set up your profile…
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth">
      <div className="auth__wrapper">
        <div className="auth__header">
          <h1 className="auth__title">Join EventBuddy</h1>
          <p className="auth__subtitle">Create an account to track events and share your story.</p>
        </div>

        <div className="form-card">
          <div className="form-card__header">
            <h2 className="form-card__title">Create account</h2>
            <p className="form-card__subtitle">Use your campus email to get exclusive access.</p>
          </div>

          {status && status.type === 'error' && <div className="form-error">{status.message}</div>}

          <form className="form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="email">University email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@university.edu"
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
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                disabled={loading}
                autoComplete="new-password"
              />
              <p className="card__body" style={{ marginTop: '0.35rem' }}>At least 6 characters — mix it up for security.</p>
            </div>

            <div className="form-field">
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
                disabled={loading}
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className="button button--primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Creating account…' : 'Sign up'}
            </button>
          </form>

          <p className="card__body" style={{ marginTop: '1.5rem', fontSize: '0.8rem' }}>
            By continuing you agree to our <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy Policy</Link>.
          </p>
        </div>

        <div className="auth__footer">
          <p>
            Already part of EventBuddy? <Link to="/login">Log in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
