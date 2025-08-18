import React from 'react';

type Props = {
  page: number;
  pages: number;
  onChange: (p: number) => void;
};

export default function Pagination({ page, pages, onChange }: Props) {
  if (pages <= 1) return null;

  const go = (p: number) => {
    if (p < 1 || p > pages || p === page) return;
    onChange(p);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(page + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(page - 1); }
  };

  const maxButtons = 5;
  let start = Math.max(1, page - 2);
  let end = Math.min(pages, start + maxButtons - 1);
  if (end - start < maxButtons - 1) start = Math.max(1, end - maxButtons + 1);
  const nums = [];
  for (let i = start; i <= end; i++) nums.push(i);
  const showStart = start > 1;
  const showEnd = end < pages;

  return (
    <nav className="pagination" aria-label="Pagination" onKeyDown={handleKey} tabIndex={0}>
      <button onClick={() => go(page - 1)} disabled={page === 1} aria-label="Previous page">Prev</button>
      {showStart && (
        <>
          <button onClick={() => go(1)} aria-current={page === 1 ? 'page' : undefined}>1</button>
          {start > 2 && <span className="ellipsis">…</span>}
        </>
      )}
      {nums.map(n => (
        <button key={n} onClick={() => go(n)} aria-current={n === page ? 'page' : undefined}>{n}</button>
      ))}
      {showEnd && (
        <>
          {end < pages - 1 && <span className="ellipsis">…</span>}
          <button onClick={() => go(pages)} aria-current={page === pages ? 'page' : undefined}>{pages}</button>
        </>
      )}
      <button onClick={() => go(page + 1)} disabled={page === pages} aria-label="Next page">Next</button>
    </nav>
  );
}
