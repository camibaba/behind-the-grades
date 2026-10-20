import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import LockedPreview from "@/components/LockedPreview";
import SampleBadge from "@/components/SampleBadge";
import Stars from "@/components/Stars";
import {
  averageRating,
  courseById,
  degreeById,
  degreeHref,
  degreeTrail,
  placementOf,
  professorsOfCourse,
  type Crumb,
  type Degree,
} from "@/lib/catalog";
import { getViewer } from "@/lib/reviews";

type Props = {
  params: Promise<{ course: string }>;
  searchParams: Promise<{ from?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { course } = await params;
  return { title: `${courseById(course)?.name ?? "Course"} · Behind the Grades` };
}

export default async function CoursePage({ params, searchParams }: Props) {
  const { course: id } = await params;
  const { from } = await searchParams;
  const course = courseById(id);
  if (!course) notFound();

  const offeredIn = course.degreeIds.map(degreeById).filter((d): d is Degree => Boolean(d));
  // Breadcrumbs follow the degree the student came from, else the first one.
  const context = offeredIn.find((d) => d.id === from) ?? offeredIn[0];
  const trail: Crumb[] = context
    ? [...degreeTrail(context), { label: course.name }]
    : [{ label: "Discover", href: "/" }, { label: "Courses", href: "/courses" }, { label: course.name }];

  const profs = professorsOfCourse(course.id);
  const { supabase, user } = await getViewer();
  const reviews = user
    ? ((
        await supabase
          .from("reviews")
          .select("id, professor, rating, semester, body, created_at")
          .eq("course", course.name)
          .order("created_at", { ascending: false })
      ).data ?? [])
    : null;
  const average = reviews ? averageRating(reviews.map((r) => r.rating)) : null;

  return (
    <div className="container page">
      <header className="page-head">
        <Breadcrumbs trail={trail} />
        <div className="page-head-row">
          <p className="kicker">
            {course.code}
            {course.year ? ` · Year ${course.year}` : ""}
            {course.credits ? ` · ${course.credits} credits` : ""}
          </p>
          <SampleBadge />
        </div>
        <h1 className="page-title">{course.name}</h1>
        <p className="lead">{course.summary}</p>
      </header>

      <div className="split">
        <section className="split-side info-panel" aria-labelledby="info-title">
          <h2 id="info-title" className="section-label">Course information</h2>
          <p className="small muted">From the catalog</p>

          <h3 className="info-h">What it covers</h3>
          <ul className="dash-list">{course.covers.map((x) => <li key={x}>{x}</li>)}</ul>

          <h3 className="info-h">How it is assessed</h3>
          <ul className="weights">
            {course.assessment.map((a) => (
              <li key={a.label}>
                <span>{a.label}</span>
                {a.weight !== undefined && <span className="weight">{a.weight}%</span>}
              </li>
            ))}
          </ul>

          <h3 className="info-h">In class</h3>
          <ul className="dash-list">{course.inClass.map((x) => <li key={x}>{x}</li>)}</ul>

          <h3 className="info-h">Skills developed</h3>
          <ul className="chips">{course.skills.map((x) => <li key={x} className="chip">{x}</li>)}</ul>

          <h3 className="info-h">Taught by</h3>
          {profs.length === 0 ? (
            <p className="muted">Professor not listed yet.</p>
          ) : (
            <ul className="plain-list">
              {profs.map((p) => (
                <li key={p.id}><Link href={`/professors/${p.id}`} className="strong-link">{p.name}</Link></li>
              ))}
            </ul>
          )}

          <h3 className="info-h">Offered in</h3>
          <ul className="plain-list">
            {offeredIn.map((d) => (
              <li key={d.id}><Link href={degreeHref(d)}>{placementOf(d)}</Link></li>
            ))}
          </ul>
        </section>

        <section className="split-main" aria-labelledby="student-title">
          <h2 id="student-title" className="section-label">From student reviews</h2>
          <p className="small muted">Personal opinions of past students, not verified facts.</p>
          {!reviews ? (
            <LockedPreview />
          ) : reviews.length === 0 ? (
            <div className="empty-block">
              <p className="empty-title">No reviews yet</p>
              <p className="muted">Took this course? Help the next students by sharing how it went.</p>
              {profs[0] && (
                <Link href={`/app?professor=${profs[0].id}`} className="btn btn-secondary">Write the first review</Link>
              )}
            </div>
          ) : (
            <>
              <div className="score">
                <span className="score-num">{average!.toFixed(1)}</span>
                <span className="score-meta">
                  <Stars value={average!} />
                  <span className="muted">Average of {reviews.length} {reviews.length === 1 ? "review" : "reviews"}</span>
                </span>
              </div>
              <ul className="review-list">
                {reviews.map((r) => (
                  <li key={r.id} className="review">
                    <div className="review-head">
                      <span className="review-course">{r.professor}</span>
                      <span className="review-meta">
                        <Stars value={r.rating} size={14} />
                        <span className="tag">{r.semester}</span>
                      </span>
                    </div>
                    <p className="review-body">{r.body}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
