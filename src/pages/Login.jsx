import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import './auth.css';

export default function Login() {
  const { loginWithCredentials } = useUser();
  const navigate = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = loginWithCredentials({ email, password });
    if (!res || !res.success) {
      setError(res?.message || 'Invalid credentials');
      setLoading(false);
      return;
    }
    navigate(from, { replace: true });
  };

  return (
    <div className="auth-card">
      <h2>Welcome back</h2>
      <form onSubmit={submit} aria-label="login form">
        <div className="auth-field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" placeholder="you@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="auth-field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        {error && <div className="error" role="alert">{error}</div>}

        <div className="auth-actions">
          <button className="btn" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
          <Link to="/register" className="btn secondary">Create account</Link>
        </div>

        <div className="auth-footer">By signing in you agree to this demo's terms — it's not production-ready.</div>
      </form>
    </div>
  );
}
