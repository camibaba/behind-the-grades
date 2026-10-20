import Link from "next/link";
import Icon from "./Icon";

// Shown to logged-out visitors where review content would be. The shapes are
// placeholders only: no review data is ever sent to a logged-out browser.
export default function LockedPreview({ what = "reviews and summaries" }: { what?: string }) {
  return (
    <div className="locked">
      <div className="locked-ghost" aria-hidden="true">
        <span style={{ width: "82%" }} />
        <span style={{ width: "64%" }} />
        <span style={{ width: "74%" }} />
        <span style={{ width: "48%" }} />
      </div>
      <div className="locked-body">
        <Icon name="lock" size={22} />
        <p className="locked-title">Student {what} are for members</p>
        <p className="muted">Create a free account to read what past students say. Reviews never show names or emails.</p>
        <Link href="/signup" className="btn btn-primary">Sign up to read reviews</Link>
        <p className="small muted">Already a member? <Link href="/login">Log in</Link></p>
      </div>
    </div>
  );
}
