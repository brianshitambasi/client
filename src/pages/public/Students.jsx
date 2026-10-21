import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaGraduationCap, FaCheckCircle, FaSpinner, FaArrowRight } from 'react-icons/fa';
import Section from '../../components/ui/Section';
import InputField from '../../components/forms/InputField';
import PhoneInputField from '../../components/forms/PhoneInputField';
import api from '../../services/api';
import { TEAM, CEO_NAME } from '../../utils/constants';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Students() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    whatsapp: '',
    school: '',
    course: '',
    yearOfStudy: '',
    daysAvailable: [],
    country: '',
    source: params.get('source') || 'direct',
    referralCode: params.get('ref') || ''
  });

  const set = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: '' }));
  };

  const toggleDay = (day) => {
    setForm((f) => {
      const has = f.daysAvailable.includes(day);
      return {
        ...f,
        daysAvailable: has
          ? f.daysAvailable.filter((d) => d !== day)
          : [...f.daysAvailable, day]
      };
    });
    setErrors((er) => ({ ...er, daysAvailable: '' }));
  };

  const validate = () => {
    const er = {};

    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      er.fullName = 'Please enter your full name';
    }

    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
      er.email = 'Please enter a valid email';
    }

    if (!form.school.trim() || form.school.trim().length < 2) {
      er.school = 'Please enter your school name';
    }

    const phone = (form.whatsapp || '').trim();
    const digits = phone.replace(/\D/g, '');
    if (!phone) {
      er.whatsapp = 'WhatsApp number is required';
    } else if (digits.length < 10 || digits.length > 15) {
      er.whatsapp = 'Please enter a valid phone number';
    }

    if (form.daysAvailable.length === 0) {
      er.daysAvailable = 'Pick at least one day';
    }

    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setServerError('');
    setSubmitting(true);
    try {
      const res = await api.post('/students', {
        ...form,
        whatsapp: form.whatsapp.replace(/\D/g, '')
      });
      navigate('/thank-you', {
        state: {
          prospectId: res.data.prospect.id,
          category: res.data.prospect.leadCategory,
          student: true
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

  return (
    <>
      <header className="yt-hero" style={{ padding: '3.5rem 0 3rem' }}>
        <div className="container">
          <span className="yt-eyebrow mb-3">Student Signup</span>
          <h1 className="mb-3" style={{ maxWidth: 820 }}>
            Built for students who want a real opportunity, not a lecture.
          </h1>
          <p className="lead mb-0" style={{ maxWidth: 720 }}>
            Share a few details and we&apos;ll match you to a suitable role or project inside
            the {TEAM} team. Inclusive of your school and the days you are available.
          </p>
        </div>
      </header>

      <Section>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="yt-card" style={{ padding: '2rem' }}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="yt-card-icon mb-0" style={{ width: 42, height: 42, fontSize: '1rem' }}>
                  <FaGraduationCap />
                </div>
                <div>
                  <h5 className="fw-bold mb-0">Student details</h5>
                  <p className="text-muted small mb-0">Takes less than a minute.</p>
                </div>
              </div>

              {serverError && <div className="alert alert-danger">{serverError}</div>}

              <form onSubmit={submit} className="row g-3">
                <div className="col-md-6">
                  <InputField label="Full name" name="fullName" value={form.fullName} onChange={set} required error={errors.fullName} placeholder="Jane Doe" />
                </div>
                <div className="col-md-6">
                  <InputField label="Email" name="email" type="email" value={form.email} onChange={set} required error={errors.email} placeholder="you@example.com" />
                </div>

                <div className="col-md-6">
                  <InputField label="School" name="school" value={form.school} onChange={set} required error={errors.school} placeholder="University of Nairobi" />
                </div>
                <div className="col-md-6">
                  <PhoneInputField
                    label="WhatsApp Number"
                    value={form.whatsapp}
                    onChange={(val) => setForm({ ...form, whatsapp: val })}
                    required
                    error={errors.whatsapp}
                  />
                </div>

                <div className="col-md-6">
                  <InputField label="Course (optional)" name="course" value={form.course} onChange={set} placeholder="Computer Science" />
                </div>
                <div className="col-md-6">
                  <InputField label="Year of study (optional)" name="yearOfStudy" value={form.yearOfStudy} onChange={set} placeholder="Year 3" />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold small">
                    Days you are available <span className="text-danger">*</span>
                  </label>
                  <div className="d-flex flex-wrap gap-2">
                    {DAYS.map((d) => {
                      const active = form.daysAvailable.includes(d);
                      return (
                        <button
                          type="button"
                          key={d}
                          onClick={() => toggleDay(d)}
                          className={`btn btn-sm ${active ? 'btn-primary' : 'btn-outline-secondary'}`}
                          style={{ minWidth: 60, borderRadius: 10 }}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                  {errors.daysAvailable && (
                    <div className="text-danger small mt-1">{errors.daysAvailable}</div>
                  )}
                </div>

                <div className="col-12">
                  <InputField label="Country (optional)" name="country" value={form.country} onChange={set} placeholder="Kenya" />
                </div>

                <div className="col-12 text-end">
                  <button type="submit" className="btn yt-btn-primary" disabled={submitting}>
                    {submitting ? (
                      <><FaSpinner className="fa-spin me-2" /> Submitting…</>
                    ) : (
                      <>Submit details <FaArrowRight className="ms-2" /></>
                    )}
                  </button>
                </div>

                <div className="col-12">
                  <div className="d-flex align-items-start gap-2 small text-muted">
                    <FaCheckCircle className="text-primary mt-1" />
                    <span>
                      Your details go only to CEO {CEO_NAME} and the {TEAM} team. We use them
                      solely to follow up on your application. You can ask us to delete them at
                      any time.
                    </span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
