import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import SearchBox from "@/components/SearchBox";
import { searchCatalog, type SearchResult } from "@/lib/catalog";

export const metadata = { title: "Search" };

const ORDER: SearchResult["kind"][] = ["Professor", "Course", "School"];

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const results = searchCatalog(q);

  return (
    <div className="container page page-narrow">
      <header className="page-head">
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Search" }]} />
        <h1 className="page-title">Search the catalog</h1>
      </header>

      <SearchBox key={q} initial={q} autoFocus={!q} live={false} />

      {q.trim() && (
        <section className="section-tight" aria-live="polite">
          <p className="muted">
            {results.length} {results.length === 1 ? "result" : "results"} for “{q.trim()}”
          </p>
          {ORDER.map((kind) => {
            const group = results.filter((r) => r.kind === kind);
            if (group.length === 0) return null;
            return (
              <div key={kind} className="result-group">
                <h2 className="section-label">{`${kind}s`}</h2>
                <ul className="course-rows">
                  {group.map((r) => (
                    <li key={r.href} className="course-row">
                      <div className="course-row-main">
                        <Link href={r.href} className="course-row-title">{r.title}</Link>
                        <span className="course-row-profs">{r.context}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          {results.length === 0 && (
            <p className="empty">
              Try a professor&apos;s surname, a course code such as “FIN 210”, or browse{" "}
              <Link href="/courses">all courses</Link>.
            </p>
          )}
        </section>
      )}
    </div>
  );
}
