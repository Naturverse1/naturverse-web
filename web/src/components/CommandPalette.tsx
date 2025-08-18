import React from 'react';
import { useNavigate } from 'react-router-dom';
import { search, remember, getRecent, SearchItem } from '../lib/search';

export default function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState('');
  const [items, setItems] = React.useState<SearchItem[]>([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if ((mod && e.key.toLowerCase() === 'k') || (!mod && e.key === '/')) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', onKey);
      window.addEventListener('nv_palette_open', onOpen as EventListener);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('keydown', onKey);
        window.removeEventListener('nv_palette_open', onOpen as EventListener);
      }
    };
  }, []);

  React.useEffect(() => {
    if (!open) return;
    try {
      setItems(q.trim() ? search(q) : getRecent());
    } catch {
      setItems([]);
    }
  }, [open, q]);

  const go = (path: string) => {
    remember(path);
    navigate(path);
    setOpen(false);
    console?.log?.('cmd_navigate', { path });
  };

  if (!open) return null;

  return (
    <div className="palette-backdrop" onClick={() => setOpen(false)}>
      <div className="palette" onClick={e => e.stopPropagation()}>
        <input
          autoFocus
          placeholder="Search the Naturverse…"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <div className="palette-group">
          {items.length === 0 ? (
            <div className="palette-header">No matches</div>
          ) : (
            items.map((it, i) => (
              <div key={it.id ?? i} className="palette-item" onClick={() => go(it.path)}>
                <div>
                  <div>{it.title}</div>
                  {it.subtitle && <div style={{ opacity: .7, fontSize: 12 }}>{it.subtitle}</div>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
