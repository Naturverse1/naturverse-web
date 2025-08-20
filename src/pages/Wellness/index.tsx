import CommonCard from '../../components/CommonCard';
import { useWellness } from '../../hooks/useContent';

export default function Wellness(){
  const tips = useWellness();
  return (
    <div>
      <h1>Wellness</h1>
      {tips.map(t => (
        <CommonCard key={t.slug} title={t.title}>
          {t.body}
        </CommonCard>
      ))}
    </div>
  );
}
