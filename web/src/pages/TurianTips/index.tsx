import CommonCard from '../../components/CommonCard';
import FavButton from '../../components/FavButton';
import { useTips } from '../../hooks/useContent';

export default function TurianTips(){
  const tips = useTips();
  return (
    <div>
      <h1>Tips</h1>
      {tips.map(t => (
        <CommonCard key={t.slug} title={t.title}>
          {t.body}
          <FavButton type="content" id={t.slug}/>
        </CommonCard>
      ))}
    </div>
  );
}
