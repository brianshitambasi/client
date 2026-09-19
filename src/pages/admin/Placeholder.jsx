import React from 'react';
import { useLocation } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminPlaceholder() {
  const { pathname } = useLocation();
  const name = pathname.replace('/admin/', '').replace('-', ' ');
  return (
    <AdminLayout>
      <div className="yt-card text-center py-5">
        <h4 className="fw-bold text-capitalize mb-2">{name}</h4>
        <p className="text-muted mb-0">This section will be built in the next phase.</p>
      </div>
    </AdminLayout>
  );
}
