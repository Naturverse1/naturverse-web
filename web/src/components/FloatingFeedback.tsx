import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from './ui/useToast';
import { submitNetlifyForm } from '../lib/feedback';

export default function FloatingFeedback() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    category: 'Bug',
    message: '',
    email: '',
    'bot-field': '',
  });
  const loc = useLocation();
  const toast = useToast();

  if (loc.pathname.includes('checkout')) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await submitNetlifyForm({
        'form-name': 'natur-feedback',
        category: form.category,
        message: form.message,
        email: form.email,
        page: window.location.href,
        ua: navigator.userAgent,
        'bot-field': form['bot-field'],
      });
      setSent(true);
      setForm({ category: 'Bug', message: '', email: '', 'bot-field': '' });
      toast.success("Thanks! We'll get back to you.", 3000);
      setTimeout(() => {
        setSent(false);
        setOpen(false);
      }, 3000);
    } catch {
      toast.error("Couldn't send feedback—try again.");
    }
  };

  return (
    <>
      <button className="nv-feedback-btn" onClick={() => setOpen(o => !o)} aria-label="Feedback">
        Feedback
      </button>
      <div className={`nv-feedback-panel${open ? ' open' : ''}`}>
        {sent ? (
          <p>Thanks! We'll get back to you.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <input type="hidden" name="form-name" value="natur-feedback" />
            <p hidden>
              <label>
                Don’t fill this out: <input name="bot-field" value={form['bot-field']} onChange={handleChange} />
              </label>
            </p>
            <div className="field">
              <label>
                Category
                <select name="category" value={form.category} onChange={handleChange}>
                  <option>Bug</option>
                  <option>Feature</option>
                  <option>Order issue</option>
                  <option>Other</option>
                </select>
              </label>
            </div>
            <div className="field">
              <label>
                Message
                <textarea name="message" required maxLength={2000} value={form.message} onChange={handleChange} rows={3}></textarea>
              </label>
            </div>
            <div className="field">
              <label>
                Email (optional)
                <input type="email" name="email" value={form.email} onChange={handleChange} />
              </label>
            </div>
            <small style={{ opacity: 0.7, display: 'block', marginBottom: '8px' }}>
              We only use this info to respond.
            </small>
            <button className="button" type="submit">Send</button>
          </form>
        )}
      </div>
    </>
  );
}
