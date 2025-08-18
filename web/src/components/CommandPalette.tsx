import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { search, getRecent, remember, getBaseItems, SearchItem } from '../lib/search';
import { useNavigate } from 'react-router-dom';

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<SearchItem[]>([]);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const tag = target.tagName;
      const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || (target as any).isContentEditable;
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !isInput)) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('nv_palette_open', onOpen as any);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('nv_palette_open', onOpen as any);
    };
  }, []);

  useEffect(() => {
    if (open) {
      const rec = getRecent();
      setItems(rec.length ? rec : getBaseItems().slice(0, 5));
      setQuery('');
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 0);
      console.log('cmd_opened');
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (!query) {
      const rec = getRecent();
      setItems(rec.length ? rec : getBaseItems().slice(0, 5));
      setActive(0);
      return;
    }
    const res = search(query);
    setItems(res);
    console.log('cmd_search', { q: query, results: res.length });
  }, [query, open]);

  const flat = items;

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(a => Math.min(a + 1, flat.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(a => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = flat[active];
      if (item) select(item);
    } else if (e.key === 'Escape') {
      setOpen(false);
    } else if (e.key === 'Tab') {
      e.preventDefault();
    }
  }

  function select(item: SearchItem) {
    setOpen(false);
    remember(item.path);
    navigate(item.path);
    console.log('cmd_navigate', { path: item.path });
  }

  function highlight(text: string) {
    if (!query) return text;
    const q = query.toLowerCase();
    const i = text.toLowerCase().indexOf(q);
    if (i === -1) return text;
    return (
      <>
        {text.slice(0, i)}<mark>{text.slice(i, i + q.length)}</mark>{text.slice(i + q.length)}
      </>
    );
  }

  const grouped: Record<string, SearchItem[]> = {};
  if (query) {
    items.forEach(i => {
      (grouped[i.kind] ||= []).push(i);
    });
  } else {
    grouped['recent'] = items;
  }

  const order = query ? ['product', 'page', 'account'] : ['recent'];

  if (!open) return null;

  return createPortal(
    <div className="palette-backdrop" onClick={() => setOpen(false)}>
      <div
        className="palette"
        role="dialog"
        aria-modal="true"
        onClick={e => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search the Naturverse…"
          aria-label="Search"
        />
        {order.map(key => {
          const arr = grouped[key];
          if (!arr || !arr.length) return null;
          const header = key === 'product' ? 'Products' : key === 'page' ? 'Pages' : key === 'account' ? 'Account' : 'Recent';
          return (
            <div className="palette-group" key={key}>
              <div className="palette-header">{header}</div>
              {arr.map((item, idx) => {
                const iIdx = flat.indexOf(item);
                return (
                  <div
                    key={item.id}
                    className={
                      'palette-item' + (iIdx === active ? ' active' : '')
                    }
                    onMouseEnter={() => setActive(iIdx)}
                    onMouseDown={e => {
                      e.preventDefault();
                      select(item);
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div>{highlight(item.title)}</div>
                      <div className="muted small">{item.subtitle || item.path}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>,
    document.body,
  );
}

