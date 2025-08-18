import { useState } from 'react';
import { fileToImage, drawToCanvas, canvasToDataURL } from '../lib/image';
import { getNavatar, saveNavatar, clearNavatar } from '../lib/navatar';

export default function ProfilePage() {
  const [preview, setPreview] = useState<string | null>(getNavatar());
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onChoose(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setErr(null);
    if (!/^image\//.test(f.type)) {
      setErr('Please choose an image file.');
      return;
    }
    try {
      setBusy(true);
      const img = await fileToImage(f);
      const canvas = drawToCanvas(img, 512);
      let q = 0.92;
      let data = canvasToDataURL(canvas, q);
      while (data.length > 160_000 && q > 0.6) {
        q -= 0.06;
        data = canvasToDataURL(canvas, q);
      }
      setPreview(data);
    } catch (e) {
      setErr('Unable to load that image.');
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  }

  function onSave() {
    if (!preview) return;
    saveNavatar(preview);
    alert('Navatar saved!');
  }

  function onClear() {
    clearNavatar();
    setPreview(null);
  }

  return (
    <div>
      <h1>Profile</h1>

      <div style={{display:'flex',gap:16,alignItems:'center'}}>
        <div className="avatar-lg">
          {preview ? <img src={preview} alt="Navatar" /> : <div className="avatar-empty">No Navatar</div>}
        </div>

        <div>
          <input type="file" accept="image/*" onChange={onChoose} disabled={busy} />
          <div style={{marginTop:8, display:'flex', gap:8}}>
            <button onClick={onSave} disabled={!preview || busy}>Save Navatar</button>
            <button onClick={onClear} disabled={busy}>Remove</button>
          </div>
          {busy && <p>Processing image…</p>}
          {err && <p style={{color:'#f88'}}>{err}</p>}
          <p style={{opacity:.8, marginTop:6}}>Tip: Large photos are auto-compressed and resized to fit 512×512.</p>
        </div>
      </div>
    </div>
  );
}
