import { useEffect, useMemo, useRef, useState } from "react";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { autoGrantOncePerDay } from "@/lib/rewards";
import { toast } from "@/components/Toaster";
import "../../../styles/zone-widgets.css";

export default function Music() {
  return (
    <main className="container">
      <Breadcrumbs />
      <h2 className="section-title">Music</h2>
      <p className="section-lead">Karaoke, beats &amp; song maker (client-only).</p>

      <section className="zone-card">
        <div className="zone-title">🎤 Karaoke (demo)</div>
        <div className="zone-sub">Auto-scrolls lines while the metronome runs.</div>
        <Karaoke />
      </section>

      <div className="music-row">
        <section className="zone-card">
          <div className="zone-title">🧭 Metronome</div>
          <div className="zone-sub">Tap start and set your BPM.</div>
          <Metronome />
        </section>

        <section className="zone-card">
          <div className="zone-title">🥁 Drum Pads</div>
          <div className="zone-sub">Tap pads to play Kick / Snare / Hat / Clap.</div>
          <DrumPads />
        </section>
      </div>

      <section className="zone-card">
        <div className="zone-title">🎛️ 16-Step Sequencer</div>
        <div className="zone-sub">Program a loop for kick, snare and hats.</div>
        <StepSequencer />
      </section>
    </main>
  );
}

/* ---------- WebAudio helpers ---------- */
function useAudioCtx() {
  const ctxRef = useRef<AudioContext | null>(null);
  const get = () => {
    if (!ctxRef.current) {
      const Ctor = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
      ctxRef.current = new Ctor();
    }
    return ctxRef.current!;
  };
  return get;
}

function clickSound(ctx: AudioContext) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = "square";
  o.frequency.value = 880;
  g.gain.value = 0.2;
  o.connect(g).connect(ctx.destination);
  o.start();
  o.stop(ctx.currentTime + 0.03);
}

function kick(ctx: AudioContext) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(150, ctx.currentTime);
  o.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.15);
  g.gain.setValueAtTime(0.7, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
  o.connect(g).connect(ctx.destination);
  o.start(); o.stop(ctx.currentTime + 0.17);
}

function snare(ctx: AudioContext) {
  // noise burst
  const bufferSize = 2 * ctx.sampleRate;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource(); noise.buffer = noiseBuffer;
  const nGain = ctx.createGain(); nGain.gain.setValueAtTime(0.5, ctx.currentTime);
  nGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
  noise.connect(nGain).connect(ctx.destination); noise.start(); noise.stop(ctx.currentTime + 0.13);
  // body
  const o = ctx.createOscillator(); o.type = "triangle"; o.frequency.value = 180;
  const g = ctx.createGain(); g.gain.setValueAtTime(0.3, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
  o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.11);
}

function hat(ctx: AudioContext) {
  const o = ctx.createOscillator(); o.type = "square"; o.frequency.value = 4000;
  const g = ctx.createGain(); g.gain.setValueAtTime(0.08, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
  o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.051);
}

function clap(ctx: AudioContext) {
  const n = ctx.createBufferSource();
  const length = ctx.sampleRate * 0.12;
  const buf = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length);
  n.buffer = buf;
  const g = ctx.createGain(); g.gain.value = 0.5;
  n.connect(g).connect(ctx.destination); n.start();
}

/* ---------- Metronome ---------- */
function Metronome() {
  const getCtx = useAudioCtx();
  const [bpm, setBpm] = useState(96);
  const [on, setOn] = useState(false);
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    if (!on) { if (tickRef.current) clearInterval(tickRef.current); return; }
    const ms = (60_000 / bpm);
    clickSound(getCtx());
    tickRef.current = window.setInterval(() => clickSound(getCtx()), ms);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [on, bpm, getCtx]);

  return (
    <div className="widget">
      <div className="metro-wrap">
        <button onClick={() => setOn(v => !v)}>{on ? "Stop" : "Start"}</button>
        <span><b>{bpm}</b> BPM</span>
      </div>
      <input
        className="metro-bpm"
        type="range" min={60} max={180} value={bpm}
        onChange={(e) => setBpm(parseInt(e.target.value))}
      />
    </div>
  );
}

/* ---------- Drum Pads ---------- */
function DrumPads() {
  const getCtx = useAudioCtx();
  const pads = useMemo(() => ([
    { id: "Kick", fn: kick },
    { id: "Snare", fn: snare },
    { id: "Hat", fn: hat },
    { id: "Clap", fn: clap },
  ]), []);

  const [active, setActive] = useState<string | null>(null);
  const hit = (p: typeof pads[number]) => {
    setActive(p.id); p.fn(getCtx()); setTimeout(() => setActive(null), 120);
  };

  return (
    <div className="widget">
      <div className="pad-grid">
        {pads.map(p => (
          <div key={p.id} className={`pad ${active === p.id ? "active" : ""}`} onClick={() => hit(p)}>
            {p.id}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- 16-Step Sequencer ---------- */
function StepSequencer() {
  const getCtx = useAudioCtx();
  const [bpm, setBpm] = useState(100);
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [grid, setGrid] = useState<boolean[][]>([
    // 3 rows: kick, snare, hat
    Array(16).fill(false),
    Array(16).fill(false),
    Array(16).fill(true).map((_, i) => i % 2 === 0), // hats on 8ths by default
  ]);

  useEffect(() => {
    if (!running) return;
    const intervalMs = (60_000 / bpm) / 4; // 16th notes
    const id = setInterval(() => {
      setStep(s => (s + 1) % 16);
    }, intervalMs);
    return () => clearInterval(id);
  }, [running, bpm]);

  useEffect(() => {
    if (!running) return;
    if (grid[0][step]) kick(getCtx());
    if (grid[1][step]) snare(getCtx());
    if (grid[2][step]) hat(getCtx());
  }, [step, running, grid, getCtx]);

  const toggle = (r: number, c: number) => {
    setGrid(g => g.map((row, ri) => row.map((v, ci) => (ri === r && ci === c ? !v : v))) as boolean[][]);
  };

  const clear = () => setGrid([Array(16).fill(false), Array(16).fill(false), Array(16).fill(false)]);

  return (
    <div className="widget">
      <div className="metro-wrap" style={{ marginBottom: 10 }}>
        <button onClick={() => setRunning(v => !v)}>{running ? "Stop" : "Play"}</button>
        <button onClick={clear} style={{ marginLeft: 6 }}>Clear</button>
        <span style={{ marginLeft: 8 }}><b>{bpm}</b> BPM</span>
      </div>
      <input className="metro-bpm" type="range" min={70} max={160} value={bpm}
             onChange={(e) => setBpm(parseInt(e.target.value))} />
      <div className="seq" style={{ marginTop: 12 }}>
        {["Kick", "Snare", "Hat"].map((label, r) => (
          <div key={label}>
            <div style={{ marginBottom: 6, fontWeight: 700 }}>{label}</div>
            <div className="seq-row">
              {Array.from({ length: 16 }).map((_, c) => {
                const on = grid[r][c];
                const playing = c === step && running;
                return (
                  <div
                    key={c}
                    className={`step ${on ? "on" : ""} ${playing ? "playhead" : ""}`}
                    onClick={() => toggle(r, c)}
                    title={`${label} – step ${c + 1}`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Karaoke ---------- */
type KLine = { t: number; text: string };
const LYRICS: KLine[] = [
  { t: 0, text: "Welcome to the Naturverse," },
  { t: 2, text: "where winds and rivers rhyme." },
  { t: 4, text: "Pick a world and start your quest," },
  { t: 6, text: "one beat at a time." },
  { t: 9, text: "Make a friend, unlock a quest," },
  { t: 11, text: "sing loud, you’ll do just fine!" },
];

  function Karaoke() {
    const [running, setRunning] = useState(false);
    const [bpm, setBpm] = useState(90);
    const [now, setNow] = useState(0);
    const startTime = useRef<number | null>(null);
    const boxRef = useRef<HTMLDivElement | null>(null);
    const grantedRef = useRef(false);

    useEffect(() => {
      if (!running) return;
      const start = performance.now();
      startTime.current = start;
      const id = setInterval(() => setNow((performance.now() - start) / 1000), 100);
      return () => clearInterval(id);
    }, [running]);

    useEffect(() => {
      if (!running) {
        grantedRef.current = false;
        return;
      }
      const last = LYRICS[LYRICS.length - 1].t;
      if (now >= last && !grantedRef.current) {
        grantedRef.current = true;
        try {
          autoGrantOncePerDay('Musiclandia').then((granted) => granted && toast('Stamp earned!'));
        } catch {}
      }
    }, [now, running]);

  useEffect(() => {
    const liveIndex = LYRICS.findIndex((l, i) => now >= l.t && (i === LYRICS.length - 1 || now < LYRICS[i + 1].t));
    if (liveIndex >= 0 && boxRef.current) {
      const el = boxRef.current.querySelectorAll(".k-line")[liveIndex] as HTMLElement | undefined;
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [now]);

  return (
    <div className="widget">
      <div className="metro-wrap" style={{ marginBottom: 8 }}>
        <button onClick={() => setRunning(v => !v)}>{running ? "Stop" : "Start"}</button>
        <span style={{ marginLeft: 8 }}><b>{bpm}</b> BPM</span>
      </div>
      <input className="metro-bpm" type="range" min={70} max={140} value={bpm}
             onChange={(e) => setBpm(parseInt(e.target.value))} />
      <div ref={boxRef} className="karaoke" style={{ marginTop: 10 }}>
        {LYRICS.map((l, i) => {
          const next = LYRICS[i + 1]?.t ?? 1e9;
          const live = now >= l.t && now < next;
          return <div key={i} className={`k-line ${live ? "live" : ""}`}>{l.text}</div>;
        })}
      </div>
    </div>
  );
}

