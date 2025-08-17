import React, { useState } from 'react';
import { addQuestion } from '../../lib/supaReviews';

type Props = {
  productId: string;
  onSaved: () => void;
};

export default function QuestionForm({ productId, onSaved }: Props) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.length < 10 || title.length > 140) {
      setError('Title must be 10-140 characters');
      return;
    }
    setSaving(true);
    const { error } = await addQuestion(productId, title, body);
    setSaving(false);
    if (error) setError(error.message);
    else {
      setTitle('');
      setBody('');
      setError(null);
      onSaved();
    }
  };

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: '0.5rem' }}>
      <input
        value={title}
        maxLength={140}
        placeholder="Title"
        onChange={e => setTitle(e.target.value)}
        required
      />
      <div className="char-count">{title.length}/140</div>
      <textarea
        value={body}
        maxLength={2000}
        placeholder="Details (optional)"
        onChange={e => setBody(e.target.value)}
        rows={4}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" disabled={saving}>
        Ask
      </button>
    </form>
  );
}
