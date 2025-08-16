export default function Worlds(){
  return (
    <div className="nv-wrap">
      <h2>Explore Amazing Worlds</h2>
      <div className="grid">
        <section id="rainforest" className="card">
          <h3>Tropical Rainforest</h3>
          <p>Explore lush rainforests with Turian.</p>
          <a className="small" href="/zones/naturversity">Enter</a>
        </section>
        <section id="ocean" className="card">
          <h3>Ocean Adventures</h3>
          <p>Dive into crystal-clear waters.</p>
          <a className="small" href="/zones/naturversity#ocean">Enter</a>
        </section>
        <section id="stories" className="card">
          <h3>Magical Stories</h3>
          <p>Read stories of transformation and nature’s magic.</p>
          <a className="small" href="/zones/creator-lab">Enter</a>
        </section>
        <section id="brain" className="card">
          <h3>Brain Challenge</h3>
          <p>Test your knowledge with fun quizzes!</p>
          <a className="small" href="/zones/arcade">Enter</a>
        </section>
      </div>
    </div>
  );
}
