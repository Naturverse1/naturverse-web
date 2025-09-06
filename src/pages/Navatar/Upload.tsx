import { Link, useNavigate } from 'react-router-dom';
import '../../styles/navatar.css';
import { useState } from 'react';

export default function Upload() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    navigate('/navatar');
  }

  return (
    <section className="nv-section nv-center">
      <nav className="nv-breadcrumb nv-bc-blue">
        <Link to="/">Home</Link> <span>/</span>
        <Link to="/navatar">Navatar</Link> <span>/</span>
        <span>Upload</span>
      </nav>
      <h2 className="nv-h2">Upload Navatar</h2>

      <form className="nv-form" onSubmit={handleUpload}>
        <input type="file" accept="image/*" className="nv-input" />
        <input className="nv-input" placeholder="Name (optional)" value={name} onChange={e => setName(e.target.value)} />
        <button className="nv-btn-blue" type="submit">Upload</button>
      </form>
    </section>
  );
}

