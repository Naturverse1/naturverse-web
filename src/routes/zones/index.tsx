import HubCard from '../../components/HubCard';
import HubGrid from '../../components/HubGrid';
import { ld, breadcrumbsLd, itemListLd } from '../../lib/jsonld';

const labels = {
  '/worlds': 'Worlds',
  '/zones': 'Zones',
  '/marketplace': 'Marketplace',
  '/naturversity': 'Naturversity',
  '/naturbank': 'Naturbank',
  '/navatar': 'Navatar',
  '/passport': 'Passport',
  '/turian': 'Turian the Durian',
};

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

const zoneItems = [
  { name: 'Arcade', path: '/zones/arcade' },
  { name: 'Music', path: '/zones/music' },
  { name: 'Wellness', path: '/zones/wellness' },
  { name: 'Creator Lab', path: '/zones/creator-lab' },
  { name: 'Stories', path: '/zones/stories' },
  { name: 'Quizzes', path: '/zones/quizzes' },
  { name: 'Observations', path: '/zones/observations' },
  { name: 'Culture', path: '/zones/culture' },
  { name: 'Community', path: '/zones/community' },
  { name: 'Future Zone', path: '/zones/future' },
];

export default function Zones() {
  return (
    <>
      <main className="container">
        <div className="breadcrumb">Home / Zones</div>
        <h1 className="page-title text-brand">Zones</h1>
        <p className="section-lead">Pick a zone to start an activity.</p>

        <HubGrid>
          {ZONES.map((z) => (
            <HubCard key={z.title} to={z.to} emoji={z.emoji} title={z.title} sub={z.sub} />
          ))}
        </HubGrid>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ld(breadcrumbsLd('/zones', labels))}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ld(itemListLd('Zones', zoneItems))}
      />
    </>
  );
}
