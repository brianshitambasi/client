import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaLock, FaSpinner } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import { BRAND, TEAM } from '../../utils/constants';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state && location.state.from) || '/admin/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      await login(email, password);
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
    <div className="yt-login-wrap">
      <div className="yt-login-card">
        <div className="text-center mb-4">
          <h4 className="fw-bold mb-1">{BRAND}</h4>
          <p className="text-muted small mb-0">Team {TEAM} · CEO Admin</p>
        </div>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn yt-btn-primary w-100" disabled={loading}>
            {loading ? (
              <><FaSpinner className="fa-spin me-2" /> Signing in…</>
            ) : (
              <><FaLock className="me-2" /> Sign In</>
            )}
          </button>
        </form>

        <p className="text-center text-muted small mt-4 mb-0">
          This area is only for CEO TNT.
        </p>
      </div>
    </div>
  );
}
