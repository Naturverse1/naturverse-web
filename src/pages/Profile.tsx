import React, { useEffect, useMemo, useRef, useState } from "react";
import Page from "../components/Page";
import { Img } from "../components";

/** Local storage keys used around the app (demo only) */
const K = {
  profile: "naturverse.profile.v1",
  navatar: "naturverse.navatar.v1",
  natur: "naturverse.natur.balance.v1",
  turian: "naturverse.turian.history.v1",
};

type Profile = {
  displayName: string;
  email: string;
  kidSafeChat: boolean;
  theme: "system" | "light" | "dark";
  newsletter: boolean;
};

type SavedNavatar = {
  imageDataUrl?: string;   // optional user-uploaded avatar preview
  baseType?: "Animal" | "Fruit" | "Insect" | "Spirit";
  backstory?: string;
};

const readJSON = <T,>(key: string, fallback: T): T => {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeJSON = (key: string, v: unknown) => {
  try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
};

const defaultProfile: Profile = {
  displayName: "",
  email: "",
  kidSafeChat: true,
  theme: "system",
  newsletter: false,
};

export default function ProfilePage() {
  const [p, setP] = useState<Profile>(() => readJSON(K.profile, defaultProfile));
  const [natur, setNatur] = useState<number>(() => readJSON<number>(K.natur, 120)); // demo balance
  const [nav, setNav] = useState<SavedNavatar>(() => readJSON<SavedNavatar>(K.navatar, {}));
  const [exportHref, setExportHref] = useState<string>("");

  // persist on change
  useEffect(() => writeJSON(K.profile, p), [p]);
  useEffect(() => writeJSON(K.natur, natur), [natur]);
  useEffect(() => writeJSON(K.navatar, nav), [nav]);

  // build export blob
  useEffect(() => {
    const dump = {
      profile: p,
      natur,
      navatar: nav,
      turianHistory: readJSON(K.turian, [] as unknown[]),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    setExportHref(url);
    return () => URL.revokeObjectURL(url);
  }, [p, natur, nav]);

  const fileInput = useRef<HTMLInputElement>(null);

  const onUpload = (file?: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setNav(prev => ({ ...prev, imageDataUrl: String(reader.result || "") }));
    };
    reader.readAsDataURL(file);
  };

  const clearAllLocal = () => {
    writeJSON(K.profile, defaultProfile);
    writeJSON(K.natur, 120);
    writeJSON(K.navatar, {});
    localStorage.removeItem(K.turian); // chat history
    setP(defaultProfile);
    setNatur(120);
    setNav({});
  };

  return (
    <Page title="Profile & Settings" subtitle="Local-only demo. No accounts or servers yet.">
      <section className="panel">
        <h2>Account</h2>
        <div className="grid2">
          <label className="field">
            <span>Display name</span>
            <input
              value={p.displayName}
              onChange={(e) => setP({ ...p, displayName: e.target.value })}
              placeholder="Your name"
            />
          </label>
          <label className="field">
            <span>Email (local only)</span>
            <input
              type="email"
              value={p.email}
              onChange={(e) => setP({ ...p, email: e.target.value })}
              placeholder="name@example.com"
            />
          </label>
        </div>
        <div className="grid2">
          <label className="switch">
            <input
              type="checkbox"
              checked={p.kidSafeChat}
              onChange={(e) => setP({ ...p, kidSafeChat: e.target.checked })}
            />
            <span>Kid-safe chat on</span>
          </label>
          <label className="select">
            <span>Theme</span>
            <select
              value={p.theme}
              onChange={(e) => setP({ ...p, theme: e.target.value as Profile["theme"] })}
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
        </div>
        <label className="switch">
          <input
            type="checkbox"
            checked={p.newsletter}
            onChange={(e) => setP({ ...p, newsletter: e.target.checked })}
          />
          <span>Opt-in to updates (placeholder)</span>
        </label>
      </section>

      <section className="panel">
        <h2>Navatar</h2>
        <div className="navatar-row">
          <div className="avatar">
            {nav.imageDataUrl ? (
              <Img src={nav.imageDataUrl} alt="Navatar preview" />
            ) : (
              <div className="avatar-placeholder">No image yet</div>
            )}
          </div>
          <div className="avatar-actions">
            <button className="btn" onClick={() => fileInput.current?.click()}>Upload photo</button>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => onUpload(e.target.files?.[0] || null)}
            />
            <button
              className="btn outline"
              onClick={() => setNav({})}
              disabled={!nav.imageDataUrl}
            >
              Remove
            </button>
            <p className="muted">This preview will be used across pages (local only).</p>
          </div>
        </div>
      </section>

      <section className="panel">
        <h2>NATUR Balance (demo)</h2>
        <p className="big">{natur} NATUR</p>
        <div className="row">
          <button className="btn tiny" onClick={() => setNatur((n) => n + 5)}>+5</button>
          <button className="btn tiny" onClick={() => setNatur((n) => Math.max(0, n - 5))}>−5</button>
          <button className="btn outline tiny" onClick={() => setNatur(120)}>Reset</button>
        </div>
        <p className="muted">Real wallets and redemptions connect later.</p>
      </section>

      <section className="panel">
        <h2>Data controls</h2>
        <div className="row">
          <a className="btn" download="naturverse-profile.json" href={exportHref}>Export data</a>
          <button className="btn outline" onClick={clearAllLocal}>Clear local data</button>
        </div>
        <p className="muted">Includes profile, navatar preview, NATUR demo balance, and Turian chat history.</p>
      </section>
    </Page>
  );
}

