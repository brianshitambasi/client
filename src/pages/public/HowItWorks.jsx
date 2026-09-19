import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaUserPlus,
  FaBookOpen,
  FaShareAlt,
  FaUsers,
  FaChartLine,
  FaArrowRight
} from 'react-icons/fa';
import Section from '../../components/ui/Section';
import Accordion from '../../components/ui/Accordion';

const STEPS = [
  {
    icon: <FaUserPlus />,
    title: '1. Learn the model',
    text: 'You go through the opportunity, the products, and the business model on this platform. You ask questions. No commitment.'
  },
  {
    icon: <FaBookOpen />,
    title: '2. Onboard & get trained',
    text: 'If you decide to join, you get onboarded into Team TNT with a simple training path, tools, and mentorship from CEO TNT.'
  },
  {
    icon: <FaShareAlt />,
    title: '3. Share products & the opportunity',
    text: 'You share real products and the business opportunity with people in your network, in your own voice, without pressure tactics.'
  },
  {
    icon: <FaUsers />,
    title: '4. Build a small team',
    text: 'As you grow, you can invite and support others who join the team. Leadership and mentoring are part of the model.'
  },
  {
    icon: <FaChartLine />,
    title: '5. Earn based on activity',
    text: 'Commission is earned from product sales and team activity. Income is not guaranteed — results depend on effort.'
  }
];

const FAQ = [
  {
    q: 'Is this a job?',
    a: 'No. This is not employment. It is an independent business opportunity. You are not paid a salary, and there are no fixed hours.'
  },
  {
    q: 'How does the business model work?',
    a: 'It is a network marketing model. You earn commission from the sale of real products and, in some cases, from the activity of people you personally introduce and support. Full details are explained during onboarding.'
  },
  {
    q: 'What do I actually have to do?',
    a: 'Learn the products. Share them with people who might want them. Talk to people who are open to a business opportunity. Support the people who join. That is the core activity.'
  },
  {
    q: 'Are there products?',
    a: 'Yes. The business is built around a product line. You can see the categories on the Products page. Products are the foundation — this is not a "pay to join and recruit only" scheme.'
  },
  {
    q: 'How much time does it require?',
    a: 'Most people start part-time, from as little as a few hours a week. The more consistent your activity, the more you can grow. There is no minimum that guarantees results.'
  },
  {
    q: 'Is income guaranteed?',
    a: 'No. Income is never guaranteed. What you earn depends on your effort, your skill, your consistency, and market conditions. Anyone who tells you otherwise is not being honest with you.'
  }
];

export default function HowItWorks() {
  return (
    <>
      <header className="yt-hero" style={{ padding: '4rem 0 3.5rem' }}>
        <div className="container">
          <span className="yt-eyebrow mb-3">How It Works</span>
          <h1 className="mb-3" style={{ maxWidth: 900 }}>
            A simple, transparent path — from first question to first step.
          </h1>
          <p className="lead mb-0" style={{ maxWidth: 720 }}>
            Here is the honest version of how the YOBBYTECH / TNT business works. Read it,
            question it, and decide for yourself.
          </p>
        </div>
      </header>

      <Section>
        <div className="row g-4">
          <div className="col-lg-7">
            <h2 className="fw-bold mb-4">The 5-step journey</h2>
            <div className="yt-timeline">
              {STEPS.map((s, i) => (
                <div className="yt-timeline-item" key={i}>
                  <span className="yt-timeline-dot" />
                  <div className="d-flex align-items-start">
                    <div className="yt-card-icon me-3 mb-0" style={{ width: 42, height: 42, fontSize: '1rem' }}>
                      {s.icon}
                    </div>
                    <div>
                      <div className="yt-timeline-title">{s.title}</div>
                      <p className="text-muted mb-0">{s.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-lg-5">
            <div className="yt-card" style={{ position: 'sticky', top: 90 }}>
              <h5 className="fw-bold mb-3">What it is / what it isn&apos;t</h5>
              <p className="text-muted small mb-2"><strong>It is:</strong></p>
              <ul className="yt-list-check small">
                <li>An independent business opportunity</li>
                <li>Built around real products</li>
                <li>Supported by training and mentorship</li>
                <li>Flexible — you decide your hours</li>
              </ul>
              <p className="text-muted small mb-2 mt-3"><strong>It is not:</strong></p>
              <ul className="list-unstyled small mb-0">
                <li className="mb-1">✗ A job with a salary</li>
                <li className="mb-1">✗ A get-rich-quick scheme</li>
                <li className="mb-1">✗ A guaranteed-income program</li>
                <li className="mb-0">✗ A pressure-to-join funnel</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      <Section light>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="text-center mb-4">
              <span className="yt-eyebrow mb-2">Common questions</span>
              <h2 className="fw-bold mb-0">Straight answers</h2>
            </div>
            <Accordion items={FAQ} />
          </div>
        </div>
      </Section>

      <Section>
        <div className="text-center">
          <h3 className="fw-bold mb-3">Ready to see if it fits you?</h3>
          <p className="text-muted mb-4 mx-auto" style={{ maxWidth: 620 }}>
            Answer a few short questions. If it looks like a good match, CEO TNT will
            personally reach out. If not, no pressure — you&apos;ll still get clear answers.
          </p>
          <Link to="/qualification" className="btn yt-btn-primary">
            Start Qualification <FaArrowRight className="ms-2" />
          </Link>
        </div>
      </Section>
    </>
  );
}
