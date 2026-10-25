import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { BRAND, TEAM } from '../../utils/constants';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <nav className="navbar navbar-expand-lg yt-navbar sticky-top">
      <div className="container">
        <Link className="navbar-brand yt-brand" to="/" onClick={close}>
          {BRAND}
          <small className="ms-2 text-white-50" style={{ fontSize: '0.7rem', fontWeight: 500 }}>
            Team {TEAM}
          </small>
        </Link>

        <button
          className="navbar-toggler border-0 text-white"
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`collapse navbar-collapse ${open ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item"><NavLink end className="nav-link" to="/" onClick={close}>Home</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/about" onClick={close}>About</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/how-it-works" onClick={close}>How It Works</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/products" onClick={close}>Products</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/business" onClick={close}>Business</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/students" onClick={close}>Students</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/free-guide" onClick={close}>Free Guide</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/faq" onClick={close}>FAQ</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/contact" onClick={close}>Contact</NavLink></li>
            <li className="nav-item ms-lg-3 mt-2 mt-lg-0">
              <Link className="btn yt-btn-primary btn-sm px-3" to="/qualification" onClick={close}>
                Get Started
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
