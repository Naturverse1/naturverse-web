import { useState } from 'react';
import { uploadAvatarImage, createAvatar, generateImageFromPrompt } from '@/lib/navatar';

export default function CreateNavatarModal({ user, onClose, onCreated }:{
  user:any; onClose:()=>void; onCreated:()=>void;
}){
  const [tab,setTab] = useState<'upload'|'ai'|'canon'>('upload');
  const [name,setName] = useState(''); const [category,setCategory]=useState('animal');
  const [file,setFile] = useState<File|null>(null);
  const [desc,setDesc] = useState('');
  const [aiPreview,setAiPreview] = useState<string>(''); const [busy,setBusy]=useState(false); const [err,setErr]=useState<string|null>(null);

  async function saveUpload(){
    if(!file || !name) return setErr('Please choose an image and name');
    setBusy(true); setErr(null);
    try{
      const image_url = await uploadAvatarImage(user.id, file);
      const { error } = await createAvatar({ user_id:user.id, name, category, method:'upload', image_url, traits:{} });
      if (error) throw error; onCreated(); onClose();
    }catch(e:any){ setErr(e.message||'Upload failed'); } finally{ setBusy(false); }
  }

  async function generate(){
    setBusy(true); setErr(null); setAiPreview('');
    try{
      const prompt = `Naturverse style character, friendly, clean white background, centered portrait. Category: ${category}. Description: ${desc}`;
      const dataUrl = await generateImageFromPrompt(prompt);
      setAiPreview(dataUrl);
    }catch(e:any){ setErr(e.message); } finally{ setBusy(false); }
  }

  async function saveAI(){
    if(!aiPreview || !name) return setErr('Generate an image and give it a name');
    setBusy(true); setErr(null);
    try{
      const blob = await (await fetch(aiPreview)).blob();
      const imageFile = new File([blob], `${crypto.randomUUID()}.png`, { type:'image/png' });
      const image_url = await uploadAvatarImage(user.id, imageFile);
      const { error } = await createAvatar({ user_id:user.id, name, category, method:'ai', image_url, traits:{ desc } });
      if (error) throw error; onCreated(); onClose();
    }catch(e:any){ setErr(e.message||'Save failed'); } finally{ setBusy(false); }
  }

  async function saveCanon(key:string, url:string){
    setBusy(true); setErr(null);
    try{
      const { error } = await createAvatar({ user_id:user.id, name: name || key, category, method:'canon', image_url:url, traits:{ canonKey:key } });
      if (error) throw error; onCreated(); onClose();
    }catch(e:any){ setErr(e.message); } finally{ setBusy(false); }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <button onClick={()=>setTab('upload')} className={`px-3 py-2 rounded ${tab==='upload'?'bg-blue-600 text-white':'bg-neutral-100'}`}>Upload</button>
          <button onClick={()=>setTab('ai')}     className={`px-3 py-2 rounded ${tab==='ai'    ?'bg-blue-600 text-white':'bg-neutral-100'}`}>Describe & Generate</button>
          <button onClick={()=>setTab('canon')}  className={`px-3 py-2 rounded ${tab==='canon' ?'bg-blue-600 text-white':'bg-neutral-100'}`}>Pick Canon</button>
          <div className="grow" />
          <button onClick={onClose} className="px-3 py-2 rounded bg-neutral-100">✕</button>
        </div>

        {tab==='upload' && (
          <div className="space-y-4">
            <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)} />
            <input placeholder="Name" className="w-full border rounded px-3 py-2" value={name} onChange={e=>setName(e.target.value)}/>
            <input placeholder="Category (fruit/animal/spirit/insect)" className="w-full border rounded px-3 py-2" value={category} onChange={e=>setCategory(e.target.value)}/>
            <button disabled={busy} onClick={saveUpload} className="px-4 py-2 rounded bg-blue-600 text-white">{busy?'Saving…':'Save'}</button>
          </div>
        )}

        {tab==='ai' && (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <input placeholder="Name" className="border rounded px-3 py-2" value={name} onChange={e=>setName(e.target.value)}/>
              <input placeholder="Category (fruit/animal/spirit/insect)" className="border rounded px-3 py-2" value={category} onChange={e=>setCategory(e.target.value)}/>
            </div>
            <textarea placeholder="Describe your Navatar (e.g., half turtle half durian, explorer hat, blue leaf cape)" className="w-full border rounded px-3 py-2 min-h-[120px]" value={desc} onChange={e=>setDesc(e.target.value)}/>
            <div className="flex items-center gap-3">
              <button disabled={busy} onClick={generate} className="px-4 py-2 rounded bg-blue-600 text-white">{busy?'Generating…':'Generate'}</button>
              {aiPreview && <button disabled={busy} onClick={saveAI} className="px-4 py-2 rounded bg-emerald-600 text-white">{busy?'Saving…':'Save'}</button>}
            </div>
            {aiPreview && <img src={aiPreview} alt="preview" className="mt-4 w-48 h-48 object-cover rounded-xl border" />}
            {err && <p className="text-sm text-red-600">{err}</p>}
          </div>
        )}

        {tab==='canon' && <CanonGrid onPick={saveCanon} name={name} setName={setName} category={category} setCategory={setCategory} />}

        {err && tab!=='ai' && <p className="mt-4 text-sm text-red-600">{err}</p>}
      </div>
    </div>
  );
}

function CanonGrid({ onPick, name, setName, category, setCategory }:{
  onPick:(key:string,url:string)=>void; name:string; setName:(s:string)=>void; category:string; setCategory:(s:string)=>void;
}){
  const canon = [
    { key:'turian', label:'Turian the Durian', url:'/canon/turian.png', category:'fruit' },
    { key:'mangsi', label:'Mangsi the Mangosteen', url:'/canon/mangsi.png', category:'fruit' },
    // add more canon characters here
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {canon.map(c=>(
          <button key={c.key} onClick={()=>onPick(c.key, c.url)} className="border rounded-xl p-3 hover:shadow">
            <img src={c.url} alt={c.label} className="w-full aspect-square object-cover rounded-md mb-2"/>
            <div className="text-sm font-medium">{c.label}</div>
          </button>
        ))}
      </div>
      <input placeholder="Name (optional)" className="border rounded px-3 py-2" value={name} onChange={e=>setName(e.target.value)}/>
      <input placeholder="Category" className="border rounded px-3 py-2" value={category} onChange={e=>setCategory(e.target.value)}/>
    </div>
  );
}
