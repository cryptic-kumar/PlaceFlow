import React, { useEffect, useState } from 'react';
import api from '../../api/axios.js';

const BANDS = ['NORMAL', 'DREAM', 'SUPER_DREAM'];
const CATEGORIES = ['CAT1', 'CAT2', 'CAT3'];

export default function PolicyConfig() {
  const [policy, setPolicy] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/admin/policy').then((res) => setPolicy(res.data.policy));
  }, []);

  if (!policy) return <div className="spinner-text">Loading policy...</div>;

  const categoryBandMap = policy.categoryBandMap instanceof Object && !(policy.categoryBandMap instanceof Map)
    ? policy.categoryBandMap
    : Object.fromEntries(policy.categoryBandMap || []);

  function toggleBand(category, band) {
    const current = categoryBandMap[category] || [];
    const next = current.includes(band)
      ? current.filter((b) => b !== band)
      : [...current, band];
    setPolicy({ ...policy, categoryBandMap: { ...categoryBandMap, [category]: next } });
  }

  function updateThreshold(field, value) {
    setPolicy({ ...policy, bandThresholds: { ...policy.bandThresholds, [field]: Number(value) } });
  }

  async function handleSave() {
    setSaving(true);
    setMessage('');
    try {
      const payload = {
        bandThresholds: policy.bandThresholds,
        categoryBandMap: policy.categoryBandMap instanceof Map
          ? Object.fromEntries(policy.categoryBandMap)
          : policy.categoryBandMap,
        oneOfferPerBand: policy.oneOfferPerBand,
      };
      const { data } = await api.put('/admin/policy', payload);
      setPolicy(data.policy);
      setMessage('Policy updated successfully. New rules apply immediately to all future eligibility checks.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to save policy.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="page-title">Eligibility Policy</div>
      <div className="page-subtitle">Configure CTC band thresholds and which categories can apply to which bands. Changes apply platform-wide immediately.</div>

      {message && <div className="alert alert-success">{message}</div>}

      <div className="card">
        <h3 style={{ marginTop: 0 }}>CTC Band Thresholds (LPA)</h3>
        <div className="grid cols-2">
          <div className="form-group">
            <label>Normal / Dream boundary (below this = Normal)</label>
            <input type="number" step="0.1" value={policy.bandThresholds.normalMax}
              onChange={(e) => updateThreshold('normalMax', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Dream / Super Dream boundary (up to this = Dream)</label>
            <input type="number" step="0.1" value={policy.bandThresholds.dreamMax}
              onChange={(e) => updateThreshold('dreamMax', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Category → Band Eligibility</h3>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              {BANDS.map((b) => <th key={b}>{b.replace('_', ' ')}</th>)}
            </tr>
          </thead>
          <tbody>
            {CATEGORIES.map((cat) => (
              <tr key={cat}>
                <td>{cat}</td>
                {BANDS.map((band) => (
                  <td key={band}>
                    <input
                      type="checkbox"
                      checked={(categoryBandMap[cat] || []).includes(band)}
                      onChange={() => toggleBand(cat, band)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: '0.9rem' }}>
          <input
            type="checkbox"
            checked={policy.oneOfferPerBand}
            onChange={(e) => setPolicy({ ...policy, oneOfferPerBand: e.target.checked })}
          />
          Enforce only one accepted offer per band per student
        </label>
      </div>

      <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save Policy'}
      </button>
    </div>
  );
}
