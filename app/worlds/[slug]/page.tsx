import Image from "next/image";
import CharacterGrid from "@/components/CharacterGrid";
import { slugToKingdomFolder } from "@/lib/kingdoms";

export default async function WorldPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  return (
    <main className="container">
      {/* ... existing world header + map ... */}

      <section className="mt-10">
        <h2 className="text-3xl font-extrabold mb-4">Characters</h2>
        <CharacterGrid kingdomFolder={slugToKingdomFolder(slug)} />
      </section>
    </main>
  );
}
