import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import CharacterCard from "../../components/CharacterCard";
import { Navatar, newId } from "../../lib/navatar/types";
import { saveActive } from "../../lib/navatar/storage";
import "./navatarPage.css";

// This is a lightweight stub UI for describe/edit flows.
// (Hook up your real image service later; for now it just saves the uploaded/edited image.)

export default function GenerateNavatar() {
  const nav = useNavigate();
  const [desc, setDesc] = useState("");
  const [preview, setPreview] = useState<string|undefined>();
  const fileRef = useRef<HTMLInputElement>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result));
    reader.readAsDataURL(f);
  }

  function save() {
    const n: Navatar = { id:newId(), name: desc.trim() || "My Navatar", imageDataUrl: preview, createdAt: Date.now() };
    saveActive(n);
    alert("Saved ✓");
    nav("/navatar");
  }

  return (
    <div className="nv-wrap">
      <h1 className="nv-title">Describe & Generate</h1>
      <Breadcrumbs items={[{href:"/",label:"Home"},{href:"/navatar",label:"Navatar"},{label:"Describe & Generate"}]} />
      <NavatarTabs/>

      <div className="gen">
        <CharacterCard navatar={preview ? {id:"tmp", createdAt:Date.now(), name:desc, imageDataUrl:preview}: null}/>
        <div className="gen-form">
          <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Describe your Navatar (e.g., leaf spirit with bamboo crown)…"/>
          <input type="file" accept="image/*" ref={fileRef} onChange={onFile}/>
          <button className="primary" disabled={!preview && !desc.trim()} onClick={save}>Save</button>
          <small className="hint">Upload a selfie or image to edit; generation hook can be added later.</small>
        </div>
      </div>
    </div>
  );
}
