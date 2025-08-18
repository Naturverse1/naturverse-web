import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

/** Tiny word list for offline play (expand later / swap to dictionary API) */
const WORDS = [
  'rain','tree','ocean','seed','stone','river','leaf','earth','water','wind',
  'forest','moss','root','bloom','cloud','dune','flora','fauna','shore','tide',
  'reef','sprout','breeze','delta','willow','oak','pine','cedar','maple','birch',
  'coral','pebble','glade','grove','meadow','prairie','cliff','canyon','valley',
  'cave','lagoon','island','volcano','geyser','glacier','savanna','tundra'
];

const ALPHABET = 'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaoooooooooooooooooooooooooooooooooooooooooouuuuuuuuuuuuuuuuuuuunnnnnnnnnnnnnrrrrrrrrrrrrrrrrttttttttttttttllllllssssssddddddgggggbbccmmppffhhvwykjxqz'; // weighted letters

function pickRack(n = 7) {
  let rack = '';
  for (let i = 0; i < n; i++) {
    rack += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return rack.split('').sort(() => Math.random() - 0.5).join('');
}

function canBuild(word: string, rack: string) {
  const a = rack.split('');
  for (const ch of word) {
    const i = a.indexOf(ch);
    if (i === -1) return false;
    a.splice(i, 1);
  }
  return true;
}

const STORAGE_KEY = 'nv_wordbuilder_best';

export default function WordBuilder() {
  const [rack, setRack] = useState(pickRack());
  const [time, setTime] = useState(60);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState<number>(() => Number(localStorage.getItem(STORAGE_KEY) || 0));
  const [found, setFound] = useState<string[]>([]);
  const [bad, setBad] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const rackLetters = useMemo(() => rack.toUpperCase().split(''), [rack]);

  useEffect(() => {
    if (!running || time <= 0) return;
    const id = setInterval(() => setTime((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [running, time]);

  useEffect(() => {
    if (time === 0) {
      setRunning(false);
      if (score > best) {
        setBest(score);
        localStorage.setItem(STORAGE_KEY, String(score));
      }
    }
  }, [time, score, best]);

  function start() {
    setRack(pickRack());
    setTime(60);
    setScore(0);
    setFound([]);
    setBad([]);
    setRunning(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function shuffle() {
    setRack(r => r.split('').sort(() => Math.random() - 0.5).join(''));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!running || time <= 0) return;
    const raw = (inputRef.current?.value || '').toLowerCase().trim();
    if (!raw) return;
    (inputRef.current as HTMLInputElement).value = '';

    // guard: unique & buildable
    if (!canBuild(raw, rack) || found.includes(raw)) {
      setBad(b => [raw, ...b].slice(0, 6));
      return;
    }
    // dictionary check
    if (!WORDS.includes(raw)) {
      setBad(b => [raw, ...b].slice(0, 6));
      return;
    }
    setFound(f => [raw, ...f].slice(0, 10));
    setScore(s => s + Math.max(1, raw.length - 2)); // simple length-based score
  }

  return (
    <div style={{padding:'24px'}}>
      <Link to="/zones/arcade" style={{color:'#7fe3ff'}}>&larr; Back to Arcade</Link>
      <h1 style={{margin:'12px 0'}}>Word Builder</h1>
      <p>Create valid words from the letters. Longer words score more. 60 seconds—go!</p>

      <div style={{
        display:'flex', gap:16, flexWrap:'wrap',
        alignItems:'center', margin:'16px 0'
      }}>
        <div style={{
          padding:'12px 16px', borderRadius:12,
          background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.12)'
        }}>
          <strong>Time:</strong> {String(Math.max(time,0)).padStart(2,'0')}s
        </div>
        <div style={{
          padding:'12px 16px', borderRadius:12,
          background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.12)'
        }}>
          <strong>Score:</strong> {score}
        </div>
        <div style={{
          padding:'12px 16px', borderRadius:12,
          background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.12)'
        }}>
          <strong>Best:</strong> {best}
        </div>

        {!running ? (
          <button onClick={start}>Start</button>
        ) : (
          <>
            <button onClick={shuffle}>Shuffle</button>
            <button onClick={() => setRunning(false)}>Pause</button>
          </>
        )}
      </div>

      <div style={{display:'flex', gap:16, alignItems:'center', marginTop:8}}>
        <div style={{display:'flex', gap:8}}>
          {rackLetters.map((ch, i) => (
            <div key={i} style={{
              width:44, height:56, display:'grid', placeItems:'center',
              borderRadius:10, fontWeight:700, fontSize:22,
              background:'linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.02))',
              border:'1px solid rgba(255,255,255,.14)', boxShadow:'inset 0 1px 0 rgba(255,255,255,.12)'
            }}>{ch}</div>
          ))}
        </div>

        <form onSubmit={submit} style={{display:'flex', gap:8}}>
          <input
            ref={inputRef}
            type="text" inputMode="latin" autoCapitalize="none" autoCorrect="off"
            placeholder="type a word"
            style={{padding:'12px 14px', borderRadius:10, border:'1px solid rgba(255,255,255,.18)', background:'rgba(0,0,0,.35)', color:'#fff'}}
            maxLength={12}
          />
          <button type="submit">Enter</button>
        </form>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginTop:20}}>
        <section>
          <h3 style={{margin:'8px 0'}}>Found</h3>
          <div style={{display:'flex', flexWrap:'wrap', gap:8}}>
            {found.map((w, i) => (
              <span key={i} style={{
                padding:'6px 10px', borderRadius:999,
                background:'rgba(0,255,170,.12)', border:'1px solid rgba(0,255,170,.3)'
              }}>{w}</span>
            ))}
            {found.length === 0 && <span style={{opacity:.7}}>—</span>}
          </div>
        </section>
        <section>
          <h3 style={{margin:'8px 0'}}>Invalid / used</h3>
          <div style={{display:'flex', flexWrap:'wrap', gap:8}}>
            {bad.map((w, i) => (
              <span key={i} style={{
                padding:'6px 10px', borderRadius:999,
                background:'rgba(255,0,90,.12)', border:'1px solid rgba(255,0,120,.3)'
              }}>{w}</span>
            ))}
            {bad.length === 0 && <span style={{opacity:.7}}>—</span>}
          </div>
        </section>
      </div>
    </div>
  );
}

