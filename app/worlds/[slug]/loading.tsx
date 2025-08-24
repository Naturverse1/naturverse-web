export default function Loading() {
  return (
    <div className="container">
      {/* ... existing map skeleton ... */}
      <div className="mt-10">
        <div className="grid grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
