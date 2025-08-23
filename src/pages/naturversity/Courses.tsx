import React, { useMemo, useState } from "react";
import { COURSES } from "../../lib/naturversity/data";
import { Link } from "react-router-dom";
import { loadEnrollments, toggleEnroll } from "../../lib/naturversity/store";

export default function Courses() {
  const [enrolled, setEnrolled] = useState<string[]>(loadEnrollments());
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const s = q.toLowerCase().trim();
    if (!s) return COURSES;
    return COURSES.filter(c =>
      c.title.toLowerCase().includes(s) ||
      c.summary.toLowerCase().includes(s) ||
      c.track.toLowerCase().includes(s)
    );
  }, [q]);

  return (
    <main id="main" className="page-wrap">
      <h1>📚 Courses</h1>
      <div className="edu-toolbar">
        <input className="input" placeholder="Search courses…" value={q} onChange={e=>setQ(e.target.value)} />
      </div>
      <div className="hub-grid">
        {list.map(c => {
          const on = enrolled.includes(c.slug);
          return (
            <div key={c.slug} className="hub-card">
              <div className="emoji">{c.emoji ?? "📘"}</div>
              <div className="title">{c.title}</div>
              <div className="desc">{c.summary}</div>
              <div className="row">
                <span className="badge">{c.track}</span>
                <div className="spacer" />
                <button className={"btn tiny outline"+(on?" active":"")}
                        onClick={()=>setEnrolled(toggleEnroll(c.slug))}
                        aria-pressed={on}>
                  {on ? "Enrolled" : "Enroll"}
                </button>
                <Link className="btn tiny" to={`/naturversity/course/${c.slug}`}>View Syllabus</Link>
              </div>
            </div>
          );
        })}
      </div>
      <p className="meta">Coming soon: pacing plans, reminders, and AI tutors.</p>
    </main>
  );
}

