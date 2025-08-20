import React, { useMemo, useState } from "react";
import Breadcrumbs from "../components/common/Breadcrumbs";
import SectionHero from "../components/common/SectionHero";
import { addBadge, addCoins, addStamp, loadPassport, updateHolder } from "../lib/passport";

export default function PassportPage() {
  const [p, setP] = useState(loadPassport());
  const stats = useMemo(() => ({
    worlds: p.stamps.length, badges: p.badges.length, xp: p.xp, coins: p.coins
  }), [p]);

  return (
    <>
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Passport" }]} />
      <SectionHero title="Passport" subtitle="Your stamps, badges, XP & coins." emoji="🛂" />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px 48px", display: "grid", gap: 16 }}>
        <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))" }}>
          <StatCard label="Worlds Visited" value={String(stats.worlds)} />
          <StatCard label="Badges" value={String(stats.badges)} />
          <StatCard label="XP" value={String(stats.xp)} />
          <StatCard label="NATUR Coins" value={String(stats.coins)} />
        </div>

        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, background: "#fff" }}>
          <h3 style={{ marginTop: 0 }}>Holder</h3>
          <div style={{ display: "grid", gap: 8, maxWidth: 520 }}>
            <input
              defaultValue={p.holder?.name || ""}
              placeholder="Adventurer name"
              onBlur={e => { setP(updateHolder({ name: e.target.value })); }}
            />
            <input
              defaultValue={p.holder?.navatarType || ""}
              placeholder="Navatar type (fruit/animal/insect/spirit)"
              onBlur={e => { setP(updateHolder({ navatarType: e.target.value })); }}
            />
            <input
              defaultValue={(p.holder?.traits || []).join(", ")}
              placeholder="Traits (comma separated)"
              onBlur={e => { setP(updateHolder({ traits: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })); }}
            />
          </div>
        </div>

        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))" }}>
          <Panel title="Stamps">
            {p.stamps.length === 0 ? <p>No stamps yet.</p> : (
              <ul>
                {p.stamps.map(s => <li key={s.world}>{s.world} — {new Date(s.date).toLocaleString()}</li>)}
              </ul>
            )}
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <input id="stamp-world" placeholder="Add world slug e.g. thailandia" />
              <button onClick={() => {
                const input = document.getElementById("stamp-world") as HTMLInputElement;
                if (!input.value.trim()) return;
                setP(addStamp(input.value.trim()));
                input.value = "";
              }}>Add Stamp</button>
            </div>
          </Panel>

          <Panel title="Badges">
            {p.badges.length === 0 ? <p>No badges yet.</p> : (
              <ul>
                {p.badges.map(b => <li key={b.id}>{b.label} — {new Date(b.earnedAt).toLocaleString()}</li>)}
              </ul>
            )}
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <input id="badge-id" placeholder="badge id" />
              <input id="badge-label" placeholder="label" />
              <button onClick={() => {
                const id = (document.getElementById("badge-id") as HTMLInputElement).value.trim();
                const label = (document.getElementById("badge-label") as HTMLInputElement).value.trim();
                if (!id || !label) return;
                setP(addBadge(id, label));
                (document.getElementById("badge-id") as HTMLInputElement).value = "";
                (document.getElementById("badge-label") as HTMLInputElement).value = "";
              }}>Add Badge</button>
            </div>
          </Panel>

          <Panel title="Coins">
            <p>Balance: <b>{p.coins}</b> NATUR</p>
            <div style={{ display: "flex", gap: 8 }}>
              <input id="coin-amt" placeholder="amount" type="number" />
              <button onClick={() => {
                const amt = Number((document.getElementById("coin-amt") as HTMLInputElement).value);
                if (!Number.isFinite(amt)) return;
                setP(addCoins(amt));
                (document.getElementById("coin-amt") as HTMLInputElement).value = "";
              }}>Add Coins</button>
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, background: "#fff" }}>
      <div style={{ opacity: 0.7, fontSize: 12 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, background: "#fff" }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      {children}
    </div>
  );
}
