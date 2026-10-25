import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaBookOpen, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import Section from '../../components/ui/Section';
import api from '../../services/api';
import { BRAND, TEAM } from '../../utils/constants';

export default function FreeGuide() {
  const [params] = useSearchParams();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email');
      return;
    }
    setLoading(true);
    try {
      await api.post('/leads', {
        email: email.trim(),
        name: name.trim(),
        source: params.get('source') || 'direct',
        leadType: 'free_guide'
      });
      setDone(true);
    } catch (err) {
      setError(
        (err.response && err.response.data && err.response.data.message) ||
          'Something went wrong. Try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="yt-hero" style={{ padding: '4rem 0 3.5rem' }}>
        <div className="container text-center">
          <span className="yt-eyebrow mb-3">Free Guide</span>
          <h1 className="mb-3 mx-auto" style={{ maxWidth: 800 }}>
            A clear guide to network marketing — no hype, no pressure.
          </h1>
          <p className="lead mb-0 mx-auto" style={{ maxWidth: 640 }}>
            Get the free PDF that explains how {BRAND} / {TEAM} works, what it actually
            takes to succeed, and how to tell a real opportunity from a scam.
          </p>
        </div>
      </header>

      <Section>
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="yt-card" style={{ padding: '2rem' }}>
              {done ? (
                <div className="text-center py-3">
                  <FaCheckCircle style={{ fontSize: '2.5rem', color: '#198754' }} className="mb-3" />
                  <h4 className="fw-bold mb-2">Check your inbox</h4>
                  <p className="text-muted mb-0">
                    We&apos;ve emailed the guide to <strong>{email}</strong>. If you don&apos;t
                    see it within 2 minutes, check your spam folder.
                  </p>
                </div>
              ) : (
                <>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <div className="yt-card-icon mb-0" style={{ width: 42, height: 42, fontSize: '1rem' }}>
                      <FaBookOpen />
                    </div>
                    <div>
                      <h5 className="fw-bold mb-0">Download the free guide</h5>
                      <p className="text-muted small mb-0">No phone number required.</p>
                    </div>
                  </div>

                  {error && <div className="alert alert-danger py-2 small">{error}</div>}

                  <form onSubmit={submit}>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Name (optional)</label>
                      <input
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Email *</label>
                      <input
                        type="email"
                        className="form-control"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                      />
                    </div>
                    <button className="btn yt-btn-primary w-100" disabled={loading}>
                      {loading ? <><FaSpinner className="fa-spin me-2" /> Sending…</> : 'Send me the guide'}
                    </button>
                  </form>

                  <ul className="list-unstyled small text-muted mt-4 mb-0">
                    <li className="mb-1"><FaCheckCircle className="text-success me-2" /> We never sell your email</li>
                    <li className="mb-1"><FaCheckCircle className="text-success me-2" /> One email, one PDF — no spam sequence</li>
                    <li><FaCheckCircle className="text-success me-2" /> Unsubscribe anytime</li>
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
