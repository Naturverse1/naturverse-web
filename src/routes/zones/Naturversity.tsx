import { Link } from "react-router-dom";
export default function ZoneNaturversity(){
  return (
    <>
      <h3>Naturversity</h3>
      <p className="muted">Pick a course or ask the Tutor.</p>
      <div className="pillbar">
        <Link className="pill" to="/naturversity/courses">Courses</Link>
        <Link className="pill" to="/naturversity/tutor">Tutor</Link>
      </div>
    </>
  );
}
