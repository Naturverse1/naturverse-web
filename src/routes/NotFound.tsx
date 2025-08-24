export default function NotFound() {
  return (
    <section style={{maxWidth: 680, margin: "48px auto"}}>
      <h1>Page not found</h1>
      <p>We couldn’t find that page. Try the links above or head home.</p>
      <a href="/" className="btn">Go home</a>
    </section>
  );
}
