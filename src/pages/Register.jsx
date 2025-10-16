import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import './auth.css';

export default function Register() {
  const { register } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const doRegister = (avatarData) => {
      const res = register({ name, email, password, avatar: avatarData });
      setLoading(false);
      if (!res || !res.success) return setError(res?.message || 'Registration failed');
      nav('/');
    };

    if (avatarFile) {
      const r = new FileReader();
      r.onload = () => doRegister(r.result);
      r.readAsDataURL(avatarFile);
    } else {
      doRegister(undefined);
    }
  };

  return (
    <div className="auth-card">
      <h2>Create an account</h2>
      <form onSubmit={submit}>
        <div className="auth-field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="auth-field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="auth-field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <div className="auth-field">
          <label>Avatar (optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} />
        </div>

        {error && <div className="error">{error}</div>}

        <div className="auth-actions">
          <button className="btn" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
          <Link to="/login" className="btn secondary">Already have an account?</Link>
        </div>
      </form>
    </div>
  );
}

