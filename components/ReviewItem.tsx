import Stars from "./Stars";

export type ReviewView = { id: string; rating: number; semester: string; body: string };

// Read-only review card for course and professor pages (no names or emails, ever).
export default function ReviewItem({ review, heading }: { review: ReviewView; heading: string }) {
  return (
    <li className="review">
      <div className="review-head">
        <span className="review-course">{heading}</span>
        <span className="review-meta">
          <Stars value={review.rating} size={14} />
          <span className="tag">{review.semester}</span>
        </span>
      </div>
      <p className="review-body">{review.body}</p>
    </li>
  );
}
