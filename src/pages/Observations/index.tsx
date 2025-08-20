import CommonCard from '../../components/CommonCard';
import { useObservations } from '../../hooks/useContent';

export default function Observations(){
  const obs = useObservations();
  return (
    <div>
      <h1>Observations</h1>
      {obs.map(o => (
        <CommonCard key={o.slug} title={o.title}>
          {o.body}
        </CommonCard>
      ))}
    </div>
  );
}
