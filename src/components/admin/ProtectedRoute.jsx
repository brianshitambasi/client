import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function ProtectedRoute({ children, role = 'ceo' }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
        <p className="text-muted mt-3 mb-0">Checking session…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  if (role && user.role !== role) {
    return (
      <div className="container py-5 text-center">
        <h3 className="fw-bold">Forbidden</h3>
        <p className="text-muted">Your account does not have access to this area.</p>
      </div>
    );
  }

  return children;
}
