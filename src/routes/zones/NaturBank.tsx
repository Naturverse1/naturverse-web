import NaturToken from "../../components/NaturToken";

export default function ZoneNaturBank(){
  return (
    <>
      <h3>NaturBank 🪙</h3>
      <p className="muted">Manage your Natur tokens, learn crypto basics, and access your wallet.</p>

      <section>
        <h4>My Natur Tokens</h4>
        <NaturToken />
      </section>

      <section>
        <h4>Wallet</h4>
        <ul className="list">
          <li className="row">
            <div className="grow">🔑 Connect Wallet</div>
            <button>Connect</button>
          </li>
          <li className="row">
            <div className="grow">📜 Transaction History</div>
            <button>View</button>
          </li>
        </ul>
      </section>

      <section>
        <h4>Learn Crypto</h4>
        <ul className="cards">
          <li className="card">
            <div className="card-emoji">📘</div>
            <div>
              <div className="card-title">Crypto Basics</div>
              <div className="card-sub">What is a wallet? How does blockchain work?</div>
            </div>
          </li>
          <li className="card">
            <div className="card-emoji">🛡️</div>
            <div>
              <div className="card-title">Custodial vs Self-Custody</div>
              <div className="card-sub">Choose how you want to manage your Natur tokens.</div>
            </div>
          </li>
          <li className="card">
            <div className="card-emoji">🌐</div>
            <div>
              <div className="card-title">Web3 Safety</div>
              <div className="card-sub">Tips for keeping your assets secure.</div>
            </div>
          </li>
        </ul>
      </section>
    </>
  );
}

