import React, { useEffect, useState } from 'react';
import QuestionForm from './QuestionForm';
import {
  getQuestions,
  addAnswer,
  toggleHelpfulAnswer,
  flagAnswer,
} from '../../lib/supaReviews';
import { getSupabase, SafeSupabase } from "@/lib/supabaseClient";

type Props = {
  productId: string;
};

type AnswerFormProps = {
  questionId: string;
  onSaved: () => void;
};

function AnswerForm({ questionId, onSaved }: AnswerFormProps) {
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body) return;
    setSaving(true);
    await addAnswer(questionId, body);
    setSaving(false);
    setBody('');
    onSaved();
  };
  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: '0.5rem' }}>
      <textarea
        value={body}
        onChange={e => setBody(e.target.value)}
        rows={3}
        required
        maxLength={2000}
      />
      <button type="submit" disabled={saving}>
        Answer
      </button>
    </form>
  );
}

export default function QAList({ productId }: Props) {
  const [page, setPage] = useState(1);
  const [questions, setQuestions] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const pageSize = 10;

  useEffect(() => {
    const supabase = getSupabase() ?? (SafeSupabase as any);
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id || null));
  }, []);

  const load = async () => {
    setLoading(true);
    const { data, count } = await getQuestions(productId, { page, size: pageSize });
    setQuestions(data);
    setCount(count);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [productId, page]);

  const handleHelpful = async (id: string) => {
    await toggleHelpfulAnswer(id);
    load();
  };

  const handleFlag = async (id: string) => {
    await flagAnswer(id);
    alert('Thanks, we\'ll review this.');
  };

  return (
    <div>
      {!showForm && (
        <button onClick={() => setShowForm(true)}>Ask a question</button>
      )}
      {showForm && (
        <QuestionForm productId={productId} onSaved={() => { setShowForm(false); load(); }} />
      )}
      {loading && <p>Loading...</p>}
      {!loading && !questions.length && (
        <p>No questions yet. Ask about sizing, materials, or shipping.</p>
      )}
      {questions.map(q => (
        <div key={q.id} className="qa-item">
          <h4>{q.title}</h4>
          {q.body && <p>{q.body}</p>}
          <div className="qa-meta">
            <span>{new Date(q.created_at).toLocaleDateString()}</span>
          </div>
          <div className="qa-answers">
            {q.products_answers?.map((a: any) => (
              <div key={a.id} className="qa-answer">
                <p>{a.body}</p>
                <div className="qa-answer-actions">
                  <button
                    className="helpful-btn"
                    onClick={() => handleHelpful(a.id)}
                    disabled={!userId}
                  >
                    Helpful ({a.helpful_count})
                  </button>
                  <button onClick={() => handleFlag(a.id)}>Report</button>
                </div>
              </div>
            ))}
            {userId && (
              <AnswerForm questionId={q.id} onSaved={load} />
            )}
          </div>
        </div>
      ))}
      {count > pageSize && (
        <div className="pager">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
            Prev
          </button>
          <button
            disabled={page >= Math.ceil(count / pageSize)}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
