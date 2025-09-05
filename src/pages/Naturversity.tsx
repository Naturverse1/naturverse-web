import { Link } from "react-router-dom";
import "../styles/cards-unify.css";
import { setTitle } from "./_meta";
import Breadcrumbs from "../components/Breadcrumbs";

export default function NaturversityPage() {
  setTitle("Naturversity");
  return (
    <div className="page-wrap">
      <Breadcrumbs />
        <main className="page" id="learn" data-turian="learn">
        <h1>Naturversity</h1>
        <p>Teachers, partners, and courses.</p>

      <div className="grid-tiles">
        {/* Teachers */}
        <Link to="/naturversity/teachers" className="tile">
          <div className="tile__icon" aria-hidden>
            <span role="img" aria-label="mortarboard">🎓</span>
          </div>
          <div className="tile__body">
            <h2 className="tile__title">Teachers</h2>
            <p className="tile__subtitle">Mentors across the 14 kingdoms.</p>
          </div>
        </Link>

        {/* Partners */}
        <Link to="/naturversity/partners" className="tile">
          <div className="tile__icon" aria-hidden>
            <span role="img" aria-label="heart-hands">🫶</span>
          </div>
          <div className="tile__body">
            <h2 className="tile__title">Partners</h2>
            <p className="tile__subtitle">Brands & orgs supporting missions.</p>
          </div>
        </Link>

        {/* Languages (now uses favicon, sized like the others) */}
        <Link to="/naturversity/languages" className="tile">
          <div className="tile__icon" aria-hidden>
            <img
              src="/favicon.svg"
              alt=""
              width={28}
              height={28}
              style={{ display: "block" }}
            />
          </div>
          <div className="tile__body">
            <h2 className="tile__title">Languages</h2>
            <p className="tile__subtitle">Phrasebooks for each kingdom.</p>
          </div>
        </Link>

        {/* Courses */}
        <Link to="/naturversity/courses" className="tile">
          <div className="tile__icon" aria-hidden>
            <span role="img" aria-label="books">📚</span>
          </div>
          <div className="tile__body">
            <h2 className="tile__title">Courses</h2>
            <p className="tile__subtitle">Nature, art, music, wellness, crypto basics…</p>
          </div>
        </Link>
      </div>

      <p className="coming-soon">Coming soon: AI tutors and step-by-step lessons.</p>
      </main>
    </div>
  );
}

