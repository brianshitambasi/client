import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCheck, FaCalendarCheck, FaSyncAlt, FaClock } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';
import { statusMeta } from '../../utils/constants';

function FollowUpTable({ rows, onComplete, emptyText }) {
  if (!rows || rows.length === 0) {
    return <p className="text-muted small mb-0">{emptyText}</p>;
  }
  return (
    <div className="table-responsive">
      <table className="table align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th>Due</th>
            <th>Prospect</th>
            <th>Reason</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((f) => {
            const p = f.prospect || {};
            const sMeta = statusMeta(p.status);
            return (
              <tr key={f._id}>
                <td className="small">
                  {new Date(f.dueDate).toLocaleDateString()}
                </td>
                <td>
                  {p._id ? (
                    <Link to={`/admin/prospects/${p._id}`} className="fw-semibold">
                      {p.fullName || 'Unknown'}
                    </Link>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                  {p.email && <div className="small text-muted">{p.email}</div>}
                </td>
                <td className="small">{f.reason || '—'}</td>
                <td>
                  <span className={`badge bg-${sMeta.color}`}>{sMeta.label}</span>
                </td>
                <td className="text-end">
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() => onComplete(f._id)}
                  >
                    <FaCheck className="me-1" /> Complete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function FollowUps() {
  const [dueToday, setDueToday] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [d, u] = await Promise.all([
        api.get('/admin/dashboard/due-today'),
        api.get('/admin/dashboard/upcoming')
      ]);
      setDueToday(d.data.items || []);
      setUpcoming(u.data.items || []);
    } catch (err) {
      setError(
        (err.response && err.response.data && err.response.data.message) ||
          'Failed to load follow-ups.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const complete = async (id) => {
    try {
      await api.patch(`/admin/followups/${id}`, {});
      await load();
    } catch (err) {
      alert('Failed to complete follow-up.');
    }
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h3 className="fw-bold mb-0">Follow-ups</h3>
          <p className="text-muted small mb-0">
            Scheduled actions across all prospects
          </p>
        </div>
        <button className="btn btn-outline-primary btn-sm" onClick={load} disabled={loading}>
          <FaSyncAlt className={loading ? 'fa-spin me-2' : 'me-2'} /> Refresh
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : (
        <>
          <div className="yt-card mb-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <FaCalendarCheck className="text-warning" />
              <h5 className="fw-bold mb-0">Due today</h5>
              {dueToday.length > 0 && (
                <span className="badge bg-warning text-dark ms-2">
                  {dueToday.length}
                </span>
              )}
            </div>
            <FollowUpTable
              rows={dueToday}
              onComplete={complete}
              emptyText="Nothing due today."
            />
          </div>

          <div className="yt-card">
            <div className="d-flex align-items-center gap-2 mb-3">
              <FaClock className="text-primary" />
              <h5 className="fw-bold mb-0">Upcoming (next 7 days)</h5>
              {upcoming.length > 0 && (
                <span className="badge bg-primary ms-2">{upcoming.length}</span>
              )}
            </div>
            <FollowUpTable
              rows={upcoming}
              onComplete={complete}
              emptyText="No upcoming follow-ups scheduled."
            />
          </div>
        </>
      )}
    </AdminLayout>
  );
}
