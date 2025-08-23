import HubCard from '../../components/HubCard';
import HubGrid from '../../components/HubGrid';
import Meta from '../../components/Meta';
import { breadcrumbs } from '../../lib/jsonld';
import { useEffect, useState } from 'react';
import SkeletonGrid from '../../components/SkeletonGrid';
import PageHead from '../../components/PageHead';

const ZONES = [
  {
    to: '/zones/arcade',
    emoji: '📍🕹️',
    title: 'Arcade',
    sub: 'Mini-games, leaderboards & tournaments.',
  },
  { to: '/zones/music', emoji: '🎤🎵', title: 'Music', sub: 'Karaoke, AI beats & song maker.' },
  {
    to: '/zones/wellness',
    emoji: '🧘',
    title: 'Wellness',
    sub: 'Yoga, breathing, stretches, mindful quests.',
  },
  {
    to: '/zones/creator-lab',
    emoji: '🎨🤖',
    title: 'Creator Lab',
    sub: 'AI art & character cards.',
  },
  {
    to: '/zones/stories',
    emoji: '📚✨',
    title: 'Stories',
    sub: 'AI story paths set in all 14 kingdoms.',
  },
  {
    to: '/zones/quizzes',
    emoji: '🎯🧠',
    title: 'Quizzes',
    sub: 'Solo & party quiz play with scoring.',
  },
  {
    to: '/zones/observations',
    emoji: '📷🌿',
    title: 'Observations',
    sub: 'Upload nature pics; tag, learn, earn.',
  },
  {
    to: '/zones/culture',
    emoji: '🏮',
    title: 'Culture',
    sub: 'Beliefs, holidays, & ceremonies.',
  },
  {
    to: '/zones/community',
    emoji: '🗳️',
    title: 'Community',
    sub: 'Voting, events, & volunteering.',
  },
  {
    to: '/zones/future',
    emoji: '🔮',
    title: 'Future Zone',
    sub: 'AR/VR, Console, Multiplayer, 3D, AI companions, wallet upgrades.',
  },
];


export default function Zones() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 250);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="container-narrow">
      <PageHead title="Naturverse — Zones" description="Pick a zone to start games, music, wellness, and more." />
      <Meta title="Zones — Naturverse" description="Pick a zone to start games, music, wellness, and more." />
      <main id="main" className="container">
        <div className="breadcrumb">Home / Zones</div>
        <h1 className="page-title text-brand">Zones</h1>
        <p className="section-lead">Pick a zone to start an activity.</p>

        {ready ? (
        <HubGrid>
          {ZONES.map((z) => (
            <HubCard key={z.title} to={z.to} emoji={z.emoji} title={z.title} sub={z.sub} />
          ))}
        </HubGrid>
        ) : (
          <SkeletonGrid count={6} />
        )}
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbs('/zones', { '/zones': 'Zones' })
          ),
        }}
      />
    </div>
  );
}
