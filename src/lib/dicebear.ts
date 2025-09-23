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
  | 'identicon'
  | 'initials'
  | 'lorelei'
  | 'lorelei-neutral'
  | 'micah'
  | 'notionists'
  | 'notionists-neutral';

export type DicebearOpts = {
  seed: string;
  size?: number;
  backgroundType?: 'solid' | 'gradientLinear' | 'gradientRadial';
  backgroundColor?: string[];
  radius?: number;
  flip?: boolean;
  scale?: number;
  translateX?: number;
  translateY?: number;
};

const BASE = 'https://api.dicebear.com/9.x';

export function dicebearUrl(
  style: DicebearStyle,
  {
    seed,
    size = 1024,
    backgroundType,
    backgroundColor,
    radius,
    flip,
    scale,
    translateX,
    translateY,
  }: DicebearOpts,
  format: 'png' | 'svg' = 'png'
) {
  const u = new URL(`${BASE}/${style}/${format}`);
  u.searchParams.set('seed', seed);
  u.searchParams.set('size', String(size));
  if (backgroundType) u.searchParams.set('backgroundType', backgroundType);
  if (backgroundColor?.length) u.searchParams.set('backgroundColor', backgroundColor.join(','));
  if (radius != null) u.searchParams.set('radius', String(radius));
  if (flip) u.searchParams.set('flip', 'true');
  if (scale != null) u.searchParams.set('scale', String(scale));
  if (translateX != null) u.searchParams.set('translateX', String(translateX));
  if (translateY != null) u.searchParams.set('translateY', String(translateY));
  return u.toString();
}
