import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND, TEAM } from '../../utils/constants';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="yt-footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-5">
            <h5 className="text-white fw-bold mb-2">
              {BRAND}<span style={{ color: '#0d6efd' }}>.</span>
            </h5>
            <p className="mb-1">Team {TEAM} · Led by CEO TNT</p>
            <p className="small text-secondary mb-0">
              A transparent business opportunity built around people, products &amp; growth.
            </p>
          </div>
          <div className="col-md-3">
            <h6 className="text-white fw-semibold mb-3">Explore</h6>
            <ul className="list-unstyled small">
              <li className="mb-1"><Link to="/about">About</Link></li>
              <li className="mb-1"><Link to="/how-it-works">How It Works</Link></li>
              <li className="mb-1"><Link to="/business">Business Model</Link></li>
              <li className="mb-1"><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h6 className="text-white fw-semibold mb-3">Ready to learn more?</h6>
            <p className="small text-secondary">
              No pressure. No spam. Just clear information so you can decide for yourself.
            </p>
            <Link to="/qualification" className="btn yt-btn-primary btn-sm">Qualify Yourself</Link>
          </div>
        </div>
        <hr className="border-secondary mt-4" />
        <div className="d-flex flex-column flex-md-row justify-content-between small text-secondary gap-2">
          <span>© {year} {BRAND} · Team {TEAM}. All rights reserved.</span>
          <span>Income is not guaranteed. Results depend on effort, skill, and market conditions.</span>
        </div>
      </div>
    </footer>
  );
}
