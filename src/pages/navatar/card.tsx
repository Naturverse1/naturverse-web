import { useEffect, useState } from 'react';
import Breadcrumbs from '../../components/Breadcrumbs';
import { Pills } from '../../components/navatar/Pills';
import { CardReadout } from '../../components/navatar/CardReadout';
import { saveUserCard, getUserCard, type UserCard } from '@/lib/supabase/navatar';
import { useAuth } from '@/lib/auth-context';
import '../../styles/navatar.css';

function formToCard(userId: string, fd: FormData): UserCard {
  const get = (k: string) => fd.get(k)?.toString().trim() || undefined;
  const split = (k: string) =>
    get(k)
      ?.split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  return {
    user_id: userId,
    name: get('name'),
    species: get('species'),
    kingdom: get('kingdom'),
    backstory: get('backstory'),
    powers: split('powers'),
    traits: split('traits'),
  };
}

export default function CardPage() {
  const { user } = useAuth();
  const [card, setCard] = useState<UserCard | null>(null);

  useEffect(() => {
    if (!user) return;
    getUserCard(user.id).then(setCard);
  }, [user]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const data = formToCard(user.id, new FormData(e.currentTarget));
    await saveUserCard(data);
    setCard(data);
  };

  return (
    <main className="container">
      <Breadcrumbs items={[{ href: '/', label: 'Home' }, { href: '/navatar', label: 'Navatar' }, { label: 'Card' }]} />
      <h1 className="nv-heading">Character Card</h1>
      <Pills hub="navatar" active="card" hideOnMobileSubpages />
      <div className="nv-two-col">
        <CardReadout card={card} />
        <form onSubmit={onSubmit} className="nv-form" style={{ display: 'grid', gap: 12 }}>
          <label className="nv-label">Name<input name="name" defaultValue={card?.name} /></label>
          <label className="nv-label">Species / Type<input name="species" defaultValue={card?.species} /></label>
          <label className="nv-label">Kingdom<input name="kingdom" defaultValue={card?.kingdom} /></label>
          <label className="nv-label">Backstory<textarea name="backstory" defaultValue={card?.backstory} /></label>
          <label className="nv-label">Powers (comma separated)<input name="powers" defaultValue={card?.powers?.join(', ') || ''} /></label>
          <label className="nv-label">Traits (comma separated)<input name="traits" defaultValue={card?.traits?.join(', ') || ''} /></label>
          <div className="row end" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button className="pill" type="submit">Save</button>
          </div>
        </form>
      </div>
    </main>
  );
}

