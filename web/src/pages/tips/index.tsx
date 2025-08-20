import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { askAI } from '../../lib/openai';

type Tip = { id: string; text: string; created_at: string };

export default function TurianTips() {
  const [tips, setTips] = useState<Tip[]>([]);
  const [newTip, setNewTip] = useState('');
  const [ai, setAi] = useState('');

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('tips')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      if (!error && data) setTips(data as Tip[]);
    })();
  }, []);

  async function addTip() {
    if (!newTip.trim()) return;
    const { data, error } = await supabase.from('tips').insert({ text: newTip }).select().single();
    if (!error && data) setTips((t) => [data as Tip, ...t]);
    setNewTip('');
  }

  async function ask() {
    setAi('Thinking…');
    try {
      const reply = await askAI('Give a short nature-themed tip for kids.');
      setAi(reply);
    } catch (e: any) {
      setAi(`AI error: ${e.message}`);
    }
  }

  return (
    <section>
      <h1>Turian Tips</h1>

      <h2>Supabase tips</h2>
      <div style={{ display: 'flex', gap: 8 }}>
        <input value={newTip} onChange={e => setNewTip(e.target.value)} placeholder="Add a tip…" />
        <button onClick={addTip}>Save</button>
      </div>
      <ul>
        {tips.map(t => <li key={t.id}>{t.text}</li>)}
      </ul>

      <h2>Ask OpenAI</h2>
      <button onClick={ask}>Generate a tip</button>
      {ai && <p style={{ marginTop: 8 }}>{ai}</p>}
    </section>
  );
}
