import { getProfile } from './profile';

export async function ensureNavatarOnFirstLogin(userId: string) {
  try {
    const p = await getProfile(userId);
    if (!p?.avatar_id) window.location.assign('/navatar');
  } catch { /* no-op */ }
}
