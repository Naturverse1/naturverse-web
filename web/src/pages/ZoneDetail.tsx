import { useParams } from 'react-router-dom';
import { find } from '../lib/content';

export default function ZoneDetail(){
  const { slug } = useParams();
  const zone = find('zones', slug!);
  if(!zone) return <p>Zone not found.</p>;
  return (<>
    <h2>{zone.title}</h2>
    {zone.description && <p>{zone.description}</p>}
    {zone.body && <div dangerouslySetInnerHTML={{__html: zone.body}}/>}
  </>);
}
