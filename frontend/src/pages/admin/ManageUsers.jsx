import React, { useEffect, useState } from 'react';
import api from '../../api/axios.js';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'tnp' });
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data.users);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    try {
      await api.post('/admin/users', form);
      setForm({ name: '', email: '', password: '', role: 'tnp' });
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user.');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    await api.delete(`/admin/users/${id}`);
    load();
  }

  return (
    <div>
      <div className="drive-header">
        <div>
          <div className="page-title">Manage Users</div>
          <div className="page-subtitle">Create TNP Cell staff accounts and manage everyone on the platform.</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : '+ New Staff User'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleCreate}>
            <div className="grid cols-2">
              <div className="form-group">
                <label>Name</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input required type="password" minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="tnp">TNP Cell</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <button className="btn btn-primary">Create User</button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="spinner-text">Loading users...</div>
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Category</th><th></th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className={`badge role-${u.role}`}>{u.role.toUpperCase()}</span></td>
                  <td>{u.category || '—'}</td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(u._id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
