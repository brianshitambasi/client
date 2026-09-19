import React from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import Section from '../../components/ui/Section';
import { CEO_NAME, CEO_WHATSAPP, whatsappLink, BRAND, TEAM } from '../../utils/constants';

export default function Contact() {
  const wa = whatsappLink(
    `Hi ${CEO_NAME}, I just went through the ${BRAND} / ${TEAM} opportunity page and I'd like to understand more.`
  );

  return (
    <>
      <header className="yt-hero" style={{ padding: '4rem 0 3.5rem' }}>
        <div className="container">
          <span className="yt-eyebrow mb-3">Contact</span>
          <h1 className="mb-3" style={{ maxWidth: 900 }}>
            Talk to a real person. On your terms.
          </h1>
          <p className="lead mb-0" style={{ maxWidth: 720 }}>
            No call centers. No scripts. Just a direct conversation with CEO {CEO_NAME} and
            the {TEAM} team if you&apos;d like to know more.
          </p>
        </div>
      </header>

      <Section>
        <div className="row g-4">
          <div className="col-lg-5">
            <div className="yt-card h-100">
              <h4 className="fw-bold mb-3">Reach out directly</h4>
              <p className="text-muted mb-4">
                Prefer to skip the form? Use WhatsApp or email. Messages are handled
                personally — usually within a few hours.
              </p>

              <div className="d-grid gap-2">
                <a href={wa} target="_blank" rel="noreferrer" className="btn yt-btn-primary">
                  <FaWhatsapp className="me-2" /> WhatsApp CEO {CEO_NAME}
                </a>
                <a
                  href={`mailto:brianshitambasi270@gmail.com?subject=Question about ${BRAND} / ${TEAM}`}
                  className="btn btn-outline-primary"
                >
                  <FaEnvelope className="me-2" /> Send an Email
                </a>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="yt-card h-100">
                  <div className="yt-card-icon"><FaWhatsapp /></div>
                  <h6 className="fw-bold">WhatsApp</h6>
                  <p className="text-muted small mb-0">+{CEO_WHATSAPP}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="yt-card h-100">
                  <div className="yt-card-icon"><FaEnvelope /></div>
                  <h6 className="fw-bold">Email</h6>
                  <p className="text-muted small mb-0">brianshitambasi270@gmail.com</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="yt-card h-100">
                  <div className="yt-card-icon"><FaMapMarkerAlt /></div>
                  <h6 className="fw-bold">Based in</h6>
                  <p className="text-muted small mb-0">Kenya · Serving a global team</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="yt-card h-100">
                  <div className="yt-card-icon"><FaClock /></div>
                  <h6 className="fw-bold">Response time</h6>
                  <p className="text-muted small mb-0">Usually within a few hours</p>
                </div>
              </div>

              <div className="col-12">
                <div className="yt-card">
                  <h5 className="fw-bold mb-2">Prefer a structured first step?</h5>
                  <p className="text-muted mb-3">
                    Fill in the qualification form. It takes two minutes, and it helps
                    CEO {CEO_NAME} prepare an answer that is actually relevant to you.
                  </p>
                  <Link to="/qualification" className="btn yt-btn-primary">
                    Go to Qualification
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
