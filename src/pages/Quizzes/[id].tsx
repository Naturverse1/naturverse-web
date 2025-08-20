import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { addTokens } from '../../lib/tokens';
import { getDeviceId } from '../../lib/device';
import { useEffect, useState } from 'react';

export default function QuizDetail(){
  const { id } = useParams();
  const [q,setQ]=useState<any>(null);
  const [score,setScore]=useState<number|undefined>(undefined);

  useEffect(()=>{ (async()=>{
    const { data } = await supabase.from('content').select('id,title,slug,quizzes(questions)').eq('slug', id!).maybeSingle();
    setQ(data);
  })(); },[id]);

  if(!q) return <p>Loading...</p>;

  async function submit(e:any){
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const correct = (q.quizzes.questions as any[]).reduce((acc,qq,i)=> acc + ((+fd.get('q'+i)===qq.answer)?1:0),0);
    setScore(correct);
    const device = getDeviceId();
    await supabase.from('progress').insert({ device_id: device, content_id: q.id, score: correct, completed_at: new Date().toISOString() });
    await addTokens(5);
  }

  return (
    <form onSubmit={submit}>
      <h1>{q.title}</h1>
      {q.quizzes?.questions?.map((qq:any, i:number)=>(
        <div key={i} style={{marginBottom:12}}>
          <div>{qq.q}</div>
          {qq.choices.map((c:string, idx:number)=>(
            <label key={idx} style={{display:'block'}}>
              <input type="radio" name={'q'+i} value={idx}/> {c}
            </label>
          ))}
        </div>
      ))}
      <button type="submit">Submit</button>
      {score!==undefined && <p>Score: {score}</p>}
    </form>
  );
}
