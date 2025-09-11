import { useAuthUser } from '@/lib/useAuthUser';

export function useSession() {
  const { user, loading } = useAuthUser();
  return { user, loading };
}
