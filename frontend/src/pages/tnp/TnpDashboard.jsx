import React, { useEffect, useState } from 'react';
import api from '../../api/axios.js';

export default function TnpDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/tnp/analytics').then((res) => setStats(res.data));
  }, []);

  if (!stats) return <div className="spinner-text">Loading analytics...</div>;

  const bandCount = (band) => stats.offerStats.find((o) => o._id === band)?.count || 0;
  const catCount = (cat) => stats.categoryBreakdown.find((c) => c._id === cat)?.count || 0;

  return (
    <div>
      <div className="page-title">TNP Cell Dashboard</div>
      <div className="page-subtitle">Real-time overview of the placement season.</div>

      <div className="grid cols-4">
        <div className="stat-card"><div className="stat-value">{stats.totalStudents}</div><div className="stat-label">Total Students</div></div>
        <div className="stat-card"><div className="stat-value">{stats.publishedDrives}/{stats.totalDrives}</div><div className="stat-label">Published Drives</div></div>
        <div className="stat-card"><div className="stat-value">{stats.aedpCount}</div><div className="stat-label">AEDP Selections</div></div>
        <div className="stat-card"><div className="stat-value">
          {stats.offerStats.reduce((sum, o) => sum + o.count, 0)}
        </div><div className="stat-label">Offers Accepted</div></div>
      </div>

      <div className="grid cols-2">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Students by Category</h3>
          <table>
            <thead><tr><th>Category</th><th>Count</th></tr></thead>
            <tbody>
              <tr><td>CAT 1</td><td>{catCount('CAT1')}</td></tr>
              <tr><td>CAT 2</td><td>{catCount('CAT2')}</td></tr>
              <tr><td>CAT 3</td><td>{catCount('CAT3')}</td></tr>
            </tbody>
          </table>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Accepted Offers by Band</h3>
          <table>
            <thead><tr><th>Band</th><th>Count</th></tr></thead>
            <tbody>
              <tr><td>Normal</td><td>{bandCount('NORMAL')}</td></tr>
              <tr><td>Dream</td><td>{bandCount('DREAM')}</td></tr>
              <tr><td>Super Dream</td><td>{bandCount('SUPER_DREAM')}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
