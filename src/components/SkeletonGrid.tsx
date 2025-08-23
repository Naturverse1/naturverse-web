export default function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="cards">
      {Array.from({ length: count }).map((_, i) => (
        <div className="card skeleton" key={i}>
          <div className="sk-img" />
          <div className="sk-line short" />
          <div className="sk-line" />
        </div>
      ))}
    </div>
  );
}

