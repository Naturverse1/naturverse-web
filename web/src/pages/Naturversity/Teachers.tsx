import { useEffect, useState } from 'react';
import { callFn } from '../../lib/api';
import type { StudentProgress } from '../../types/naturversity';

export default function TeachersPage() {
  const [rows, setRows] = useState<StudentProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await callFn('nv-progress', 'GET');
      if (res?.ok) setRows(res.data as StudentProgress[]);
      setLoading(false);
    })();
  }, []);

  return (
    <main className="page">
      <h1>Teacher Dashboard</h1>
      <p>Recent quiz submissions.</p>
      {loading ? <p>Loading…</p> : (
        <table className="table">
          <thead>
            <tr><th>Student</th><th>Quiz</th><th>Score</th><th>When</th></tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td>{r.student_id}</td>
                <td>{r.quiz_id}</td>
                <td>{r.score}%</td>
                <td>{new Date(r.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
