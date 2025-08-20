import { Link } from "react-router-dom";
const zones = [
  { id:"music", name:"Music", blurb:"Songs, loops, nature rhythms." },
  { id:"wellness", name:"Wellness", blurb:"Mind & body outdoors." },
  { id:"creator-lab", name:"Creator Lab", blurb:"Make, remix, publish." },
  { id:"community", name:"Community", blurb:"Clubs, events, shout-outs." },
  { id:"teachers", name:"Teachers", blurb:"Classroom packs & guides." },
  { id:"partners", name:"Partners", blurb:"Collabs & initiatives." },
  { id:"naturversity", name:"Naturversity", blurb:"Skill paths & badges." },
  { id:"parents", name:"Parents", blurb:"Resources & safety." }
] as const;

export default function Zones(){
  return (
    <main className="container">
      <h1>Zones</h1>
      <ul>
        {zones.map(z=>(
          <li key={z.id}>
            <Link to={`/zones/${z.id}`}><strong>{z.name}</strong></Link> — {z.blurb}
          </li>
        ))}
      </ul>
    </main>
  );
}
