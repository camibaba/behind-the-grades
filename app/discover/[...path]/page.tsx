import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import LevelCard from "@/components/LevelCard";
import RatingInline from "@/components/RatingInline";
import SampleBadge from "@/components/SampleBadge";
import {
  coursesOfDegree,
  degreeById,
  degreeHref,
  degreeTrail,
  degreesOfSchool,
  degreesOfUniversity,
  looseDegreesOf,
  professorById,
  professorsOfCourse,
  schoolById,
  schoolsOf,
  universityById,
  type Crumb,
  type Degree,
  type School,
  type University,
} from "@/lib/catalog";
import { getRatingRows, statsFor } from "@/lib/reviews";

type Params = { params: Promise<{ path: string[] }> };

// Works out which level the URL points to. Schools are optional, so
// /discover/[university]/[x] can be either a school or a degree.
function resolve(path: string[]) {
  const [uId, second, third] = path;
  const university = universityById(uId);
  if (!university || path.length > 3) return null;
  if (!second) return { level: "university" as const, university };

  const school = schoolById(second);
  if (school && school.universityId === university.id) {
    if (!third) return { level: "school" as const, university, school };
    const degree = degreeById(third);
    if (degree && degree.schoolId === school.id) return { level: "degree" as const, degree };
    return null;
  }

  const degree = degreeById(second);
  if (degree && degree.universityId === university.id && !third) return { level: "degree" as const, degree };
  return null;
}

export async function generateMetadata({ params }: Params) {
  const { path } = await params;
  const r = resolve(path);
  const name = !r ? "Discover" : r.level === "degree" ? r.degree.name : r.level === "school" ? r.school.name : r.university.name;
  return { title: `${name} · Behind the Grades` };
}

export default async function DiscoverLevel({ params }: Params) {
  const { path } = await params;

  // Old professor links (/discover/[professor]) now live under /professors.
  if (path.length === 1 && professorById(path[0])) redirect(`/professors/${path[0]}`);

  const r = resolve(path);
  if (!r) notFound();

  if (r.level === "degree") {
    // Normalise to the canonical URL if the school segment is missing or extra.
    const canonical = degreeHref(r.degree);
    if (`/discover/${path.join("/")}` !== canonical) redirect(canonical);
    return <DegreeView degree={r.degree} />;
  }
  if (r.level === "school") return <SchoolView university={r.university} school={r.school} />;
  return <UniversityView university={r.university} />;
}

function LevelHeader({ trail, kicker, title, description }: { trail: Crumb[]; kicker: string; title: string; description: string }) {
  return (
    <header className="page-head">
      <Breadcrumbs trail={trail} />
      <div className="page-head-row">
        <p className="kicker">{kicker}</p>
        <SampleBadge />
      </div>
      <h1 className="page-title">{title}</h1>
      <p className="lead">{description}</p>
    </header>
  );
}

function degreeMeta(d: Degree) {
  return `${d.level} · ${d.years} years · ${coursesOfDegree(d.id).length} courses`;
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="empty">{children}</p>;
}

function UniversityView({ university }: { university: University }) {
  const schools = schoolsOf(university.id);
  const loose = looseDegreesOf(university.id);
  const trail = [{ label: "Discover", href: "/" }, { label: university.name }];

  return (
    <div className="container page">
      <LevelHeader trail={trail} kicker={`University · ${university.city}`} title={university.name} description={university.description} />

      {schools.length > 0 && (
        <section className="section-tight" aria-labelledby="schools-title">
          <h2 id="schools-title" className="section-title">Schools</h2>
          <ul className="level-grid">
            {schools.map((s, i) => (
              <LevelCard
                key={s.id}
                index={i}
                href={`/discover/${university.id}/${s.id}`}
                kicker="School"
                title={s.name}
                description={s.description}
                meta={`${degreesOfSchool(s.id).length} degrees`}
              />
            ))}
          </ul>
        </section>
      )}

      {loose.length > 0 && (
        <section className="section-tight" aria-labelledby="degrees-title">
          <h2 id="degrees-title" className="section-title">{schools.length ? "Other degrees" : "Degrees"}</h2>
          <ul className="level-grid">
            {loose.map((d, i) => (
              <LevelCard key={d.id} index={i} href={degreeHref(d)} kicker="Degree" title={d.name} description={d.description} meta={degreeMeta(d)} />
            ))}
          </ul>
        </section>
      )}

      {degreesOfUniversity(university.id).length === 0 && (
        <Empty>No programmes are listed for this university yet.</Empty>
      )}
    </div>
  );
}

function SchoolView({ university, school }: { university: University; school: School }) {
  const list = degreesOfSchool(school.id);
  const trail = [
    { label: "Discover", href: "/" },
    { label: university.name, href: `/discover/${university.id}` },
    { label: school.name },
  ];

  return (
    <div className="container page">
      <LevelHeader trail={trail} kicker={`School · ${university.name}`} title={school.name} description={school.description} />
      <section className="section-tight" aria-labelledby="degrees-title">
        <h2 id="degrees-title" className="section-title">Degrees</h2>
        {list.length === 0 ? (
          <Empty>No degrees are listed for this school yet.</Empty>
        ) : (
          <ul className="level-grid">
            {list.map((d, i) => (
              <LevelCard key={d.id} index={i} href={degreeHref(d)} kicker="Degree" title={d.name} description={d.description} meta={degreeMeta(d)} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

async function DegreeView({ degree }: { degree: Degree }) {
  const list = coursesOfDegree(degree.id);
  const rows = await getRatingRows();
  const university = universityById(degree.universityId);

  // Group by year; courses without a year go last.
  const years = [...new Set(list.map((c) => c.year ?? 0))].sort((a, b) => (a || 99) - (b || 99));

  return (
    <div className="container page">
      <LevelHeader
        trail={degreeTrail(degree)}
        kicker={`${degree.level} · ${university?.name ?? ""}`}
        title={degree.name}
        description={degree.description}
      />

      <section className="section-tight" aria-labelledby="courses-title">
        <h2 id="courses-title" className="section-title">Courses</h2>
        {list.length === 0 ? (
          <Empty>No courses are listed for this degree yet.</Empty>
        ) : (
          years.map((y) => (
            <div key={y} className="year-group">
              <h3 className="year-label">{y ? `Year ${y}` : "Other courses"}</h3>
              <ul className="course-rows">
                {list
                  .filter((c) => (c.year ?? 0) === y)
                  .map((c, i) => {
                    const profs = professorsOfCourse(c.id);
                    return (
                      <li key={c.id} className="course-row reveal" style={{ "--i": i } as React.CSSProperties}>
                        <div className="course-row-main">
                          <span className="course-code">{c.code}</span>
                          <Link href={`/courses/${c.id}?from=${degree.id}`} className="course-row-title">{c.name}</Link>
                          <span className="course-row-profs">
                            {profs.length === 0
                              ? "Professor not listed yet"
                              : profs.map((p, j) => (
                                  <span key={p.id}>
                                    {j > 0 && ", "}
                                    <Link href={`/professors/${p.id}`}>{p.name}</Link>
                                  </span>
                                ))}
                          </span>
                        </div>
                        <div className="course-row-side">
                          {rows ? (
                            <RatingInline stats={statsFor(rows, (r) => r.course === c.name)} />
                          ) : (
                            c.credits && <span className="muted">{c.credits} credits</span>
                          )}
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))
        )}
        {!rows && list.length > 0 && (
          <p className="hint">
            <Link href="/signup">Sign up</Link> to see how students rate each course.
          </p>
        )}
      </section>
    </div>
  );
}
