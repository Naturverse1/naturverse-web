import { Link, useParams } from 'react-router-dom';
import { bySection, type Doc, type Section } from '../lib/content';

export default function SectionList() {
  const { section } = useParams();
  const docs = bySection(section as Section);
  return (
    <>
      <h2 style={{textTransform:'capitalize'}}>{section}</h2>
      {docs.length === 0 && <p>Nothing here yet.</p>}
      <ul>
        {docs.map((d:Doc) => (
          <li key={d.slug}><Link to={`/${section}/${d.slug}`}>{d.title}</Link></li>
        ))}
      </ul>
    </>
  );
}
