import { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';
import { NavPills } from './_shared/NavPills';
import { CardFrame } from './_shared/CardFrame';

export default function Mint() {
  const [img, setImg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const session = (await supabase.auth.getUser()).data.user;
      if (!session) return;
      const { data } = await supabase
        .from('avatars')
        .select('image_url')
        .eq('user_id', session.id)
        .eq('is_primary', true)
        .maybeSingle();
      setImg(data?.image_url ?? null);
    })();
  }, []);

  return (
    <main className="container">
      <ol className="breadcrumb">
        <li>
          <a href="/">Home</a>
        </li>
        <li>/ Navatar</li>
        <li>/ NFT / Mint</li>
      </ol>
      <h1>NFT / Mint</h1>
      <NavPills active="NFT / Mint" />
      <p className="lede">
        Coming soon: mint your Navatar on-chain. In the meantime, make merch with your Navatar on
        the Marketplace.
      </p>
      {img && (
        <section className="centerCol">
          <CardFrame>
            <img src={img} alt="" />
          </CardFrame>
          <div className="caption">{extractName(img)}</div>
        </section>
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
