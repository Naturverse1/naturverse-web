// @ts-nocheck
import Image from "next/image";
import CharacterGallery from "../../../components/CharacterGallery";
import { slugToFolder } from "../../../lib/kingdoms";

export default async function WorldPage({ params }: { params: { slug: string } }) {
  return (
    <main className="container">
      {/* ... existing world header + map ... */}

      <section className="mt-10">
        <h2 className="text-2xl font-bold">Characters</h2>
        <CharacterGallery folder={slugToFolder[params.slug] ?? params.slug} />
      </section>
    </main>
  );
}
