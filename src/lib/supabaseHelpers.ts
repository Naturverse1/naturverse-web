import { getSessionUserId, upsertCard, upsertNavatar } from "./navatar";
import type { Navatar } from "./navatar";

export type SaveNavatarParams = {
  id?: string;
  name: string;
  species: string;
  kingdom: string;
  backstory: string;
  powers?: string[];
  traits?: string[];
};

export async function saveNavatar(params: SaveNavatarParams) {
  const userId = await getSessionUserId();

  const navatar = await upsertNavatar(userId, {
    name: params.name,
    species: params.species,
    kingdom: params.kingdom,
    backstory: params.backstory,
  });

  const card = await upsertCard(userId, navatar.id, {
    name: params.name,
    species: params.species,
    kingdom: params.kingdom,
    backstory: params.backstory,
    powers: params.powers,
    traits: params.traits,
  });

  return {
    ...(navatar as Navatar),
    powers: card.powers ?? [],
    traits: card.traits ?? [],
  };
}
