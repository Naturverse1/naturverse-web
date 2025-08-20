import { bySection } from '../lib/content';
export default function Marketplace(){
  const items = bySection('market');
  return (
    <>
      <h2>Marketplace</h2>
      <ul>
        {items.map(i=>(
          <li key={i.slug}>
            <strong>{i.title}</strong> — {i.price ? `${i.price} NATUR` : i.description}
          </li>
        ))}
      </ul>
    </>
  );
}
