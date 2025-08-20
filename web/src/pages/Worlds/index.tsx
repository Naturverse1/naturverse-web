import CommonCard from '../../components/CommonCard';
import { useWorlds } from '../../hooks/useContent';

export default function Worlds(){
  const worlds = useWorlds();
  return (
    <div>
      <h1>Worlds</h1>
      {worlds.map(w => (
        <CommonCard key={w.slug} title={w.title}/>
      ))}
    </div>
  );
}
