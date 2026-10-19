import React, { useEffect, useState } from 'react';
import { FaStar, FaRegStar, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import api from '../../services/api';

function Stars({ value, onChange, size = '1.25rem' }) {
  return (
    <div className="d-inline-flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          role={onChange ? 'button' : undefined}
          onClick={onChange ? () => onChange(n) : undefined}
          style={{ cursor: onChange ? 'pointer' : 'default', fontSize: size }}
        >
          {n <= value ? <FaStar className="text-warning" /> : <FaRegStar className="text-secondary" />}
        </span>
      ))}
    </div>
  );
}

export default function Reviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState({ name: '', email: '', rating: 0, text: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/products/${productId}/reviews`);
      setReviews(res.data.reviews || []);
      setAverage(res.data.average || 0);
      setCount(res.data.count || 0);
    } catch (err) {
      setError('Could not load reviews.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [productId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.rating) {
      alert('Please pick a star rating.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post(`/products/${productId}/reviews`, form);
      setSuccess(true);
      setForm({ name: '', email: '', rating: 0, text: '' });
    } catch (err) {
      alert(
        (err.response && err.response.data && (err.response.data.message || 'Submission failed')) ||
          'Submission failed.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="yt-card mt-5">
      <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
        <h4 className="fw-bold mb-0">Reviews</h4>
        {count > 0 && (
          <div className="d-flex align-items-center gap-2">
            <Stars value={Math.round(average)} size="1rem" />
            <span className="text-muted small">
              {average.toFixed(1)} out of 5 · {count} review{count > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-4"><div className="spinner-border text-primary" /></div>
      ) : error ? (
        <div className="alert alert-warning">{error}</div>
      ) : (
        <>
          {reviews.length === 0 ? (
            <p className="text-muted small mb-4">No reviews yet. Be the first.</p>
          ) : (
            <ul className="list-unstyled mb-4">
              {reviews.map((r) => (
                <li key={r._id} className="border-bottom py-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <strong>{r.name}</strong>
                      <div className="mt-1"><Stars value={r.rating} size="0.9rem" /></div>
                    </div>
                    <span className="small text-muted">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="small text-muted mb-0 mt-2">{r.text}</p>
                </li>
              ))}
            </ul>
          )}

          <hr />

          {success ? (
            <div className="alert alert-success d-flex align-items-center gap-2 mb-0">
              <FaCheckCircle /> Thank you — your review is pending approval.
            </div>
          ) : (
            <form onSubmit={submit} className="row g-3">
              <div className="col-12">
                <label className="form-label small fw-semibold d-block">Your rating *</label>
                <Stars value={form.rating} onChange={(n) => setForm({ ...form, rating: n })} />
              </div>
              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Your name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <input
                  className="form-control"
                  type="email"
                  placeholder="Your email (not shown)"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="col-12">
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="What did you think? Be specific — it helps others."
                  required
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                />
              </div>
              <div className="col-12 text-end">
                <button className="btn yt-btn-primary" disabled={submitting}>
                  {submitting ? (
                    <><FaSpinner className="fa-spin me-2" /> Submitting…</>
                  ) : (
                    'Submit review'
                  )}
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}
