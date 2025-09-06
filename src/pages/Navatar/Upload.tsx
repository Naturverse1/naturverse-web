import { useNavigate, Link } from 'react-router-dom';
import '../../styles/navatar.css';

export default function Upload() {
  const navigate = useNavigate();
  async function handleSave() {
    // TODO: your upload+save to Supabase Storage, then:
    navigate('/navatar');
  }

  return (
    <section className="nv-section">
      <nav className="nv-breadcrumb nv-subcrumb">
        <Link to="/">Home</Link> <span>/</span>
        <Link to="/navatar">Navatar</Link> <span>/</span>
        <span>Upload</span>
      </nav>

      <h2 className="nv-h2">Upload</h2>
      <p className="nv-muted">Choose an image to use as your Navatar card.</p>
      {/* your dropzone/input here */}
      <button className="nv-btn-primary" onClick={handleSave}>
        Save
      </button>
    </section>
  );
}
