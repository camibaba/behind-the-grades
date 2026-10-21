import { FEW_REVIEWS, type Stats } from "@/lib/reviews";
import Stars from "./Stars";

// "★★★★☆ 4.2 · 12 reviews", flagged when there are few reviews. Only rendered for logged-in users.
export default function RatingInline({ stats }: { stats: Stats }) {
  if (stats.average === null) return <span className="muted">No reviews yet</span>;
  return (
    <span className="rating-inline">
      <Stars value={stats.average} size={14} />
      <strong>{stats.average.toFixed(1)}</strong>
      <span className="muted">
        ({stats.count} {stats.count === 1 ? "review" : "reviews"})
      </span>
      {stats.count < FEW_REVIEWS && <span className="badge-few">Few reviews yet</span>}
    </span>
  );
}
