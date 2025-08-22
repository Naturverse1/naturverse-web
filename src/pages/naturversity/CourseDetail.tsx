import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { COURSES } from "../../lib/naturversity/data";
import { loadProgress, markLesson, toggleEnroll, loadEnrollments } from "../../lib/naturversity/store";

export default function CourseDetail() {
  const { slug = "" } = useParams();
  const course = useMemo(() => COURSES.find(c => c.slug === slug), [slug]);
  const [enrolled, setEnrolled] = useState<string[]>(loadEnrollments());
  const [done, setDone] = useState<string[]>(loadProgress(slug));

  if (!course) return <main id="main"><h1>Course</h1><p>Not found.</p></main>;

  const on = enrolled.includes(course.slug);

  return (
    <main id="main">
      <h1>{course.emoji ?? "📘"} {course.title}</h1>
      <p className="lead">{course.summary}</p>
      <div className="row">
        <span className="badge">{course.track}</span>
        <div className="spacer" />
        <button className={"btn tiny outline"+(on?" active":"")}
                onClick={()=>setEnrolled(toggleEnroll(course.slug))}
                aria-pressed={on}>
          {on ? "Enrolled" : "Enroll"}
        </button>
      </div>

      <h2 className="mt">Syllabus</h2>
      <div className="edu-list">
        {course.lessons.map(ls => {
          const checked = done.includes(ls.id);
          return (
            <div key={ls.id} className="edu-row">
              <input
                type="checkbox"
                checked={checked}
                onChange={()=>setDone(markLesson(course.slug, ls.id))}
                aria-label={`Mark ${ls.title} complete`}
              />
              <div className="grow">
                <div className="title">{ls.title}</div>
                <div className="desc">{ls.summary}</div>
              </div>
              <button className="btn tiny" disabled>Open Lesson (soon)</button>
            </div>
          );
        })}
      </div>

      <p className="meta">Lessons, video, and AI tutoring connect here later.</p>
    </main>
  );
}

