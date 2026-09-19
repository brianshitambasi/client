import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaSyncAlt, FaUserPlus, FaArrowRight } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';
import {
  PROSPECT_STATUSES,
  SOURCES,
  LEAD_CATEGORIES,
  statusMeta,
  categoryMeta
} from '../../utils/constants';

const LIMIT = 15;

export default function Prospects() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [q, setQ] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [status, setStatus] = useState('');
  const [source, setSource] = useState('');
  const [category, setCategory] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: LIMIT };
      if (q) params.q = q;
      if (status) params.status = status;
      if (source) params.source = source;
      if (category) params.category = category;
      const res = await api.get('/admin/prospects', { params });
      setItems(res.data.items || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      setError(
        (err.response && err.response.data && err.response.data.message) ||
          'Failed to load prospects.'
      );
    } finally {
      setLoading(false);
    }
  }, [page, q, status, source, category]);

  useEffect(() => { load(); }, [load]);

  const submitSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setQ(searchInput.trim());
  };

  const clearFilters = () => {
    setSearchInput('');
    setQ('');
    setStatus('');
    setSource('');
    setCategory('');
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h3 className="fw-bold mb-0">Prospects</h3>
          <p className="text-muted small mb-0">
            {total} total · page {page} of {totalPages}
          </p>
        </div>
        <button className="btn btn-outline-primary btn-sm" onClick={load} disabled={loading}>
          <FaSyncAlt className={loading ? 'fa-spin me-2' : 'me-2'} /> Refresh
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="yt-card mb-4">
        <form className="row g-3 align-items-end" onSubmit={submitSearch}>
          <div className="col-md-4">
            <label className="form-label small fw-semibold">Search</label>
            <div className="input-group">
              <span className="input-group-text bg-white"><FaSearch /></span>
              <input
                type="text"
                className="form-control"
                placeholder="Name, email, WhatsApp"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">Search</button>
            </div>
          </div>
          <div className="col-md-2">
            <label className="form-label small fw-semibold">Status</label>
            <select className="form-select" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
              <option value="">All</option>
              {PROSPECT_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label small fw-semibold">Source</label>
            <select className="form-select" value={source} onChange={(e) => { setSource(e.target.value); setPage(1); }}>
              <option value="">All</option>
              {SOURCES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label small fw-semibold">Category</label>
            <select className="form-select" value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
              <option value="">All</option>
              {LEAD_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <button type="button" className="btn btn-outline-secondary w-100" onClick={clearFilters}>
              Clear
            </button>
          </div>
        </form>
      </div>

      <div className="yt-card p-0">
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-5">
            <FaUserPlus style={{ fontSize: '2rem', color: '#adb5bd' }} className="mb-3" />
            <h5 className="fw-bold">No prospects match your filters</h5>
            <p className="text-muted small mb-0">
              New submissions from the public qualification form will appear here.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Source</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => {
                  const sMeta = statusMeta(p.status);
                  const cMeta = categoryMeta(p.leadCategory);
                  return (
                    <tr key={p._id}>
                      <td>
                        <Link to={`/admin/prospects/${p._id}`} className="fw-semibold">
                          {p.fullName}
                        </Link>
                        <div className="small text-muted">{p.country || '—'}</div>
                      </td>
                      <td className="small">
                        <div>{p.email}</div>
                        <div className="text-muted">{p.whatsapp}</div>
                      </td>
                      <td className="small text-capitalize">{p.source}</td>
                      <td>
                        <span className={`badge bg-${cMeta.color}`}>{cMeta.label}</span>
                      </td>
                      <td>
                        <span className={`badge bg-${sMeta.color}`}>{sMeta.label}</span>
                      </td>
                      <td className="small text-muted">
                        {new Date(p.submittedAt).toLocaleDateString()}
                      </td>
                      <td>
                        <Link
                          to={`/admin/prospects/${p._id}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          Open <FaArrowRight className="ms-1" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <nav className="mt-3 d-flex justify-content-center">
          <ul className="pagination mb-0">
            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setPage((p) => Math.max(1, p - 1))}>
                Previous
              </button>
            </li>
            <li className="page-item disabled">
              <span className="page-link">Page {page} / {totalPages}</span>
            </li>
            <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </AdminLayout>
  );
}
