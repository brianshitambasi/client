import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaArrowRight, FaSyncAlt, FaImage } from 'react-icons/fa';
import Section from '../../components/ui/Section';
import api from '../../services/api';

export default function Products() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/products');
      setItems(res.data.items || []);
    } catch (err) {
      setError('Could not load products right now. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <>
      <header className="yt-hero" style={{ padding: '4rem 0 3.5rem' }}>
        <div className="container">
          <span className="yt-eyebrow mb-3">Products &amp; Services</span>
          <h1 className="mb-3" style={{ maxWidth: 900 }}>
            Real products with a defined value.
          </h1>
          <p className="lead mb-0" style={{ maxWidth: 720 }}>
            The business is built on real products. Browse the catalog below. If you&apos;d
            like a personal explanation of any product, request one from the qualification page.
          </p>
        </div>
      </header>

      <Section>
        {loading && (
          <div className="text-center py-5">
            <FaSyncAlt className="fa-spin mb-3" style={{ fontSize: '1.6rem', color: '#0d6efd' }} />
            <p className="text-muted mb-0">Loading products…</p>
          </div>
        )}

        {!loading && error && (
          <div className="alert alert-warning d-flex justify-content-between align-items-center">
            <span>{error}</span>
            <button className="btn btn-sm btn-outline-dark" onClick={load}>Retry</button>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="row justify-content-center text-center">
            <div className="col-lg-7">
              <div className="yt-card">
                <div className="yt-card-icon mx-auto"><FaBoxOpen /></div>
                <h4 className="fw-bold mb-2">Catalog is being set up</h4>
                <p className="text-muted mb-4">
                  Product listings are added by CEO TNT. Check back soon, or request a
                  personal explanation to learn more about what the business offers today.
                </p>
                <Link to="/qualification" className="btn yt-btn-primary">
                  Request More Info <FaArrowRight className="ms-2" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="row g-4">
            {items.map((p) => {
              const first = (p.images && p.images[0]) || null;
              return (
                <div className="col-md-6 col-lg-4" key={p._id}>
                  <div
                    className="yt-product-card d-flex flex-column h-100"
                    style={{ overflow: 'hidden' }}
                  >
                    {first ? (
                      <img
                        src={first.url}
                        alt={p.name}
                        style={{
                          width: '100%',
                          height: 240,
                          objectFit: 'cover',
                          display: 'block'
                        }}
                      />
                    ) : (
                      <div className="yt-product-thumb" style={{ height: 240 }}>
                        <FaImage style={{ fontSize: '2.5rem' }} />
                      </div>
                    )}
                    <div className="yt-product-body d-flex flex-column flex-grow-1">
                      <span className="yt-eyebrow mb-2">{p.category || 'General'}</span>
                      <h5 className="fw-bold mb-2">{p.name}</h5>
                      <p className="text-muted small mb-3 flex-grow-1">
                        {p.shortDesc || 'No description provided.'}
                      </p>
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <span className="yt-product-price">
                          {p.currency} {Number(p.price || 0).toLocaleString()}
                        </span>
                        <Link
                          to={`/products/${p._id}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          View <FaArrowRight className="ms-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Section>
    </>
  );
}
