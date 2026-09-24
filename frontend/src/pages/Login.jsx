import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ROLE_HOME = {
  student: '/student/drives',
  tnp: '/tnp/dashboard',
  admin: '/admin/dashboard',
};

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const result = await login(form.email, form.password);
    if (!result.success) {
      setError(result.message);
      return;
    }
    const stored = JSON.parse(localStorage.getItem('placeflow_user'));
    navigate(ROLE_HOME[stored.role] || '/');
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1>Welcome to PlaceFlow</h1>
        <p className="sub">Centralized placement management &amp; eligibility platform</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@student.edu"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ marginTop: 16, fontSize: '0.85rem', color: 'var(--muted)' }}>
          New student? <Link to="/register">Create an account</Link>
        </p>
        <p style={{ marginTop: 8, fontSize: '0.78rem', color: 'var(--muted)' }}>
          TNP Cell &amp; Admin accounts are created by an existing Admin.
        </p>
      </div>
    </div>
  );
}
