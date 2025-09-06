import { useEffect, useState } from 'react';
import Breadcrumbs from '../../components/Breadcrumbs';
import { Pills } from '../../components/navatar/Pills';
import { CardFrame } from '../../components/navatar/CardFrame';
import { CardReadout } from '../../components/navatar/CardReadout';
import { getUserNavatar, getUserCard, type UserNavatar, type UserCard } from '@/lib/supabase/navatar';
import { useAuth } from '@/lib/auth-context';
import '../../styles/navatar.css';

export default function MyNavatarPage() {
  const { user } = useAuth();
  const [navatar, setNavatar] = useState<UserNavatar | null>(null);
  const [card, setCard] = useState<UserCard | null>(null);

  useEffect(() => {
    if (!user) return;
    getUserNavatar(user.id).then(setNavatar);
    getUserCard(user.id).then(setCard);
  }, [user]);

  return (
    <main className="container">
      <Breadcrumbs items={[{ href: '/', label: 'Home' }, { href: '/navatar', label: 'Navatar' }]} />
      <h1 className="nv-heading">My Navatar</h1>
      <Pills hub="navatar" active="my" hideOnMobileSubpages />
      <div className="nv-two-col">
        <CardFrame title={navatar?.name ?? 'My Navatar'}>
          {navatar?.url ? (
            <img src={navatar.url} alt="My Navatar" />
          ) : (
            <div className="nav-card__placeholder">No photo</div>
          )}
        </CardFrame>
        <CardReadout card={card} />
      </div>
    </main>
  );
}

