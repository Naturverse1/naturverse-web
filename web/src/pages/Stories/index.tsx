import CommonCard from '../../components/CommonCard';
import FavButton from '../../components/FavButton';
import { useStories } from '../../hooks/useContent';
import { Link } from 'react-router-dom';

export default function Stories(){
  const stories = useStories();
  return (
    <div>
      <h1>Stories</h1>
      {stories.map(s=> (
        <CommonCard key={s.slug} title={s.title}>
          <Link to={`/stories/${s.slug}`}>Read</Link>
          <FavButton type="content" id={s.slug}/>
        </CommonCard>
      ))}
    </div>
  );
}
