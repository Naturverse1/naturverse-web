import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getNavatarUrl } from '../lib/navatar';

type Profile = { avatarUrl?: string };

type ProfileCtx = { profile: Profile };
const Ctx = createContext<ProfileCtx>({ profile: {} });
export const useProfile = () => useContext(Ctx);

export default function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>({});

  useEffect(() => {
    getNavatarUrl().then((url) => {
      if (url) setProfile({ avatarUrl: url });
    });
  }, []);

  return <Ctx.Provider value={{ profile }}>{children}</Ctx.Provider>;
}
