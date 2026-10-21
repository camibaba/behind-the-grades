import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import LockedPreview from "@/components/LockedPreview";
import RatingInline from "@/components/RatingInline";
import SampleBadge from "@/components/SampleBadge";
import { SCHOOLS, YEARS, schoolById } from "@/lib/catalog";
import { getRatingRows, rankProfessors } from "@/lib/reviews";

export const metadata = { title: "Professor rankings" };

type Props = { searchParams: Promise<{ school?: string; year?: string }> };

// Filters are plain links, so they work without JavaScript.
function filterHref(school?: string, year?: number) {
  const q = new URLSearchParams();
  if (school) q.set("school", school);
  if (year) q.set("year", String(year));
  const s = q.toString();
  return s ? `/rankings?${s}` : "/rankings";
}

export default async function RankingsPage({ searchParams }: Props) {
  const params = await searchParams;
  const school = params.school && schoolById(params.school) ? params.school : undefined;
  const yearNum = Number(params.year);
  const year = YEARS.includes(yearNum as (typeof YEARS)[number]) ? yearNum : undefined;

  const rows = await getRatingRows();
  const result = rows ? rankProfessors(rows, { schoolId: school, year }) : null;

  return (
    <div className="container page">
      <header className="page-head">
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Rankings" }]} />
        <div className="page-head-row">
          <p className="kicker">Professors ranked by average student rating</p>
          <SampleBadge />
        </div>
        <h1 className="page-title">Rankings</h1>
      </header>

      <div className="filters">
        <div className="filter-group" role="group" aria-labelledby="f-school">
          <span id="f-school" className="filter-label">School</span>
          <Link href={filterHref(undefined, year)} className="pill" aria-current={!school ? "true" : undefined}>All</Link>
          {SCHOOLS.map((s) => (
            <Link key={s.id} href={filterHref(s.id, year)} className="pill" aria-current={school === s.id ? "true" : undefined}>
              {s.short}
            </Link>
          ))}
        </div>
        <div className="filter-group" role="group" aria-labelledby="f-year">
          <span id="f-year" className="filter-label">Year</span>
          <Link href={filterHref(school, undefined)} className="pill" aria-current={!year ? "true" : undefined}>All</Link>
          {YEARS.map((y) => (
            <Link key={y} href={filterHref(school, y)} className="pill" aria-current={year === y ? "true" : undefined}>
              Year {y}
            </Link>
          ))}
        </div>
        {year && <p className="small muted">With a year selected, only reviews of that year&apos;s courses count.</p>}
      </div>

      {!result ? (
        <LockedPreview title="Professor rankings are for members" rows={5} />
      ) : (
        <>
          {result.ranked.length === 0 ? (
            <p className="empty">No reviewed professors match these filters yet.</p>
          ) : (
            <ol className="rank-list">
              {result.ranked.map((r) => (
                <li key={r.professor.id} className="rank-row">
                  <span className="rank-num" aria-label={`Rank ${r.rank}`}>{r.rank}</span>
                  <span className="rank-main">
                    <Link href={`/professors/${r.professor.id}`} className="rank-name">{r.professor.name}</Link>
                    <span className="small muted">{schoolById(r.professor.schoolId)?.short} · {r.professor.title}</span>
                  </span>
                  <span className="rank-side">
                    <RatingInline stats={{ average: r.average, count: r.count }} />
                  </span>
                </li>
              ))}
            </ol>
          )}

          {result.unrated.length > 0 && (
            <section className="section-gap" aria-labelledby="unrated-title">
              <h2 id="unrated-title" className="section-label">Not ranked yet (no reviews)</h2>
              <ul className="prof-chips">
                {result.unrated.map((p) => (
                  <li key={p.id}>
                    <Link href={`/professors/${p.id}`} className="prof-chip">
                      <span className="prof-chip-name">{p.name}</span>
                      <span className="prof-chip-title">{schoolById(p.schoolId)?.short}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}
