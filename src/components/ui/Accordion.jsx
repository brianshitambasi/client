import React, { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

export default function Accordion({ items }) {
  const [open, setOpen] = useState(null);
  const toggle = (i) => setOpen(open === i ? null : i);

  return (
    <div className="accordion yt-accordion">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div className="yt-accordion-item" key={i}>
            <button
              type="button"
              className="yt-accordion-head"
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
            >
              <span>{it.q}</span>
              <span className="yt-accordion-icon">{isOpen ? <FaMinus /> : <FaPlus />}</span>
            </button>
            {isOpen && (
              <div className="yt-accordion-body">
                {typeof it.a === 'string' ? <p className="mb-0">{it.a}</p> : it.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
