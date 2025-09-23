import { supabase } from '@/lib/supabaseClient';
import {
  NAVATAR_BUCKET,
  NAVATAR_PREFIX,
  getSessionUserId,
  pickNavatar,
  type NavatarRow,
} from '@/lib/navatar';
import { dicebearUrl, type DicebearOpts, type DicebearStyle } from '@/lib/dicebear';

const DEFAULT_SEED = 'naturverse';
const DEFAULT_SIZE = 1024;

export type DicebearGenerateOptions = DicebearOpts & {
  style: DicebearStyle;
  name?: string;
};

export type DicebearCreationResult = {
  row: NavatarRow;
  storagePath: string;
  publicUrl: string | null;
  sourceUrl: string;
};

function safeSeed(seed?: string | null) {
  if (!seed) return 'seed';
  const cleaned = seed.replace(/[^a-z0-9-_]/gi, '').slice(0, 48);
  return cleaned.length > 0 ? cleaned : 'seed';
}

function normalizeSeed(raw?: string) {
  const trimmed = raw?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : DEFAULT_SEED;
}

export async function generateDicebearAndSave({
  style,
  seed,
  size = DEFAULT_SIZE,
  backgroundType,
  backgroundColor,
  radius,
  flip,
  scale,
  translateX,
  translateY,
  name,
}: DicebearGenerateOptions): Promise<DicebearCreationResult> {
  const ownerId = await getSessionUserId();
  const normalizedSeed = normalizeSeed(seed);
  const fileSeed = safeSeed(normalizedSeed);

  const sourceUrl = dicebearUrl(
    style,
    {
      seed: normalizedSeed,
      size,
      backgroundType,
      backgroundColor,
      radius,
      flip,
      scale,
      translateX,
      translateY,
    },
    'png'
  );

  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`DiceBear fetch failed: ${response.status}`);
  }

  const blob = await response.blob();
  const filename = `${fileSeed}-${style}-${Date.now()}.png`;
  const storagePath = `${NAVATAR_PREFIX}/${ownerId}/${filename}`;

  const { error } = await supabase.storage.from(NAVATAR_BUCKET).upload(storagePath, blob, {
    contentType: 'image/png',
    upsert: true,
  });

  if (error) throw error;

  const row = await pickNavatar(storagePath, name);
  const { data } = supabase.storage.from(NAVATAR_BUCKET).getPublicUrl(storagePath);

  return {
    row,
    storagePath,
    publicUrl: data?.publicUrl ?? null,
    sourceUrl,
  };
}

export const createDicebearAvatar = generateDicebearAndSave;
