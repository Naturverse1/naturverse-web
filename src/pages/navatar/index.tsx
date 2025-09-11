import { useEffect, useState } from "react";
import { getMyPrimaryAvatar, getMyCharacterCard, AvatarRow, CharacterCard } from "@/lib/navatarApi";

export default function MyNavatar() {
  const [avatar, setAvatar] = useState<AvatarRow | null>(null);
  const [card, setCard] = useState<CharacterCard | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const a = await getMyPrimaryAvatar();
        setAvatar(a);
        const c = await getMyCharacterCard();
        setCard(c);
      } catch (e: any) {
        alert(e.message);
      }
    })();
  }, []);

  return (
    <div className="container mx-auto px-4 pb-24">
      <div className="text-sm text-blue-600 mb-2"><a href="/">Home</a> / Navatar</div>
      <h1 className="text-3xl font-bold text-blue-700 mb-4">My Navatar</h1>

      <div className="flex flex-wrap gap-8">
        <div className="flex-1 min-w-[260px] max-w-[380px]">
          {avatar ? (
            <div className="rounded-2xl bg-white shadow p-3">
              <img
                src={avatar.image_url || ""}
                alt={avatar.name || "Navatar"}
                className="w-full h-[360px] object-cover rounded-xl bg-gray-50"
              />
              <div className="text-center font-semibold mt-2">{avatar.name}</div>
            </div>
          ) : (
            <div className="text-gray-600">No Navatar yet. <a className="text-blue-600 underline" href="/navatar/pick">Pick</a> or <a className="text-blue-600 underline" href="/navatar/upload">Upload</a>.</div>
          )}
        </div>

        <div className="flex-1 min-w-[260px] max-w-[480px]">
          <div className="rounded-2xl bg-white shadow p-4">
            <div className="text-xl font-semibold mb-3">Character Card</div>
            {card ? (
              <dl className="space-y-2 text-sm">
                <div><dt className="font-medium">Name</dt><dd>{card.name}</dd></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><dt className="font-medium">Species</dt><dd>{card.species}</dd></div>
                  <div><dt className="font-medium">Kingdom</dt><dd>{card.kingdom}</dd></div>
                </div>
                <div><dt className="font-medium">Backstory</dt><dd className="whitespace-pre-wrap">{card.backstory}</dd></div>
                <div><dt className="font-medium">Powers</dt><dd>{(card.powers ?? []).join(', ')}</dd></div>
                <div><dt className="font-medium">Traits</dt><dd>{(card.traits ?? []).join(', ')}</dd></div>
            </dl>
            ) : (
              <div className="text-gray-600">No card yet. <a className="text-blue-600 underline" href="/navatar/card">Create Card</a>.</div>
            )}
            <div className="mt-4">
              <a href="/navatar/card" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Edit Card</a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <a href="/navatar" className="px-4 py-2 bg-blue-600 text-white rounded">My Navatar</a>
        <a href="/navatar/card" className="px-4 py-2 bg-blue-100 text-blue-700 rounded">Card</a>
        <a href="/navatar/pick" className="px-4 py-2 bg-blue-100 text-blue-700 rounded">Pick</a>
        <a href="/navatar/upload" className="px-4 py-2 bg-blue-100 text-blue-700 rounded">Upload</a>
        <a href="/navatar/generate" className="px-4 py-2 bg-blue-100 text-blue-700 rounded">Generate</a>
        <a href="/navatar/mint" className="px-4 py-2 bg-blue-100 text-blue-700 rounded">NFT / Mint</a>
        <a href="/navatar/marketplace" className="px-4 py-2 bg-blue-100 text-blue-700 rounded">Marketplace</a>
      </div>
    </div>
  );
}
