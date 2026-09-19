import React, { useEffect, useRef, useState } from 'react';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaBoxOpen,
  FaEyeSlash,
  FaEye,
  FaUpload,
  FaImage,
  FaSpinner
} from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';

const EMPTY = {
  name: '',
  shortDesc: '',
  longDesc: '',
  category: 'General',
  price: 0,
  currency: 'KES',
  features: '',
  isActive: true,
  images: []
};

export default function AdminProducts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/products');
      setItems(res.data.items || []);
    } catch (err) {
      setError(
        (err.response && err.response.data && err.response.data.message) ||
          'Failed to load products.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const startNew = () => {
    setEditing('new');
    setForm(EMPTY);
    setUploadError('');
  };

  const startEdit = (p) => {
    setEditing(p._id);
    setForm({
      name: p.name,
      shortDesc: p.shortDesc || '',
      longDesc: p.longDesc || '',
      category: p.category || 'General',
      price: p.price || 0,
      currency: p.currency || 'KES',
      features: (p.features || []).join('\n'),
      isActive: p.isActive !== false,
      images: p.images || []
    });
    setUploadError('');
  };

  const cancel = () => {
    setEditing(null);
    setForm(EMPTY);
    setUploadError('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        shortDesc: form.shortDesc,
        longDesc: form.longDesc,
        category: form.category,
        price: Number(form.price) || 0,
        currency: form.currency,
        features: form.features
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        isActive: form.isActive,
        images: form.images
      };
      if (editing === 'new') {
        await api.post('/admin/products', payload);
      } else {
        await api.patch(`/admin/products/${editing}`, payload);
      }
      cancel();
      await load();
    } catch (err) {
      alert(
        (err.response && err.response.data && err.response.data.message) ||
          'Save failed.'
      );
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      await load();
    } catch (err) {
      alert('Delete failed.');
    }
  };

  const toggleActive = async (p) => {
    try {
      await api.patch(`/admin/products/${p._id}`, { isActive: !(p.isActive !== false) });
      await load();
    } catch (err) {
      alert('Update failed.');
    }
  };

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploadError('');
    setUploading(true);
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append('images', f));
      const res = await api.post('/admin/uploads/product', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const uploaded = (res.data.images || []).map((img) => ({
        url: img.url,
        publicId: img.publicId
      }));
      setForm((prev) => ({ ...prev, images: [...prev.images, ...uploaded] }));
    } catch (err) {
      setUploadError(
        (err.response && err.response.data && err.response.data.message) ||
          'Upload failed. Check Cloudinary config.'
      );
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const removeImage = async (img, index) => {
    if (!window.confirm('Remove this image?')) return;
    try {
      if (img.publicId) {
        await api.delete(`/admin/uploads/product/${img.publicId}`);
      }
      setForm((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    } catch (err) {
      alert('Failed to delete image.');
    }
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h3 className="fw-bold mb-0">Products</h3>
          <p className="text-muted small mb-0">Create, edit, and remove products — CEO only.</p>
        </div>
        {editing === null && (
          <button className="btn yt-btn-primary" onClick={startNew}>
            <FaPlus className="me-2" /> New product
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {editing !== null && (
        <div className="yt-card mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">
              {editing === 'new' ? 'New product' : 'Edit product'}
            </h5>
            <button className="btn btn-sm btn-outline-secondary" onClick={cancel}>
              <FaTimes />
            </button>
          </div>

          <form className="row g-3" onSubmit={save}>
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Name *</label>
              <input
                className="form-control"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold">Category</label>
              <input
                className="form-control"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>
            <div className="col-md-2">
              <label className="form-label small fw-semibold">Price</label>
              <input
                type="number"
                className="form-control"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div className="col-md-1">
              <label className="form-label small fw-semibold">Curr.</label>
              <input
                className="form-control"
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
              />
            </div>

            <div className="col-md-12">
              <label className="form-label small fw-semibold">Short description</label>
              <input
                className="form-control"
                value={form.shortDesc}
                onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
              />
            </div>
            <div className="col-md-12">
              <label className="form-label small fw-semibold">Long description</label>
              <textarea
                className="form-control"
                rows={3}
                value={form.longDesc}
                onChange={(e) => setForm({ ...form, longDesc: e.target.value })}
              />
            </div>
            <div className="col-md-12">
              <label className="form-label small fw-semibold">Features (one per line)</label>
              <textarea
                className="form-control"
                rows={4}
                value={form.features}
                onChange={(e) => setForm({ ...form, features: e.target.value })}
                placeholder={'30-day supply\nBeginner friendly\nFree delivery'}
              />
            </div>

            {/* IMAGES */}
            <div className="col-12">
              <label className="form-label small fw-semibold">Product images</label>

              <div className="d-flex flex-wrap gap-3 mb-3">
                {form.images.length === 0 && (
                  <div
                    className="d-flex align-items-center justify-content-center text-muted"
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: 12,
                      border: '2px dashed #dee2e6',
                      background: '#fafbfc'
                    }}
                  >
                    <FaImage style={{ fontSize: '1.75rem' }} />
                  </div>
                )}

                {form.images.map((img, i) => (
                  <div
                    key={img.publicId || img.url || i}
                    style={{
                      position: 'relative',
                      width: 120,
                      height: 120,
                      borderRadius: 12,
                      overflow: 'hidden',
                      border: '1px solid #e6e9f2'
                    }}
                  >
                    <img
                      src={img.url}
                      alt={`Product ${i + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        padding: '0.15rem 0.4rem',
                        borderRadius: 8,
                        lineHeight: 1
                      }}
                      onClick={() => removeImage(img, i)}
                      title="Remove image"
                    >
                      <FaTrash style={{ fontSize: '0.75rem' }} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="d-flex align-items-center gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="form-control"
                  style={{ maxWidth: 320 }}
                  onChange={handleFiles}
                  disabled={uploading}
                />
                {uploading && (
                  <span className="text-muted small">
                    <FaSpinner className="fa-spin me-1" /> Uploading…
                  </span>
                )}
                {!uploading && (
                  <span className="text-muted small">
                    <FaUpload className="me-1" /> Pick up to 6 images (5MB each)
                  </span>
                )}
              </div>
              {uploadError && (
                <div className="text-danger small mt-2">{uploadError}</div>
              )}
            </div>

            <div className="col-md-12">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                />
                <label className="form-check-label small" htmlFor="isActive">
                  Visible on the public products page
                </label>
              </div>
            </div>

            <div className="col-12 text-end">
              <button type="button" className="btn btn-outline-secondary me-2" onClick={cancel}>
                Cancel
              </button>
              <button type="submit" className="btn yt-btn-primary" disabled={saving || uploading}>
                {saving ? 'Saving…' : editing === 'new' ? 'Create product' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="yt-card p-0">
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-5">
            <FaBoxOpen style={{ fontSize: '2rem', color: '#adb5bd' }} className="mb-3" />
            <h5 className="fw-bold">No products yet</h5>
            <p className="text-muted small mb-3">
              Add your first product — it will appear on the public products page immediately.
            </p>
            <button className="btn yt-btn-primary" onClick={startNew}>
              <FaPlus className="me-2" /> Add product
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: 70 }}></th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Visible</th>
                  <th>Updated</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => {
                  const first = (p.images && p.images[0]) || null;
                  return (
                    <tr key={p._id}>
                      <td>
                        {first ? (
                          <img
                            src={first.url}
                            alt={p.name}
                            style={{
                              width: 48,
                              height: 48,
                              objectFit: 'cover',
                              borderRadius: 8,
                              border: '1px solid #e6e9f2'
                            }}
                          />
                        ) : (
                          <div
                            className="d-flex align-items-center justify-content-center text-muted"
                            style={{
                              width: 48,
                              height: 48,
                              borderRadius: 8,
                              background: '#f5f7fb',
                              border: '1px solid #e6e9f2'
                            }}
                          >
                            <FaImage />
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="fw-semibold">{p.name}</div>
                        <div className="small text-muted">{p.shortDesc || '—'}</div>
                      </td>
                      <td className="small">{p.category || '—'}</td>
                      <td className="small">
                        {p.currency} {Number(p.price || 0).toLocaleString()}
                      </td>
                      <td>
                        {p.isActive !== false ? (
                          <span className="badge bg-success">Public</span>
                        ) : (
                          <span className="badge bg-secondary">Hidden</span>
                        )}
                      </td>
                      <td className="small text-muted">
                        {new Date(p.updatedAt || p.createdAt).toLocaleDateString()}
                      </td>
                      <td className="text-nowrap">
                        <button
                          className="btn btn-sm btn-outline-secondary me-1"
                          title={p.isActive !== false ? 'Hide from public' : 'Show to public'}
                          onClick={() => toggleActive(p)}
                        >
                          {p.isActive !== false ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        <button
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => startEdit(p)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => remove(p._id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
