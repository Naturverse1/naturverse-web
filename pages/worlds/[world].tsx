import { useRouter } from "next/router";
import Image from "next/image";
import fs from "fs";
import path from "path";
import CharacterGallery from "../../components/CharacterGallery";

export default function WorldPage() {
  const router = useRouter();
  const { world } = router.query;

  let characters = [];
  try {
    const filePath = path.join(process.cwd(), "public", "kingdoms", `${world}`, "manifest.json");
    const fileData = fs.readFileSync(filePath, "utf-8");
    characters = JSON.parse(fileData);
  } catch (err) {
    characters = [];
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 capitalize">{world}</h1>
      <div className="mb-6">
        <Image
          src={`/MapsMain/${world}mapmain.png`}
          alt={`${world} map`}
          width={600}
          height={400}
          className="mx-auto object-contain"
        />
      </div>
      <CharacterGallery world={world as string} characters={characters} />
    </div>
  );
}
