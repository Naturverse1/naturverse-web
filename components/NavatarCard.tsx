import Image from "next/image";

export default function NavatarCard({ navatar }: { navatar: any }) {
  return (
    <div className="character-card">
      <h3 className="card-title">Your Navatar</h3>
      <div className="card-image-container">
        <Image
          src={navatar.image_url}
          alt={navatar.name || "Navatar"}
          width={400}
          height={240}
          className="card-image"
        />
      </div>
      <div className="card-body">
        <p><strong>Name:</strong> {navatar.name}</p>
        <p><strong>Category:</strong> {navatar.category}</p>
        <p><strong>Created:</strong> {new Date(navatar.created_at).toLocaleDateString()}</p>
      </div>
    </div>
  );
}

