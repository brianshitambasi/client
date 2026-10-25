import React, { useState } from 'react';
import { FaLink, FaCopy, FaCheckCircle, FaUsers } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';

const BASE_URL = 'https://brianceotnt.devs.li';

export default function Referrals() {
  const [name, setName] = useState('');
  const [generated, setGenerated] = useState(null);
  const [copied, setCopied] = useState('');

  const generateLinks = (e) => {
    e.preventDefault();
    const code = name.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!code) return;
    setGenerated({
      code,
      general: `${BASE_URL}/qualification?ref=${code}`,
      student: `${BASE_URL}/students?ref=${code}`
    });
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <AdminLayout>
      <div className="mb-4">
        <h3 className="fw-bold mb-0">Team Referral Links</h3>
        <p className="text-muted small mb-0">Generate custom links to track who brings in the most prospects.</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="yt-card">
            <h5 className="fw-bold mb-3">Generate a Link</h5>
            <form onSubmit={generateLinks}>
              <label className="form-label small fw-semibold">Team Member Name / Code</label>
              <input
                type="text"
                className="form-control mb-3"
                placeholder="e.g. Sarah or JohnDoe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <button type="submit" className="btn yt-btn-primary w-100">
                <FaLink className="me-2" /> Generate Links
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-7">
          {generated && (
            <div className="yt-card">
              <div className="d-flex align-items-center gap-2 mb-3">
                <FaUsers className="text-primary" />
                <h5 className="fw-bold mb-0">Links for <span className="text-uppercase text-primary">{generated.code}</span></h5>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">General Opportunity Link</label>
                <div className="input-group">
                  <input type="text" className="form-control form-control-sm" value={generated.general} readOnly />
                  <button className={`btn btn-sm ${copied === 'general' ? 'btn-success' : 'btn-outline-primary'}`} onClick={() => copyToClipboard(generated.general, 'general')}>
                    {copied === 'general' ? <><FaCheckCircle className="me-1" /> Copied</> : <><FaCopy className="me-1" /> Copy</>}
                  </button>
                </div>
              </div>

              <div className="mb-0">
                <label className="form-label small fw-semibold">Student Signup Link</label>
                <div className="input-group">
                  <input type="text" className="form-control form-control-sm" value={generated.student} readOnly />
                  <button className={`btn btn-sm ${copied === 'student' ? 'btn-success' : 'btn-outline-primary'}`} onClick={() => copyToClipboard(generated.student, 'student')}>
                    {copied === 'student' ? <><FaCheckCircle className="me-1" /> Copied</> : <><FaCopy className="me-1" /> Copy</>}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
