import CommonCard from '../../components/CommonCard';
import { useMusic } from '../../hooks/useContent';

export default function Music(){
  const songs = useMusic();
  return (
    <div>
      <h1>Music</h1>
      {songs.map(s => (
        <CommonCard key={s.slug} title={s.title}/>
      ))}
    </div>
  );
}
