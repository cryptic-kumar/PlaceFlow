import React, { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import { bandTagClass, bandLabel, formatDate } from '../../utils/format.js';

export default function DriveList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDrives();
  }, []);

  async function loadDrives() {
    setLoading(true);
    try {
      const { data } = await api.get('/student/drives');
      setItems(data.drives);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load drives.');
    } finally {
      setLoading(false);
    }
  }

  async function handleOpenForm(driveId) {
    setChecking(driveId);
    setError('');
    try {
      const { data } = await api.get(`/student/drives/${driveId}/eligibility`);
      if (data.eligibility.eligible && data.googleFormLink) {
        window.open(data.googleFormLink, '_blank', 'noopener,noreferrer');
      } else {
        setError(data.eligibility.reason);
      }
      loadDrives();
    } catch (err) {
      setError(err.response?.data?.message || 'Eligibility check failed.');
    } finally {
      setChecking(null);
    }
  }

  if (loading) return <div className="spinner-text">Loading available drives...</div>;

  return (
    <div>
      <div className="page-title">Placement Drives</div>
      <div className="page-subtitle">Every opportunity currently published by the TNP Cell, with your live eligibility.</div>

      {error && <div className="alert alert-danger">{error}</div>}

      {items.length === 0 && (
        <div className="card empty-state">No drives have been published yet. Check back soon.</div>
      )}

      {items.map(({ drive, eligibility }) => (
        <div className="card" key={drive._id}>
          <div className="drive-header">
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>
                {drive.company?.name} — {drive.role}
              </div>
              <div className="drive-meta">
                <span>₹{drive.ctc} LPA</span>
                <span className={bandTagClass(drive.band)}>{bandLabel(drive.band)}</span>
                <span>{drive.location}</span>
                <span>Deadline: {formatDate(drive.deadline)}</span>
                <span className="tag" style={{ background: '#eef0f6', color: 'var(--muted)' }}>
                  {drive.placementType}
                </span>
              </div>
              {drive.description && (
                <p style={{ marginTop: 10, color: 'var(--muted)', fontSize: '0.9rem' }}>{drive.description}</p>
              )}
            </div>

            <div style={{ textAlign: 'right', minWidth: 200 }}>
              <span className={eligibility.eligible ? 'tag tag-eligible' : 'tag tag-ineligible'}>
                {eligibility.eligible ? '✅ Eligible' : '❌ Not Eligible'}
              </span>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 6, maxWidth: 220 }}>
                {eligibility.reason}
              </div>
              <button
                className="btn btn-primary btn-sm"
                style={{ marginTop: 10 }}
                disabled={!eligibility.eligible || checking === drive._id}
                onClick={() => handleOpenForm(drive._id)}
              >
                {checking === drive._id ? 'Checking...' : 'Open Official Google Form'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
