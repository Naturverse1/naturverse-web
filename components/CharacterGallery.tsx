import Link from "next/link";
import Image from "next/image";

interface Character {
  name: string;
  image: string;
  slug: string;
}

export default function CharacterGallery({ world, characters }: { world: string; characters: Character[] }) {
  if (!characters || characters.length === 0) {
    return <p className="text-center text-gray-500">Characters coming soon.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {characters.map((char) => (
        <Link key={char.slug} href={`/characters/${char.slug}`} className="block text-center">
          <div className="border rounded-lg p-2 bg-white shadow hover:shadow-md">
            <Image
              src={char.image}
              alt={char.name}
              width={200}
              height={200}
              className="mx-auto object-contain"
            />
            <p className="mt-2 font-semibold">{char.name}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
