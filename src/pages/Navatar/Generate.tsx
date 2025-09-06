import { Link, useNavigate } from 'react-router-dom';
import '../../styles/navatar.css';
import { useState } from 'react';

export default function Generate() {
  const [prompt, setPrompt] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    navigate('/navatar');
  }

  return (
    <section className="nv-section nv-center">
      <nav className="nv-breadcrumb nv-bc-blue">
        <Link to="/">Home</Link> <span>/</span>
        <Link to="/navatar">Navatar</Link> <span>/</span>
        <span>Describe &amp; Generate</span>
      </nav>
      <h2 className="nv-h2">Describe &amp; Generate</h2>

      <form className="nv-form" onSubmit={handleSave}>
        <textarea className="nv-input" rows={5} placeholder="Describe your Navatar…" value={prompt} onChange={e => setPrompt(e.target.value)} />
        <input className="nv-input" placeholder="Name (optional)" value={name} onChange={e => setName(e.target.value)} />
        <button className="nv-btn-blue" type="submit">Save</button>
      </form>
    </section>
  );
}

