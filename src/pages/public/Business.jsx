import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaStore,
  FaHandsHelping,
  FaCoins,
  FaBalanceScale,
  FaArrowRight
} from 'react-icons/fa';
import Section from '../../components/ui/Section';
import Accordion from '../../components/ui/Accordion';

const CONCERNS = [
  {
    q: 'What are the costs?',
    a: 'There is a starter cost when you join, which covers your initial product pack and platform access. Any additional costs are explained clearly before you commit. No hidden fees, no surprise charges.'
  },
  {
    q: 'How do commissions work?',
    a: 'You earn commission from the sale of products to customers and, where applicable, from the activity of the people you personally introduce and support. Exact percentages and tiers are explained during onboarding and are shown in your back office.'
  },
  {
    q: 'Is income guaranteed?',
    a: 'No. Absolutely not. Income depends entirely on your effort, your consistency, your skill at communicating, and the market. Anyone promising guaranteed income is misleading you.'
  },
  {
    q: 'Do I need to be a "salesperson"?',
    a: 'No. What you mainly need is the ability to talk honestly to people, share products you actually believe in, and follow up politely. Sales skills can be learned with practice and mentorship.'
  },
  {
    q: 'Do I have to recruit people?',
    a: 'Recruiting is one path to growth, but it is not the only one. Many people focus primarily on sharing products with retail customers. Your business can be shaped around what suits you.'
  },
  {
    q: 'How is this different from a scam or pyramid scheme?',
    a: 'A pyramid scheme pays people for recruiting alone, with no real product. This business is product-based: commissions come from real sales. That said, we encourage you to research network marketing and ask hard questions before committing.'
  }
];

export default function Business() {
  return (
    <>
      <header className="yt-hero" style={{ padding: '4rem 0 3.5rem' }}>
        <div className="container">
          <span className="yt-eyebrow mb-3">Business Opportunity</span>
          <h1 className="mb-3" style={{ maxWidth: 900 }}>
            The business model — in plain language.
          </h1>
          <p className="lead mb-0" style={{ maxWidth: 720 }}>
            No jargon. No hidden structure. Here is how the YOBBYTECH / TNT model works and
            what it genuinely requires from you.
          </p>
        </div>
      </header>

      <Section>
        <div className="row g-4">
          {[
            { icon: <FaStore />, title: 'Products', text: 'You share real products with real customers. Sales are the foundation of everything.' },
            { icon: <FaHandsHelping />, title: 'Team', text: 'You can invite and support others who want to do the same. Team activity earns additional commission.' },
            { icon: <FaCoins />, title: 'Commission', text: 'You earn from product sales and from team activity. Exact rates are provided during onboarding.' },
            { icon: <FaBalanceScale />, title: 'Effort', text: 'Income is proportional to consistent, honest work. There is no passive magic — only leverage.' }
          ].map((b, i) => (
            <div className="col-md-6 col-lg-3" key={i}>
              <div className="yt-card">
                <div className="yt-card-icon">{b.icon}</div>
                <h5 className="fw-bold">{b.title}</h5>
                <p className="text-muted mb-0">{b.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section light>
        <div className="row g-5 align-items-start">
          <div className="col-lg-6">
            <h2 className="fw-bold mb-3">What you actually do</h2>
            <ul className="yt-list-check">
              <li>Learn the product line well enough to speak about it honestly</li>
              <li>Share products with people who might genuinely want them</li>
              <li>Talk to people open to a business opportunity — without pressure</li>
              <li>Follow up politely, consistently, and with respect</li>
              <li>Support the people who join your team</li>
              <li>Track your activity and improve with mentorship</li>
            </ul>
            <p className="text-muted small mt-3 mb-0">
              That is the honest summary. There is no shortcut, no script that guarantees
              results, and no replacement for consistent effort.
            </p>
          </div>
          <div className="col-lg-6">
            <div className="yt-card">
              <h3 className="fw-bold mb-3">Costs, at a glance</h3>
              <p className="text-muted mb-3">
                We keep costs simple and transparent. Nothing is hidden behind a wall of
                jargon.
              </p>
              <ul className="list-unstyled mb-0">
                <li className="d-flex justify-content-between border-bottom py-2">
                  <span className="text-muted">Starter kit / product pack</span>
                  <strong>One-time</strong>
                </li>
                <li className="d-flex justify-content-between border-bottom py-2">
                  <span className="text-muted">Platform access</span>
                  <strong>Included</strong>
                </li>
                <li className="d-flex justify-content-between border-bottom py-2">
                  <span className="text-muted">Optional training / tools</span>
                  <strong>Optional</strong>
                </li>
                <li className="d-flex justify-content-between py-2">
                  <span className="text-muted">Hidden fees</span>
                  <strong>None</strong>
                </li>
              </ul>
              <p className="text-muted small mt-3 mb-0">
                Exact amounts are shared before you commit, never after.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="text-center mb-4">
              <span className="yt-eyebrow mb-2">Addressing real concerns</span>
              <h2 className="fw-bold mb-0">The questions people actually ask</h2>
            </div>
            <Accordion items={CONCERNS} />
          </div>
        </div>
      </Section>

      <Section light>
        <div className="text-center">
          <h3 className="fw-bold mb-3">Still curious?</h3>
          <p className="text-muted mb-4 mx-auto" style={{ maxWidth: 620 }}>
            The best next step is a short, honest conversation. Answer a few questions and
            CEO TNT will personally reach out — on your terms, at your pace.
          </p>
          <Link to="/qualification" className="btn yt-btn-primary">
            Qualify Yourself <FaArrowRight className="ms-2" />
          </Link>
        </div>
      </Section>
    </>
  );
}
