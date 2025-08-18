import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

export default function Home() {
  return (
    <>
      <Seo title="Naturverse" description="Embark on your magical learning journey." />
      <div className="landing">
        <section className="hero">
          <h1>Welcome to The Naturverse</h1>
          <p>Embark on your magical learning journey.</p>
        </section>
        <div className="grid">
          <Link to="/worlds" className="card"><h3>Worlds</h3></Link>
          <Link to="/zones" className="card"><h3>Zones</h3></Link>
          <Link to="/zones/arcade" className="card"><h3>Arcade</h3></Link>
          <Link to="/marketplace" className="card"><h3>Marketplace</h3></Link>
          <Link to="/account" className="card"><h3>Account</h3></Link>
        </div>
      </div>
    </>
  );
}

