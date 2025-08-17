import { Link } from 'react-router-dom';
import ImmersiveBackground from '../components/ImmersiveBackground';

export default function Home() {
  return (
    <div className="relative flex items-center justify-center py-32 min-h-[60vh] text-center">
      <ImmersiveBackground />
      <div className="relative z-10 space-y-6">
        <h1 className="text-4xl font-bold">Welcome to The Naturverse</h1>
        <p className="opacity-90">Sign in to start your magical learning journey ✨🌿</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link className="nv-btn" to="/worlds">Explore Worlds</Link>
          <Link className="nv-btn" to="/zones">Enter Zones</Link>
          <Link className="nv-btn" to="/marketplace">Marketplace</Link>
        </div>
      </div>
    </div>
  );
}

