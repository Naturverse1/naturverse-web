import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import { getMyActiveAvatar } from '../../lib/navatar';
import NavatarBreadcrumbs from '../../components/NavatarBreadcrumbs';
import '../../styles/navatar.css';

export default function MarketplaceStub() {
  const { user } = useAuth();
  const [avatar, setAvatar] = useState<any>(null);

  useEffect(() => { if (user) getMyActiveAvatar(user.id).then(setAvatar); }, [user]);

  return (
    <div className="navatar-shell">
      <NavatarBreadcrumbs />
      <h1>Marketplace (Coming Soon)</h1>
      <p className="center">Mockups and merch generator preview will appear here.</p>

      <div className="grid" style={{ marginTop: 18 }}>
        <div className="card-300" style={{ height: 420, background: '#f5f7ff' }}>
          {/* placeholder */}
        </div>
        {avatar && (
          <div className="card-300 center">
            <img src={avatar.image_url || ''} alt={avatar.name || 'Navatar'} />
            <div style={{ padding: 8, fontWeight: 700 }}>{avatar.name}</div>
          </div>
        )}
      </div>
    </div>
  );
}
