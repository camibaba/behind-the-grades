import type { Stats } from "@/lib/reviews";
import Stars from "./Stars";

// "★★★★☆ 4.2 · 12 reviews", or a quiet empty state. Only rendered for logged-in users.
export default function RatingInline({ stats }: { stats: Stats }) {
  if (stats.average === null) return <span className="muted">No reviews yet</span>;
  return (
    <span className="rating-inline">
      <Stars value={stats.average} size={14} />
      <strong>{stats.average.toFixed(1)}</strong>
      <span className="muted">
        · {stats.count} {stats.count === 1 ? "review" : "reviews"}
      </span>
    </span>
  );
}
