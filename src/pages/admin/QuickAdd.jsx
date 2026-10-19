import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaUserPlus } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';
import { SOURCES, LOOKING_FOR_OPTIONS, PREFERRED_CONTACT_OPTIONS } from '../../utils/constants';

export default function QuickAdd() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [form, setForm] = useState({
    fullName: '', email: '', whatsapp: '', country: '',
    lookingFor: 'exploring', source: 'direct', preferredContact: 'whatsapp',
    previousExperience: false, weeklyTime: '', wantsExplanation: 'yes'
  });

  const submit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const res = await api.post('/prospects', form);
      navigate(`/admin/prospects/${res.data.prospect.id}`);
    } catch (err) {
      setError((err.response && err.response.data && err.response.data.message) || 'Failed to add prospect.');
    } finally { setLoading(false); }
  };

  return (
    <AdminLayout>
      <div className="mb-4"><Link to="/admin/prospects" className="text-decoration-none small"><FaArrowLeft /> Back to prospects</Link></div>
      <div className="yt-card max-w-600 mx-auto" style={{ maxWidth: 600 }}>
        <h4 className="fw-bold mb-4"><FaUserPlus className="text-primary me-2"/> Add Prospect Manually</h4>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={submit} className="row g-3">
          <div className="col-md-6"><label className="form-label small fw-bold">Full Name *</label><input required className="form-control" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} /></div>
          <div className="col-md-6"><label className="form-label small fw-bold">Email *</label><input required type="email" className="form-control" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
          <div className="col-md-6"><label className="form-label small fw-bold">WhatsApp</label><input className="form-control" value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} placeholder="254..." /></div>
          <div className="col-md-6"><label className="form-label small fw-bold">Country</label><input className="form-control" value={form.country} onChange={e => setForm({...form, country: e.target.value})} /></div>
          <div className="col-md-6"><label className="form-label small fw-bold">Source</label><select className="form-select" value={form.source} onChange={e => setForm({...form, source: e.target.value})}>{SOURCES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
          <div className="col-md-6"><label className="form-label small fw-bold">Looking For</label><select className="form-select" value={form.lookingFor} onChange={e => setForm({...form, lookingFor: e.target.value})}>{LOOKING_FOR_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
          <div className="col-12 mt-4 text-end">
            <button type="submit" className="btn yt-btn-primary" disabled={loading}><FaSave className="me-2" /> {loading ? 'Saving...' : 'Save Prospect'}</button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
