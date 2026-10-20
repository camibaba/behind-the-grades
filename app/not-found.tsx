import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container page page-narrow">
      <p className="kicker">404</p>
      <h1 className="page-title">We couldn&apos;t find that page</h1>
      <p className="lead">It may have moved, or the link may be incomplete.</p>
      <div className="row">
        <Link href="/" className="btn btn-primary">Back to Discover</Link>
        <Link href="/search" className="btn btn-secondary">Search the catalog</Link>
      </div>
    </div>
  );
}
