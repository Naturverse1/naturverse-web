type Character = {
  image: string;
  name: string;
  subtitle: string;
};

export function CharacterCard({ character }: { character: Character }) {
  return (
    <article className="overflow-hidden rounded-xl border bg-white">
      <img
        src={character.image}
        alt={character.name}
        className="w-full max-w-full h-auto object-cover"
        loading="lazy"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{character.name}</h3>
        <p className="mt-1 text-sm text-gray-700">{character.subtitle}</p>
      </div>
    </article>
  );
}

export default CharacterCard;

