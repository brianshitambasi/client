import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaWhatsapp, FaCheckCircle, FaHome, FaCalendarAlt } from 'react-icons/fa';
import Section from '../../components/ui/Section';
import ShareButton from '../../components/ui/ShareButton';
import { CEO_NAME, whatsappLink, BRAND, TEAM } from '../../utils/constants';

const CATEGORY_MSG = {
  HIGH_INTEREST: "Great — based on your answers, this looks worth a real conversation.",
  EXPLORING: "Thanks — it sounds like you're exploring. Here's how to keep learning at your own pace.",
  FOLLOW_UP: 'Thanks for your answers. We will be in touch soon with more information.',
  NOT_READY: "That's completely fine. Here are some resources if you ever want to revisit this."
};

// ==============================================================
// 👇 REPLACE THIS WITH YOUR REAL CALENDLY (OR CAL.COM) LINK 👇
const BOOKING_LINK = 'YOUR_REAL_LINK_HERE'; 
// ==============================================================

export default function ThankYou() {
  const { state } = useLocation() || {};
  const category = (state && state.category) || null;

  useEffect(() => {
    // Fire tracking events when the Thank You page loads
    if (window.fbq) window.fbq('track', 'Lead');
    if (window.ttq) window.ttq.track('SubmitForm');
  }, []);

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
          
          {/* LEFT COLUMN: Booking Calendar */}
          <div className="col-lg-7">
            <div className="yt-card mb-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="yt-card-icon mb-0"><FaCalendarAlt /></div>
                <div>
                  <h4 className="fw-bold mb-1">Book your 1-on-1 call</h4>
                  <p className="text-muted small mb-0">Skip the wait. Pick a time that works for you.</p>
                </div>
              </div>
              
              <div className="rounded overflow-hidden border" style={{ height: '600px', background: '#fff' }}>
                <iframe
                  src={BOOKING_LINK}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  title="Book a call"
                ></iframe>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: What happens next & links */}
          <div className="col-lg-5">
            <div className="yt-card mb-4">
              <h5 className="fw-bold mb-3">What happens next</h5>
              <ol className="text-muted mb-0 small">
                <li className="mb-2">CEO {CEO_NAME} reviews your answers.</li>
                <li className="mb-2">You book a time on the calendar.</li>
                <li className="mb-2">We meet on Zoom (link sent via email).</li>
                <li>You decide if you want to take the next step.</li>
              </ol>
            </div>

            <div className="yt-card mb-4">
              <h5 className="fw-bold mb-3">Prefer to chat on WhatsApp?</h5>
              <p className="text-muted small mb-3">
                If you'd rather just message first, CEO {CEO_NAME} is one tap away.
              </p>
              <a href={wa} target="_blank" rel="noreferrer" className="btn yt-btn-primary w-100">
                <FaWhatsapp className="me-2" /> WhatsApp CEO {CEO_NAME}
              </a>
            </div>

            <div className="yt-card text-center">
              <p className="text-muted small mb-3">Know someone who'd appreciate this?</p>
              <div className="d-flex justify-content-center">
                <ShareButton
                  url="https://brianceotnt.devs.li"
                  text={`I just checked out ${BRAND} / ${TEAM} — a transparent business opportunity. Worth a look.`}
                  label="Share with a friend"
                  variant="outline"
                  size="sm"
                />
              </div>
              <div className="mt-3">
                <Link to="/" className="small text-muted text-decoration-none"><FaHome className="me-1" /> Back to Home</Link>
              </div>
            </div>
          </div>

        </div>
      </Section>
    </>
  );
}
