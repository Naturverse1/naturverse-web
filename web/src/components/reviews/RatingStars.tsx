import React from 'react';

type Props = {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  readOnly?: boolean;
};

export default function RatingStars({
  value,
  onChange,
  size = 16,
  readOnly = false,
}: Props) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <span>
      {stars.map(s => (
        <button
          key={s}
          type="button"
          aria-label={`${s} star`}
          onClick={() => !readOnly && onChange?.(s)}
          disabled={readOnly}
          style={{
            background: 'none',
            border: 'none',
            cursor: readOnly ? 'default' : 'pointer',
            fontSize: size,
            color: s <= value ? '#fc0' : '#ccc',
            padding: 0,
          }}
        >
          {s <= value ? '★' : '☆'}
        </button>
      ))}
    </span>
  );
}
