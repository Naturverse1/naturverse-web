import React from "react";
import { Quest, QuestStep, Reward } from "../../data/quests";
import { uid, slugify } from "../../utils/id";
import { upsertQuest } from "../../utils/quests-store";
import { validateQuest } from "../../utils/validate";

export default function NewQuest() {
  const [title, setTitle] = React.useState("");
  const [summary, setSummary] = React.useState("");
  const [kingdom, setKingdom] = React.useState("");
  const [steps, setSteps] = React.useState<QuestStep[]>([
    { id: uid(), text: "" }
  ]);
  const [rewards, setRewards] = React.useState<Reward[]>([]);
  const [errors, setErrors] = React.useState<string[]>([]);

  function addStep() {
    setSteps(s => [...s, { id: uid(), text: "" }]);
  }
  function removeStep(id: string) {
    setSteps(s => s.filter(x => x.id !== id));
  }
  function setStep(id: string, patch: Partial<QuestStep>) {
    setSteps(s => s.map(x => (x.id === id ? { ...x, ...patch } : x)));
  }
  function addReward() {
    setRewards(r => [...r, { type: "stamp", code: "" }]);
  }
  function setReward(i: number, patch: Partial<Reward>) {
    setRewards(r => r.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  }
  function removeReward(i: number) {
    setRewards(r => r.filter((_, idx) => idx !== i));
  }

  function onSave(e: React.FormEvent) {
    e.preventDefault();
    const now = new Date().toISOString();
    const quest: Quest = {
      id: `q-${uid()}`,
      slug: slugify(title || `quest-${uid()}`),
      title: title.trim(),
      summary: summary.trim(),
      kingdom: kingdom || undefined,
      steps: steps.map(s => ({ ...s, text: s.text.trim() })).filter(s => s.text),
      rewards: rewards.filter(r => r.code?.trim()),
      createdAt: now,
      updatedAt: now
    };
    const errs = validateQuest(quest);
    if (errs.length) { setErrors(errs); return; }
    upsertQuest(quest);
    location.assign(`/quests/${quest.slug}`);
  }

  return (
    <main style={{ maxWidth: 900, margin:"24px auto", padding:"0 20px" }}>
      <h1>Create a Mini-Quest</h1>
      <p style={{ opacity:.8, marginTop:0 }}>Keep it short and friendly: 3–6 steps works best.</p>

      {!!errors.length && (
        <div style={{border:"1px solid #e11d48", padding:12, borderRadius:10, color:"#e11d48", marginBottom:12}}>
          <b>Please fix:</b>
          <ul>{errors.map((e,i)=><li key={i}>{e}</li>)}</ul>
        </div>
      )}

      <form onSubmit={onSave} style={{ display:"grid", gap:12 }}>
        <label style={{ display:"grid", gap:6 }}>
          <span>Title</span>
          <input required value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="e.g., Calm Start" />
        </label>

        <label style={{ display:"grid", gap:6 }}>
          <span>Summary</span>
          <textarea required rows={3} value={summary} onChange={(e)=>setSummary(e.target.value)} placeholder="One-line description of the quest" />
        </label>

        <label style={{ display:"grid", gap:6 }}>
          <span>Kingdom (optional)</span>
          <input value={kingdom} onChange={(e)=>setKingdom(e.target.value)} placeholder="Air / Water / Earth / …" />
        </label>

        <fieldset style={{ border:"1px solid #e5e7eb", borderRadius:12, padding:12 }}>
          <legend>Steps</legend>
          <div style={{ display:"grid", gap:10 }}>
            {steps.map((s, idx) => (
              <div key={s.id} style={{ display:"grid", gap:6, border:"1px dashed #e5e7eb", borderRadius:10, padding:10 }}>
                <label style={{ display:"grid", gap:6 }}>
                  <span>Step {idx+1}</span>
                  <input required value={s.text} onChange={(e)=>setStep(s.id,{ text: e.target.value })} placeholder="Instruction…" />
                </label>
                <div style={{ display:"flex", gap:10 }}>
                  <input style={{ flex:1 }} value={s.tip || ""} onChange={(e)=>setStep(s.id,{ tip: e.target.value })} placeholder="Tip (optional)" />
                  <input style={{ width:120 }} type="number" min={0} value={s.minutes || ""} onChange={(e)=>setStep(s.id,{ minutes: Number(e.target.value)||undefined })} placeholder="Minutes" />
                </div>
                {steps.length > 1 && <button type="button" className="btn danger" onClick={()=>removeStep(s.id)}>Remove step</button>}
              </div>
            ))}
            <button type="button" className="btn ghost" onClick={addStep}>+ Add step</button>
          </div>
        </fieldset>

        <fieldset style={{ border:"1px solid #e5e7eb", borderRadius:12, padding:12 }}>
          <legend>Rewards (optional)</legend>
          <div style={{ display:"grid", gap:10 }}>
            {rewards.map((r, idx) => (
              <div key={idx} style={{ display:"flex", gap:10 }}>
                <select value={r.type} onChange={(e)=>setReward(idx,{ type: e.target.value as any })}>
                  <option value="stamp">Stamp</option>
                  <option value="badge">Badge</option>
                  <option value="xp">XP</option>
                </select>
                <input style={{ flex:1 }} value={r.code} onChange={(e)=>setReward(idx,{ code: e.target.value })} placeholder="Code or name" />
                <input style={{ width:120 }} type="number" min={0} value={r.amount || ""} onChange={(e)=>setReward(idx,{ amount: Number(e.target.value)||undefined })} placeholder="Amount" />
                <button type="button" className="btn danger" onClick={()=>removeReward(idx)}>Remove</button>
              </div>
            ))}
            <button type="button" className="btn ghost" onClick={addReward}>+ Add reward</button>
          </div>
        </fieldset>

        <div style={{ display:"flex", gap:10 }}>
          <button className="btn" type="submit">Save quest</button>
          <a className="btn ghost" href="/quests">Cancel</a>
        </div>
      </form>
    </main>
  );
}
