import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUsers,
  FaUserPlus,
  FaFire,
  FaCalendarCheck,
  FaInstagram,
  FaTiktok,
  FaFacebook,
  FaWhatsapp,
  FaSyncAlt, FaDownload
} from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';
import { downloadBackup } from '../../utils/backupDownload';

const SOURCE_ICONS = {
  instagram: <FaInstagram />,
  tiktok: <FaTiktok />,
  facebook: <FaFacebook />,
  whatsapp: <FaWhatsapp />
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [dueToday, setDueToday] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [s, r, d] = await Promise.all([
        api.get('/admin/dashboard/stats'),
        api.get('/admin/dashboard/recent'),
        api.get('/admin/dashboard/due-today')
      ]);
      setStats(s.data.stats);
      setRecent(r.data.items);
      setDueToday(d.data.items);
    } catch (err) {
      setError(
        (err.response && err.response.data && err.response.data.message) ||
          'Failed to load dashboard.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h3 className="fw-bold mb-0">Dashboard</h3>
          <p className="text-muted small mb-0">Overview of your prospect pipeline</p>
        </div>
        <button className="btn btn-outline-primary btn-sm" onClick={load} disabled={loading}>
          <FaSyncAlt className={loading ? 'fa-spin me-2' : 'me-2'} /> Refresh
        </button>
          <button className="btn btn-outline-success btn-sm" onClick={downloadBackup}>
            <FaDownload className="me-2" /> Backup
          </button>
          <button className="btn btn-outline-success btn-sm" onClick={downloadBackup}>
            <FaDownload className="me-2" /> Backup
          </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3 mb-4">
        {[
          { label: 'Total prospects', value: stats?.totalProspects ?? '-', icon: <FaUsers />, color: '#0d6efd' },
          { label: 'New prospects', value: stats?.newProspects ?? '-', icon: <FaUserPlus />, color: '#198754' },
          { label: 'High interest', value: stats?.highInterest ?? '-', icon: <FaFire />, color: '#dc3545' },
          { label: 'Follow-ups due today', value: stats?.followUpsDueToday ?? '-', icon: <FaCalendarCheck />, color: '#fd7e14' }
        ].map((s, i) => (
          <div className="col-6 col-lg-3" key={i}>
            <div className="yt-card" style={{ padding: '1.25rem' }}>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted small mb-1">{s.label}</p>
                  <div className="yt-stat">{s.value}</div>
                </div>
                <div
                  className="yt-card-icon mb-0"
                  style={{ background: `${s.color}1a`, color: s.color, width: 42, height: 42, fontSize: '1rem' }}
                >
                  {s.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="yt-card h-100">
            <h5 className="fw-bold mb-3">Prospects by source</h5>
            {!stats || Object.keys(stats.bySource || {}).length === 0 ? (
              <p className="text-muted small mb-0">No sources recorded yet.</p>
            ) : (
              <ul className="list-unstyled mb-0">
                {Object.entries(stats.bySource).map(([src, count]) => (
                  <li key={src} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                    <span className="text-capitalize d-flex align-items-center gap-2">
                      {SOURCE_ICONS[src] || null} {src}
                    </span>
                    <span className="badge bg-primary">{count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="col-lg-7">
          <div className="yt-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Follow-ups due today</h5>
              <Link to="/admin/followups" className="small">View all</Link>
            </div>
            {dueToday.length === 0 ? (
              <p className="text-muted small mb-0">Nothing due today.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-sm align-middle mb-0">
                  <thead>
                    <tr className="text-muted small">
                      <th>Prospect</th>
                      <th>Reason</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dueToday.map((f) => (
                      <tr key={f._id}>
                        <td>
                          <Link to={`/admin/prospects/${f.prospect?._id}`}>
                            {f.prospect?.fullName || 'Unknown'}
                          </Link>
                        </td>
                        <td className="small text-muted">{f.reason || '-'}</td>
                        <td>
                          <span className="badge bg-warning text-dark">{f.prospect?.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="col-12">
          <div className="yt-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Recent submissions</h5>
              <Link to="/admin/prospects" className="small">View all</Link>
            </div>
            {recent.length === 0 ? (
              <p className="text-muted small mb-0">No prospects yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr className="text-muted small">
                      <th>Name</th>
                      <th>Email</th>
                      <th>Source</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((p) => (
                      <tr key={p._id}>
                        <td>
                          <Link to={`/admin/prospects/${p._id}`} className="fw-semibold">
                            {p.fullName}
                          </Link>
                        </td>
                        <td className="small text-muted">{p.email}</td>
                        <td className="text-capitalize small">{p.source}</td>
                        <td><span className="badge bg-secondary">{p.leadCategory}</span></td>
                        <td><span className="badge bg-primary">{p.status}</span></td>
                        <td className="small text-muted">
                          {new Date(p.submittedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
