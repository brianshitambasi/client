import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaArrowRight, FaArrowLeft, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import Section from '../../components/ui/Section';
import InputField from '../../components/forms/InputField';
import api from '../../services/api';
import {
  LOOKING_FOR_OPTIONS,
  PREFERRED_CONTACT_OPTIONS,
  WANTS_EXPLANATION_OPTIONS,
  WEEKLY_TIME_OPTIONS,
  SOURCES,
  TEAM,
  CEO_NAME
} from '../../utils/constants';

const STEPS = ['About you', 'What you want', 'One last thing', 'Review'];

export default function Qualification() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    fullName: '',
    whatsapp: '',
    email: '',
    country: '',
    preferredContact: 'whatsapp',
    lookingFor: '',
    previousExperience: '',
    weeklyTime: '',
    wantsExplanation: '',
    questionsToClarify: '',
    source: params.get('source') || 'direct',
    referralCode: params.get('ref') || ''
  });

  useEffect(() => {
    const src = params.get('source');
    if (src && SOURCES.includes(src)) {
      setForm((f) => ({ ...f, source: src }));
    }
  }, [params]);

  const set = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: '' }));
  };

  const validateStep = () => {
    const er = {};

    if (step === 0) {
      if (!form.fullName.trim() || form.fullName.trim().length < 2) {
        er.fullName = 'Please enter your full name';
      }

      if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
        er.email = 'Please enter a valid email';
      }

      const phone = (form.whatsapp || '').trim();
      const digitsOnly = phone.replace(/\D/g, '');
      if (!phone) {
        er.whatsapp = 'Please enter your WhatsApp number';
      } else if (/[a-zA-Z@]/.test(phone)) {
        er.whatsapp = 'WhatsApp number cannot contain letters or @';
      } else if (digitsOnly.length < 7 || digitsOnly.length > 15) {
        er.whatsapp = 'Please enter a valid phone number (7–15 digits)';
      }

      if (!form.country.trim()) er.country = 'Please enter your country';
    }

    if (step === 1) {
      if (!form.lookingFor) er.lookingFor = 'Please pick what you are looking for';
      if (form.previousExperience === '') er.previousExperience = 'Please answer this';
      if (!form.weeklyTime) er.weeklyTime = 'Please choose an option';
    }

    if (step === 2) {
      if (!form.wantsExplanation) er.wantsExplanation = 'Please pick an option';
    }

    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const back = () => {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = async () => {
    setServerError('');
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        whatsapp: form.whatsapp.replace(/\s+/g, ''),
        previousExperience: form.previousExperience === 'yes'
      };
      const res = await api.post('/prospects', payload);
      navigate('/thank-you', {
        state: {
          prospectId: res.data.prospect.id,
          category: res.data.prospect.leadCategory
        }
      });
    } catch (err) {
      const msg =
        (err.response && err.response.data && (err.response.data.message || 'Submission failed')) ||
        'Network error. Please try again.';
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <>
      <header className="yt-hero" style={{ padding: '3rem 0 2.5rem' }}>
        <div className="container">
          <span className="yt-eyebrow mb-3">Qualification</span>
          <h1 className="mb-3" style={{ maxWidth: 820 }}>
            Let&apos;s see if this is a good fit — for you.
          </h1>
          <p className="lead mb-0" style={{ maxWidth: 720 }}>
            Four short steps. No obligation. If it isn&apos;t a match, we&apos;ll tell you
            honestly. CEO {CEO_NAME} reviews every submission personally.
          </p>
        </div>
      </header>

      <Section>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="mb-4">
              <div className="d-flex justify-content-between small text-muted mb-2">
                <span>Step {step + 1} of {STEPS.length}</span>
                <span>{STEPS[step]}</span>
              </div>
              <div className="progress" style={{ height: 8, borderRadius: 999 }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${progress}%`, background: '#0d6efd' }}
                />
              </div>
            </div>

            <div className="yt-card" style={{ padding: '2rem' }}>
              {serverError && <div className="alert alert-danger">{serverError}</div>}

              {step === 0 && (
                <>
                  <h5 className="fw-bold mb-3">Tell us about you</h5>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <InputField label="Full name" name="fullName" value={form.fullName} onChange={set} required error={errors.fullName} placeholder="Jane Doe" />
                    </div>
                    <div className="col-md-6">
                      <InputField label="Country" name="country" value={form.country} onChange={set} required error={errors.country} placeholder="Kenya" />
                    </div>
                    <div className="col-md-6">
                      <InputField label="WhatsApp number" name="whatsapp" value={form.whatsapp} onChange={set} required error={errors.whatsapp} placeholder="2547XXXXXXXX" />
                    </div>
                    <div className="col-md-6">
                      <InputField label="Email" name="email" type="email" value={form.email} onChange={set} required error={errors.email} placeholder="you@example.com" />
                    </div>
                    <div className="col-12">
                      <InputField
                        label="Preferred way to communicate"
                        name="preferredContact"
                        as="select"
                        value={form.preferredContact}
                        onChange={set}
                        options={PREFERRED_CONTACT_OPTIONS}
                      />
                    </div>
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <h5 className="fw-bold mb-3">What are you looking for?</h5>
                  <InputField
                    label="Main interest"
                    name="lookingFor"
                    as="select"
                    value={form.lookingFor}
                    onChange={set}
                    required
                    error={errors.lookingFor}
                    options={LOOKING_FOR_OPTIONS}
                  />

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">
                      Have you been involved in network marketing before? <span className="text-danger">*</span>
                    </label>
                    <div className="d-flex gap-3">
                      {['yes', 'no'].map((v) => (
                        <label key={v} className="d-flex align-items-center gap-2">
                          <input
                            type="radio"
                            name="previousExperience"
                            value={v}
                            checked={form.previousExperience === v}
                            onChange={set}
                          />
                          <span className="text-capitalize">{v}</span>
                        </label>
                      ))}
                    </div>
                    {errors.previousExperience && (
                      <div className="text-danger small mt-1">{errors.previousExperience}</div>
                    )}
                  </div>

                  <InputField
                    label="How much time can you realistically dedicate each week?"
                    name="weeklyTime"
                    as="select"
                    value={form.weeklyTime}
                    onChange={set}
                    required
                    error={errors.weeklyTime}
                    options={WEEKLY_TIME_OPTIONS.map((w) => ({ value: w, label: w }))}
                  />
                </>
              )}

              {step === 2 && (
                <>
                  <h5 className="fw-bold mb-3">One last thing</h5>
                  <InputField
                    label="Would you like a personal explanation?"
                    name="wantsExplanation"
                    as="select"
                    value={form.wantsExplanation}
                    onChange={set}
                    required
                    error={errors.wantsExplanation}
                    options={WANTS_EXPLANATION_OPTIONS}
                  />

                  <InputField
                    label="What would you like to understand better? (optional)"
                    name="questionsToClarify"
                    as="textarea"
                    value={form.questionsToClarify}
                    onChange={set}
                    placeholder="Ask anything — costs, time, products, how commissions work…"
                  />
                </>
              )}

              {step === 3 && (
                <>
                  <h5 className="fw-bold mb-3">Review your answers</h5>
                  <div className="table-responsive">
                    <table className="table table-sm align-middle">
                      <tbody>
                        <tr><th style={{ width: 200 }}>Full name</th><td>{form.fullName}</td></tr>
                        <tr><th>Country</th><td>{form.country}</td></tr>
                        <tr><th>WhatsApp</th><td>{form.whatsapp}</td></tr>
                        <tr><th>Email</th><td>{form.email}</td></tr>
                        <tr><th>Preferred contact</th><td className="text-capitalize">{form.preferredContact}</td></tr>
                        <tr><th>Looking for</th><td>{LOOKING_FOR_OPTIONS.find((o) => o.value === form.lookingFor)?.label || '—'}</td></tr>
                        <tr><th>Previous experience</th><td className="text-capitalize">{form.previousExperience || '—'}</td></tr>
                        <tr><th>Weekly time</th><td>{form.weeklyTime || '—'}</td></tr>
                        <tr><th>Wants explanation</th><td>{WANTS_EXPLANATION_OPTIONS.find((o) => o.value === form.wantsExplanation)?.label || '—'}</td></tr>
                        <tr><th>Questions</th><td>{form.questionsToClarify || <span className="text-muted">—</span>}</td></tr>
                        <tr><th>Source</th><td className="text-capitalize">{form.source}</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-muted small mb-0">
                    By submitting, you agree to be contacted by CEO {CEO_NAME} and the {TEAM} team
                    about this opportunity. You can ask us to stop at any time.
                  </p>
                </>
              )}

              <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={back}
                  disabled={step === 0 || submitting}
                >
                  <FaArrowLeft className="me-2" /> Back
                </button>

                {step < STEPS.length - 1 ? (
                  <button type="button" className="btn yt-btn-primary" onClick={next}>
                    Next <FaArrowRight className="ms-2" />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn yt-btn-primary"
                    onClick={submit}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <><FaSpinner className="fa-spin me-2" /> Submitting…</>
                    ) : (
                      <><FaCheckCircle className="me-2" /> Submit</>
                    )}
                  </button>
                )}
              </div>
            </div>

            <p className="text-muted small text-center mt-3 mb-0">
              Prefer to talk first? <Link to="/contact">Contact CEO {CEO_NAME}</Link>.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
