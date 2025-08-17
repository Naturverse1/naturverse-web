import React, { useEffect, useState } from 'react';

interface Props {
  images: string[];
  onChange?: (index: number) => void;
}

export default function Gallery({ images, onChange }: Props) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    onChange?.(idx);
  }, [idx, onChange]);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setIdx(i => (i - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') setIdx(i => (i + 1) % images.length);
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [images.length]);

  return (
    <div>
      <div>
        <img src={images[idx]} alt="Product" style={{ width: '100%', borderRadius: 8 }} />
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => setIdx(i)}
            style={{
              border: i === idx ? '2px solid #fff' : '2px solid transparent',
              padding: 0,
              background: 'none',
              cursor: 'pointer',
            }}
          >
            <img src={src} alt="thumb" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4 }} />
          </button>
        ))}
      </div>
    </div>
  );
}
