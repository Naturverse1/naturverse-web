import { supabase } from '@/lib/supabaseClient';
import { NAVATAR_BUCKET, NAVATAR_PREFIX, getSessionUserId, pickNavatar, type NavatarRow } from '@/lib/navatar';

export type DicebearStyle =
  | 'adventurer'
  | 'adventurer-neutral'
  | 'avataaars'
  | 'big-ears'
  | 'big-ears-neutral'
  | 'big-smile'
  | 'bottts'
  | 'croodles'
  | 'croodles-neutral'
  | 'fun-emoji'
  | 'icons'
  | 'identicon'
  | 'initials'
  | 'lorelei'
  | 'micah'
  | 'miniavs'
  | 'notionists'
  | 'open-peeps'
  | 'personas'
  | 'pixel-art'
  | 'pixel-art-neutral'
  | 'shapes'
  | 'thumbs';

export type DicebearOptions = {
  style: DicebearStyle;
  seed?: string;
  size?: number;
  backgroundColor?: string;
  hair?: string;
  eyes?: string;
  mouth?: string;
  format?: 'svg' | 'png';
};

const API_VERSION = '9.x';

function cleanHex(value?: string | null) {
  return value ? value.replace(/^#/, '').trim() : undefined;
}

function safeSeed(seed?: string | null) {
  if (!seed) return 'seed';
  const cleaned = seed.replace(/[^a-z0-9-_]/gi, '').slice(0, 48);
  return cleaned.length > 0 ? cleaned : 'seed';
}

export function buildDicebearUrl(opts: DicebearOptions) {
  const {
    style,
    seed = 'naturverse',
    size = 1024,
    backgroundColor,
    hair,
    eyes,
    mouth,
    format = 'svg',
  } = opts;

  const base = `https://api.dicebear.com/${API_VERSION}/${style}/${format}`;
  const params = new URLSearchParams();

  params.set('seed', seed);

  if (format === 'png') {
    params.set('size', String(size));
  }

  const bg = cleanHex(backgroundColor);
  if (bg) {
    params.set('backgroundColor', bg);
  }

  if (hair) params.set('hair', hair);
  if (eyes) params.set('eyes', eyes);
  if (mouth) params.set('mouth', mouth);

  return `${base}?${params.toString()}`;
}

export type DicebearCreationResult = {
  row: NavatarRow;
  storagePath: string;
  publicUrl: string | null;
  sourceUrl: string;
};

export async function createDicebearAvatar(
  options: DicebearOptions,
  name?: string
): Promise<DicebearCreationResult> {
  const ownerId = await getSessionUserId();
  const format = (options.format ?? 'svg').toLowerCase() === 'png' ? 'png' : 'svg';

  const sourceUrl = buildDicebearUrl({ ...options, format });
  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`DiceBear fetch failed: ${response.status}`);
  }

  const blob = await response.blob();
  const ext = format === 'svg' ? 'svg' : 'png';
  const filename = `${safeSeed(options.seed)}-${options.style}-${Date.now()}.${ext}`;
  const storagePath = `${NAVATAR_PREFIX}/${ownerId}/${filename}`;

  const { error } = await supabase.storage
    .from(NAVATAR_BUCKET)
    .upload(storagePath, blob, {
      contentType: format === 'svg' ? 'image/svg+xml' : 'image/png',
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
