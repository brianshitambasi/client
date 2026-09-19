import React, { useEffect, useState } from 'react';
import {
  FaSyncAlt,
  FaInstagram,
  FaTiktok,
  FaFacebook,
  FaWhatsapp,
  FaLink,
  FaGlobe
} from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';

const SOURCE_META = {
  instagram: { icon: <FaInstagram />, color: '#E1306C' },
  tiktok: { icon: <FaTiktok />, color: '#000000' },
  facebook: { icon: <FaFacebook />, color: '#1877F2' },
  whatsapp: { icon: <FaWhatsapp />, color: '#25D366' },
  direct: { icon: <FaGlobe />, color: '#0d6efd' },
  referral: { icon: <FaLink />, color: '#6c757d' },
  other: { icon: <FaLink />, color: '#adb5bd' }
};

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [s, a] = await Promise.all([
        api.get('/admin/dashboard/stats'),
        api.get('/admin/analytics/sources')
      ]);
      setStats(s.data.stats);
      setSources(a.data.items || []);
    } catch (err) {
      setError(
        (err.response && err.response.data && err.response.data.message) ||
          'Failed to load analytics.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const total = sources.reduce((sum, s) => sum + s.count, 0);

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h3 className="fw-bold mb-0">Analytics</h3>
          <p className="text-muted small mb-0">Where your prospects come from</p>
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
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div className="yt-card">
                <p className="text-muted small mb-1">Total prospects</p>
                <div className="yt-stat">{stats?.totalProspects ?? 0}</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="yt-card">
                <p className="text-muted small mb-1">High interest</p>
                <div className="yt-stat">{stats?.highInterest ?? 0}</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="yt-card">
                <p className="text-muted small mb-1">New</p>
                <div className="yt-stat">{stats?.newProspects ?? 0}</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="yt-card">
                <p className="text-muted small mb-1">Follow-ups due today</p>
                <div className="yt-stat">{stats?.followUpsDueToday ?? 0}</div>
              </div>
            </div>
          </div>

          <div className="yt-card">
            <h5 className="fw-bold mb-3">Prospects by source</h5>

            {sources.length === 0 ? (
              <p className="text-muted small mb-0">
                No prospects yet — nothing to analyse.
              </p>
            ) : (
              <>
                {sources.map((s) => {
                  const meta = SOURCE_META[s.source] || SOURCE_META.other;
                  const pct = total > 0 ? Math.round((s.count / total) * 100) : 0;
                  return (
                    <div key={s.source} className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="d-flex align-items-center gap-2 text-capitalize">
                          <span style={{ color: meta.color, fontSize: '1.05rem' }}>
                            {meta.icon}
                          </span>
                          <span className="fw-semibold">{s.source}</span>
                        </span>
                        <span className="small text-muted">
                          <strong className="text-dark">{s.count}</strong> · {pct}%
                        </span>
                      </div>
                      <div className="progress" style={{ height: 10, borderRadius: 999 }}>
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{
                            width: `${pct}%`,
                            background: meta.color
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
                <hr className="my-3" />
                <div className="d-flex justify-content-between small">
                  <span className="text-muted">Total recorded</span>
                  <strong>{total}</strong>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
}
