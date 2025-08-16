export default function Landing() {
  return (
    <main className="landing">
      <section className="hero">
        <h1>Welcome to The Naturverse!</h1>
        <p>Sign in to start your magical learning journey ✨🌿</p>
        <a className="cta" href="/login">Start Your Adventure</a>
      </section>
      <section className="grid">
        <article>
          <h2>Explore Amazing Worlds</h2>
          <ul>
            <li><a href="/rainforest">Tropical Rainforest</a></li>
            <li><a href="/map#ocean">Ocean Adventures</a></li>
            <li><a href="/map#stories">Magical Stories</a></li>
            <li><a href="/map#quizzes">Brain Challenge</a></li>
          </ul>
        </article>
      </section>
    </main>
  );
}
