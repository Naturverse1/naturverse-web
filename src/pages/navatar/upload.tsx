import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import { Navatar, newId } from "../../lib/navatar/types";
import { saveActive } from "../../lib/navatar/storage";
import "./navatarPage.css";

export default function UploadNavatar() {
  const nav = useNavigate();
  const [name, setName] = useState("");

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const n: Navatar = { id:newId(), name: name || "My Navatar", imageDataUrl:String(reader.result), createdAt:Date.now() };
      saveActive(n);
      alert("Uploaded ✓");
      nav("/navatar");
    };
    reader.readAsDataURL(f);
  }

  return (
    <div className="nv-wrap">
      <h1 className="nv-title">Upload a Navatar</h1>
      <Breadcrumbs items={[{href:"/",label:"Home"},{href:"/navatar",label:"Navatar"},{label:"Upload"}]} />
      <NavatarTabs/>
      <div className="form">
        <input type="file" accept="image/*" onChange={onFile}/>
        <input placeholder="Name (optional)" value={name} onChange={e=>setName(e.target.value)} />
        <button className="primary" onClick={()=>{ /* no-op: submit handled on file select */ }}>Save</button>
      </div>
    </div>
  );
}
