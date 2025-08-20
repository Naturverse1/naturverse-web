export default function Home() {
  return (
    <>
      <h2>Explore</h2>
      <ul className="cards">
        <li className="card">
          <a className="card-link" href="/naturbank">
            <div className="card-emoji">🏦</div>
            <div>
              <div className="card-title">NaturBank</div>
              <div className="card-sub">Wallets, Natur token, crypto learning</div>
            </div>
          </a>
        </li>
        <li className="card">
          <a className="card-link" href="/navatar">
            <div className="card-emoji">🧩</div>
            <div>
              <div className="card-title">Navatar Creator</div>
              <div className="card-sub">Build your character for the Naturverse</div>
            </div>
          </a>
        </li>
      </ul>
    </>
  );
}
