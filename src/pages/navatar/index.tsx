import { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';
import { useSession } from '@/state/session';
import { NavPills } from './_shared/NavPills';
import { CardFrame } from './_shared/CardFrame';

type View = { image_url: string | null; name: string | null };

export default function MyNavatar() {
  const { user } = useSession();
  const [view, setView] = useState<View | null>(null);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const { data: avatar } = await supabase
        .from('avatars')
        .select('image_url')
        .eq('user_id', user.id)
        .eq('is_primary', true)
        .maybeSingle();

      const { data: card } = await supabase
        .from('character_cards')
        .select('name')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      setView({ image_url: avatar?.image_url ?? null, name: card?.name ?? null });
    })();
  }, [user]);

  return (
    <main className="container">
      <ol className="breadcrumb">
        <li>
          <a href="/">Home</a>
        </li>
        <li>/ Navatar</li>
      </ol>
      <h1>My Navatar</h1>
      <NavPills active="My Navatar" />
      {view?.image_url ? (
        <section className="centerCol">
          <CardFrame>
            <img src={view.image_url} alt="" />
          </CardFrame>
          <div className="caption">{view.name ?? extractName(view.image_url)}</div>
        </section>
      ) : (
        <p>
          No Navatar yet. <a href="/navatar/pick">Pick</a> or <a href="/navatar/upload">Upload</a>
        </p>
      )}
    </main>
  );
}

function extractName(path: string) {
  return (
    path
      .split('/')
      .pop()
      ?.replace(/\.[a-z]+$/i, '') ?? 'Unnamed'
  );
}
