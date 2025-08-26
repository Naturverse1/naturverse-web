import { useEffect, useState } from 'react'

export default function SwUpdateToast(){
  const [needRefresh, setNeedRefresh] = useState(false)
  useEffect(()=>{
    const handler = (e: Event) => {
      if ((e as CustomEvent).detail === 'updated') setNeedRefresh(true)
    }
    window.addEventListener('swUpdated', handler as any)
    return ()=> window.removeEventListener('swUpdated', handler as any)
  },[])
  if(!needRefresh) return null
  return (
    <div style={{
      position:'fixed', bottom:16, left:'50%', transform:'translateX(-50%)',
      background:'#111', color:'#fff', padding:'10px 14px', borderRadius:8, zIndex:9999
    }}>
      New version available. <button onClick={()=>location.reload()} style={{marginLeft:8}}>Refresh</button>
    </div>
  )
}
