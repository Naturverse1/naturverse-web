import { useEffect, useState } from 'react'
export default function InstallPrompt(){
  const [deferred, setDeferred] = useState<any>(null)
  const [open, setOpen] = useState(false)
  useEffect(()=>{
    const onBip = (e:any)=>{ e.preventDefault(); setDeferred(e); setOpen(true) }
    window.addEventListener('beforeinstallprompt', onBip)
    return ()=> window.removeEventListener('beforeinstallprompt', onBip)
  },[])
  if(!open) return null
  return (
    <div style={{position:'fixed', bottom:80, right:16, background:'#0ea5e9', color:'#fff', padding:12, borderRadius:8}}>
      Install Naturverse for quicker access.
      <div style={{marginTop:8}}>
        <button onClick={async()=>{ await deferred?.prompt(); setOpen(false) }}>Install</button>
        <button onClick={()=>setOpen(false)} style={{marginLeft:8}}>Later</button>
      </div>
    </div>
  )
}
