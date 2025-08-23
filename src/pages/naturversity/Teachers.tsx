import React, { useMemo, useState } from "react";
import { TEACHERS } from "../../lib/naturversity/data";

export default function Teachers() {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const s = q.toLowerCase().trim();
    if (!s) return TEACHERS;
    return TEACHERS.filter(t =>
      t.name.toLowerCase().includes(s) ||
      t.kingdom.toLowerCase().includes(s) ||
      t.specialty.toLowerCase().includes(s)
    );
  }, [q]);

  return (
    <main id="main" className="page-wrap">
      <h1>👩‍🏫 Teachers</h1>
      <div className="edu-toolbar">
        <input className="input" placeholder="Search mentors…" value={q} onChange={e=>setQ(e.target.value)} />
      </div>
      <div className="edu-list">
        {list.map(t => (
          <div key={t.id} className="edu-row">
            <div className="badge">{t.kingdom}</div>
            <div className="grow">
              <div className="title">{t.name}</div>
              <div className="desc">{t.specialty}</div>
            </div>
            <button className="btn tiny outline" disabled>Message (soon)</button>
          </div>
        ))}
      </div>
    </main>
  );
}

