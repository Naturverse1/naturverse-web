import { STARTER_NAVATARS } from '../data/navatars';
import NavatarBadge from './NavatarBadge';

export default function NavatarPicker({
  value, onSelect, onSave, saving
}: { value?: string; onSelect: (id:string)=>void; onSave: ()=>void; saving?: boolean }) {
  return (
    <section className="navatar-picker">
      <h2>Choose your Navatar</h2>
      <div className="grid">
        {STARTER_NAVATARS.map(a => (
          <button key={a.id}
            className={`avatar-card ${value===a.id?'active':''}`}
            onClick={()=>onSelect(a.id)}
            aria-pressed={value===a.id}
            type="button">
            <NavatarBadge svg={a.svg} size={72} alt={a.name} />
            <div className="label">{a.name}</div>
          </button>
        ))}
      </div>
      <button className="primary" disabled={!value || saving} onClick={onSave} type="button">
        {saving? 'Saving…' : 'Save Navatar'}
      </button>
    </section>
  );
}
