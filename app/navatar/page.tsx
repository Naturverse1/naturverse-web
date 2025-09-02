"use client";
import React, { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";
import NavatarModal from "./NavatarModal";

type Avatar = { id: string; name: string|null; image_url: string; method: "upload"|"canon"|"ai" };

export default function NavatarPage(){
  const [user, setUser] = useState<any>(null);
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [show, setShow] = useState(false);

  const [canonList, setCanonList] = useState<any[]>([]);

  useEffect(() => {
    // get current user
    supabaseBrowser.auth.getUser().then(({ data }) => setUser(data.user || null));
  }, []);

  useEffect(() => {
    if (!user) return;
    refresh();
    // load canon data (static JSON or from /public)
    fetch("/navatars/catalog.json").then(r=>r.json()).then(setCanonList).catch(()=>setCanonList([]));
  }, [user]);

  function refresh(){
    supabaseBrowser.from("avatars")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setAvatars(data || []));
  }

  return (
    <main style={{padding:"24px 16px", maxWidth:1000, margin:"0 auto"}}>
      <h1>Your Navatar</h1>
      <button onClick={()=>setShow(true)}>Create Navatar</button>

      <div style={{marginTop:18}}>
        {avatars.map(a=>(
          <div key={a.id} style={{marginBottom:24}}>
            <img src={a.image_url} alt={a.name || "navatar"} style={{width:380, borderRadius:12}}/>
            <div style={{fontWeight:600, marginTop:8}}>{a.name || "(unnamed)"}</div>
            <div style={{color:"#667"}}>{a.method.toUpperCase()}</div>
          </div>
        ))}
        {avatars.length===0 && <div>No Navatars yet — create your first!</div>}
      </div>

      {show && user && (
        <NavatarModal
          userId={user.id}
          canonList={canonList}
          onCreated={()=>{ refresh(); }}
          onClose={()=>setShow(false)}
        />
      )}
    </main>
  );
}
