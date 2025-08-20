import { Link } from "react-router-dom";
export default function ZoneCreator(){
  return (
    <>
      <h3>Creator Lab</h3>
      <p>Make stories, art, code, and music.</p>
      <ul className="cards">
        <li className="card"><div className="card-emoji">📖</div><div><div className="card-title">Story Forge</div><div className="card-sub">Prompts and scenes to write.</div></div></li>
        <li className="card"><div className="card-emoji">🎨</div><div><div className="card-title">Sketch Pad</div><div className="card-sub">Draw with layers and stickers.</div></div></li>
        <li className="card"><Link className="card-link" to="/naturversity/tutor"><div className="card-emoji">🧠</div><div><div className="card-title">Idea Helper</div><div className="card-sub">Ask AI Tutor for ideas.</div></div></Link></li>
      </ul>
    </>
  );
}
