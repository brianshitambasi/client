import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  FaLock, FaSpinner, FaEye, FaEyeSlash, FaArrowRight,
  FaCheckCircle, FaShieldAlt, FaChartLine, FaUsers,
  FaQrcode, FaKey, FaCopy
} from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';
import { BRAND, TEAM } from '../../utils/constants';

export default function Login() {
  const { login, completeLogin, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state && location.state.from) || '/admin/dashboard';

  const [step, setStep] = useState('password'); // 'password' | 'setup' | 'code'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 2FA state
  const [setupToken, setSetupToken] = useState('');
  const [preAuthToken, setPreAuthToken] = useState('');
  const [qr, setQr] = useState('');
  const [secret, setSecret] = useState('');
  const [code, setCode] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState([]);

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, from, navigate]);

  // STEP 1: Password
  const onSubmitPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(email.trim(), password);
      if (result.requires2FA) {
        setPreAuthToken(result.preAuthToken);
        setStep('code');
      } else if (result.requiresSetup) {
        setSetupToken(result.setupToken);
        // Immediately request QR
        const res = await api.post('/auth/2fa/setup', { setupToken: result.setupToken });
        setQr(res.data.qr);
        setSecret(res.data.secret);
        setStep('setup');
      } else if (result.success) {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(
        (err.response && err.response.data && err.response.data.message) ||
          'Login failed. Check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  // STEP 2a: Setup — verify first code to activate
  const onEnable2FA = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/2fa/enable', { setupToken, code });
      setRecoveryCodes(res.data.recoveryCodes);
      completeLogin(res.data.token, res.data.user);
      // Show recovery codes for 15 seconds, then navigate
      setTimeout(() => navigate(from, { replace: true }), 15000);
    } catch (err) {
      setError(
        (err.response && err.response.data && err.response.data.message) ||
          'Invalid code. Check the time on your phone and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // STEP 2b: Verify — normal login with code or recovery code
  const onVerify2FA = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/2fa/verify', { preAuthToken, code });
      completeLogin(res.data.token, res.data.user);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        (err.response && err.response.data && err.response.data.message) ||
          'Invalid code. Try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
  };

  // ============ RENDER ============

  // Success screen after enabling 2FA — show recovery codes
  if (recoveryCodes.length > 0) {
    return (
      <div className="yt-login-shell">
        <div className="yt-login-right" style={{ width: '100%' }}>
          <div className="yt-login-card" style={{ maxWidth: 560 }}>
            <div className="text-center mb-3">
              <FaCheckCircle style={{ fontSize: '2.5rem', color: '#198754' }} />
            </div>
            <h3 className="fw-bold text-center mb-3">2FA enabled!</h3>
            <p className="text-muted small text-center mb-4">
              Save these recovery codes somewhere safe. Each code works <strong>once</strong>. If you lose
              your phone, use one of them to log in. You can also view them again later in your settings.
            </p>
            <div
              className="bg-light rounded p-3 mb-3 font-monospace"
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}
            >
              {recoveryCodes.map((c, i) => (
                <div key={i} className="d-flex justify-content-between">
                  <span>{c}</span>
                  <button className="btn btn-sm btn-outline-secondary p-0 px-1" onClick={() => copyText(c)}>
                    <FaCopy style={{ fontSize: '0.7rem' }} />
                  </button>
                </div>
              ))}
            </div>
            <button className="btn yt-btn-primary w-100" onClick={() => navigate(from, { replace: true })}>
              Continue to dashboard <FaArrowRight className="ms-2" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="yt-login-shell">
      <div className="yt-login-left">
        <div className="yt-login-left-inner">
          <Link to="/" className="yt-login-brand">{BRAND}</Link>
          <p className="yt-login-tagline">
            Manage prospects, products, and follow-ups — from one clean dashboard.
          </p>
          <ul className="yt-login-features">
            <li><FaUsers /><div><strong>Prospect pipeline</strong><span>Track every lead from first touch to joined.</span></div></li>
            <li><FaChartLine /><div><strong>Live analytics</strong><span>See which sources actually convert.</span></div></li>
            <li><FaShieldAlt /><div><strong>CEO-only access</strong><span>Password + 2FA. Double-locked.</span></div></li>
          </ul>
          <div className="yt-login-footer">
            <div className="yt-login-quote">"Clarity beats pressure. Every time."</div>
            <div className="yt-login-quote-author">— CEO TNT</div>
          </div>
        </div>
      </div>

      <div className="yt-login-right">
        <div className="yt-login-card">
          {step === 'password' && (
            <>
              <div className="mb-4">
                <h3 className="fw-bold mb-1">Sign in</h3>
                <p className="text-muted small mb-0">Welcome back. Enter your credentials to continue.</p>
              </div>
              {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}
              <form onSubmit={onSubmitPassword} noValidate>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Email</label>
                  <input type="email" className="form-control form-control-lg" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus autoComplete="email" placeholder="you@example.com" disabled={loading} />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Password</label>
                  <div className="position-relative">
                    <input type={showPassword ? 'text' : 'password'} className="form-control form-control-lg pe-5" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" placeholder="••••••••" disabled={loading} />
                    <button type="button" className="btn btn-sm position-absolute top-50 translate-middle-y" style={{ right: 6, border: 0, background: 'transparent', color: '#6c757d' }} onClick={() => setShowPassword((v) => !v)} tabIndex={-1}>
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                <button type="submit" className="btn yt-btn-primary w-100 py-2" disabled={loading}>
                  {loading ? <><FaSpinner className="fa-spin me-2" /> Signing in…</> : <><FaLock className="me-2" /> Sign in <FaArrowRight className="ms-1" /></>}
                </button>
              </form>
              <div className="d-flex align-items-center gap-2 mt-4 pt-3 border-top">
                <FaShieldAlt className="text-success flex-shrink-0" />
                <span className="small text-muted">Private admin area. CEO {TEAM} only.</span>
              </div>
              <div className="text-center small mt-3">
                <Link to="/" className="text-decoration-none text-muted">← Back to site</Link>
              </div>
            </>
          )}

          {step === 'setup' && (
            <>
              <div className="mb-3 text-center">
                <FaQrcode style={{ fontSize: '2rem', color: '#0d6efd' }} />
              </div>
              <h3 className="fw-bold mb-1 text-center">Set up 2FA</h3>
              <p className="text-muted small text-center mb-3">
                Scan this QR code with Google Authenticator, Authy, or any TOTP app.
              </p>
              {qr && <img src={qr} alt="QR code" style={{ width: '100%', maxWidth: 220, margin: '0 auto', display: 'block', borderRadius: 12 }} />}
              <details className="mt-3 mb-3">
                <summary className="small text-muted">Can&apos;t scan? Enter code manually</summary>
                <div className="bg-light rounded p-2 mt-2 d-flex justify-content-between align-items-center font-monospace small">
                  <span style={{ wordBreak: 'break-all' }}>{secret}</span>
                  <button className="btn btn-sm btn-outline-secondary ms-2" onClick={() => copyText(secret)}>
                    <FaCopy />
                  </button>
                </div>
              </details>
              {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}
              <form onSubmit={onEnable2FA}>
                <label className="form-label small fw-semibold">Enter the 6-digit code from your app</label>
                <input className="form-control form-control-lg text-center mb-3" style={{ letterSpacing: '0.5rem', fontSize: '1.5rem' }} maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} placeholder="123456" autoFocus disabled={loading} />
                <button type="submit" className="btn yt-btn-primary w-100 py-2" disabled={loading || code.length !== 6}>
                  {loading ? <><FaSpinner className="fa-spin me-2" /> Verifying…</> : <><FaCheckCircle className="me-2" /> Enable 2FA</>}
                </button>
              </form>
            </>
          )}

          {step === 'code' && (
            <>
              <div className="mb-3 text-center">
                <FaKey style={{ fontSize: '2rem', color: '#0d6efd' }} />
              </div>
              <h3 className="fw-bold mb-1 text-center">Enter 2FA code</h3>
              <p className="text-muted small text-center mb-3">
                Open your authenticator app and type the 6-digit code for <strong>BRIAN — CEO TNT</strong>.
              </p>
              {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}
              <form onSubmit={onVerify2FA}>
                <input className="form-control form-control-lg text-center mb-3" style={{ letterSpacing: '0.5rem', fontSize: '1.5rem' }} maxLength={10} value={code} onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} placeholder="123456" autoFocus disabled={loading} />
                <button type="submit" className="btn yt-btn-primary w-100 py-2" disabled={loading || code.length < 6}>
                  {loading ? <><FaSpinner className="fa-spin me-2" /> Verifying…</> : <><FaLock className="me-2" /> Verify <FaArrowRight className="ms-1" /></>}
                </button>
              </form>
              <p className="text-muted small text-center mt-3 mb-0">
                Lost your phone? Enter one of your recovery codes instead.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
