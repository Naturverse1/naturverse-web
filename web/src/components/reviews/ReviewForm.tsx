import React, { useState } from 'react';
import RatingStars from './RatingStars';
import { upsertReview } from '../../lib/supaReviews';

type Props = {
  productId: string;
  existing?: {
    id: string;
    rating: number;
    title: string | null;
    body: string;
  } | null;
  onSaved: () => void;
};

export default function ReviewForm({ productId, existing, onSaved }: Props) {
  const [rating, setRating] = useState(existing?.rating || 0);
  const [title, setTitle] = useState(existing?.title || '');
  const [body, setBody] = useState(existing?.body || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || body.length < 20 || body.length > 2000 || title.length > 120) {
      setError('Please complete required fields');
      return;
    }
    setSaving(true);
    const { error } = await upsertReview(productId, { rating, title, body });
    setSaving(false);
    if (error) setError(error.message);
    else {
      setError(null);
      onSaved();
    }
  };

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: '0.5rem' }}>
      <div>
        <RatingStars value={rating} onChange={setRating} size={20} />
      </div>
      <div>
        <input
          value={title}
          maxLength={120}
          placeholder="Title (optional)"
          onChange={e => setTitle(e.target.value)}
        />
        <div className="char-count">{title.length}/120</div>
      </div>
      <div>
        <textarea
          value={body}
          maxLength={2000}
          required
          placeholder="Your review"
          onChange={e => setBody(e.target.value)}
          rows={5}
        />
        <div className="char-count">{body.length}/2000</div>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" disabled={saving}>
        {existing ? 'Save' : 'Submit'}
      </button>
    </form>
  );
}
