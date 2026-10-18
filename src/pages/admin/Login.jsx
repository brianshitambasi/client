import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  FaLock,
  FaSpinner,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaCheckCircle,
  FaShieldAlt,
  FaChartLine,
  FaUsers
} from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import { BRAND, TEAM } from '../../utils/constants';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state && location.state.from) || '/admin/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, from, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        (err.response && err.response.data && err.response.data.message) ||
        'Login failed. Check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="yt-login-shell">
      {/* Left panel — brand + trust */}
      <div className="yt-login-left">
        <div className="yt-login-left-inner">
          <Link to="/" className="yt-login-brand">
            {BRAND}
          </Link>
          <p className="yt-login-tagline">
            Manage prospects, products, and follow-ups — from one clean dashboard.
          </p>

          <ul className="yt-login-features">
            <li>
              <FaUsers />
              <div>
                <strong>Prospect pipeline</strong>
                <span>Track every lead from first touch to joined.</span>
              </div>
            </li>
            <li>
              <FaChartLine />
              <div>
                <strong>Live analytics</strong>
                <span>See which sources actually convert.</span>
              </div>
            </li>
            <li>
              <FaShieldAlt />
              <div>
                <strong>CEO-only access</strong>
                <span>JWT-protected. No public signups.</span>
              </div>
            </li>
          </ul>

          <div className="yt-login-footer">
            <div className="yt-login-quote">
              “Clarity beats pressure. Every time.”
            </div>
            <div className="yt-login-quote-author">— CEO TNT</div>
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="yt-login-right">
        <div className="yt-login-card">
          <div className="mb-4">
            <h3 className="fw-bold mb-1">Sign in</h3>
            <p className="text-muted small mb-0">
              Welcome back. Enter your credentials to continue.
            </p>
          </div>

          {error && (
            <div className="alert alert-danger py-2 small mb-3" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Email</label>
              <input
                type="email"
                className="form-control form-control-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                autoComplete="email"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>

            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label small fw-semibold mb-0">Password</label>
              </div>
              <div className="position-relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control form-control-lg pe-5"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="btn btn-sm position-absolute top-50 translate-middle-y"
                  style={{ right: 6, border: 0, background: 'transparent', color: '#6c757d' }}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn yt-btn-primary w-100 py-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="fa-spin me-2" /> Signing in…
                </>
              ) : (
                <>
                  <FaLock className="me-2" /> Sign in <FaArrowRight className="ms-1" />
                </>
              )}
            </button>
          </form>

          <div className="d-flex align-items-center gap-2 mt-4 pt-3 border-top">
            <FaCheckCircle className="text-success flex-shrink-0" />
            <span className="small text-muted">
              Private admin area. CEO {TEAM} only. All actions are logged.
            </span>
          </div>

          <div className="text-center small mt-3">
            <Link to="/" className="text-decoration-none text-muted">
              ← Back to site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
