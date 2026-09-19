import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaUsers,
  FaBoxOpen,
  FaChartLine,
  FaShieldAlt,
  FaArrowRight,
  FaCheckCircle
} from 'react-icons/fa';
import Section from '../../components/ui/Section';
import { BRAND, TEAM } from '../../utils/constants';

const FEATURES = [
  {
    icon: <FaUsers />,
    title: 'People First',
    text: 'A community-driven approach with mentorship from CEO TNT and the TNT team.'
  },
  {
    icon: <FaBoxOpen />,
    title: 'Real Products',
    text: 'The opportunity is built around real products and services — not empty promises.'
  },
  {
    icon: <FaChartLine />,
    title: 'Growth Path',
    text: 'A structured path for personal development, skills, and long-term growth.'
  },
  {
    icon: <FaShieldAlt />,
    title: 'Transparent',
    text: 'No guaranteed-income claims. No hidden costs. Just clear information.'
  }
];

export default function Home() {
  return (
    <>
      <header className="yt-hero">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span className="yt-eyebrow mb-3">Team {TEAM} · Led by CEO TNT</span>
              <h1 className="mb-3">
                Discover a Business Opportunity Built Around People, Products &amp; Growth.
              </h1>
              <p className="lead mb-4">
                A clear, honest look at the {BRAND} / {TEAM} opportunity — how it works,
                what it involves, and whether it&apos;s right for you. No pressure.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/qualification" className="btn yt-btn-primary">
                  See If It Fits You <FaArrowRight className="ms-2" />
                </Link>
                <Link to="/how-it-works" className="btn yt-btn-ghost">
                  How It Works
                </Link>
              </div>
            </div>
            <div className="col-lg-5">
              <div
                className="p-4 rounded-4"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)'
                }}
              >
                <h5 className="fw-bold mb-3">What you&apos;ll find here</h5>
                <ul className="list-unstyled mb-0">
                  {[
                    'A factual explanation of the opportunity',
                    'Products & services overview',
                    'The business model in plain language',
                    'Honest answers to common concerns',
                    'A short form if you want a personal explanation'
                  ].map((line, i) => (
                    <li key={i} className="mb-2 d-flex align-items-start">
                      <FaCheckCircle className="me-2 mt-1 flex-shrink-0" style={{ color: '#8ab4ff' }} />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>

      <Section>
        <div className="text-center mb-5">
          <span className="yt-eyebrow mb-2">Why {BRAND} / {TEAM}</span>
          <h2 className="fw-bold mb-2">Built on clarity, not pressure.</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: 720 }}>
            We believe people make better decisions when they understand the full picture.
            This platform exists to give you that picture.
          </p>
        </div>
        <div className="row g-4">
          {FEATURES.map((f, i) => (
            <div className="col-md-6 col-lg-3" key={i}>
              <div className="yt-card">
                <div className="yt-card-icon">{f.icon}</div>
                <h5 className="fw-bold">{f.title}</h5>
                <p className="text-muted mb-0">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section light>
        <div className="row justify-content-center text-center">
          <div className="col-lg-8">
            <h2 className="fw-bold mb-3">Not sure yet? That&apos;s completely fine.</h2>
            <p className="text-muted mb-4">
              Take your time. Read through the pages, check the FAQ, and if you want a
              personal explanation, you can request one. There is no obligation.
            </p>
            <Link to="/qualification" className="btn yt-btn-primary">
              Request More Information
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
