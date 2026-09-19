import React from 'react';
import { Link } from 'react-router-dom';
import Section from '../../components/ui/Section';
import Accordion from '../../components/ui/Accordion';
import { BRAND, TEAM } from '../../utils/constants';

const GENERAL = [
  {
    q: `What is ${BRAND} / Team ${TEAM}?`,
    a: `${BRAND} is the brand and technology platform behind Team ${TEAM}, a network-marketing team led by CEO TNT. The team shares real products and introduces people to an independent business opportunity.`
  },
  {
    q: 'Is this a job?',
    a: 'No. This is not employment and there is no salary. It is an independent business opportunity. You decide your hours, your activity, and your pace.'
  },
  {
    q: 'Is there a cost to join?',
    a: 'Yes, there is a starter cost which covers your initial product pack and platform access. Exact amounts are shown before you commit — never hidden.'
  },
  {
    q: 'Is income guaranteed?',
    a: 'No. Never. Income depends on your effort, your consistency, your skill, and market conditions. Any claim of guaranteed income is not something we support.'
  },
  {
    q: 'Do I have to recruit people?',
    a: 'No. Recruiting is one way to grow, but many people focus mainly on sharing products with customers. You build the business in the shape that suits you.'
  }
];

const PROCESS = [
  {
    q: 'How do I get started?',
    a: 'Go through the qualification page. Answer a few short questions. If it looks like a good fit, CEO TNT or a team leader will personally reach out to explain everything in detail.'
  },
  {
    q: 'How long does onboarding take?',
    a: 'Most people are onboarded within a few days of their first conversation. It depends on your pace and your questions.'
  },
  {
    q: 'What kind of support do I get?',
    a: 'You get access to training, tools, mentorship from CEO TNT and the wider TNT network, and a community of people doing the same thing.'
  },
  {
    q: 'Can I do this part-time?',
    a: 'Yes. Many people start part-time. There is no minimum-hours requirement. Results simply scale with consistent effort.'
  }
];

const PRIVACY = [
  {
    q: 'What do you do with my data?',
    a: 'We only collect the details you submit through the qualification form — name, contact info, country, and your answers. We use them solely to follow up about the opportunity. We never sell or share your data with third parties.'
  },
  {
    q: 'Will I be spammed?',
    a: 'No. We only reach out through your preferred contact method, and you can ask us to stop at any time. No bulk spam, no repeated unsolicited messages.'
  },
  {
    q: 'Can I opt out?',
    a: 'Yes. You can reply "stop" at any point and we will stop contacting you immediately. There is no penalty, no hard feelings, and no obligation.'
  }
];

export default function FAQ() {
  return (
    <>
      <header className="yt-hero" style={{ padding: '4rem 0 3.5rem' }}>
        <div className="container">
          <span className="yt-eyebrow mb-3">Frequently Asked Questions</span>
          <h1 className="mb-3" style={{ maxWidth: 900 }}>
            Honest answers, in plain language.
          </h1>
          <p className="lead mb-0" style={{ maxWidth: 720 }}>
            If your question isn&apos;t here, request a personal explanation and we&apos;ll
            answer it directly.
          </p>
        </div>
      </header>

      <Section>
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <h4 className="fw-bold mb-3">About the opportunity</h4>
            <Accordion items={GENERAL} />

            <h4 className="fw-bold mb-3 mt-5">Getting started</h4>
            <Accordion items={PROCESS} />

            <h4 className="fw-bold mb-3 mt-5">Privacy &amp; data</h4>
            <Accordion items={PRIVACY} />
          </div>
        </div>
      </Section>

      <Section light>
        <div className="text-center">
          <h3 className="fw-bold mb-3">Question not answered?</h3>
          <p className="text-muted mb-4 mx-auto" style={{ maxWidth: 620 }}>
            That&apos;s fine. Ask it directly. Answer a few short questions and CEO TNT will
            personally get back to you.
          </p>
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            <Link to="/qualification" className="btn yt-btn-primary">Ask a Question</Link>
            <Link to="/contact" className="btn btn-outline-primary">Contact Page</Link>
          </div>
        </div>
      </Section>
    </>
  );
}
