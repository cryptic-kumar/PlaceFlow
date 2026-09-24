import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios.js';
import { bandTagClass, bandLabel, formatDate } from '../../utils/format.js';

const EMPTY_FORM = {
  companyName: '', role: '', ctc: '', location: '', deadline: '',
  placementType: 'NORMAL', description: '', googleFormLink: '',
};

export default function ManageDrives() {
  const [drives, setDrives] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDrives(); }, []);

  async function loadDrives() {
    setLoading(true);
    try {
      const { data } = await api.get('/drives');
      setDrives(data.drives);
    } finally {
      setLoading(false);
    }
  }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    try {
      await api.post('/drives', form);
      setForm(EMPTY_FORM);
      setShowForm(false);
      loadDrives();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create drive.');
    }
  }

  async function togglePublish(id) {
    await api.patch(`/drives/${id}/publish`);
    loadDrives();
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this drive? This cannot be undone.')) return;
    await api.delete(`/drives/${id}`);
    loadDrives();
  }

  return (
    <div>
      <div className="drive-header">
        <div>
          <div className="page-title">Manage Drives</div>
          <div className="page-subtitle">Create placement drives; the band is derived automatically from CTC.</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : '+ New Drive'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleCreate}>
            <div className="grid cols-2">
              <div className="form-group">
                <label>Company Name</label>
                <input required value={form.companyName} onChange={(e) => update('companyName', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Role</label>
                <input required value={form.role} onChange={(e) => update('role', e.target.value)} />
              </div>
              <div className="form-group">
                <label>CTC (LPA)</label>
                <input required type="number" step="0.1" value={form.ctc} onChange={(e) => update('ctc', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input value={form.location} onChange={(e) => update('location', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Application Deadline</label>
                <input required type="date" value={form.deadline} onChange={(e) => update('deadline', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Placement Type</label>
                <select value={form.placementType} onChange={(e) => update('placementType', e.target.value)}>
                  <option value="NORMAL">Normal</option>
                  <option value="PLI">PLI (Placement Linked Internship)</option>
                  <option value="AEDP">AEDP (removes student from season)</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Official Google Form Link</label>
              <input required type="url" value={form.googleFormLink} onChange={(e) => update('googleFormLink', e.target.value)} placeholder="https://forms.gle/..." />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={form.description} onChange={(e) => update('description', e.target.value)} />
            </div>
            <button className="btn btn-primary">Create Drive</button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="spinner-text">Loading drives...</div>
      ) : (
        drives.map((drive) => (
          <div className="card" key={drive._id}>
            <div className="drive-header">
              <div>
                <div style={{ fontWeight: 700 }}>{drive.company?.name} — {drive.role}</div>
                <div className="drive-meta">
                  <span>₹{drive.ctc} LPA</span>
                  <span className={bandTagClass(drive.band)}>{bandLabel(drive.band)}</span>
                  <span>{drive.placementType}</span>
                  <span>Deadline: {formatDate(drive.deadline)}</span>
                  <span className={drive.published ? 'tag tag-eligible' : 'tag tag-ineligible'}>
                    {drive.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Link className="btn btn-secondary btn-sm" to={`/tnp/drives/${drive._id}/applications`}>
                  Applications
                </Link>
                <button className="btn btn-secondary btn-sm" onClick={() => togglePublish(drive._id)}>
                  {drive.published ? 'Unpublish' : 'Publish'}
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(drive._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
