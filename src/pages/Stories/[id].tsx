import { useParams } from 'react-router-dom';
import { useStories } from '../../hooks/useContent';
export default function StoryDetail(){
  const { id } = useParams();
  const story = useStories().find(s=>s.slug===id);
  if(!story) return <p>Story not found.</p>;
  return (<div><h1>{story.title}</h1><p style={{whiteSpace:'pre-wrap'}}>{story.body}</p></div>);
}
