import { useParams } from 'react-router-dom';
import { find, type Section } from '../lib/content';

export default function SectionDetail() {
  const { section, slug } = useParams();
  const doc = find(section as Section, slug!);
  if (!doc) return <p>Not found.</p>;
  return (
    <>
      <h2>{doc.title}</h2>
      {doc.image && <img src={doc.image} alt="" style={{maxWidth:'100%', borderRadius:8}}/>}
      {doc.description && <p>{doc.description}</p>}
      {doc.body && <div dangerouslySetInnerHTML={{__html: doc.body}}/>}
    </>
  );
}
