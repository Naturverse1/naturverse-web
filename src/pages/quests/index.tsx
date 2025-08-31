import QuestSearchBar from "@/components/QuestSearchBar";
import { metaTag } from "@/lib/seo";

export default function QuestsHome(){
  return (
    <>
      {metaTag({ title: "Mini-quests", desc: "Fast actions for calm, focus, sleep, and energy." })}
      <main className="container" style={{ padding: 24 }}>
        <h1>Mini-quests</h1>
        <p className="muted">Quick, guided steps you can do anywhere.</p>
        <QuestSearchBar />
      </main>
    </>
  );
}
