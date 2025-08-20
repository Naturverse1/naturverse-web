import { quizzes } from '../../data/quizzes'
import { useState } from 'react'

export default function Quizzes() {
  const q = quizzes[0]
  const [i,setI] = useState(0)
  const [score,setScore] = useState(0)
  const cur = q.questions[i]

  function choose(idx:number){
    if (idx===cur.answer) setScore(s=>s+1)
    setI(x=>Math.min(x+1, q.questions.length))
  }

  return (
    <section>
      <h1>{q.title}</h1>
      {i<q.questions.length ? (
        <div>
          <p><strong>Q{i+1}.</strong> {cur.q}</p>
          <ul>
            {cur.choices.map((c,idx)=>(
              <li key={idx}><button onClick={()=>choose(idx)}>{c}</button></li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Done! Score: {score}/{q.questions.length}</p>
      )}
    </section>
  )
}
