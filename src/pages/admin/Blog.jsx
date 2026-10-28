import React, { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';

const EMPTY = { title: '', excerpt: '', content: '', coverImage: '', isPublished: true };

export default function AdminBlog() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/posts');
      setItems(res.data.items || []);
    } catch (err) { alert('Failed to load posts'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const startNew = () => { setEditing('new'); setForm(EMPTY); };
  const startEdit = (p) => { setEditing(p._id); setForm({ title: p.title, excerpt: p.excerpt, content: p.content, coverImage: p.coverImage, isPublished: p.isPublished }); };
  const cancel = () => { setEditing(null); setForm(EMPTY); };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing === 'new') {
        await api.post('/admin/posts', form);
      } else {
        await api.patch(`/admin/posts/${editing}`, form);
      }
      cancel(); await load();
    } catch (err) { alert('Save failed'); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this article?')) return;
    try { await api.delete(`/admin/posts/${id}`); await load(); }
    catch (err) { alert('Delete failed'); }
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h3 className="fw-bold mb-0">Blog Posts</h3>
          <p className="text-muted small mb-0">Write articles to rank on Google and capture free traffic.</p>
        </div>
        {editing === null && (
          <button className="btn yt-btn-primary" onClick={startNew}><FaPlus className="me-2" /> New Article</button>
        )}
      </div>

      {editing !== null && (
        <div className="yt-card mb-4">
          <div className="d-flex justify-content-between mb-3">
            <h5 className="fw-bold mb-0">{editing === 'new' ? 'New Article' : 'Edit Article'}</h5>
            <button className="btn btn-sm btn-outline-secondary" onClick={cancel}><FaTimes /></button>
          </div>
          <form className="row g-3" onSubmit={save}>
            <div className="col-md-8">
              <label className="form-label small fw-semibold">Title *</label>
              <input className="form-control" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-semibold">Cover Image URL (optional)</label>
              <input className="form-control" value={form.coverImage} onChange={e => setForm({ ...form, coverImage: e.target.value })} placeholder="https://..." />
            </div>
            <div className="col-12">
              <label className="form-label small fw-semibold">Short Excerpt (shown on the blog list)</label>
              <textarea className="form-control" rows={2} value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} />
            </div>
            <div className="col-12">
              <label className="form-label small fw-semibold">Article Content * (line breaks are preserved)</label>
              <textarea className="form-control" rows={12} required value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
            </div>
            <div className="col-12">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="pub" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} />
                <label className="form-check-label small" htmlFor="pub">Published (visible to the public)</label>
              </div>
            </div>
            <div className="col-12 text-end">
              <button type="button" className="btn btn-outline-secondary me-2" onClick={cancel}>Cancel</button>
              <button type="submit" className="btn yt-btn-primary" disabled={saving}><FaSave className="me-2" /> {saving ? 'Saving...' : 'Save Post'}</button>
            </div>
          </form>
        </div>
      )}

      <div className="yt-card p-0">
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-5"><h5 className="fw-bold">No posts yet</h5></div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr><th>Title</th><th>Status</th><th>Date</th><th></th></tr>
              </thead>
              <tbody>
                {items.map(p => (
                  <tr key={p._id}>
                    <td><div className="fw-semibold">{p.title}</div><div className="small text-muted">/blog/{p.slug}</div></td>
                    <td>{p.isPublished ? <span className="badge bg-success">Published</span> : <span className="badge bg-secondary">Draft</span>}</td>
                    <td className="small text-muted">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="text-nowrap">
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => startEdit(p)}><FaEdit /></button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => remove(p._id)}><FaTrash /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
