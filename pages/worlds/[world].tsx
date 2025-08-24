import { useRouter } from "next/router";
import Image from "next/image";
import CharacterGallery from "../../components/CharacterGallery";
import { slugToFolder } from "../../lib/kingdoms";

export default function WorldPage() {
  const router = useRouter();
  const { world } = router.query;
  const folder = typeof world === "string" ? slugToFolder[world] ?? world : "";

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 capitalize">{world}</h1>
      <div className="mb-6">
        <Image
          src={`/Mapsmain/${world}mapmain.png`}
          alt={`${world} map`}
          width={600}
          height={400}
          className="mx-auto object-contain"
        />
      </div>
      {folder && <CharacterGallery folder={folder} />}
    </div>
  );
}
