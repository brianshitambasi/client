import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBookOpen, FaArrowRight, FaCalendarAlt } from 'react-icons/fa';
import Section from '../../components/ui/Section';
import api from '../../services/api';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/posts')
      .then(res => setPosts(res.data.items || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <header className="yt-hero" style={{ padding: '4rem 0 3.5rem' }}>
        <div className="container text-center">
          <span className="yt-eyebrow mb-3">Blog & Insights</span>
          <h1 className="mb-3 mx-auto" style={{ maxWidth: 800 }}>
            Straight talk on business, growth, and network marketing.
          </h1>
        </div>
      </header>

      <Section>
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : posts.length === 0 ? (
          <div className="text-center py-5">
            <FaBookOpen style={{ fontSize: '2rem', color: '#adb5bd' }} className="mb-3" />
            <h5 className="fw-bold">No articles yet</h5>
            <p className="text-muted small">Check back soon for new insights.</p>
          </div>
        ) : (
          <div className="row g-4 justify-content-center">
            {posts.map(post => (
              <div className="col-md-6 col-lg-4" key={post._id}>
                <div className="yt-card h-100 d-flex flex-column">
                  <h4 className="fw-bold mb-2">{post.title}</h4>
                  <div className="text-muted small mb-3 d-flex align-items-center gap-2">
                    <FaCalendarAlt /> {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                  <p className="text-muted small flex-grow-1">{post.excerpt}</p>
                  <Link to={`/blog/${post.slug}`} className="btn btn-outline-primary btn-sm mt-3 w-100">
                    Read Article <FaArrowRight className="ms-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
