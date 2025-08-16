import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/useAuth';
import { supabase } from '@/supabaseClient';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { setAvatarUrl(null); return; }
    supabase
      .from('users')
      .select('avatar_url')
      .eq('id', user.id)
      .single()
      .then(({ data }) => setAvatarUrl((data?.avatar_url as string) ?? null));
  }, [user]);

  const initials = user?.email?.charAt(0).toUpperCase() ?? '?';

  return (
    <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 16px',borderBottom:'1px solid #eee'}}>
      <Link to="/" style={{fontWeight:700,textDecoration:'none'}}>Naturverse</Link>
      {user ? (
        <div style={{position:'relative'}}>
          <button onClick={() => setOpen(o=>!o)} style={{background:'none',border:'none',cursor:'pointer'}}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" style={{width:32,height:32,borderRadius:'50%',objectFit:'cover'}} />
            ) : (
              <div style={{width:32,height:32,borderRadius:'50%',background:'#ccc',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,color:'#fff'}}>{initials}</div>
            )}
          </button>
          {open && (
            <div style={{position:'absolute',right:0,marginTop:8,background:'#fff',border:'1px solid #ddd',borderRadius:4,padding:8,display:'flex',flexDirection:'column',minWidth:120}}>
              <Link to="/profile" onClick={() => setOpen(false)} style={{marginBottom:4}}>Profile</Link>
              <Link to="/map" onClick={() => setOpen(false)} style={{marginBottom:4}}>Map</Link>
              <button onClick={async()=>{await signOut(); navigate('/');}} style={{textAlign:'left',background:'none',border:'none',padding:0,cursor:'pointer'}}>Sign out</button>
            </div>
          )}
        </div>
      ) : (
        <Link to="/login">Sign in</Link>
      )}
    </nav>
  );
}
