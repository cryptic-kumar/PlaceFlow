import React, { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import { bandTagClass, bandLabel, formatDate } from '../../utils/format.js';

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/student/dashboard')
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner-text">Loading your dashboard...</div>;
  if (!data) return null;

  const { profile, offers, placementStatus, applications } = data;

  return (
    <div>
      <div className="page-title">My Dashboard</div>
      <div className="page-subtitle">Your profile, offers and placement application history.</div>

      {placementStatus === 'AEDP_SELECTED' && (
        <div className="alert alert-warning">
          You have been selected under the AEDP program and are no longer active for further placements this season.
        </div>
      )}

      <div className="grid cols-3">
        <div className="stat-card">
          <div className="stat-value">{profile.category}</div>
          <div className="stat-label">Placement Category</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{offers.length}</div>
          <div className="stat-label">Offers Recorded</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{placementStatus === 'ACTIVE' ? 'Active' : 'Inactive'}</div>
          <div className="stat-label">Season Status</div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Profile</h3>
        <div className="grid cols-2">
          <div><strong>Name:</strong> {profile.name}</div>
          <div><strong>Roll No:</strong> {profile.rollNumber}</div>
          <div><strong>Branch:</strong> {profile.branch}</div>
          <div><strong>Email:</strong> {profile.email}</div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>My Offers</h3>
        {offers.length === 0 ? (
          <p style={{ color: 'var(--muted)' }}>No offers recorded yet.</p>
        ) : (
          <table>
            <thead>
              <tr><th>Company</th><th>Band</th><th>Type</th><th>CTC</th><th>Status</th></tr>
            </thead>
            <tbody>
              {offers.map((o, i) => (
                <tr key={i}>
                  <td>{o.company}</td>
                  <td><span className={bandTagClass(o.band)}>{bandLabel(o.band)}</span></td>
                  <td>{o.placementType}</td>
                  <td>₹{o.ctc} LPA</td>
                  <td>{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Application History</h3>
        {applications.length === 0 ? (
          <p style={{ color: 'var(--muted)' }}>You haven't opened any application forms yet.</p>
        ) : (
          <table>
            <thead>
              <tr><th>Company</th><th>Role</th><th>Outcome</th><th>Checked On</th></tr>
            </thead>
            <tbody>
              {applications.map((a) => (
                <tr key={a._id}>
                  <td>{a.drive?.company?.name}</td>
                  <td>{a.drive?.role}</td>
                  <td>{a.outcome}</td>
                  <td>{formatDate(a.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
