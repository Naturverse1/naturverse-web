import { getSupabase } from '@/lib/supabase-client';

/** Create a quiz shell (title/metadata); questions inserted separately */
export async function createQuiz(payload: {
  title: string;
  description?: string;
  world_slug?: string | null;
  zone_slug?: string | null;
  difficulty?: 'easy' | 'medium' | 'hard';
  is_published?: boolean;
}) {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('quizzes')
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Fetch quiz with its published questions */
export async function getQuiz(quizId: string) {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data: quiz, error: e1 } = await supabase
    .from('quizzes')
    .select('*')
    .eq('id', quizId)
    .single();
  if (e1) throw e1;

  const { data: questions, error: e2 } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('quiz_id', quizId)
    .eq('is_active', true)
    .order('order_index', { ascending: true });
  if (e2) throw e2;

  return { quiz, questions };
}

/** Record a user's attempt (score out of max_score) */
export async function submitQuizAttempt(input: {
  user_id: string;
  quiz_id: string;
  score: number;
  max_score: number;
  duration_ms?: number;
  detail?: unknown; // optional JSON with per-question results
}) {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('quiz_attempts')
    .insert({
      user_id: input.user_id,
      quiz_id: input.quiz_id,
      score: input.score,
      max_score: input.max_score,
      duration_ms: input.duration_ms ?? null,
      detail: input.detail ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Attempts for a user (newest first) */
export async function getUserQuizAttempts(userId: string) {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('*, quizzes(title)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

/** Simple leaderboard for a quiz (top scores, fastest tiebreak) */
export async function getLeaderboard(quizId: string, limit = 25) {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('user_id, score, max_score, duration_ms, created_at')
    .eq('quiz_id', quizId)
    .order('score', { ascending: false })
    .order('duration_ms', { ascending: true, nullsFirst: true })
    .order('created_at', { ascending: true })
    .limit(limit);
  if (error) throw error;
  return data;
}
