import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUsers,
  FaBoxOpen,
  FaCalendarCheck,
  FaChartBar,
  FaSignOutAlt,
  FaArrowLeft
} from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import { BRAND, TEAM } from '../../utils/constants';

const NAV = [
  { to: '/admin/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
  { to: '/admin/prospects', icon: <FaUsers />, label: 'Prospects' },
  { to: '/admin/products', icon: <FaBoxOpen />, label: 'Products' },
  { to: '/admin/followups', icon: <FaCalendarCheck />, label: 'Follow-ups' },
  { to: '/admin/analytics', icon: <FaChartBar />, label: 'Analytics' }
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const doLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="yt-admin-shell">
      <aside className="yt-admin-side">
        <div className="yt-admin-brand">
          {BRAND}<span style={{ color: '#0d6efd' }}>.</span>
          <div className="small text-secondary mt-1" style={{ fontSize: '0.72rem', fontWeight: 500 }}>
            Team {TEAM} · Admin
          </div>
        </div>

        <nav className="yt-admin-nav">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) => `yt-admin-link ${isActive ? 'active' : ''}`}
            >
              {n.icon}
              <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto p-3">
          <Link to="/" className="yt-admin-link mb-2">
            <FaArrowLeft />
            <span>Back to site</span>
          </Link>
          <button className="yt-admin-link yt-admin-link-btn" onClick={doLogout}>
            <FaSignOutAlt />
            <span>Log out</span>
          </button>
          <div className="text-secondary small mt-3 px-2">
            Signed in as<br />
            <span className="text-white">{user?.name || user?.email}</span>
          </div>
        </div>
      </aside>

      <main className="yt-admin-main">
        <div className="container-fluid py-4">{children}</div>
      </main>
    </div>
  );
}
