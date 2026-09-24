import React, { useEffect, useState } from 'react';
import api from '../../api/axios.js';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/tnp/analytics').then((res) => setStats(res.data));
  }, []);

  if (!stats) return <div className="spinner-text">Loading analytics...</div>;

  return (
    <div>
      <div className="page-title">Admin Dashboard</div>
      <div className="page-subtitle">System-wide placement analytics and governance controls.</div>

      <div className="grid cols-4">
        <div className="stat-card"><div className="stat-value">{stats.totalStudents}</div><div className="stat-label">Total Students</div></div>
        <div className="stat-card"><div className="stat-value">{stats.totalDrives}</div><div className="stat-label">Total Drives</div></div>
        <div className="stat-card"><div className="stat-value">{stats.publishedDrives}</div><div className="stat-label">Published Drives</div></div>
        <div className="stat-card"><div className="stat-value">{stats.aedpCount}</div><div className="stat-label">AEDP Selections</div></div>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Quick Links</h3>
        <p style={{ color: 'var(--muted)' }}>
          Use <strong>Policy</strong> to configure category eligibility rules and CTC band thresholds.
          Use <strong>Users</strong> to create TNP Cell staff accounts and manage all platform users.
        </p>
      </div>
    </div>
  );
}
