import Link from "next/link";
import Breadcrumbs from "./Breadcrumbs";

// Placeholder for account pages that ship in a later phase.
export default function ComingSoon({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="container page page-narrow">
      <header className="page-head">
        <Breadcrumbs trail={[{ label: "Account" }, { label: title }]} />
        <h1 className="page-title">{title}</h1>
      </header>
      <div className="empty-block">
        <p className="empty-title">Not available yet</p>
        <p className="muted">{children}</p>
        <Link href="/app" className="btn btn-secondary">Go to Write a review</Link>
      </div>
    </div>
  );
}
