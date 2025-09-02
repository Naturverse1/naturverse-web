import { useState } from 'react';
import { uploadAvatarImage, createAvatar, generateImageFromPrompt } from '@/lib/navatar';

export default function CreateNavatarModal({ user, onClose, onCreated }:{
  user: any, onClose:()=>void, onCreated:()=>void
}) {
  const [tab, setTab] = useState<'upload'|'ai'|'canon'>('upload');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('animal');
  const [file, setFile] = useState<File|null>(null);
  const [desc, setDesc] = useState('');
  const [aiPreview, setAiPreview] = useState<string>(''); // data URL
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string| null>(null);

  const handleUploadSave = async () => {
    if (!file || !name) return setError('Please choose an image and name');
    setBusy(true); setError(null);
    try {
      const image_url = await uploadAvatarImage(user.id, file);
      const { error } = await createAvatar({ user_id: user.id, name, category, method:'upload', image_url, traits:{ } });
      if (error) throw error;
      onCreated(); onClose();
    } catch (e:any) { setError(e.message || 'Upload failed'); }
    finally { setBusy(false); }
  };

  const handleAIGenerate = async () => {
    setBusy(true); setError(null); setAiPreview('');
    const prompt = `Naturverse style, friendly, clean white background, centered character portrait. Category: ${category}. Description: ${desc}`;
    try {
      const b64 = await generateImageFromPrompt(prompt);
      if (!b64) throw new Error('No image returned');
      setAiPreview(`data:image/png;base64,${b64}`);
    } catch (e:any) {
      setError(e.message === 'no_openai_key' ? 'AI generation disabled on this preview (no API key).' : e.message);
    } finally { setBusy(false); }
  };

  const handleAISave = async () => {
    if (!aiPreview || !name) return setError('Generate an image and add a name');
    setBusy(true); setError(null);
    try {
      // convert dataURL -> blob -> File for upload
      const res = await fetch(aiPreview); const blob = await res.blob();
      const imageFile = new File([blob], `${crypto.randomUUID()}.png`, { type: 'image/png' });
      const image_url = await uploadAvatarImage(user.id, imageFile);
      const { error } = await createAvatar({ user_id: user.id, name, category, method:'ai', image_url, traits:{ desc } });
      if (error) throw error;
      onCreated(); onClose();
    } catch (e:any) { setError(e.message || 'Save failed'); }
    finally { setBusy(false); }
  };

  const handleCanonSave = async (canonKey:string, canonUrl:string) => {
    setBusy(true); setError(null);
    try {
      const { error } = await createAvatar({
        user_id: user.id, name: name || canonKey, category, method:'canon', image_url: canonUrl, traits:{ canonKey }
      });
      if (error) throw error;
      onCreated(); onClose();
    } catch (e:any) { setError(e.message); } finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <button onClick={()=>setTab('upload')} className={`px-3 py-2 rounded ${tab==='upload'?'bg-blue-600 text-white':'bg-neutral-100'}`}>Upload</button>
          <button onClick={()=>setTab('ai')} className={`px-3 py-2 rounded ${tab==='ai'?'bg-blue-600 text-white':'bg-neutral-100'}`}>Describe & Generate</button>
          <button onClick={()=>setTab('canon')} className={`px-3 py-2 rounded ${tab==='canon'?'bg-blue-600 text-white':'bg-neutral-100'}`}>Pick Canon</button>
          <div className="grow" />
          <button onClick={onClose} className="px-3 py-2 rounded bg-neutral-100">✕</button>
        </div>

        {tab==='upload' && (
          <div className="space-y-4">
            <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)} />
            <input placeholder="Name" className="w-full border rounded px-3 py-2" value={name} onChange={e=>setName(e.target.value)}/>
            <input placeholder="Category (fruit/animal/spirit/insect)" className="w-full border rounded px-3 py-2" value={category} onChange={e=>setCategory(e.target.value)}/>
            <button disabled={busy} onClick={handleUploadSave} className="px-4 py-2 rounded bg-blue-600 text-white">{busy?'Saving…':'Save'}</button>
          </div>
        )}

        {tab==='ai' && (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <input placeholder="Name" className="border rounded px-3 py-2" value={name} onChange={e=>setName(e.target.value)}/>
              <input placeholder="Category (fruit/animal/spirit/insect)" className="border rounded px-3 py-2" value={category} onChange={e=>setCategory(e.target.value)}/>
            </div>
            <textarea placeholder="Describe your Navatar (e.g., half turtle half durian, friendly, explorer hat, blue leaf cape)" className="w-full border rounded px-3 py-2 min-h-[120px]" value={desc} onChange={e=>setDesc(e.target.value)}/>
            <div className="flex items-center gap-3">
              <button disabled={busy} onClick={handleAIGenerate} className="px-4 py-2 rounded bg-blue-600 text-white">{busy?'Generating…':'Generate'}</button>
              {aiPreview && <button disabled={busy} onClick={handleAISave} className="px-4 py-2 rounded bg-emerald-600 text-white">{busy?'Saving…':'Save'}</button>}
            </div>
            {aiPreview && <img src={aiPreview} alt="preview" className="mt-4 w-48 h-48 object-cover rounded-xl border" />}
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        )}

        {tab==='canon' && (
          <CanonGrid onPick={handleCanonSave} name={name} setName={setName} category={category} setCategory={setCategory}/>
        )}

        {error && tab!=='ai' && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}

function CanonGrid({ onPick, name, setName, category, setCategory }:{
  onPick:(key:string,url:string)=>void; name:string; setName:(s:string)=>void; category:string; setCategory:(s:string)=>void;
}) {
  const canon = [
    { key:'turian', label:'Turian the Durian', url:'/canon/turian.png', category:'fruit' },
    { key:'mangsi', label:'Mangsi the Mangosteen', url:'/canon/mangsi.png', category:'fruit' },
    // add as needed…
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
