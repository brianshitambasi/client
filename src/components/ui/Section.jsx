import React from 'react';

export default function Section({ children, className = '', light = false }) {
  return (
    <section className={`yt-section ${light ? 'yt-section-light' : ''} ${className}`}>
      <div className="container">{children}</div>
    </section>
  );
}
