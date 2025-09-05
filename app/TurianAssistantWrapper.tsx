'use client';

import TurianAssistant from '@/components/TurianAssistant';
import { useUser } from '@supabase/auth-helpers-react';

export default function TurianAssistantWrapper() {
  const user = useUser();
  return <TurianAssistant isAuthed={!!user} />;
}
