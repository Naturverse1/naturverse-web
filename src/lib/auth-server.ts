export function getUserIdFromCookie(cookie?: string | null): string | null {
  // If using Supabase Auth Helpers you can decode the JWT here.
  // For now, return null (Stripe session will still be stored without user_id).
  try {
    return null;
  } catch {
    return null;
  }
}
