import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  FaArrowLeft,
  FaWhatsapp,
  FaEnvelope,
  FaTrash,
  FaSave,
  FaPlus,
  FaCheck,
  FaCalendarPlus,
  FaGraduationCap,
  FaCopy,
  FaCheckCircle
} from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';
import {
  PROSPECT_STATUSES,
  LOG_CHANNELS,
  LOG_DIRECTIONS,
  statusMeta,
  categoryMeta
} from '../../utils/constants';

export default function ProspectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');

  const [logForm, setLogForm] = useState({ channel: 'whatsapp', direction: 'outbound', summary: '', outcome: '' });
  const [followForm, setFollowForm] = useState({ dueDate: '', reason: '' });

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/admin/prospects/${id}`);
      setData(res.data);
      setStatus(res.data.prospect.status);
      setNotes(res.data.prospect.notes || '');
      setWhatsapp(res.data.prospect.whatsapp || '');
      setNextFollowUpDate(
        res.data.prospect.nextFollowUpDate
          ? new Date(res.data.prospect.nextFollowUpDate).toISOString().slice(0, 10)
          : ''
      );
    } catch (err) {
      setError(
        (err.response && err.response.data && err.response.data.message) ||
          'Failed to load prospect.'
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const saveBasics = async () => {
    const phone = (whatsapp || '').trim();
    const digits = phone.replace(/\D/g, '');
    if (phone && (/[a-zA-Z@]/.test(phone) || digits.length < 7 || digits.length > 15)) {
      alert('WhatsApp must be a valid phone number (7–15 digits, no letters or @).');
      return;
    }

    setSaving(true);
    try {
      await api.patch(`/admin/prospects/${id}`, {
        status,
        notes,
        whatsapp: phone,
        nextFollowUpDate: nextFollowUpDate || null
      });
      await load();
    } catch (err) {
      alert(
        (err.response && err.response.data && err.response.data.message) ||
          'Save failed.'
      );
    } finally {
      setSaving(false);
    }
  };

  const addLog = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/admin/prospects/${id}/logs`, logForm);
      setLogForm({ channel: 'whatsapp', direction: 'outbound', summary: '', outcome: '' });
      await load();
    } catch (err) {
      alert('Failed to add log.');
    }
  };

  const addFollowUp = async (e) => {
    e.preventDefault();
    if (!followForm.dueDate) return;
    try {
      await api.post(`/admin/prospects/${id}/followups`, followForm);
      setFollowForm({ dueDate: '', reason: '' });
      await load();
    } catch (err) {
      alert('Failed to add follow-up.');
    }
  };

  const completeFollowUp = async (fid) => {
    try {
      await api.patch(`/admin/followups/${fid}`, {});
      await load();
    } catch (err) {
      alert('Failed to complete follow-up.');
    }
  };

  const removeProspect = async () => {
    if (!window.confirm('Delete this prospect and all related logs/follow-ups? This cannot be undone.')) return;
    try {
      await api.delete(`/admin/prospects/${id}`);
      navigate('/admin/prospects');
    } catch (err) {
      alert('Delete failed.');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      </AdminLayout>
    );
  }

  if (error || !data) {
    return (
      <AdminLayout>
        <div className="alert alert-danger">{error || 'Prospect not found.'}</div>
        <Link to="/admin/prospects" className="btn btn-outline-primary">
          <FaArrowLeft className="me-2" /> Back to list
        </Link>
      </AdminLayout>
    );
  }

  const { prospect, followUps, logs } = data;
  const sMeta = statusMeta(prospect.status);
  const cMeta = categoryMeta(prospect.leadCategory);
  const isStudent = prospect.prospectType === 'student';
  const si = prospect.studentInfo || {};
  const days = Array.isArray(si.daysAvailable) ? si.daysAvailable : [];

  const waDigits = (whatsapp || prospect.whatsapp || '').replace(/[^\d]/g, '');

  // Generate the intro message
  const firstName = prospect.fullName.split(' ')[0];
  let message = '';
  
  if (isStudent) {
    message = `Hi ${firstName}! Brian here from CEO TNT. I saw you're studying ${si.course || 'at ' + (si.school || 'university')} and you mentioned you're available on ${days.join(', ')}. I'd love to share a flexible business opportunity that fits perfectly around your class schedule. Do you have a few minutes to chat this week?`;
  } else {
    const looking = (prospect.lookingFor || '').replace('_', ' ');
    message = `Hi ${firstName}! Brian here from CEO TNT. Thanks for reaching out about the business opportunity. Since you mentioned you're looking for ${looking} and have ${prospect.weeklyTime || 'some time'} available, I'd love to share how our model works and answer any questions you have. Let me know when you're free to chat!`;
  }

  const copyMessage = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AdminLayout>
      <div className="mb-3">
        <Link to="/admin/prospects" className="small d-inline-flex align-items-center gap-2">
          <FaArrowLeft /> Back to prospects
        </Link>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="yt-card">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h4 className="fw-bold mb-1">{prospect.fullName}</h4>
                <p className="text-muted small mb-0">
                  Submitted {new Date(prospect.submittedAt).toLocaleString()}
                </p>
              </div>
              <span className={`badge bg-${sMeta.color}`}>{sMeta.label}</span>
            </div>

            {isStudent && (
              <div className="mb-3">
                <span className="badge bg-info text-dark d-inline-flex align-items-center gap-1">
                  <FaGraduationCap /> Student
                </span>
              </div>
            )}

            <ul className="list-unstyled small mb-4">
              <li className="mb-2"><strong>Email:</strong> {prospect.email}</li>
              <li className="mb-2"><strong>WhatsApp:</strong> {whatsapp || prospect.whatsapp || '—'}</li>
              <li className="mb-2"><strong>Country:</strong> {prospect.country || '—'}</li>
              <li className="mb-2"><strong>Preferred contact:</strong> <span className="text-capitalize">{prospect.preferredContact}</span></li>
              <li className="mb-2"><strong>Source:</strong> <span className="text-capitalize">{prospect.source}</span></li>
              <li className="mb-2"><strong>Lead score:</strong> {prospect.leadScore}</li>
              <li className="mb-2"><strong>Category:</strong> <span className={`badge bg-${cMeta.color}`}>{cMeta.label}</span></li>

              {!isStudent && (
                <>
                  <li className="mb-2"><strong>Looking for:</strong> <span className="text-capitalize">{(prospect.lookingFor || '').replace('_', ' ')}</span></li>
                  <li className="mb-2"><strong>Previous experience:</strong> {prospect.previousExperience ? 'Yes' : 'No'}</li>
                  <li className="mb-2"><strong>Weekly time:</strong> {prospect.weeklyTime || '—'}</li>
                  <li className="mb-0"><strong>Wants explanation:</strong> <span className="text-capitalize">{prospect.wantsExplanation}</span></li>
                </>
              )}
            </ul>

            {isStudent && (
              <div className="mb-3 p-3 rounded" style={{ background: '#e7f6ff', border: '1px solid #b8e0ff' }}>
                <div className="small fw-semibold mb-2 d-flex align-items-center gap-2">
                  <FaGraduationCap /> Student details
                </div>
                <ul className="list-unstyled small mb-0">
                  <li className="mb-2"><strong>School:</strong> {si.school || '—'}</li>
                  {si.course && <li className="mb-2"><strong>Course:</strong> {si.course}</li>}
                  {si.yearOfStudy && <li className="mb-2"><strong>Year:</strong> {si.yearOfStudy}</li>}
                  <li className="mb-0">
                    <strong>Days available:</strong>{' '}
                    {days.length === 0 ? '—' : days.map((d) => (
                      <span key={d} className="badge bg-primary me-1">{d}</span>
                    ))}
                  </li>
                </ul>
              </div>
            )}

            {prospect.questionsToClarify && (
              <div className="mb-3 p-3 rounded" style={{ background: '#f5f7fb' }}>
                <div className="small fw-semibold mb-1">Their questions</div>
                <div className="small text-muted">{prospect.questionsToClarify}</div>
              </div>
            )}

            {/* Copy Message block */}
            <div className="mb-3 p-3 rounded bg-light border">
              <div className="small fw-semibold mb-2">Ready-to-send message</div>
              <textarea 
                className="form-control form-control-sm bg-white mb-2" 
                rows={4} 
                readOnly 
                value={message}
                style={{ resize: 'none', fontSize: '0.85rem' }}
              />
              <button 
                className={`btn btn-sm w-100 ${copied ? 'btn-success' : 'btn-outline-secondary'}`} 
                onClick={copyMessage}
              >
                {copied ? <><FaCheckCircle className="me-2" /> Copied!</> : <><FaCopy className="me-2" /> Copy Intro Message</>}
              </button>
            </div>

            <div className="d-grid gap-2 mb-3">
              <a
                href={`https://wa.me/${waDigits}`}
                target="_blank"
                rel="noreferrer"
                className={`btn btn-success ${waDigits.length < 7 ? 'disabled' : ''}`}
                onClick={(e) => { if (waDigits.length < 7) e.preventDefault(); }}
              >
                <FaWhatsapp className="me-2" /> WhatsApp them
              </a>
              <a href={`mailto:${prospect.email}`} className="btn btn-outline-primary">
                <FaEnvelope className="me-2" /> Email them
              </a>
            </div>

            <button className="btn btn-outline-danger w-100" onClick={removeProspect}>
              <FaTrash className="me-2" /> Delete prospect
            </button>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="yt-card mb-4">
            <h5 className="fw-bold mb-3">Update</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Status</label>
                <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                  {PROSPECT_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">WhatsApp number</label>
                <input
                  type="text"
                  className="form-control"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="2547XXXXXXXX"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Next follow-up date</label>
                <input
                  type="date"
                  className="form-control"
                  value={nextFollowUpDate}
                  onChange={(e) => setNextFollowUpDate(e.target.value)}
                />
              </div>
              <div className="col-12">
                <label className="form-label small fw-semibold">Internal notes</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Private notes — never shown to the prospect."
                />
              </div>
              <div className="col-12 text-end">
                <button className="btn yt-btn-primary" onClick={saveBasics} disabled={saving}>
                  <FaSave className="me-2" /> {saving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </div>
          </div>

          <div className="yt-card mb-4">
            <h5 className="fw-bold mb-3">Follow-ups</h5>

            <form className="row g-2 align-items-end mb-3" onSubmit={addFollowUp}>
              <div className="col-md-4">
                <label className="form-label small fw-semibold">Due date</label>
                <input
                  type="date"
                  className="form-control"
                  value={followForm.dueDate}
                  onChange={(e) => setFollowForm({ ...followForm, dueDate: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Reason</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Send business model PDF"
                  value={followForm.reason}
                  onChange={(e) => setFollowForm({ ...followForm, reason: e.target.value })}
                />
              </div>
              <div className="col-md-2">
                <button className="btn btn-primary w-100" type="submit">
                  <FaCalendarPlus />
                </button>
              </div>
            </form>

            {followUps.length === 0 ? (
              <p className="text-muted small mb-0">No follow-ups scheduled yet.</p>
            ) : (
              <ul className="list-unstyled mb-0">
                {followUps.map((f) => (
                  <li key={f._id} className="d-flex justify-content-between align-items-center border-bottom py-2">
                    <div className="small">
                      <div className={f.completed ? 'text-muted text-decoration-line-through' : 'fw-semibold'}>
                        {new Date(f.dueDate).toLocaleDateString()}
                      </div>
                      <div className="text-muted">{f.reason || '—'}</div>
                    </div>
                    {f.completed ? (
                      <span className="badge bg-success">Done</span>
                    ) : (
                      <button className="btn btn-sm btn-outline-success" onClick={() => completeFollowUp(f._id)}>
                        <FaCheck className="me-1" /> Complete
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="yt-card">
            <h5 className="fw-bold mb-3">Communication log</h5>

            <form className="row g-2 align-items-end mb-3" onSubmit={addLog}>
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Channel</label>
                <select
                  className="form-select"
                  value={logForm.channel}
                  onChange={(e) => setLogForm({ ...logForm, channel: e.target.value })}
                >
                  {LOG_CHANNELS.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Direction</label>
                <select
                  className="form-select"
                  value={logForm.direction}
                  onChange={(e) => setLogForm({ ...logForm, direction: e.target.value })}
                >
                  {LOG_DIRECTIONS.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Summary</label>
                <input
                  type="text"
                  className="form-control"
                  value={logForm.summary}
                  onChange={(e) => setLogForm({ ...logForm, summary: e.target.value })}
                  placeholder="Short summary"
                />
              </div>
              <div className="col-12">
                <label className="form-label small fw-semibold">Outcome (optional)</label>
                <input
                  type="text"
                  className="form-control"
                  value={logForm.outcome}
                  onChange={(e) => setLogForm({ ...logForm, outcome: e.target.value })}
                  placeholder="What happened?"
                />
              </div>
              <div className="col-12 text-end">
                <button type="submit" className="btn btn-primary">
                  <FaPlus className="me-2" /> Add log entry
                </button>
              </div>
            </form>

            {logs.length === 0 ? (
              <p className="text-muted small mb-0">No communication recorded yet.</p>
            ) : (
              <ul className="list-unstyled mb-0">
                {logs.map((l) => (
                  <li key={l._id} className="border-bottom py-2 small">
                    <div className="d-flex justify-content-between">
                      <span className="fw-semibold text-capitalize">
                        {l.channel} · {l.direction}
                      </span>
                      <span className="text-muted">
                        {new Date(l.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div>{l.summary || '—'}</div>
                    {l.outcome && <div className="text-muted">Outcome: {l.outcome}</div>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
