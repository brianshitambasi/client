import React, { useEffect, useState, useCallback } from 'react';
import { FaSyncAlt, FaChartPie, FaChartBar, FaChartLine, FaUsers } from 'react-icons/fa';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Filler
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';
import { statusMeta, categoryMeta } from '../../utils/constants';

ChartJS.register(
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, Title, Filler
);

const SOURCE_COLORS = {
  instagram: '#E1306C',
  tiktok: '#000000',
  facebook: '#1877F2',
  whatsapp: '#25D366',
  direct: '#0d6efd',
  referral: '#6c757d',
  other: '#adb5bd'
};

const PALETTE = ['#0d6efd', '#198754', '#dc3545', '#fd7e14', '#6f42c1', '#20c997', '#6c757d', '#d63384'];

function StatCard({ label, value, color }) {
  return (
    <div className="yt-card" style={{ padding: '1.25rem' }}>
      <p className="text-muted small mb-1">{label}</p>
      <div className="yt-stat" style={{ color: color || undefined }}>{value}</div>
    </div>
  );
}

export default function Analytics() {
  const [data, setData] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [overviewRes, referralsRes] = await Promise.all([
        api.get('/admin/analytics/overview'),
        api.get('/admin/analytics/referrals')
      ]);
      setData(overviewRes.data);
      setReferrals(referralsRes.data.items || []);
    } catch (err) {
      setError(
        (err.response && err.response.data && err.response.data.message) ||
          'Failed to load analytics.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading && !data) {
    return (
      <AdminLayout>
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      </AdminLayout>
    );
  }

  const total = data?.total || 0;
  const bySource = data?.bySource || [];
  const byStatus = data?.byStatus || [];
  const byCategory = data?.byCategory || [];
  const byType = data?.byType || [];
  const daily = data?.daily || [];

  const highInterest = (byCategory.find((c) => c.key === 'HIGH_INTEREST') || {}).count || 0;
  const newCount = (byStatus.find((s) => s.key === 'NEW') || {}).count || 0;

  const sourceChart = {
    labels: bySource.map((r) => r.key),
    datasets: [
      {
        data: bySource.map((r) => r.count),
        backgroundColor: bySource.map((r, i) => SOURCE_COLORS[r.key] || PALETTE[i % PALETTE.length]),
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const statusChart = {
    labels: byStatus.map((r) => statusMeta(r.key).label),
    datasets: [
      {
        label: 'Prospects',
        data: byStatus.map((r) => r.count),
        backgroundColor: byStatus.map((r, i) => PALETTE[i % PALETTE.length]),
        borderRadius: 8
      }
    ]
  };

  const categoryChart = {
    labels: byCategory.map((r) => categoryMeta(r.key).label),
    datasets: [
      {
        label: 'Prospects',
        data: byCategory.map((r) => r.count),
        backgroundColor: ['#dc3545', '#ffc107', '#0dcaf0', '#adb5bd'],
        borderRadius: 8
      }
    ]
  };

  const dailyChart = {
    labels: daily.map((d) => d.date.slice(5)),
    datasets: [
      {
        label: 'Submissions',
        data: daily.map((d) => d.count),
        borderColor: '#0d6efd',
        backgroundColor: 'rgba(13,110,253,0.15)',
        fill: true,
        tension: 0.35,
        pointRadius: 3,
        pointBackgroundColor: '#0d6efd'
      }
    ]
  };

  const barOpts = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
  };

  const lineOpts = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
  };

  const doughnutOpts = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 12, padding: 12 } }
    },
    cutout: '62%'
  };

  const studentCount = (byType.find((t) => t.key === 'student') || {}).count || 0;
  const generalCount = total - studentCount;

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h3 className="fw-bold mb-0">Analytics</h3>
          <p className="text-muted small mb-0">Where your prospects come from and how they progress</p>
        </div>
        <button className="btn btn-outline-primary btn-sm" onClick={load} disabled={loading}>
          <FaSyncAlt className={loading ? 'fa-spin me-2' : 'me-2'} /> Refresh
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3"><StatCard label="Total prospects" value={total} /></div>
        <div className="col-6 col-lg-3"><StatCard label="High interest" value={highInterest} color="#dc3545" /></div>
        <div className="col-6 col-lg-3"><StatCard label="New" value={newCount} color="#0d6efd" /></div>
        <div className="col-6 col-lg-3">
          <StatCard label="Students / General" value={`${studentCount} / ${generalCount}`} color="#198754" />
        </div>
      </div>

      {total === 0 ? (
        <div className="yt-card text-center py-5">
          <FaChartBar style={{ fontSize: '2rem', color: '#adb5bd' }} className="mb-3" />
          <h5 className="fw-bold">No data yet</h5>
          <p className="text-muted small mb-0">Charts will populate once you have prospects.</p>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-5">
            <div className="yt-card h-100">
              <div className="d-flex align-items-center gap-2 mb-3">
                <FaChartPie className="text-primary" />
                <h5 className="fw-bold mb-0">Prospects by source</h5>
              </div>
              <div style={{ maxHeight: 320 }}>
                <Doughnut data={sourceChart} options={doughnutOpts} />
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="yt-card h-100">
              <div className="d-flex align-items-center gap-2 mb-3">
                <FaChartLine className="text-primary" />
                <h5 className="fw-bold mb-0">Submissions — last 14 days</h5>
              </div>
              <div style={{ maxHeight: 320 }}>
                <Line data={dailyChart} options={lineOpts} />
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="yt-card h-100">
              <div className="d-flex align-items-center gap-2 mb-3">
                <FaChartBar className="text-primary" />
                <h5 className="fw-bold mb-0">Prospects by status</h5>
              </div>
              <Bar data={statusChart} options={barOpts} />
            </div>
          </div>

          <div className="col-lg-6">
            <div className="yt-card h-100">
              <div className="d-flex align-items-center gap-2 mb-3">
                <FaChartBar className="text-primary" />
                <h5 className="fw-bold mb-0">Prospects by category</h5>
              </div>
              <Bar data={categoryChart} options={barOpts} />
            </div>
          </div>

          {/* NEW: Referral Leaderboard */}
          <div className="col-12 mt-4">
            <div className="yt-card">
              <div className="d-flex align-items-center gap-2 mb-3">
                <FaUsers className="text-primary" />
                <h5 className="fw-bold mb-0">Referral Leaderboard</h5>
              </div>
              {referrals.length === 0 ? (
                <p className="text-muted small mb-0">No referrals yet. Share links with your team to start tracking.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm align-middle mb-0">
                    <thead>
                      <tr className="text-muted small">
                        <th>Ref Code</th>
                        <th>Prospects Referred</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referrals.map(r => (
                        <tr key={r.code}>
                          <td><span className="badge bg-secondary text-uppercase">{r.code}</span></td>
                          <td className="fw-bold">{r.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </AdminLayout>
  );
}
