export function NavPills({ active }: { active: string }) {
  const items = [
    ['My Navatar', '/navatar'],
    ['Card', '/navatar/card'],
    ['Pick', '/navatar/pick'],
    ['Upload', '/navatar/upload'],
    ['Generate', '/navatar/generate'],
    ['NFT / Mint', '/navatar/mint'],
    ['Marketplace', '/navatar/marketplace'],
  ];
  return (
    <nav className="pills">
      {items.map(([label, href]) => (
        <a key={href} className={`pill ${active === label ? 'active' : ''}`} href={href}>
          {label}
        </a>
      ))}
    </nav>
  );
}
