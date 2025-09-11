import { useEffect, useState } from 'react';
import { listNavatarImageUrls } from '@/lib/navatarFiles';
import { supabase } from '@/supabaseClient';
import { useSession } from '@/state/session';
import { NavPills } from './_shared/NavPills';
import { CardFrame } from './_shared/CardFrame';

export default function PickNavatar() {
  const [images, setImages] = useState<string[]>([]);
  const { user } = useSession();

  useEffect(() => setImages(listNavatarImageUrls()), []);

  async function setActive(imageUrl: string) {
    if (!user) return alert('Please sign in.');
    // upsert into avatars table as user's active choice, one row per (user,image_path)
    const image_path = imageUrl; // public served path like /navatars/...
    const { data, error } = await supabase
      .from('avatars')
      .upsert(
        { user_id: user.id, image_path, image_url: image_path, is_primary: true },
        { onConflict: 'user_id,image_path' },
      )
      .select()
      .single();

    if (error) return alert(`Pick failed: ${error.message}`);

    // make this the current primary for the user (unset others)
    await supabase
      .from('avatars')
      .update({ is_primary: false })
      .eq('user_id', user.id)
      .neq('id', data.id);

    await supabase.from('avatars').update({ is_primary: true }).eq('id', data.id);

    window.location.href = '/navatar'; // back to main
  }

  return (
    <main className="container">
      <ol className="breadcrumb">
        <li>
          <a href="/">Home</a>
        </li>
        <li>/ Navatar</li>
      </ol>
      <h1>Pick Navatar</h1>
      <NavPills active="Pick" />
      <div className="grid">
        {images.map((src) => (
          <button key={src} className="pickCard" onClick={() => setActive(src)}>
            <CardFrame>
              <img src={src} alt="" />
            </CardFrame>
          </button>
        ))}
      </div>
    </main>
  );
}
