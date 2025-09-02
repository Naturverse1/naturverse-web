import { Breadcrumbs } from '../../components/Breadcrumbs';
import './navatar.css';

export default function NavatarUpload() {
  return (
    <div className="nv-wrap">
      <Breadcrumbs items={[{ to: '/', label: 'Home' }, { to: '/navatar', label: 'Navatar' }, { label: 'Upload' }]} />
      <h1>Upload a Navatar</h1>
      <p>Coming next.</p>
    </div>
  );
}

