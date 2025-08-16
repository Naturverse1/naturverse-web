import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { useAuth } from "@/providers/AuthProvider";

interface ProfileContextType {
  avatarUrl: string | null;
  avatarPath: string | null;
  email: string | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  setAvatarUrl: (url: string | null) => void;
  setAvatarPath: (path: string | null) => void;
}

const ProfileContext = createContext<ProfileContextType>({
  avatarUrl: null,
  avatarPath: null,
  email: null,
  loading: true,
  refreshProfile: async () => {},
  setAvatarUrl: () => {},
  setAvatarPath: () => {},
});

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: sessionUser } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (!sessionUser) { setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from('users')
      .select('avatar_url, avatar_path, email')
      .eq('id', sessionUser.id)
      .single();
    if (!error && data) {
      setAvatarUrl((data.avatar_url as string) ?? null);
      setAvatarPath((data.avatar_path as string) ?? null);
      setEmail((data.email as string) ?? null);
    }
    setLoading(false);
  };

  useEffect(() => { refreshProfile(); /* eslint-disable-next-line */ }, [sessionUser]);

  return (
    <ProfileContext.Provider value={{ avatarUrl, avatarPath, email, loading, refreshProfile, setAvatarUrl, setAvatarPath }}>
      {children}
    </ProfileContext.Provider>
  );
};
