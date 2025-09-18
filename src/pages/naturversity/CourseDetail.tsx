import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { COURSES } from "../../lib/naturversity/data";
import { loadProgress, markLesson, toggleEnroll, loadEnrollments } from "../../lib/naturversity/store";
import { ai } from "../../lib/useAI";
import { lessonPrompt, type LessonPack } from "../../ai/schemas";

export default function CourseDetail() {
  const { slug = "" } = useParams();
  const course = useMemo(() => COURSES.find(c => c.slug === slug), [slug]);
  const [enrolled, setEnrolled] = useState<string[]>(loadEnrollments());
  const [done, setDone] = useState<string[]>(loadProgress(slug));
  const [topic, setTopic] = useState<string>(course?.lessons?.[0]?.title ?? course?.title ?? "");
  const [age, setAge] = useState<number>(8);
  const [lesson, setLesson] = useState<LessonPack | null>(null);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [lessonMessage, setLessonMessage] = useState<string | null>(null);

  useEffect(() => {
    setTopic(course?.lessons?.[0]?.title ?? course?.title ?? "");
    setLesson(null);
    setLessonMessage(null);
  }, [course?.slug]);

  if (!course) return <main id="main" className="page-wrap"><h1>Course</h1><p>Not found.</p></main>;

  const on = enrolled.includes(course.slug);
  const outlineItems = (lesson?.outline ?? []).filter(item => !!item);
  const quizItems = (lesson?.quiz ?? [])
    .slice(0, 5)
    .filter((item): item is LessonPack["quiz"][number] => !!item && typeof item.q === "string");

  async function handleGenerateLesson(e: React.FormEvent) {
    e.preventDefault();
    if (!course) {
      setLessonMessage("Turian is thinking… try again later.");
      return;
    }
    setLessonMessage(null);
    setLessonLoading(true);
    try {
      const safeTopic = (topic || "").trim() || course.title;
      const rawAge = Number.isFinite(age) ? age : 8;
      const safeAge = Math.min(14, Math.max(5, Math.round(rawAge)));

      const pack = await ai<LessonPack>(
        "lesson",
        lessonPrompt({ topic: safeTopic, age: safeAge })
      );

      setLesson(pack);
      setAge(safeAge);
      setLessonMessage("✨ Turian drafted a fresh Naturversity lesson!");
    } catch (error) {
      console.error(error);
      setLessonMessage("Turian is thinking… try again later.");
    } finally {
      setLessonLoading(false);
    }
  }

  return (
    <main id="main" className="page-wrap">
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

      <p className="meta">Lessons, video, and AI tutoring connect here later. Turian can already sketch a mini-lesson below.</p>

      <section style={{ marginTop: 24, borderTop: "1px solid #e5e7eb", paddingTop: 20 }}>
        <h2>Lesson Builder</h2>
        <p className="meta">Choose a topic and let Turian craft a quick Naturversity lesson plan.</p>
        <form onSubmit={handleGenerateLesson} style={{ maxWidth: 520, marginTop: 12 }}>
          <label style={{ display: "block", marginBottom: 12 }}>
            Topic
            <input
              className="input"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g., Rainforest Rivers"
            />
          </label>
          <label style={{ display: "block", marginBottom: 12 }}>
            Learner age
            <input
              className="input"
              type="number"
              min={5}
              max={14}
              value={age}
              onChange={e => setAge(Number(e.target.value) || 8)}
            />
          </label>
          <div className="row gap" style={{ marginTop: 12 }}>
            <button type="submit" className="btn tiny" disabled={lessonLoading}>
              {lessonLoading ? "Summoning…" : "Generate Lesson"}
            </button>
          </div>
        </form>
        {lessonMessage && (
          <p className="meta" style={{ marginTop: 8 }}>{lessonMessage}</p>
        )}

        {lesson && (
          <article className="lesson" style={{ marginTop: 16 }}>
            <h3>{lesson.title}</h3>
            {lesson.summary && <p>{lesson.summary}</p>}
            {outlineItems.length > 0 && (
              <>
                <h4>Outline</h4>
                <ol>
                  {outlineItems.map((item, idx) => (
                    <li key={`${idx}-${item}`}>{item}</li>
                  ))}
                </ol>
              </>
            )}
            {lesson.activity && (
              <>
                <h4>Activity</h4>
                <p>{lesson.activity}</p>
              </>
            )}
            {quizItems.length > 0 && (
              <>
                <h4>Quiz</h4>
                <ol>
                  {quizItems.map((item, idx) => (
                    <li key={`${idx}-${item.q}`} style={{ marginBottom: 12 }}>
                      <p>
                        <strong>Q{idx + 1}.</strong> {item.q}
                      </p>
                      <ul style={{ paddingLeft: "1.25rem", marginTop: 4 }}>
                        {(item.a ?? []).map((choice, cIdx) => (
                          <li key={`${idx}-${cIdx}`} style={{ marginBottom: 4 }}>
                            <span>{String.fromCharCode(65 + cIdx)}. {choice}</span>
                            {item.correct === cIdx && (
                              <span className="badge" style={{ marginLeft: 8 }}>Answer</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </article>
        )}
      </section>
    </main>
  );
}

