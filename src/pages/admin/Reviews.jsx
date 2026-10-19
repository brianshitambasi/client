import React, { useEffect, useState } from 'react';
import { FaSyncAlt, FaCheck, FaTimes, FaTrash, FaStar, FaRegStar } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';

const TABS = [
  { key: '', label: 'All' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'APPROVED', label: 'Approved' },
  { key: 'REJECTED', label: 'Rejected' }
];

function Stars({ value }) {
  return (
    <span className="d-inline-flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} style={{ fontSize: '0.85rem' }}>
          {n <= value ? <FaStar className="text-warning" /> : <FaRegStar className="text-secondary" />}
        </span>
      ))}
    </span>
  );
}

export default function AdminReviews() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (tab) params.status = tab;
      const res = await api.get('/admin/reviews', { params });
      setItems(res.data.items || []);
    } catch (err) {
      setError((err.response && err.response.data && err.response.data.message) || 'Failed to load reviews.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [tab]);

  const setStatus = async (id, status) => {
    try {
      await api.patch(`/admin/reviews/${id}`, { status });
      await load();
    } catch (err) {
      alert('Update failed.');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this review permanently?')) return;
    try {
      await api.delete(`/admin/reviews/${id}`);
      await load();
    } catch (err) {
      alert('Delete failed.');
    }
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h3 className="fw-bold mb-0">Reviews</h3>
          <p className="text-muted small mb-0">Moderate product reviews before they go public</p>
        </div>
        <button className="btn btn-outline-primary btn-sm" onClick={load} disabled={loading}>
          <FaSyncAlt className={loading ? 'fa-spin me-2' : 'me-2'} /> Refresh
        </button>
      </div>

      <div className="d-flex gap-2 mb-3 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`btn btn-sm ${tab === t.key ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : items.length === 0 ? (
        <div className="yt-card text-center py-5">
          <h5 className="fw-bold">No reviews</h5>
          <p className="text-muted small mb-0">Reviews will appear here once submitted.</p>
        </div>
      ) : (
        <div className="row g-3">
          {items.map((r) => (
            <div key={r._id} className="col-md-6">
              <div className="yt-card h-100">
                <div className="d-flex justify-content-between mb-2">
                  <div>
                    <strong>{r.name}</strong>
                    <div className="small text-muted">{r.email}</div>
                  </div>
                  <span className={`badge ${
                    r.status === 'APPROVED' ? 'bg-success' :
                    r.status === 'REJECTED' ? 'bg-secondary' : 'bg-warning text-dark'
                  }`}>{r.status}</span>
                </div>

                <div className="mb-2"><Stars value={r.rating} /></div>
                <div className="small text-muted mb-3" style={{ whiteSpace: 'pre-wrap' }}>{r.text}</div>
                <div className="small text-muted mb-3">
                  Product: <strong>{r.product?.name || '—'}</strong>
                </div>

                <div className="d-flex gap-2 flex-wrap">
                  {r.status !== 'APPROVED' && (
                    <button className="btn btn-sm btn-success" onClick={() => setStatus(r._id, 'APPROVED')}>
                      <FaCheck className="me-1" /> Approve
                    </button>
                  )}
                  {r.status !== 'REJECTED' && (
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => setStatus(r._id, 'REJECTED')}>
                      <FaTimes className="me-1" /> Reject
                    </button>
                  )}
                  <button className="btn btn-sm btn-outline-danger ms-auto" onClick={() => remove(r._id)}>
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
