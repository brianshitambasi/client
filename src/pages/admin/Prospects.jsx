import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaSyncAlt, FaUserPlus, FaArrowRight, FaGraduationCap, FaCheckSquare, FaRegSquare, FaTrash, FaUserCheck } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';
import { PROSPECT_STATUSES, SOURCES, LEAD_CATEGORIES, statusMeta, categoryMeta } from '../../utils/constants';

const LIMIT = 15;

export default function Prospects() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState([]);

  const [q, setQ] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [status, setStatus] = useState('');
  const [source, setSource] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: LIMIT };
      if (q) params.q = q;
      if (status) params.status = status;
      if (source) params.source = source;
      if (category) params.category = category;
      if (type) params.type = type;
      const res = await api.get('/admin/prospects', { params });
      setItems(res.data.items || []);
      setTotal(res.data.total || 0);
      setSelected([]); // clear selection on load
    } catch (err) {
      setError((err.response && err.response.data && err.response.data.message) || 'Failed to load prospects.');
    } finally {
      setLoading(false);
    }
  }, [page, q, status, source, category, type]);

  useEffect(() => { load(); }, [load]);

  const submitSearch = (e) => { e.preventDefault(); setPage(1); setQ(searchInput.trim()); };
  const clearFilters = () => { setSearchInput(''); setQ(''); setStatus(''); setSource(''); setCategory(''); setType(''); setPage(1); };

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  const toggleAll = () => {
    if (selected.length === items.length) setSelected([]);
    else setSelected(items.map(i => i._id));
  };

  const bulkUpdateStatus = async (newStatus) => {
    if (!newStatus || selected.length === 0) return;
    if (!window.confirm(`Update ${selected.length} prospects to "${statusMeta(newStatus).label}"?`)) return;
    setLoading(true);
    try {
      await Promise.all(selected.map(id => api.patch(`/admin/prospects/${id}`, { status: newStatus })));
      await load();
    } catch (err) { alert('Bulk update failed.'); }
  };

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));
  const allSelected = items.length > 0 && selected.length === items.length;

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h3 className="fw-bold mb-0">Prospects</h3>
          <p className="text-muted small mb-0">{total} total · page {page} of {totalPages}</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary btn-sm" onClick={() => navigate('/admin/prospects/new')}>
            <FaUserPlus className="me-2" /> Add Prospect
          </button>
          <button className="btn btn-outline-secondary btn-sm" onClick={load} disabled={loading}>
            <FaSyncAlt className={loading ? 'fa-spin' : ''} />
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {selected.length > 0 && (
        <div className="alert alert-primary d-flex align-items-center justify-content-between mb-3 animate__animated animate__fadeIn">
          <span><strong>{selected.length}</strong> prospects selected</span>
          <div className="d-flex gap-2">
            <select className="form-select form-select-sm w-auto" onChange={(e) => { bulkUpdateStatus(e.target.value); e.target.value=''; }}>
              <option value="">Bulk change status...</option>
              {PROSPECT_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>
      )}

      <div className="yt-card mb-4">
        <form className="row g-3 align-items-end" onSubmit={submitSearch}>
          <div className="col-md-4">
            <label className="form-label small fw-semibold">Search</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0"><FaSearch /></span>
              <input type="text" className="form-control border-start-0 ps-0" placeholder="Name, email, phone" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
              <button className="btn btn-primary" type="submit">Search</button>
            </div>
          </div>
          <div className="col-md-2">
            <select className="form-select" value={type} onChange={(e) => { setType(e.target.value); setPage(1); }}>
              <option value="">All Types</option>
              <option value="general">General</option>
              <option value="student">Student</option>
            </select>
          </div>
          <div className="col-md-2">
            <select className="form-select" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
              <option value="">All Statuses</option>
              {PROSPECT_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <select className="form-select" value={source} onChange={(e) => { setSource(e.target.value); setPage(1); }}>
              <option value="">All Sources</option>
              {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <button type="button" className="btn btn-outline-secondary w-100" onClick={clearFilters}>Clear</button>
          </div>
        </form>
      </div>

      <div className="yt-card p-0 overflow-hidden">
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-5">
            <FaUserPlus style={{ fontSize: '2rem', color: '#adb5bd' }} className="mb-3" />
            <h5 className="fw-bold">No prospects found</h5>
            <p className="text-muted small mb-0">Try adjusting your filters or add a prospect manually.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle mb-0 text-nowrap">
              <thead className="table-light">
                <tr>
                  <th style={{ width: 40 }} className="text-center">
                    <span role="button" onClick={toggleAll} className="text-muted">
                      {allSelected ? <FaCheckSquare className="text-primary" /> : <FaRegSquare />}
                    </span>
                  </th>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Category</th>
                  <th>Submitted</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => {
                  const isSel = selected.includes(p._id);
                  const sMeta = statusMeta(p.status);
                  const cMeta = categoryMeta(p.leadCategory);
                  const isStudent = p.prospectType === 'student';
                  return (
                    <tr key={p._id} className={isSel ? 'table-primary' : ''}>
                      <td className="text-center">
                        <span role="button" onClick={() => toggleSelect(p._id)} className="text-muted">
                          {isSel ? <FaCheckSquare className="text-primary" /> : <FaRegSquare />}
                        </span>
                      </td>
                      <td>
                        <Link to={`/admin/prospects/${p._id}`} className="fw-semibold text-body text-decoration-none d-block">{p.fullName}</Link>
                        <div className="small text-muted">{isStudent ? (p.studentInfo?.school || 'Student') : (p.country || '—')}</div>
                      </td>
                      <td className="small">
                        <div>{p.email}</div>
                        <div className="text-muted">{p.whatsapp}</div>
                      </td>
                      <td>{isStudent ? <span className="badge bg-info text-dark"><FaGraduationCap /> Student</span> : <span className="badge bg-light text-dark border">General</span>}</td>
                      <td><span className={`badge bg-${sMeta.color}`}>{sMeta.label}</span></td>
                      <td><span className={`badge bg-${cMeta.color}`}>{cMeta.label}</span></td>
                      <td className="small text-muted">{new Date(p.submittedAt).toLocaleDateString()}</td>
                      <td><Link to={`/admin/prospects/${p._id}`} className="btn btn-sm btn-outline-primary">Open</Link></td>
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
            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}><button className="page-link" onClick={() => setPage(p => p - 1)}>Prev</button></li>
            <li className="page-item disabled"><span className="page-link text-body">{page} / {totalPages}</span></li>
            <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}><button className="page-link" onClick={() => setPage(p => p + 1)}>Next</button></li>
          </ul>
        </nav>
      )}
    </AdminLayout>
  );
}
