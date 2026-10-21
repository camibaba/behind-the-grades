import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import RatingInline from "@/components/RatingInline";
import SampleBadge from "@/components/SampleBadge";
import {
  YEARS,
  coursesOfSchool,
  professorsOfCourse,
  professorsOfSchool,
  schoolById,
} from "@/lib/catalog";
import { getRatingRows, statsFor } from "@/lib/reviews";

type Params = { params: Promise<{ school: string }> };

export async function generateMetadata({ params }: Params) {
  const { school } = await params;
  return { title: schoolById(school)?.name ?? "School" };
}

export default async function SchoolPage({ params }: Params) {
  const { school: id } = await params;
  const school = schoolById(id);
  if (!school) notFound();

  const rows = await getRatingRows();
  const profs = professorsOfSchool(school.id);

  return (
    <>
      <header className={`school-band folder-${school.color}`}>
        <div className="container">
          <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: school.short }]} />
          <div className="page-head-row">
            <p className="kicker">School</p>
            <SampleBadge />
          </div>
          <h1 className="page-title">{school.name}</h1>
          <p className="lead">{school.description}</p>
        </div>
      </header>

      <div className="container page">
        <nav className="year-tabs" aria-label="Jump to year">
          {YEARS.map((y) => (
            <a key={y} href={`#year-${y}`} className="year-tab">Year {y}</a>
          ))}
          <Link href={`/rankings?school=${school.id}`} className="year-tab year-tab-rank">Rankings for this school</Link>
        </nav>

        {YEARS.map((y) => {
          const list = coursesOfSchool(school.id, y);
          return (
            <section key={y} id={`year-${y}`} className="year-section" aria-labelledby={`year-${y}-title`}>
              <h2 id={`year-${y}-title`} className="year-title">Year {y}</h2>
              {list.length === 0 ? (
                <p className="empty">No courses listed for Year {y} yet.</p>
              ) : (
                <ul className="course-rows">
                  {list.map((c) => {
                    const teachers = professorsOfCourse(c.id);
                    return (
                      <li key={c.id} className="course-row">
                        <div className="course-row-main">
                          <span className="course-code">{c.code}</span>
                          <Link href={`/courses/${c.id}`} className="course-row-title">{c.name}</Link>
                          <span className="course-row-profs">
                            {teachers.length === 0
                              ? "Professor not listed yet"
                              : teachers.map((p, j) => (
                                  <span key={p.id}>
                                    {j > 0 && ", "}
                                    <Link href={`/professors/${p.id}`}>{p.name}</Link>
                                  </span>
                                ))}
                          </span>
                        </div>
                        {rows && (
                          <div className="course-row-side">
                            <RatingInline stats={statsFor(rows, (r) => r.course === c.name)} />
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          );
        })}

        <section className="year-section" aria-labelledby="profs-title">
          <h2 id="profs-title" className="year-title">Professors</h2>
          {profs.length === 0 ? (
            <p className="empty">No professors listed for this school yet.</p>
          ) : (
            <ul className="prof-chips">
              {profs.map((p) => (
                <li key={p.id}>
                  <Link href={`/professors/${p.id}`} className="prof-chip">
                    <span className="prof-chip-name">{p.name}</span>
                    <span className="prof-chip-title">{p.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {!rows && (
            <p className="hint">
              <Link href="/signup">Sign up</Link> to see ratings and rankings for this school.
            </p>
          )}
        </section>
      </div>
    </>
  );
}
