import React, { useEffect, useState } from 'react';
import api from '../../api/axios.js';

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tnp/students').then((res) => setStudents(res.data.students)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner-text">Loading students...</div>;

  return (
    <div>
      <div className="page-title">Student Roster</div>
      <div className="page-subtitle">All registered students and their current placement status.</div>

      <div className="card">
        <table>
          <thead>
            <tr><th>Name</th><th>Roll No</th><th>Branch</th><th>Category</th><th>Status</th><th>Offers</th></tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s._id}>
                <td>{s.name}<br /><span style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{s.email}</span></td>
                <td>{s.rollNumber}</td>
                <td>{s.branch}</td>
                <td>{s.category}</td>
                <td>
                  <span className={s.placementStatus === 'ACTIVE' ? 'tag tag-eligible' : 'tag tag-ineligible'}>
                    {s.placementStatus === 'ACTIVE' ? 'Active' : 'AEDP Selected'}
                  </span>
                </td>
                <td>{s.offers?.length || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
