import { useRouter } from "next/router";
import Image from "next/image";
import fs from "fs";
import path from "path";

export default function CharacterPage() {
  const router = useRouter();
  const { slug } = router.query;

  let character = null;
  try {
    const filePath = path.join(process.cwd(), "public", "characters", `${slug}.json`);
    const fileData = fs.readFileSync(filePath, "utf-8");
    character = JSON.parse(fileData);
  } catch (err) {
    character = null;
  }

  if (!character) {
    return <p className="p-6 text-center text-gray-500">Character not found.</p>;
  }

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">{character.name}</h1>
      <Image
        src={character.image}
        alt={character.name}
        width={400}
        height={400}
        className="mx-auto object-contain"
      />
      <p className="mt-4 text-lg text-gray-700">More about {character.name} coming soon.</p>
    </div>
  );
}
