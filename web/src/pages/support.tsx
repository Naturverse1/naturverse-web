import { useState } from 'react';
import Seo from '../components/Seo';
import { useToast } from '../components/ui/useToast';
import { submitNetlifyForm } from '../lib/feedback';

export default function Support() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    category: 'Bug',
    message: '',
    email: '',
    'bot-field': '',
  });
  const toast = useToast();

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
      setTimeout(() => setSent(false), 3000);
    } catch {
      toast.error("Couldn't send feedback—try again.");
    }
  };

  return (
    <main className="page">
      <Seo title="Support – Naturverse" description="Send feedback or get help." />
      <h1>Support</h1>
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
              <textarea name="message" required maxLength={2000} value={form.message} onChange={handleChange}></textarea>
            </label>
          </div>
          <div className="field">
            <label>
              Email (optional)
              <input type="email" name="email" value={form.email} onChange={handleChange} />
            </label>
          </div>
          <small style={{ opacity: 0.7 }}>We only use this info to respond.</small>
          <div style={{ marginTop: '8px' }}>
            <button className="button" type="submit">Send</button>
          </div>
        </form>
      )}
    </main>
  );
}
