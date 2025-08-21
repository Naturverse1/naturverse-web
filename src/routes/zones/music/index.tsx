export default function MusicZone() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">🎤 Music</h2>
      <p className="text-gray-600">Karaoke, AI beats & song maker.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border p-4">
          <div className="font-semibold">Featured</div>
          <p className="text-sm text-gray-600">Starter activity for Music.</p>
        </div>
        <div className="rounded-lg border p-4 opacity-60">
          <div className="font-semibold">Coming Soon</div>
          <p className="text-sm text-gray-600">More tools will appear here.</p>
        </div>
      </div>
    </section>
  );
}
