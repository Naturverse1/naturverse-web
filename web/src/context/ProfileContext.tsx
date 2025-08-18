import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getNavatar } from '../lib/navatar';

type Profile = { avatarUrl?: string };

type ProfileCtx = { profile: Profile };
const Ctx = createContext<ProfileCtx>({ profile: {} });
export const useProfile = () => useContext(Ctx);

export default function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>({});

  useEffect(() => {
    const url = getNavatar();
    if (url) setProfile({ avatarUrl: url });
  }, []);

  return <Ctx.Provider value={{ profile }}>{children}</Ctx.Provider>;
}
