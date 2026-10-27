import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaUser } from 'react-icons/fa';
import Section from '../../components/ui/Section';
import api from '../../services/api';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/posts/${slug}`)
      .then(res => setPost(res.data.post))
      .catch(() => setError('Article not found.'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Section><div className="text-center py-5"><div className="spinner-border text-primary" /></div></Section>;
  if (error) return <Section><div className="alert alert-warning">{error}</div><Link to="/blog" className="btn btn-outline-primary"><FaArrowLeft /> Back to Blog</Link></Section>;

  return (
    <>
      <header className="yt-hero" style={{ padding: '4rem 0 3.5rem' }}>
        <div className="container">
          <Link to="/blog" className="small text-white-50 d-inline-flex align-items-center gap-2 mb-3 text-decoration-none">
            <FaArrowLeft /> Back to Blog
          </Link>
          <h1 className="mb-3" style={{ maxWidth: 900 }}>{post.title}</h1>
          <div className="d-flex flex-wrap gap-4 text-white-50 small">
            <span className="d-flex align-items-center gap-2"><FaUser /> {post.author}</span>
            <span className="d-flex align-items-center gap-2"><FaCalendarAlt /> {new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </header>

      <Section>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {post.coverImage && (
              <img src={post.coverImage} alt={post.title} className="img-fluid rounded mb-4" style={{ width: '100%', maxHeight: 400, objectFit: 'cover' }} />
            )}
            <div className="yt-card">
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, color: '#333' }}>
                {post.content}
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
