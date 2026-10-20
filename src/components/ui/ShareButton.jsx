import React, { useState } from 'react';
import { FaWhatsapp, FaTwitter, FaFacebook, FaLink, FaCheckCircle } from 'react-icons/fa';

export default function ShareButton({
  url,
  text,
  label = 'Share on WhatsApp',
  variant = 'primary',
  showOtherPlatforms = false,
  size = 'md'
}) {
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = text || `Check this out: ${shareUrl}`;
  const encodedText = encodeURIComponent(`${shareText}\n\n${shareUrl}`);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Could not copy — please select and copy the URL manually.');
    }
  };

  const btnClass =
    variant === 'primary'
      ? 'btn btn-success'
      : variant === 'light'
      ? 'btn btn-light'
      : 'btn btn-outline-success';

  const btnSize = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';

  return (
    <div className="d-flex flex-wrap gap-2 align-items-center">
      <a
        href={`https://wa.me/?text=${encodedText}`}
        target="_blank"
        rel="noreferrer"
        className={`${btnClass} ${btnSize} d-inline-flex align-items-center gap-2`}
      >
        <FaWhatsapp style={{ fontSize: '1.15em' }} />
        {label}
      </a>

      {showOtherPlatforms && (
        <>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline-dark btn-sm d-inline-flex align-items-center gap-1"
          >
            <FaTwitter /> Tweet
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1"
          >
            <FaFacebook /> Share
          </a>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1"
            onClick={copyLink}
          >
            {copied ? <FaCheckCircle /> : <FaLink />}
            {copied ? 'Copied!' : 'Copy link'}
          </button>
        </>
      )}
    </div>
  );
}
