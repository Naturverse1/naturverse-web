import { useAuth } from '@/lib/auth-context';
import type React from 'react';
import { signInWithGoogle } from '../lib/auth';

export default function Home() {
  const { user } = useAuth();
  const authed = !!user;

  return (
    <main className="home">
      <section className="hero">
        <h1 className="homeTitle">Welcome to the Naturverse™</h1>
        <p className="homeSubtitle">A playful world of kingdoms, characters, and quests that teach wellness, creativity, and kindness.</p>

        {!authed && (
          <div className="ctaRow">
            <button className="btn-primary" onClick={() => document.getElementById('open-signup')?.click()}>
              Create account
            </button>
            <button className="btn-primary" onClick={signInWithGoogle}>
              Continue with Google
            </button>
          </div>
        )}

        <div className="tiles">
          <Tile title="Play" desc="Mini-games, stories, and map adventures across 14 kingdoms."
                to={authed ? '/zones' : undefined} disabled={!authed} />
          <Tile title="Learn" desc="Naturversity lessons in languages, art, music, wellness, and more."
                to={authed ? '/naturversity' : undefined} disabled={!authed} />
          <Tile title="Earn" desc="Collect badges, save favorites, and build your Navatar card."
                foot="Natur Coin — coming soon"
                to={authed ? '/naturbank' : undefined} disabled={!authed} />
        </div>
      </section>

      <section className="flow">
        <Step title="1) Create" desc={<span>Create a free account · <a href="#" onClick={(e)=>{e.preventDefault(); document.getElementById('open-signup')?.click();}}>create your Navatar</a></span>} />
        <Step title="2) Pick a hub" desc={<span><b>Worlds</b> · <b>Zones</b> · <b>Marketplace</b></span>} />
        <Step title="3) Play · Learn · Earn" desc={<span>Explore, meet characters, earn badges <small className="muted">(Natur Coin — coming soon)</small></span>} />
      </section>
    </main>
  );
}

function Tile({ title, desc, foot, to, disabled }:{
  title:string; desc:string; foot?:string; to?:string; disabled?:boolean
}) {
  const core = (
    <div className={`tile ${disabled ? 'tileDisabled' : ''}`} aria-disabled={disabled}>
      <h3 className="tileTitle">{title}</h3>
      <p className="tileDesc">{desc}</p>
      {foot && <p className="tileFoot">{foot}</p>}
    </div>
  );
  return disabled || !to ? core : <a className="tileLink" href={to}>{core}</a>;
}

function Step({ title, desc }:{title:string; desc:React.ReactNode}) {
  return (
    <div className="step">
      <div className="stepTitle">{title}</div>
      <div className="stepDesc">{desc}</div>
    </div>
  );
}
