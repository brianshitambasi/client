import React from 'react';
import { Link } from 'react-router-dom';
import { FaBullseye, FaHandshake, FaLightbulb, FaUsers } from 'react-icons/fa';
import Section from '../../components/ui/Section';
import { BRAND, TEAM, CEO_NAME } from '../../utils/constants';

export default function About() {
  return (
    <>
      <header className="yt-hero" style={{ padding: '4rem 0 3.5rem' }}>
        <div className="container">
          <span className="yt-eyebrow mb-3">About {BRAND}</span>
          <h1 className="mb-3" style={{ maxWidth: 900 }}>
            A modern business platform built on clarity, people, and real products.
          </h1>
          <p className="lead mb-0" style={{ maxWidth: 720 }}>
            {BRAND} is the technology and brand layer behind Team {TEAM}, led by CEO {CEO_NAME}.
            Our goal is simple: give people an honest, structured way to explore a business
            opportunity without hype, pressure, or misleading promises.
          </p>
        </div>
      </header>

      <Section>
        <div className="row g-4">
          <div className="col-lg-6">
            <h2 className="fw-bold mb-3">Who we are</h2>
            <p className="text-muted">
              Team {TEAM} is a network of independent distributors and partners who work
              together under the {BRAND} brand. We combine a product line, a mentorship
              structure, and a digital platform so that new members can onboard with
              confidence — not confusion.
            </p>
            <p className="text-muted">
              CEO {CEO_NAME} leads the team with a focus on long-term development, ethical
              communication, and real results. Every prospect who visits this site is
              treated as a person, not a target.
            </p>
            <ul className="yt-list-check mt-3">
              <li>Clear, factual information — no exaggerated claims</li>
              <li>Real products and services with a defined value</li>
              <li>Mentorship and structured personal development</li>
              <li>No guaranteed-income promises — ever</li>
            </ul>
          </div>
          <div className="col-lg-6">
            <div className="row g-3">
              {[
                { icon: <FaBullseye />, title: 'Our Mission', text: 'To make network marketing understandable, honest, and accessible to everyday people.' },
                { icon: <FaHandshake />, title: 'Our Values', text: 'Transparency, respect for time, and a genuine focus on people over numbers.' },
                { icon: <FaLightbulb />, title: 'Our Approach', text: 'Education first. You learn before you decide. No rush, no pressure, no closing tricks.' },
                { icon: <FaUsers />, title: 'Our Community', text: 'A growing team of independent partners supported by CEO TNT and the wider TNT network.' }
              ].map((b, i) => (
                <div className="col-sm-6" key={i}>
                  <div className="yt-card">
                    <div className="yt-card-icon">{b.icon}</div>
                    <h5 className="fw-bold mb-2">{b.title}</h5>
                    <p className="text-muted mb-0 small">{b.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section light>
        <div className="row align-items-center g-4">
          <div className="col-lg-7">
            <h3 className="fw-bold mb-2">Meet CEO {CEO_NAME}</h3>
            <p className="text-muted mb-3">
              CEO {CEO_NAME} founded and leads Team {TEAM} under the {BRAND} brand. Rather
              than sell a dream, the focus is on teaching people what network marketing
              actually is, how the model works, and what it realistically takes to succeed.
            </p>
            <p className="text-muted mb-0">
              The team has one rule: <strong>explain clearly, never pressure</strong>. If
              the opportunity is a good fit, great. If it isn&apos;t, you should leave with
              a clear understanding — and zero obligation.
            </p>
          </div>
          <div className="col-lg-5">
            <div className="yt-card">
              <h5 className="fw-bold mb-3">Quick facts</h5>
              <ul className="list-unstyled mb-0 small">
                <li className="mb-2"><strong>Brand:</strong> {BRAND}</li>
                <li className="mb-2"><strong>Team:</strong> {TEAM}</li>
                <li className="mb-2"><strong>Led by:</strong> CEO {CEO_NAME}</li>
                <li className="mb-2"><strong>Model:</strong> Network marketing / direct sales</li>
                <li className="mb-0"><strong>Focus:</strong> Products, people, and personal development</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="text-center">
          <h3 className="fw-bold mb-3">Want to understand it better?</h3>
          <p className="text-muted mb-4 mx-auto" style={{ maxWidth: 620 }}>
            Read the step-by-step explanation of how the business works, or jump straight
            to the qualification form if you&apos;d like a personal conversation.
          </p>
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            <Link to="/how-it-works" className="btn yt-btn-primary">How It Works</Link>
            <Link to="/qualification" className="btn btn-outline-primary">Qualify Yourself</Link>
          </div>
        </div>
      </Section>
    </>
  );
}
