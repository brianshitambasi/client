import React, { useEffect, useState } from 'react';
import { FaSyncAlt, FaDownload, FaEnvelope } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';

export default function Leads() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/leads');
      setItems(res.data.items || []);
    } catch (err) {
      setError((err.response && err.response.data && err.response.data.message) || 'Failed to load leads.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const exportCsv = () => {
    if (items.length === 0) return;
    const header = ['Email', 'Name', 'Source', 'Type', 'Date'];
    const lines = [header.join(',')];
    items.forEach((l) => {
      const row = [
        l.email,
        `"${(l.name || '').replace(/"/g, '""')}"`,
        l.source,
        l.leadType,
        new Date(l.downloadedAt).toISOString()
      ];
      lines.push(row.join(','));
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h3 className="fw-bold mb-0">Email Leads</h3>
          <p className="text-muted small mb-0">{items.length} total · captured via free guide</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm" onClick={exportCsv} disabled={items.length === 0}>
            <FaDownload className="me-2" /> Export CSV
          </button>
          <button className="btn btn-outline-primary btn-sm" onClick={load} disabled={loading}>
            <FaSyncAlt className={loading ? 'fa-spin me-2' : 'me-2'} /> Refresh
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="yt-card p-0">
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-5">
            <FaEnvelope style={{ fontSize: '2rem', color: '#adb5bd' }} className="mb-3" />
            <h5 className="fw-bold">No email leads yet</h5>
            <p className="text-muted small mb-0">Submissions to the free guide page will appear here.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Source</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {items.map((l) => (
                  <tr key={l._id}>
                    <td className="small fw-semibold">{l.email}</td>
                    <td className="small">{l.name || '—'}</td>
                    <td className="small text-capitalize">{l.source}</td>
                    <td className="small text-muted">{new Date(l.downloadedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
