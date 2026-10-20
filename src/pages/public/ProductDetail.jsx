import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaImage, FaWhatsapp, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import Section from '../../components/ui/Section';
import Reviews from '../../components/ui/Reviews';
import ShareButton from '../../components/ui/ShareButton';
import api from '../../services/api';
import { CEO_NAME, whatsappLink, BRAND, TEAM } from '../../utils/constants';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .get(`/products/${id}`)
      .then((res) => setItem(res.data.item))
      .catch((err) => {
        setError(
          (err.response && err.response.data && err.response.data.message) || 'Product not found.'
        );
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const onEsc = (e) => { if (e.key === 'Escape') setLightbox(false); };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);

  if (loading) {
    return (
      <Section>
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      </Section>
    );
  }

  if (error || !item) {
    return (
      <Section>
        <div className="alert alert-warning">{error || 'Product not found.'}</div>
        <button className="btn btn-outline-primary" onClick={() => navigate('/products')}>
          <FaArrowLeft className="me-2" /> Back to products
        </button>
      </Section>
    );
  }

  const images = item.images || [];
  const active = images[activeIdx] || null;

  const wa = whatsappLink(
    `Hi ${CEO_NAME}, I'm interested in "${item.name}" from ${BRAND} / ${TEAM}. Could you tell me more?`
  );

  return (
    <>
      <header className="yt-hero" style={{ padding: '3rem 0 2.5rem' }}>
        <div className="container">
          <Link to="/products" className="small text-white-50 d-inline-flex align-items-center gap-2 mb-3">
            <FaArrowLeft /> Back to products
          </Link>
          <span className="yt-eyebrow mb-3">{item.category || 'General'}</span>
          <h1 className="mb-2">{item.name}</h1>
          {item.shortDesc && <p className="lead mb-0" style={{ maxWidth: 720 }}>{item.shortDesc}</p>}
        </div>
      </header>

      <Section>
        <div className="row g-5">
          <div className="col-lg-7">
            {active ? (
              <>
                <img
                  src={active.url}
                  alt={item.name}
                  onClick={() => setLightbox(true)}
                  style={{
                    width: '100%',
                    maxHeight: 620,
                    objectFit: 'contain',
                    background: '#f5f7fb',
                    borderRadius: 16,
                    border: '1px solid #e6e9f2',
                    cursor: 'zoom-in',
                    display: 'block'
                  }}
                />
                <p className="text-muted small mt-2 mb-0">Click the image to view it full size.</p>

                {images.length > 1 && (
                  <div className="d-flex gap-2 mt-3 flex-wrap">
                    {images.map((img, i) => (
                      <button
                        key={img.publicId || img.url || i}
                        type="button"
                        onClick={() => setActiveIdx(i)}
                        className="p-0"
                        style={{
                          width: 84,
                          height: 84,
                          borderRadius: 10,
                          overflow: 'hidden',
                          border: i === activeIdx ? '2px solid #0d6efd' : '1px solid #e6e9f2',
                          background: 'transparent',
                          cursor: 'pointer'
                        }}
                      >
                        <img
                          src={img.url}
                          alt={`${item.name} ${i + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div
                className="d-flex align-items-center justify-content-center text-muted"
                style={{
                  width: '100%',
                  height: 420,
                  borderRadius: 16,
                  border: '1px dashed #dee2e6',
                  background: '#fafbfc'
                }}
              >
                <FaImage style={{ fontSize: '3rem' }} />
              </div>
            )}
          </div>

          <div className="col-lg-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="yt-product-price" style={{ fontSize: '1.6rem' }}>
                {item.currency} {Number(item.price || 0).toLocaleString()}
              </span>
              {item.isActive !== false && <span className="badge bg-success">Available</span>}
            </div>

            {item.longDesc && <p className="text-muted">{item.longDesc}</p>}

            {item.features && item.features.length > 0 && (
              <ul className="yt-list-check mt-3">
                {item.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            )}

            <div className="d-grid gap-2 mt-4">
              <a href={wa} target="_blank" rel="noreferrer" className="btn yt-btn-primary">
                <FaWhatsapp className="me-2" /> Ask CEO {CEO_NAME} about this
              </a>
              <Link to="/qualification" className="btn btn-outline-primary">
                Request a personal explanation <FaArrowRight className="ms-1" />
              </Link>
            </div>

            <div className="mt-3 pt-3 border-top">
              <ShareButton
                url={`https://brian-ceotnt.vercel.app/products/${item._id}`}
                text={`Check out "${item.name}" from ${BRAND} / ${TEAM}`}
                label="Share this product"
                variant="outline"
                size="sm"
              />
            </div>

            <div className="mt-4 p-3 rounded" style={{ background: '#f5f7fb' }}>
              <div className="small d-flex align-items-start gap-2">
                <FaCheckCircle className="text-primary mt-1" />
                <span className="text-muted">
                  Products are provided as part of the {BRAND} / {TEAM} business. Real value,
                  real delivery. If you want to understand how the business works around these
                  products, the qualification page is the best next step.
                </span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section light>
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <Reviews productId={item._id} />
          </div>
        </div>
      </Section>

      {lightbox && active && (
        <div
          onClick={() => setLightbox(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5,10,25,0.92)',
            zIndex: 1050,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            cursor: 'zoom-out'
          }}
        >
          <img
            src={active.url}
            alt={item.name}
            style={{ maxWidth: '95%', maxHeight: '95%', objectFit: 'contain', borderRadius: 12 }}
          />
          <button
            className="btn btn-light"
            onClick={(e) => { e.stopPropagation(); setLightbox(false); }}
            style={{ position: 'absolute', top: 20, right: 20 }}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
}
