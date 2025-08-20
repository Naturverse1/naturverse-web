import { Link } from 'react-router-dom';

export default function NaturversityHub() {
  const cards = [
    { to: '/naturversity/web3', title: 'Web3 & Crypto Basics', desc: 'Simple guides for families' },
    { to: '/naturversity/wallets', title: 'Custodial Wallet Tools', desc: 'Parent-managed NATUR balance' },
    { to: '/naturversity/teachers', title: 'Teacher Dashboards', desc: 'Quiz results & progress' },
    { to: '/naturversity/parents', title: 'Parent Controls', desc: 'Locks, limits, approvals' },
    { to: '/naturversity/dao', title: 'DAO Literacy', desc: 'Proposals & voting with $NATUR' },
  ];
  return (
    <main className="page">
      <h1>Naturversity™</h1>
      <p>Resources for parents, teachers, and older users.</p>
      <div className="card-grid">
        {cards.map(c => (
          <Link key={c.to} to={c.to} className="card">
            <h3>{c.title}</h3>
            <p>{c.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
