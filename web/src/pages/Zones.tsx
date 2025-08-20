import { bySection } from '../lib/content';
import { Link } from 'react-router-dom';

export default function Zones(){
  const zones = bySection('zones');
  return (
    <>
      <h2>Zones</h2>
      <ul>{zones.map(z=><li key={z.slug}><Link to={`/zones/${z.slug}`}>{z.title}</Link></li>)}</ul>
    </>
  );
}
