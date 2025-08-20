import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type Item = { slug:string; title:string; body?:string; zone?:string; type?:string; meta?:any };
type Ctx = {
  stories: Item[]; quizzes: Item[]; tips: Item[]; worlds: Item[]; observations: Item[]; music: Item[]; wellness: Item[];
  reload: () => Promise<void>;
};
const C = createContext<Ctx | null>(null);
export const useContentCtx = () => useContext(C)!;

async function fromSupabase(type: string): Promise<Item[]> {
  const { data, error } = await supabase.from('content').select('*').eq('type', type).order('created_at',{ascending:false});
  if (error) throw error;
  return (data || []).map((d:any)=>({ slug:d.slug, title:d.title, body:d.body, type:d.type, meta:d.meta }));
}

async function fromLocal(file: string): Promise<Item[]> {
  try {
    const res = await fetch(`/src/content/${file}.json`);
    if (!res.ok) return [];
    return await res.json();
  } catch { return []; }
}

export function ContentProvider({ children }: { children:any }) {
  const [stories,setStories]=useState<Item[]>([]);
  const [quizzes,setQuizzes]=useState<Item[]>([]);
  const [tips,setTips]=useState<Item[]>([]);
  const [worlds,setWorlds]=useState<Item[]>([]);
  const [observations,setObservations]=useState<Item[]>([]);
  const [music,setMusic]=useState<Item[]>([]);
  const [wellness,setWellness]=useState<Item[]>([]);

  async function load() {
    try { setStories(await fromSupabase('story')); }
    catch { setStories(await fromLocal('stories')); }
    try { setQuizzes(await fromSupabase('quiz')); }
    catch { setQuizzes(await fromLocal('quizzes')); }
    try { setTips(await fromSupabase('tip')); }
    catch { setTips(await fromLocal('tips')); }
    try { setWorlds(await fromSupabase('world')); }
    catch { setWorlds(await fromLocal('worlds')); }
    try { setObservations(await fromSupabase('observation')); }
    catch { setObservations(await fromLocal('observations')); }
    try { setMusic(await fromSupabase('music')); }
    catch { setMusic(await fromLocal('music')); }
    try { setWellness(await fromSupabase('wellness')); }
    catch { setWellness(await fromLocal('wellness')); }
  }
  useEffect(()=>{ load(); },[]);
  return <C.Provider value={{stories, quizzes, tips, worlds, observations, music, wellness, reload:load}}>{children}</C.Provider>;
}
