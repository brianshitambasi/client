import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container text-center py-5">
      <h1 className="display-3 fw-bold mb-2">404</h1>
      <p className="text-muted mb-4">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link to="/" className="btn yt-btn-primary">Back to Home</Link>
    </div>
  );
}
