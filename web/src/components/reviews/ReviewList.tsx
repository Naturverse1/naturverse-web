import React, { useEffect, useState } from 'react';
import RatingStars from './RatingStars';
import ReviewForm from './ReviewForm';
import {
  getReviews,
  getMyReview,
  getReviewSummary,
  toggleHelpful,
  deleteReview,
  flagReview,
} from '../../lib/supaReviews';
import { getSupabase } from "@/lib/supabaseClient";

type Props = {
  productId: string;
};

export default function ReviewList({ productId }: Props) {
  const [page, setPage] = useState(1);
  const [reviews, setReviews] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<{ avg: number; count: number; dist: number[] }>({
    avg: 0,
    count: 0,
    dist: [0, 0, 0, 0, 0],
  });
  const [showForm, setShowForm] = useState(false);
  const [myReview, setMyReview] = useState<any | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const pageSize = 10;

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id || null));
  }, []);

  const load = async () => {
    setLoading(true);
    const { data, count } = await getReviews(productId, { page, size: pageSize });
    setReviews(data);
    setCount(count);
    setLoading(false);
    const summary = await getReviewSummary(productId);
    setSummary(summary);
  };

  useEffect(() => {
    load();
    if (userId) getMyReview(productId).then(r => setMyReview(r));
  }, [productId, page, userId]);

  const handleSaved = () => {
    setShowForm(false);
    load();
    if (userId) getMyReview(productId).then(r => setMyReview(r));
  };

  const handleHelpful = async (id: string) => {
    await toggleHelpful(id);
    load();
  };

  const handleDelete = async (id: string) => {
    await deleteReview(id);
    load();
    if (userId) getMyReview(productId).then(r => setMyReview(r));
  };

  const handleFlag = async (id: string) => {
    await flagReview(id);
    alert('Thanks, we\'ll review this.');
  };

  const maxCount = Math.max(...summary.dist, 1);

  return (
    <div>
      <div className="review-summary">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <RatingStars value={summary.avg} size={20} readOnly />
          <strong>{summary.avg.toFixed(1)}</strong>
          <span>({summary.count})</span>
        </div>
        {[5, 4, 3, 2, 1].map(star => (
          <div key={star} className="star-bar">
            <span>{star}</span>
            <div className="bar">
              <div
                className="bar-fill"
                style={{ width: `${(summary.dist[star - 1] / maxCount) * 100}%` }}
              />
            </div>
            <span>{summary.dist[star - 1]}</span>
          </div>
        ))}
        {!myReview && (
          <button onClick={() => setShowForm(true)}>Write a review</button>
        )}
        {myReview && (
          <button onClick={() => setShowForm(true)}>Edit your review</button>
        )}
      </div>
      {showForm && (
        <ReviewForm
          productId={productId}
          existing={myReview}
          onSaved={handleSaved}
        />
      )}
      {loading && <p>Loading...</p>}
      {!loading && !reviews.length && <p>Be the first to review this item.</p>}
      {reviews.map(r => (
        <div key={r.id} className="review-item">
          <RatingStars value={r.rating} readOnly />
          {r.title && <h4>{r.title}</h4>}
          <p>{r.body}</p>
          <div className="review-meta">
            <span>
              {userId === r.user_id ? 'You' : r.user_id.slice(0, 8)} •{' '}
              {new Date(r.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="review-actions">
            <button
              className="helpful-btn"
              onClick={() => handleHelpful(r.id)}
              disabled={!userId}
            >
              Helpful ({r.helpful_count})
            </button>
            <button onClick={() => handleFlag(r.id)}>Report</button>
            {userId === r.user_id && (
              <>
                <button onClick={() => { setShowForm(true); setMyReview(r); }}>Edit</button>
                <button onClick={() => handleDelete(r.id)}>Delete</button>
              </>
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
