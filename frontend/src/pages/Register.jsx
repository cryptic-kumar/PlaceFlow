import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', rollNumber: '', branch: '', category: 'CAT1',
  });
  const [error, setError] = useState('');

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const result = await register(form);
    if (!result.success) {
      setError(result.message);
      return;
    }
    navigate('/student/drives');
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: 460 }}>
        <h1>Student Registration</h1>
        <p className="sub">Create your PlaceFlow account</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input required value={form.name} onChange={(e) => update('name', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" required minLength={6} value={form.password} onChange={(e) => update('password', e.target.value)} />
          </div>
          <div className="grid cols-2">
            <div className="form-group">
              <label>Roll Number</label>
              <input required value={form.rollNumber} onChange={(e) => update('rollNumber', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Branch</label>
              <input required value={form.branch} onChange={(e) => update('branch', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label>Placement Category</label>
            <select value={form.category} onChange={(e) => update('category', e.target.value)}>
              <option value="CAT1">CAT 1 — eligible for Normal, Dream &amp; Super Dream</option>
              <option value="CAT2">CAT 2 — eligible for Normal &amp; Dream</option>
              <option value="CAT3">CAT 3 — eligible for Normal only</option>
            </select>
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ marginTop: 16, fontSize: '0.85rem', color: 'var(--muted)' }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
