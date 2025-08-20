import CommonCard from '../../components/CommonCard';
import { useQuizzes } from '../../hooks/useContent';
import { Link } from 'react-router-dom';

export default function Quizzes(){
  const quizzes = useQuizzes();
  return (
    <div>
      <h1>Quizzes</h1>
      {quizzes.map(q=> (
        <CommonCard key={q.slug} title={q.title}>
          <Link to={`/quizzes/${q.slug}`}>Take Quiz</Link>
        </CommonCard>
      ))}
    </div>
  );
}
