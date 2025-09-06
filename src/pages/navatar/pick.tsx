import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import { newId, Navatar } from "../../lib/navatar/types";
import { saveActive } from "../../lib/navatar/storage";
import "./navatarPage.css";

type Manifest = string[]; // filenames in /navatars

export default function PickNavatar() {
  const nav = useNavigate();
  const [files, setFiles] = useState<string[]>([]);

  useEffect(()=>{
    fetch("/navatars/manifest.json").then(r=>r.json()).then((m:Manifest)=>setFiles(m)).catch(()=>setFiles([]));
  },[]);

  function choose(src:string) {
    const n: Navatar = { id:newId(), name:"My Navatar", imageDataUrl: src, createdAt:Date.now() };
    saveActive(n);
    alert("Set as active ✓");
    nav("/navatar");
  }

  return (
    <div className="nv-wrap">
      <h1 className="nv-title">Pick Navatar</h1>
      <Breadcrumbs items={[{href:"/",label:"Home"},{href:"/navatar",label:"Navatar"},{label:"Pick"}]} />
      <NavatarTabs/>
      <div className="grid">
        {files.map(fn => {
          const url = `/navatars/${fn}`;
          return (
            <button key={fn} className="pick" onClick={()=>choose(url)}>
              <img src={url} alt={fn} />
            </button>
          );
        })}
        {files.length===0 && <p>No images found in <code>public/navatars</code>.</p>}
      </div>
    </div>
  );
}
