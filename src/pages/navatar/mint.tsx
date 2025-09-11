import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import { getMyActiveAvatar } from '../../lib/navatar';
import NavatarBreadcrumbs from '../../components/NavatarBreadcrumbs';
import '../../styles/navatar.css';

export default function MintPage() {
  const { user } = useAuth();
  const [avatar, setAvatar] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    getMyActiveAvatar(user.id).then(setAvatar);
  }, [user]);

  return (
    <div className="navatar-shell">
      <NavatarBreadcrumbs />
      <h1>NFT / Mint</h1>
      <p className="center">Coming soon: mint your Navatar on-chain. In the meantime, make merch with your Navatar on the Marketplace.</p>
      {avatar && (
        <div className="card-300 center" style={{ margin: '12px auto' }}>
          <img src={avatar.image_url || ''} alt={avatar.name || 'Navatar'} />
          <h3 style={{ padding: '10px 0' }}>{avatar.name}</h3>
        </div>
      )}
    </div>
  );
}
