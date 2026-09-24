import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios.js';
import { formatDate } from '../../utils/format.js';

const OUTCOMES = ['APPLIED', 'SHORTLISTED', 'SELECTED', 'REJECTED', 'WITHDRAWN'];

export default function DriveApplications() {
  const { driveId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => { load(); }, [driveId]);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get(`/tnp/drives/${driveId}/applications`);
      setApplications(data.applications);
    } finally {
      setLoading(false);
    }
  }

  async function handleOutcomeChange(applicationId, outcome) {
    setUpdating(applicationId);
    try {
      await api.patch(`/tnp/applications/${applicationId}/outcome`, { outcome });
      load();
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div>
      <Link to="/tnp/drives" style={{ fontSize: '0.85rem' }}>&larr; Back to drives</Link>
      <div className="page-title" style={{ marginTop: 8 }}>Drive Applications</div>
      <div className="page-subtitle">Students who were found eligible and opened the official form. Update outcomes after checking the form / interview results.</div>

      {loading ? (
        <div className="spinner-text">Loading applications...</div>
      ) : applications.length === 0 ? (
        <div className="card empty-state">No students have checked eligibility for this drive yet.</div>
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr><th>Student</th><th>Roll No</th><th>Category</th><th>Checked On</th><th>Outcome</th></tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td>{app.student?.name}<br /><span style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{app.student?.email}</span></td>
                  <td>{app.student?.rollNumber}</td>
                  <td>{app.student?.category}</td>
                  <td>{formatDate(app.createdAt)}</td>
                  <td>
                    <select
                      value={app.outcome}
                      disabled={updating === app._id}
                      onChange={(e) => handleOutcomeChange(app._id, e.target.value)}
                    >
                      {OUTCOMES.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
