import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import LockedPreview from "@/components/LockedPreview";
import RatingInline from "@/components/RatingInline";
import ReviewItem from "@/components/ReviewItem";
import SampleBadge from "@/components/SampleBadge";
import { courseById, professorsOfCourse, schoolById, schoolTrail } from "@/lib/catalog";
import { getViewer, statsFor } from "@/lib/reviews";

type Params = { params: Promise<{ course: string }> };

export async function generateMetadata({ params }: Params) {
  const { course } = await params;
  return { title: courseById(course)?.name ?? "Course" };
}

export default async function CoursePage({ params }: Params) {
  const { course: id } = await params;
  const course = courseById(id);
  if (!course) notFound();
  const school = schoolById(course.schoolId)!;
  const teachers = professorsOfCourse(course.id);

  const { supabase, user } = await getViewer();
  const reviews = user
    ? ((
        await supabase
          .from("reviews")
          .select("id, professor, course, rating, semester, body, created_at")
          .eq("course", course.name)
          .order("created_at", { ascending: false })
      ).data ?? [])
    : null;

  return (
    <div className="container page">
      <header className="page-head">
        <Breadcrumbs
          trail={[
            ...schoolTrail(school),
            { label: `Year ${course.year}`, href: `/schools/${school.id}#year-${course.year}` },
            { label: course.name },
          ]}
        />
        <p className="kicker">{course.code} · Year {course.year} · {school.short}</p>
        <h1 className="page-title">{course.name}</h1>
      </header>

      <div className="split">
        <section className={`briefing folder-${school.color}`} aria-labelledby="brief-title">
          <div className="briefing-head">
            <h2 id="brief-title" className="briefing-title">Course information (sample)</h2>
            <SampleBadge />
          </div>
          <p>{course.summary}</p>

          <h3 className="info-h">What it covers</h3>
          <ul className="dash-list">{course.covers.map((x) => <li key={x}>{x}</li>)}</ul>

          <h3 className="info-h">How it is assessed</h3>
          <ul className="weights">
            {course.assessment.map((a) => (
              <li key={a.label}>
                <span>{a.label}</span>
                <span className="weight">{a.weight}%</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="split-main">
          <section aria-labelledby="teach-title">
            <h2 id="teach-title" className="section-label">Who teaches it</h2>
            {teachers.length === 0 ? (
              <p className="empty">No professor is listed for this course yet.</p>
            ) : (
              <ul className="prof-chips">
                {teachers.map((p) => (
                  <li key={p.id}>
                    <Link href={`/professors/${p.id}`} className="prof-chip">
                      <span className="prof-chip-name">{p.name}</span>
                      <span className="prof-chip-title">{p.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-labelledby="student-title" className="section-gap">
            <h2 id="student-title" className="section-label">From student reviews</h2>
            <p className="small muted">Personal opinions of past students, not verified facts.</p>
            {!reviews ? (
              <LockedPreview title="Ratings for this course are for members" rows={3} />
            ) : reviews.length === 0 ? (
              <div className="empty-block">
                <p className="empty-title">No reviews yet</p>
                <p className="muted">Took this course? Help the next students by sharing how it went.</p>
                {teachers[0] && (
                  <Link href={`/app?professor=${teachers[0].id}&course=${course.id}`} className="btn btn-secondary">Write the first review</Link>
                )}
              </div>
            ) : (
              <>
                <p className="rating-line">
                  <RatingInline stats={statsFor(reviews, () => true)} />
                </p>
                <ul className="review-list">
                  {reviews.map((r) => (
                    <ReviewItem key={r.id} review={r} heading={r.professor} />
                  ))}
                </ul>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
