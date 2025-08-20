import { bySection } from '../lib/content';
export default function Worlds(){
  const worlds = bySection('worlds');
  return (<>
    <h2>Worlds</h2>
    <ul>{worlds.map(w=><li key={w.slug}>{w.title}</li>)}</ul>
  </>);
}
