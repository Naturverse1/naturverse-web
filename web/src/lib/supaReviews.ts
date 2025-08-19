import { getSupabase } from "@/lib/supabaseClient";

export type Review = {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  body: string;
  helpful_count: number;
  created_at: string;
};

export async function getReviews(
  productId: string,
  opts: { page?: number; size?: number } = {},
) {
  const page = opts.page || 1;
  const size = opts.size || 10;
  const from = (page - 1) * size;
  const to = from + size - 1;
  const supabase = getSupabase();
  if (!supabase) return { data: [], count: 0, error: new Error('Supabase unavailable') };
  const { data, count, error } = await supabase
    .from('products_reviews')
    .select('*', { count: 'exact' })
    .eq('product_id', productId)
    .order('created_at', { ascending: false })
    .order('helpful_count', { ascending: false })
    .range(from, to);
  return { data: (data as Review[]) || [], count: count || 0, error };
}

export async function getReviewSummary(productId: string) {
  const supabase = getSupabase();
  if (!supabase) return { count: 0, avg: 0, dist: [0,0,0,0,0], error: new Error('Supabase unavailable') };
  const { data, error } = await supabase
    .from('products_reviews')
    .select('rating')
    .eq('product_id', productId);
  const dist = [0, 0, 0, 0, 0];
  let sum = 0;
  data?.forEach(r => {
    const rt = (r as any).rating as number;
    dist[rt - 1] += 1;
    sum += rt;
  });
  const count = data ? data.length : 0;
  const avg = count ? sum / count : 0;
  return { count, avg, dist, error };
}

export async function getReviewSummaries(productIds: string[]) {
  if (!productIds.length) return {} as Record<string, { avg: number; count: number }>;
  const supabase = getSupabase();
  if (!supabase) return {} as Record<string, { avg: number; count: number }>;
  const { data } = await supabase
    .from('products_reviews')
    .select('product_id,rating')
    .in('product_id', productIds);
  const map: Record<string, { sum: number; count: number }> = {};
  data?.forEach(r => {
    const id = (r as any).product_id as string;
    const rating = (r as any).rating as number;
    map[id] = map[id] || { sum: 0, count: 0 };
    map[id].sum += rating;
    map[id].count += 1;
  });
  const res: Record<string, { avg: number; count: number }> = {};
  Object.entries(map).forEach(([id, v]) => {
    res[id] = { avg: v.count ? v.sum / v.count : 0, count: v.count };
  });
  return res;
}

export async function getMyReview(productId: string) {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return null;
  const { data } = await supabase
    .from('products_reviews')
    .select('*')
    .eq('product_id', productId)
    .eq('user_id', user.id)
    .maybeSingle();
  return data as Review | null;
}

export async function upsertReview(
  productId: string,
  review: { rating: number; title: string; body: string },
) {
  const supabase = getSupabase();
  if (!supabase) return { error: new Error('Supabase unavailable') };
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return { error: new Error('Not authenticated') };
  const { error } = await supabase.from('products_reviews').upsert({
    product_id: productId,
    user_id: user.id,
    rating: review.rating,
    title: review.title,
    body: review.body,
  });
  return { error };
}

export async function deleteReview(id: string) {
  const supabase = getSupabase();
  if (!supabase) return { error: new Error('Supabase unavailable') };
  const { error } = await supabase.from('products_reviews').delete().eq('id', id);
  return { error };
}

export async function toggleHelpful(reviewId: string) {
  const supabase = getSupabase();
  if (!supabase) return { error: new Error('Supabase unavailable') };
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return { error: new Error('Not authenticated') };
  const { data } = await supabase
    .from('products_review_votes')
    .select('id,is_helpful')
    .eq('review_id', reviewId)
    .eq('user_id', user.id)
    .maybeSingle();
  if (data) {
    if (data.is_helpful) {
      await supabase.from('products_review_votes').delete().eq('id', data.id);
    } else {
      await supabase
        .from('products_review_votes')
        .update({ is_helpful: true })
        .eq('id', data.id);
    }
  } else {
    await supabase.from('products_review_votes').insert({
      review_id: reviewId,
      user_id: user.id,
      is_helpful: true,
    });
  }
  return {};
}

export async function flagReview(id: string) {
  const supabase = getSupabase();
  if (!supabase) return { error: new Error('Supabase unavailable') };
  const { error } = await supabase
    .from('products_reviews')
    .update({ flagged: true })
    .eq('id', id);
  return { error };
}

export type Question = {
  id: string;
  product_id: string;
  user_id: string;
  title: string;
  body: string | null;
  created_at: string;
  products_answers?: Answer[];
};

export type Answer = {
  id: string;
  question_id: string;
  user_id: string;
  body: string;
  helpful_count: number;
  created_at: string;
};

export async function getQuestions(
  productId: string,
  opts: { page?: number; size?: number } = {},
) {
  const page = opts.page || 1;
  const size = opts.size || 10;
  const from = (page - 1) * size;
  const to = from + size - 1;
  const supabase = getSupabase();
  if (!supabase) return { data: [], count: 0, error: new Error('Supabase unavailable') };
  const { data, count, error } = await supabase
    .from('products_questions')
    .select('*, products_answers(*)', { count: 'exact' })
    .eq('product_id', productId)
    .order('created_at', { ascending: false })
    .range(from, to);
  return {
    data: (data as Question[]) || [],
    count: count || 0,
    error,
  };
}

export async function addQuestion(
  productId: string,
  title: string,
  body: string,
) {
  const supabase = getSupabase();
  if (!supabase) return { error: new Error('Supabase unavailable') };
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return { error: new Error('Not authenticated') };
  const { error } = await supabase.from('products_questions').insert({
    product_id: productId,
    user_id: user.id,
    title,
    body,
  });
  return { error };
}

export async function addAnswer(questionId: string, body: string) {
  const supabase = getSupabase();
  if (!supabase) return { error: new Error('Supabase unavailable') };
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return { error: new Error('Not authenticated') };
  const { error } = await supabase.from('products_answers').insert({
    question_id: questionId,
    user_id: user.id,
    body,
  });
  return { error };
}

export async function toggleHelpfulAnswer(answerId: string) {
  const supabase = getSupabase();
  if (!supabase) return { error: new Error('Supabase unavailable') };
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return { error: new Error('Not authenticated') };
  const { data } = await supabase
    .from('products_answer_votes')
    .select('id,is_helpful')
    .eq('answer_id', answerId)
    .eq('user_id', user.id)
    .maybeSingle();
  if (data) {
    if (data.is_helpful) {
      await supabase.from('products_answer_votes').delete().eq('id', data.id);
    } else {
      await supabase
        .from('products_answer_votes')
        .update({ is_helpful: true })
        .eq('id', data.id);
    }
  } else {
    await supabase.from('products_answer_votes').insert({
      answer_id: answerId,
      user_id: user.id,
      is_helpful: true,
    });
  }
  return {};
}

export async function flagAnswer(id: string) {
  const supabase = getSupabase();
  if (!supabase) return { error: new Error('Supabase unavailable') };
  const { error } = await supabase
    .from('products_answers')
    .update({ flagged: true })
    .eq('id', id);
  return { error };
}
