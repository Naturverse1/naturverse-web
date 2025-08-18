import React from 'react';

export default function ShareRow() {
  const url = typeof window !== 'undefined' ? window.location.href : '';

  const copy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
  };

  const share = (u: string) => {
    window.open(u, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="share-row">
      <button onClick={copy}>Copy Link</button>
      <button
        onClick={() =>
          share(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`)
        }
      >
        X
      </button>
      <button
        onClick={() =>
          share(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
        }
      >
        Facebook
      </button>
    </div>
  );
}

