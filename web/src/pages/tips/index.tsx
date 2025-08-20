import { tips } from '../../data/tips'
export default function Tips(){
  return (
    <section>
      <h1>Turian Tips</h1>
      <ul>{tips.map(t=> <li key={t.id}>{t.text}</li>)}</ul>
    </section>
  )
}
