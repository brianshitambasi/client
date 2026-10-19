import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  FaArrowLeft, FaWhatsapp, FaEnvelope, FaTrash, FaSave, FaPlus, FaCheck, 
  FaCalendarPlus, FaGraduationCap, FaClock, FaUserPlus, FaPhone, FaStickyNote
} from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';
import { PROSPECT_STATUSES, LOG_CHANNELS, LOG_DIRECTIONS, statusMeta, categoryMeta } from '../../utils/constants';

export default function ProspectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');

  const [logForm, setLogForm] = useState({ channel: 'whatsapp', direction: 'outbound', summary: '', outcome: '' });
  const [followForm, setFollowForm] = useState({ dueDate: '', reason: '' });

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await api.get(`/admin/prospects/${id}`);
      setData(res.data);
      setStatus(res.data.prospect.status);
      setNotes(res.data.prospect.notes || '');
      setWhatsapp(res.data.prospect.whatsapp || '');
      setNextFollowUpDate(res.data.prospect.nextFollowUpDate ? new Date(res.data.prospect.nextFollowUpDate).toISOString().slice(0, 10) : '');
    } catch (err) {
      setError((err.response && err.response.data && err.response.data.message) || 'Failed to load prospect.');
    } finally { setLoading(false); }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const saveBasics = async () => {
    const phone = (whatsapp || '').trim();
    const digits = phone.replace(/\D/g, '');
    if (phone && (/[a-zA-Z@]/.test(phone) || digits.length < 7 || digits.length > 15)) {
      alert('WhatsApp must be a valid phone number (7–15 digits, no letters or @).'); return;
    }
    setSaving(true);
    try {
      await api.patch(`/admin/prospects/${id}`, { status, notes, whatsapp: phone, nextFollowUpDate: nextFollowUpDate || null });
      await load();
    } catch (err) { alert((err.response && err.response.data && err.response.data.message) || 'Save failed.'); } 
    finally { setSaving(false); }
  };

  const addLog = async (e) => {
    e.preventDefault();
    try { await api.post(`/admin/prospects/${id}/logs`, logForm); setLogForm({ ...logForm, summary: '', outcome: '' }); await load(); } 
    catch (err) { alert('Failed to add log.'); }
  };

  const addFollowUp = async (e) => {
    e.preventDefault();
    if (!followForm.dueDate) return;
    try { await api.post(`/admin/prospects/${id}/followups`, followForm); setFollowForm({ dueDate: '', reason: '' }); await load(); } 
    catch (err) { alert('Failed to add follow-up.'); }
  };

  const completeFollowUp = async (fid) => {
    try { await api.patch(`/admin/followups/${fid}`, {}); await load(); } catch (err) { alert('Failed.'); }
  };

  const removeProspect = async () => {
    if (!window.confirm('Delete this prospect and all related data?')) return;
    try { await api.delete(`/admin/prospects/${id}`); navigate('/admin/prospects'); } catch (err) { alert('Delete failed.'); }
  };

  if (loading) return <AdminLayout><div className="text-center py-5"><div className="spinner-border text-primary" /></div></AdminLayout>;
  if (error || !data) return <AdminLayout><div className="alert alert-danger">{error || 'Not found.'}</div><Link to="/admin/prospects" className="btn btn-outline-primary"><FaArrowLeft /> Back</Link></AdminLayout>;

  const { prospect, followUps, logs } = data;
  const sMeta = statusMeta(prospect.status);
  const cMeta = categoryMeta(prospect.leadCategory);
  const isStudent = prospect.prospectType === 'student';
  const si = prospect.studentInfo || {};
  const days = Array.isArray(si.daysAvailable) ? si.daysAvailable : [];
  const waDigits = (whatsapp || prospect.whatsapp || '').replace(/[^\d]/g, '');

  // Build timeline array
  const timeline = [
    { date: new Date(prospect.submittedAt), icon: <FaUserPlus />, title: 'Submitted Form', desc: `Source: ${prospect.source}`, color: '#0d6efd' },
    ...logs.map(l => ({ date: new Date(l.createdAt), icon: l.channel === 'call' ? <FaPhone /> : <FaWhatsapp />, title: `${l.direction === 'outbound' ? 'Outbound' : 'Inbound'} ${l.channel}`, desc: l.summary || 'No summary', color: l.direction === 'outbound' ? '#198754' : '#6c757d' })),
    ...followUps.map(f => ({ date: new Date(f.dueDate), icon: <FaCalendarPlus />, title: 'Follow-up Scheduled', desc: f.reason || 'No reason', color: '#fd7e14' }))
  ].sort((a, b) => b.date - a.date); // newest first

  return (
    <AdminLayout>
      <div className="mb-3"><Link to="/admin/prospects" className="small d-inline-flex align-items-center gap-2 text-decoration-none"><FaArrowLeft /> Back to prospects</Link></div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="yt-card mb-4">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h4 className="fw-bold mb-0">{prospect.fullName}</h4>
              <span className={`badge bg-${sMeta.color}`}>{sMeta.label}</span>
            </div>
            <p className="text-muted small mb-4">Added {new Date(prospect.submittedAt).toLocaleString()}</p>

            <ul className="list-unstyled small mb-4">
              <li className="mb-2"><strong>Email:</strong> {prospect.email}</li>
              <li className="mb-2"><strong>WhatsApp:</strong> {whatsapp || prospect.whatsapp || '—'}</li>
              <li className="mb-2"><strong>Category:</strong> <span className={`badge bg-${cMeta.color}`}>{cMeta.label}</span></li>
              {!isStudent && <li className="mb-2"><strong>Looking for:</strong> <span className="text-capitalize">{prospect.lookingFor.replace('_', ' ')}</span></li>}
            </ul>

            {isStudent && (
              <div className="mb-4 p-3 rounded bg-info bg-opacity-10 border border-info border-opacity-25">
                <div className="small fw-bold mb-2 text-info text-darken d-flex align-items-center gap-2"><FaGraduationCap /> Student Info</div>
                <div className="small mb-1"><strong>School:</strong> {si.school || '—'}</div>
                <div className="small mb-1"><strong>Course:</strong> {si.course || '—'}</div>
                <div className="small mb-1"><strong>Days:</strong> {days.length ? days.join(', ') : '—'}</div>
              </div>
            )}

            <div className="d-grid gap-2 mb-4">
              <a href={`https://wa.me/${waDigits}`} target="_blank" rel="noreferrer" className={`btn btn-success ${waDigits.length < 7 ? 'disabled' : ''}`}><FaWhatsapp /> WhatsApp</a>
              <a href={`mailto:${prospect.email}`} className="btn btn-outline-primary"><FaEnvelope /> Email</a>
            </div>
            <button className="btn btn-outline-danger w-100 btn-sm" onClick={removeProspect}><FaTrash /> Delete prospect</button>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <div className="yt-card h-100">
                <h5 className="fw-bold mb-3">Update Details</h5>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Status</label>
                  <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                    {PROSPECT_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">WhatsApp</label>
                  <input type="text" className="form-control" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Next Follow-up</label>
                  <input type="date" className="form-control" value={nextFollowUpDate} onChange={(e) => setNextFollowUpDate(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Internal Notes</label>
                  <textarea className="form-control" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
                <button className="btn yt-btn-primary w-100" onClick={saveBasics} disabled={saving}><FaSave /> {saving ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </div>

            <div className="col-md-6">
              <div className="yt-card h-100">
                <h5 className="fw-bold mb-3">Add Log</h5>
                <form onSubmit={addLog}>
                  <div className="row g-2 mb-2">
                    <div className="col-6"><select className="form-select" value={logForm.channel} onChange={e => setLogForm({...logForm, channel: e.target.value})}>{LOG_CHANNELS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
                    <div className="col-6"><select className="form-select" value={logForm.direction} onChange={e => setLogForm({...logForm, direction: e.target.value})}>{LOG_DIRECTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}</select></div>
                  </div>
                  <div className="mb-2"><input type="text" className="form-control" placeholder="Summary" value={logForm.summary} onChange={e => setLogForm({...logForm, summary: e.target.value})} /></div>
                  <button type="submit" className="btn btn-primary w-100 btn-sm"><FaPlus /> Add Entry</button>
                </form>
              </div>
            </div>
          </div>

          <div className="yt-card">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2"><FaClock className="text-primary" /> History Timeline</h5>
            <div className="yt-timeline">
              {timeline.map((t, i) => (
                <div className="yt-timeline-item" key={i}>
                  <div className="yt-timeline-dot" style={{ background: t.color, borderColor: t.color }} />
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span style={{ color: t.color }}>{t.icon}</span>
                    <strong className="text-dark">{t.title}</strong>
                    <span className="text-muted small ms-auto">{t.date.toLocaleString()}</span>
                  </div>
                  <p className="text-muted small mb-0 ps-4 ms-1">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
