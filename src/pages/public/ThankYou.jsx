import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaWhatsapp, FaCheckCircle, FaHome } from 'react-icons/fa';
import Section from '../../components/ui/Section';
import { CEO_NAME, whatsappLink, BRAND, TEAM } from '../../utils/constants';

const CATEGORY_MSG = {
  HIGH_INTEREST: "Great — based on your answers, this looks worth a real conversation.",
  EXPLORING: "Thanks — it sounds like you're exploring. Here's how to keep learning at your own pace.",
  FOLLOW_UP: 'Thanks for your answers. We will be in touch soon with more information.',
  NOT_READY: "That's completely fine. Here are some resources if you ever want to revisit this."
};

export default function ThankYou() {
  const { state } = useLocation() || {};
  const category = (state && state.category) || null;

  const waMessage = `Hi ${CEO_NAME}, I just went through the ${BRAND} / ${TEAM} opportunity page and I'd like to understand more.`;
  const wa = whatsappLink(waMessage);

  return (
    <>
      <header className="yt-hero" style={{ padding: '4rem 0 3.5rem' }}>
        <div className="container text-center">
          <FaCheckCircle style={{ fontSize: '3rem', color: '#8ab4ff' }} className="mb-3" />
          <h1 className="mb-3">Thank you — your answers are in.</h1>
          <p className="lead mb-0 mx-auto" style={{ maxWidth: 680 }}>
            {category && CATEGORY_MSG[category]
              ? CATEGORY_MSG[category]
              : 'CEO ' + CEO_NAME + ' reviews every submission personally. You will hear back soon.'}
          </p>
        </div>
      </header>

      <Section>
        <div className="row g-4 justify-content-center">
          <div className="col-lg-7">
            <div className="yt-card">
              <h4 className="fw-bold mb-3">What happens next</h4>
              <ol className="text-muted mb-4">
                <li className="mb-2">CEO {CEO_NAME} reviews your answers.</li>
                <li className="mb-2">You receive a personal message on your preferred contact channel.</li>
                <li className="mb-2">You get honest, clear answers — no pressure to decide.</li>
                <li>You decide if you want to take the next step.</li>
              </ol>

              <p className="text-muted mb-4">
                Want to skip the wait? Message CEO {CEO_NAME} directly on WhatsApp with the
                button below. It opens a chat with a ready-made intro — you can edit it
                before sending.
              </p>

              <div className="d-flex flex-wrap gap-2">
                <a href={wa} target="_blank" rel="noreferrer" className="btn yt-btn-primary">
                  <FaWhatsapp className="me-2" /> WhatsApp CEO {CEO_NAME}
                </a>
                <Link to="/" className="btn btn-outline-primary">
                  <FaHome className="me-2" /> Back to Home
                </Link>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="yt-card h-100">
              <h5 className="fw-bold mb-3">While you wait</h5>
              <ul className="yt-list-check mb-0">
                <li><Link to="/how-it-works">How the business works, step by step</Link></li>
                <li><Link to="/business">The business model in plain language</Link></li>
                <li><Link to="/products">See the current product line</Link></li>
                <li><Link to="/faq">Common questions answered honestly</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
