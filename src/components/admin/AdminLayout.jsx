import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  FaTachometerAlt, FaUsers, FaBoxOpen, FaCalendarCheck, FaChartBar, 
  FaSignOutAlt, FaArrowLeft, FaMoon, FaSun, FaStar, FaLink 
} from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import { BRAND, TEAM } from '../../utils/constants';

const NAV = [
  { to: '/admin/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
  { to: '/admin/prospects', icon: <FaUsers />, label: 'Prospects' },
  { to: '/admin/products', icon: <FaBoxOpen />, label: 'Products' },
  { to: '/admin/reviews', icon: <FaStar />, label: 'Reviews' },
  { to: '/admin/referrals', icon: <FaLink />, label: 'Referrals' },
  { to: '/admin/followups', icon: <FaCalendarCheck />, label: 'Follow-ups' },
  { to: '/admin/analytics', icon: <FaChartBar />, label: 'Analytics' }
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('adminDarkMode') === 'true');

  useEffect(() => {
    if (darkMode) document.body.classList.add('yt-dark-admin');
    else document.body.classList.remove('yt-dark-admin');
    localStorage.setItem('adminDarkMode', darkMode);
  }, [darkMode]);

  const doLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <div className="yt-admin-shell">
      <aside className="yt-admin-side">
        <div className="yt-admin-brand d-flex align-items-center gap-2">
          <img src="/logo.svg" alt="logo" width="32" height="32" style={{ borderRadius: 8 }} />
          <div><div style={{ lineHeight: 1.1 }}>{BRAND}</div><div className="small text-secondary" style={{ fontSize: '0.72rem' }}>Team {TEAM} · Admin</div></div>
        </div>

        <nav className="yt-admin-nav mt-3">
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => `yt-admin-link ${isActive ? 'active' : ''}`}>
              {n.icon}<span>{n.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto p-3">
          <button className="yt-admin-link mb-1 w-100 border-0 bg-transparent text-start" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FaSun className="text-warning" /> : <FaMoon className="text-info" />}
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <Link to="/" className="yt-admin-link mb-1"><FaArrowLeft /><span>Back to site</span></Link>
          <button className="yt-admin-link yt-admin-link-btn" onClick={doLogout}><FaSignOutAlt /><span>Log out</span></button>
          <div className="text-secondary small mt-3 px-2">Signed in as<br /><span className="text-white">{user?.name}</span></div>
        </div>
      </aside>
      <main className="yt-admin-main">
        <div className="container-fluid py-4">{children}</div>
      </main>
    </div>
  );
}
