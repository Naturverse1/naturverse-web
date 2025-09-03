import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '../../lib/session';
import '../../styles/navatar.css';

export default function NavatarGenerate() {
  const user = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    const fd = new FormData(e.currentTarget);
    try {
      const r = await fetch('/.netlify/functions/generate-navatar', {
        method: 'POST',
        body: fd,
      });

      const text = await r.text();
      let data: any = {};
      try { data = JSON.parse(text); } catch {}

      if (!r.ok) {
        throw new Error(data?.error || `HTTP ${r.status}`);
      }

      const url = data.image_url as string;
      // TODO: show preview / link
      setSuccess('Created!');
    } catch (err: any) {
      setError(err.message || 'Create failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="nav-page">
      <div className="breadcrumbs">
        <Link to="/">Home</Link> / <Link to="/navatar">Navatar</Link> / Describe &amp; Generate
      </div>
      <h1 className="nav-title">Describe &amp; Generate</h1>
      <form className="nav-card" onSubmit={onSubmit} encType="multipart/form-data">
        <textarea name="prompt" placeholder="Describe your Navatar" rows={4} />
        <input type="file" name="source" />
        <input type="file" name="mask" />
        <input type="text" name="name" placeholder="Name (optional)" />
        <input type="hidden" name="userId" value={user?.id ?? ''} />
        <button className="nav-btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Save'}
        </button>
        {error && <div className="nav-error">{error}</div>}
      </form>
    </div>
  );
}

