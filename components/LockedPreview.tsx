import Link from "next/link";
import Icon from "./Icon";

// Shown to logged-out visitors where ratings, rankings or reviews would be.
// The rows are placeholders only: no review data is ever sent to a logged-out browser.
export default function LockedPreview({
  title = "Ratings and reviews are for members",
  rows = 4,
}: {
  title?: string;
  rows?: number;
}) {
  return (
    <div className="locked">
      <div className="locked-ghost" aria-hidden="true">
        {Array.from({ length: rows }, (_, i) => (
          <span key={i} className="ghost-row">
            <span className="ghost-num">{i + 1}</span>
            <span className="ghost-bar" style={{ width: `${78 - i * 11}%` }} />
          </span>
        ))}
      </div>
      <div className="locked-body">
        <Icon name="lock" size={22} />
        <p className="locked-title">{title}</p>
        <p className="muted">Create a free account to see how students rate each professor. Reviews never show names or emails.</p>
        <Link href="/signup" className="btn btn-primary">Sign up to see rankings</Link>
        <p className="small muted">Already a member? <Link href="/login">Log in</Link></p>
      </div>
    </div>
  );
}
