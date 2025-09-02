import { Breadcrumbs } from '../../components/Breadcrumbs';
import './navatar.css';

export default function NavatarGenerate() {
  return (
    <div className="nv-wrap">
      <Breadcrumbs items={[{ to: '/', label: 'Home' }, { to: '/navatar', label: 'Navatar' }, { label: 'Describe & Generate' }]} />
      <h1>Describe & Generate a Navatar</h1>
      <p>Coming next.</p>
    </div>
  );
}

