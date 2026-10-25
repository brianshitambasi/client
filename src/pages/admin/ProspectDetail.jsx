import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  FaArrowLeft, FaWhatsapp, FaEnvelope, FaTrash, FaSave, FaPlus, FaUndo,
  FaCalendarPlus, FaGraduationCap, FaClock, FaUserPlus, FaPhone, FaCopy, FaCheckCircle,
} from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import PhoneInputField from '../../components/forms/PhoneInputField';
import api from '../../services/api';
import {
  PROSPECT_STATUSES, LOG_CHANNELS, LOG_DIRECTIONS, statusMeta, categoryMeta,
} from '../../utils/constants';

/* -------------------------------------------------------------------------- */
/*  Constants                                                                  */
/* -------------------------------------------------------------------------- */

const BRAND = { sender: 'Brian', company: 'CEO TNT' };
const MIN_PHONE_DIGITS = 10;
const COPY_FEEDBACK_MS = 2000;
const NOTICE_DISMISS_MS = 5000;

const SOURCE_INTROS = {
  facebook: 'Thanks for reaching out on Facebook!',
  instagram: 'Thanks for connecting on Instagram!',
  tiktok: 'I saw your interest on TikTok!',
  whatsapp: 'Thanks for messaging me on WhatsApp!',
  referral: 'Thanks for the referral!',
  default: 'Thanks for your interest in the opportunity!',
};

const EMPTY_LOG_FORM = { channel: 'whatsapp', direction: 'outbound', summary: '', outcome: '' };

/* -------------------------------------------------------------------------- */
/*  Pure helpers (easy to unit-test or move into utils/)                       */
/* -------------------------------------------------------------------------- */

const digitsOnly = (value) => String(value || '').replace(/\D/g, '');
const humanize = (value) => String(value || '').replace(/_/g, ' ');
const getErrorMessage = (err, fallback) => err?.response?.data?.message || fallback;

const toDateInputValue = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
};

/** ["Mon", "Tue", "Wed"] -> "Mon, Tue and Wed" */
const joinList = (items) => {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
};

function buildWhatsAppMessage(prospect) {
  const firstName = prospect.fullName?.trim().split(/\s+/)[0] || 'there';
  const intro = SOURCE_INTROS[prospect.source] || SOURCE_INTROS.default;

  let body;
  if (prospect.prospectType === 'student') {
    const info = prospect.studentInfo || {};
    const days = Array.isArray(info.daysAvailable) ? info.daysAvailable : [];
    const facts = [];

    if (info.course) {
      facts.push(`you're studying ${info.course}${info.school ? ` at ${info.school}` : ''}`);
    }
    if (days.length) facts.push(`you're free on ${joinList(days)}`);

    const detail = facts.length ? `I saw that ${facts.join(' and ')}. ` : '';
    body = `${detail}We have a flexible opportunity that works around your class schedule.`;
  } else {
    const looking = humanize(prospect.lookingFor) || 'a business opportunity';
    const time = prospect.weeklyTime ? `have ${prospect.weeklyTime} to dedicate` : 'are looking to grow';
    body = `You mentioned you're looking for ${looking} and ${time}. I'd love to share how our model works.`;
  }

  return `Hi ${firstName}, ${BRAND.sender} here from ${BRAND.company}. ${intro} ${body} Do you have a few minutes to chat this week?`;
}

function buildTimeline({ prospect, logs = [], followUps = [] }) {
  const items = [
    {
      key: 'submitted',
      date: new Date(prospect.submittedAt),
      icon: <FaUserPlus />,
      title: 'Submitted form',
      desc: `Source: ${humanize(prospect.source)}`,
      color: '#0d6efd',
    },
    ...logs.map((log, i) => ({
      key: `log-${log._id || log.id || i}`,
      date: new Date(log.createdAt),
      icon: log.channel === 'call' ? <FaPhone /> : <FaWhatsapp />,
      title: `${log.direction === 'outbound' ? 'Outbound' : 'Inbound'} ${log.channel}`,
      desc: [log.summary || 'No summary', log.outcome && `Outcome: ${log.outcome}`].filter(Boolean).join(' — '),
      color: log.direction === 'outbound' ? '#198754' : '#6c757d',
    })),
    ...followUps.map((fu, i) => ({
      key: `followup-${fu._id || fu.id || i}`,
      date: new Date(fu.dueDate),
      icon: <FaCalendarPlus />,
      title: 'Follow-up scheduled',
      desc: fu.reason || 'No reason given',
      color: '#fd7e14',
    })),
  ];

  return items.sort((a, b) => b.date - a.date); // newest first
}

/* -------------------------------------------------------------------------- */
/*  Small presentational pieces                                                */
/* -------------------------------------------------------------------------- */

function Notice({ notice, onClose }) {
  if (!notice) return null;
  return (
    <div
      className={`alert alert-${notice.type} alert-dismissible py-2 small`}
      role={notice.type === 'danger' ? 'alert' : 'status'}
      aria-live="polite"
    >
      {notice.text}
      <button type="button" className="btn-close" aria-label="Dismiss" onClick={onClose} />
    </div>
  );
}

function InfoRow({ label, children }) {
  return (
    <li className="mb-2">
      <strong>{label}:</strong> {children}
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function ProspectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMounted = useRef(true);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [notice, setNotice] = useState(null);

  const [saving, setSaving] = useState(false);
  const [addingLog, setAddingLog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');
  const [messageDraft, setMessageDraft] = useState(null); // null = use generated message
  const [logForm, setLogForm] = useState(EMPTY_LOG_FORM);

  const showNotice = useCallback((type, text) => setNotice({ type, text }), []);

  /* ----------------------------- Data loading ----------------------------- */

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  // `silent` refreshes data without swapping the whole page for a spinner.
  const load = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setLoadError('');
    try {
      const { data: payload } = await api.get(`/admin/prospects/${id}`);
      if (!isMounted.current) return;

      const p = payload.prospect;
      setData(payload);
      setStatus(p.status);
      setNotes(p.notes || '');
      setWhatsapp(p.whatsapp || '');
      setNextFollowUpDate(toDateInputValue(p.nextFollowUpDate));
    } catch (err) {
      if (isMounted.current) setLoadError(getErrorMessage(err, 'Failed to load prospect.'));
    } finally {
      if (isMounted.current && !silent) setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!notice || notice.type === 'danger') return undefined;
    const timer = setTimeout(() => setNotice(null), NOTICE_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [notice]);

  /* ---------------------------- Derived values ---------------------------- */

  const prospect = data?.prospect;

  const generatedMessage = useMemo(
    () => (prospect ? buildWhatsAppMessage(prospect) : ''),
    [prospect],
  );
  const waMessage = messageDraft ?? generatedMessage;
  const isMessageEdited = messageDraft !== null && messageDraft !== generatedMessage;

  const waDigits = digitsOnly(whatsapp || prospect?.whatsapp);
  const canWhatsApp = waDigits.length >= MIN_PHONE_DIGITS;

  const timeline = useMemo(
    () => (data ? buildTimeline(data) : []),
    [data],
  );

  const isDirty = useMemo(() => {
    if (!prospect) return false;
    return (
      status !== prospect.status ||
      notes !== (prospect.notes || '') ||
      digitsOnly(whatsapp) !== digitsOnly(prospect.whatsapp) ||
      nextFollowUpDate !== toDateInputValue(prospect.nextFollowUpDate)
    );
  }, [prospect, status, notes, whatsapp, nextFollowUpDate]);

  /* -------------------------------- Actions ------------------------------- */

  const saveBasics = async () => {
    const phone = digitsOnly(whatsapp);
    if (phone && phone.length < MIN_PHONE_DIGITS) {
      showNotice('warning', 'Enter a valid phone number, including the country code.');
      return;
    }

    setSaving(true);
    try {
      await api.patch(`/admin/prospects/${id}`, {
        status,
        notes,
        whatsapp: phone,
        nextFollowUpDate: nextFollowUpDate || null,
      });
      await load({ silent: true });
      showNotice('success', 'Changes saved.');
    } catch (err) {
      showNotice('danger', getErrorMessage(err, 'Could not save changes.'));
    } finally {
      if (isMounted.current) setSaving(false);
    }
  };

  const addLog = async (e) => {
    e.preventDefault();
    if (!logForm.summary.trim()) {
      showNotice('warning', 'Add a short summary before saving the log.');
      return;
    }

    setAddingLog(true);
    try {
      await api.post(`/admin/prospects/${id}/logs`, {
        ...logForm,
        summary: logForm.summary.trim(),
        outcome: logForm.outcome.trim(),
      });
      setLogForm((prev) => ({ ...prev, summary: '', outcome: '' }));
      await load({ silent: true });
      showNotice('success', 'Log added.');
    } catch (err) {
      showNotice('danger', getErrorMessage(err, 'Could not add the log.'));
    } finally {
      if (isMounted.current) setAddingLog(false);
    }
  };

  const removeProspect = async () => {
    if (!window.confirm('Delete this prospect and all related data? This cannot be undone.')) return;

    setDeleting(true);
    try {
      await api.delete(`/admin/prospects/${id}`);
      navigate('/admin/prospects');
    } catch (err) {
      showNotice('danger', getErrorMessage(err, 'Could not delete the prospect.'));
      if (isMounted.current) setDeleting(false);
    }
  };

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(waMessage);
      setCopied(true);
      setTimeout(() => isMounted.current && setCopied(false), COPY_FEEDBACK_MS);
    } catch {
      showNotice('danger', 'Could not copy automatically. Select the text and copy it manually.');
    }
  };

  const updateLogField = (field) => (e) => setLogForm((prev) => ({ ...prev, [field]: e.target.value }));

  /* -------------------------------- Rendering ----------------------------- */

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-5" role="status" aria-live="polite">
          <div className="spinner-border text-primary" />
          <span className="visually-hidden">Loading prospect…</span>
        </div>
      </AdminLayout>
    );
  }

  if (loadError || !prospect) {
    return (
      <AdminLayout>
        <div className="alert alert-danger" role="alert">{loadError || 'Prospect not found.'}</div>
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-primary" onClick={() => load()}>Try again</button>
          <Link to="/admin/prospects" className="btn btn-outline-primary d-inline-flex align-items-center gap-2">
            <FaArrowLeft /> Back to prospects
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const sMeta = statusMeta(prospect.status);
  const cMeta = categoryMeta(prospect.leadCategory);
  const isStudent = prospect.prospectType === 'student';
  const studentInfo = prospect.studentInfo || {};
  const days = Array.isArray(studentInfo.daysAvailable) ? studentInfo.daysAvailable : [];
  const waHref = canWhatsApp ? `https://wa.me/${waDigits}?text=${encodeURIComponent(waMessage)}` : undefined;

  return (
    <AdminLayout>
      <div className="mb-3">
        <Link to="/admin/prospects" className="small d-inline-flex align-items-center gap-2 text-decoration-none">
          <FaArrowLeft /> Back to prospects
        </Link>
      </div>

      <Notice notice={notice} onClose={() => setNotice(null)} />

      <div className="row g-4">
        {/* ------------------------------ Left column ----------------------------- */}
        <div className="col-lg-5">
          <div className="yt-card mb-4">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h4 className="fw-bold mb-0">{prospect.fullName}</h4>
              <span className={`badge bg-${sMeta.color}`}>{sMeta.label}</span>
            </div>
            <p className="text-muted small mb-4">Added {new Date(prospect.submittedAt).toLocaleString()}</p>

            <ul className="list-unstyled small mb-4">
              <InfoRow label="Email">{prospect.email}</InfoRow>
              <InfoRow label="WhatsApp">{whatsapp || prospect.whatsapp || '—'}</InfoRow>
              <InfoRow label="Category"><span className={`badge bg-${cMeta.color}`}>{cMeta.label}</span></InfoRow>
              <InfoRow label="Source"><span className="text-capitalize">{humanize(prospect.source)}</span></InfoRow>
              {prospect.referralCode && <InfoRow label="Referral Code"><span className="badge bg-info text-dark text-uppercase">{prospect.referralCode}</span></InfoRow>}
              {!isStudent && (
                <InfoRow label="Looking for">
                  <span className="text-capitalize">{humanize(prospect.lookingFor) || '—'}</span>
                </InfoRow>
              )}
            </ul>

            {isStudent && (
              <div className="mb-4 p-3 rounded bg-info bg-opacity-10 border border-info border-opacity-25">
                <div className="small fw-bold mb-2 text-info d-flex align-items-center gap-2">
                  <FaGraduationCap /> Student info
                </div>
                <div className="small mb-1"><strong>School:</strong> {studentInfo.school || '—'}</div>
                <div className="small mb-1"><strong>Course:</strong> {studentInfo.course || '—'}</div>
                <div className="small mb-1"><strong>Days:</strong> {days.length ? days.join(', ') : '—'}</div>
              </div>
            )}

            {prospect.questionsToClarify && (
              <div className="mb-4 p-3 rounded bg-light">
                <div className="small fw-semibold mb-1">Their questions</div>
                <div className="small text-muted">{prospect.questionsToClarify}</div>
              </div>
            )}

            {/* WhatsApp message composer */}
            <div className="mb-4 p-3 rounded border bg-white">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label htmlFor="wa-message" className="small fw-semibold text-primary mb-0">
                  WhatsApp message
                </label>
                {isMessageEdited && (
                  <button
                    type="button"
                    className="btn btn-link btn-sm p-0 text-decoration-none d-inline-flex align-items-center gap-1"
                    onClick={() => setMessageDraft(null)}
                  >
                    <FaUndo /> Reset
                  </button>
                )}
              </div>
              <textarea
                id="wa-message"
                className="form-control form-control-sm mb-3"
                rows={6}
                value={waMessage}
                onChange={(e) => setMessageDraft(e.target.value)}
              />
              <button
                type="button"
                className={`btn btn-sm w-100 ${copied ? 'btn-success' : 'btn-outline-secondary'}`}
                onClick={copyMessage}
                aria-live="polite"
              >
                {copied
                  ? <><FaCheckCircle className="me-2" /> Copied</>
                  : <><FaCopy className="me-2" /> Copy message</>}
              </button>
            </div>

            <div className="d-grid gap-2 mb-4">
              <a
                href={waHref}
                target="_blank"
                rel="noreferrer noopener"
                className={`btn btn-success ${canWhatsApp ? '' : 'disabled'}`}
                aria-disabled={!canWhatsApp}
                tabIndex={canWhatsApp ? undefined : -1}
                title={canWhatsApp ? undefined : 'Add a valid WhatsApp number to enable this'}
              >
                <FaWhatsapp className="me-2" /> Open in WhatsApp
              </a>
              <a href={`mailto:${prospect.email}`} className="btn btn-outline-primary">
                <FaEnvelope className="me-2" /> Email
              </a>
            </div>

            <button
              type="button"
              className="btn btn-outline-danger w-100 btn-sm"
              onClick={removeProspect}
              disabled={deleting}
            >
              <FaTrash className="me-2" /> {deleting ? 'Deleting…' : 'Delete prospect'}
            </button>
          </div>
        </div>

        {/* ------------------------------ Right column ---------------------------- */}
        <div className="col-lg-7">
          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <div className="yt-card h-100">
                <h5 className="fw-bold mb-3">Update details</h5>

                <div className="mb-3">
                  <label htmlFor="prospect-status" className="form-label small fw-semibold">Status</label>
                  <select
                    id="prospect-status"
                    className="form-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    {PROSPECT_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <PhoneInputField label="WhatsApp number" value={whatsapp} onChange={setWhatsapp} />
                </div>

                <div className="mb-3">
                  <label htmlFor="next-follow-up" className="form-label small fw-semibold">Next follow-up</label>
                  <input
                    id="next-follow-up"
                    type="date"
                    className="form-control"
                    value={nextFollowUpDate}
                    onChange={(e) => setNextFollowUpDate(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="internal-notes" className="form-label small fw-semibold">Internal notes</label>
                  <textarea
                    id="internal-notes"
                    className="form-control"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  className="btn yt-btn-primary w-100"
                  onClick={saveBasics}
                  disabled={saving || !isDirty}
                >
                  <FaSave className="me-2" /> {saving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </div>

            <div className="col-md-6">
              <div className="yt-card h-100">
                <h5 className="fw-bold mb-3">Add log</h5>
                <form onSubmit={addLog} noValidate>
                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <select
                        className="form-select"
                        aria-label="Channel"
                        value={logForm.channel}
                        onChange={updateLogField('channel')}
                      >
                        {LOG_CHANNELS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                    </div>
                    <div className="col-6">
                      <select
                        className="form-select"
                        aria-label="Direction"
                        value={logForm.direction}
                        onChange={updateLogField('direction')}
                      >
                        {LOG_DIRECTIONS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Summary"
                      aria-label="Summary"
                      value={logForm.summary}
                      onChange={updateLogField('summary')}
                    />
                  </div>
                  <div className="mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Outcome (optional)"
                      aria-label="Outcome"
                      value={logForm.outcome}
                      onChange={updateLogField('outcome')}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100 btn-sm" disabled={addingLog}>
                    <FaPlus className="me-2" /> {addingLog ? 'Adding…' : 'Add entry'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="yt-card">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
              <FaClock className="text-primary" /> History timeline
            </h5>
            <div className="yt-timeline">
              {timeline.map((item) => (
                <div className="yt-timeline-item" key={item.key}>
                  <div className="yt-timeline-dot" style={{ background: item.color, borderColor: item.color }} />
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span style={{ color: item.color }} aria-hidden="true">{item.icon}</span>
                    <strong className="text-dark">{item.title}</strong>
                    <span className="text-muted small ms-auto">{item.date.toLocaleString()}</span>
                  </div>
                  <p className="text-muted small mb-0 ps-4 ms-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
