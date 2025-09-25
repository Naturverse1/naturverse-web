export const DEFAULT_IMAGE_URL = '/Marketplace/placeholder.svg';

export function resolveImageUrl(imagePath?: string | null): string {
  if (!imagePath) return DEFAULT_IMAGE_URL;
  const trimmed = imagePath.trim();
  if (!trimmed) return DEFAULT_IMAGE_URL;

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    return trimmed;
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '');
  if (!supabaseUrl) return DEFAULT_IMAGE_URL;

  const objectPath = trimmed.replace(/^\/+/, '');
  return `${supabaseUrl}/storage/v1/object/public/${objectPath}`;
}

export default resolveImageUrl;
