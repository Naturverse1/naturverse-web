import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import NavatarBreadcrumbs from '../../components/NavatarBreadcrumbs';
import '../../styles/navatar.css';
import { getMyActiveAvatar } from '../../lib/navatar';
import { Link } from 'react-router-dom';

export default function MyNavatar() {
  const { user } = useAuth();
  const [avatar, setAvatar] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      if (!user) return;
      setLoading(true);
      const a = await getMyActiveAvatar(user.id);
      setAvatar(a);
      setLoading(false);
    };
    run();
  }, [user]);

  if (!user) return <div className="navatar-shell"><p>Please sign in.</p></div>;

  return (
    <div className="navatar-shell">
      <NavatarBreadcrumbs />
      <h1>My Navatar</h1>

      <div className="pills">
        <Link className="pill" to="/navatar">My Navatar</Link>
        <Link className="pill" to="/navatar/card">Card</Link>
        <Link className="pill" to="/navatar/pick">Pick</Link>
        <Link className="pill" to="/navatar/upload">Upload</Link>
        <Link className="pill" to="/navatar/generate">Generate</Link>
        <Link className="pill" to="/navatar/mint">NFT / Mint</Link>
        <Link className="pill" to="/navatar/marketplace">Marketplace</Link>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : !avatar ? (
        <p>No Navatar yet. <Link to="/navatar/pick">Pick</Link> or <Link to="/navatar/upload">Upload</Link></p>
      ) : (
        <div className="card-300 center" style={{ margin: '12px auto' }}>
          <img src={avatar.image_url || ''} alt={avatar.name || 'Navatar'} />
          <h3 style={{ padding: '10px 0' }}>{avatar.name}</h3>
        </div>
      )}
    </div>
  );
}
