// For login and sign up page
import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import cupIcon from './assets/cup-of-coffee-icon.svg';

export default function Auth({ onGuest }) {
  const [mode, setMode] = useState('signIn'); // 'signIn' or 'signUp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const isSignIn = mode === 'signIn';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    let result;
    if (isSignIn) {
      result = await supabase.auth.signInWithPassword({ email, password });
    } else {
      result = await supabase.auth.signUp({ email, password });
    }

    setLoading(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    if (!isSignIn) {
      setMessage('Check your email to confirm your account, then log in.');
    }
  }

  function switchMode() {
    setMode(isSignIn ? 'signUp' : 'signIn');
    setError('');
    setMessage('');
  }

  return (
    <div className="auth-screen">
      <div className="auth-logo">
        <img src={cupIcon} alt="" />
      </div>
      <h1 className="screen-title center-text">Coffee Brew Journal</h1>
      <p className="screen-subtitle center-text">
        {isSignIn
          ? 'From your first shot to your best shot. Welcome back — log in to your journal.'
          : 'Create an account to start logging.'}
      </p>

      <div className="auth-card">
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="input-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="input-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={isSignIn ? 'current-password' : 'new-password'}
            />
          </div>

          {error && <p className="form-error">{error}</p>}
          {message && <p className="card-meta">{message}</p>}

          <div className="form-actions auth-actions">
            <button type="submit" className="btn btn-accent full-width" disabled={loading}>
              {loading ? 'Please wait…' : isSignIn ? 'Log in' : 'Sign up'}
            </button>
            <button type="button" className="btn btn-secondary full-width" onClick={switchMode}>
              {isSignIn ? 'Need an account? Sign up' : 'Have an account? Log in'}
            </button>
          </div>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button type="button" className="btn btn-secondary full-width" onClick={onGuest}>
          Continue as guest
        </button>
        <p className="card-meta center-text auth-note">Guest brews are saved on this device only.</p>
      </div>
    </div>
  );
}
