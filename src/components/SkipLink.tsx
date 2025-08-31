import React from 'react';

/**
 * Keyboard users can press Tab once to reveal this link and jump
 * directly to the main content (id="main").
 */
export default function SkipLink() {
  return (
    <a href="#main" className="skip-link">
      Skip to content
    </a>
  );
}
