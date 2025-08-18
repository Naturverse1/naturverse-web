import { useState } from 'react';
import Seo from '../components/Seo';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    await fetch('/', { method: 'POST', body: data });
    setSent(true);
  };
  return (
    <main className="page">
      <Seo title="Contact – Naturverse" description="Get in touch with the Naturverse team." />
      <h1>Contact</h1>
      {sent ? (
        <p>Thanks—message received!</p>
      ) : (
        <form name="contact" method="POST" data-netlify="true" netlify onSubmit={handleSubmit}>
          <input type="hidden" name="form-name" value="contact" />
          <div className="field">
            <label>
              Name
              <input type="text" name="name" required />
            </label>
          </div>
          <div className="field">
            <label>
              Email
              <input type="email" name="email" required />
            </label>
          </div>
          <div className="field">
            <label>
              Message
              <textarea name="message" required></textarea>
            </label>
          </div>
          <button className="button" type="submit">Send</button>
        </form>
      )}
    </main>
  );
}
