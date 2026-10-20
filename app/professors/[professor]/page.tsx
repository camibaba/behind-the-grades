import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import LockedPreview from "@/components/LockedPreview";
import SampleBadge from "@/components/SampleBadge";
import Stars from "@/components/Stars";
import { averageRating, coursesOfProfessor, degreeById, placementOf, professorById } from "@/lib/catalog";
import { getViewer } from "@/lib/reviews";

type Params = { params: Promise<{ professor: string }> };

export async function generateMetadata({ params }: Params) {
  const { professor } = await params;
  return { title: `${professorById(professor)?.name ?? "Professor"} · Behind the Grades` };
}

export default async function ProfessorPage({ params }: Params) {
  const { professor: id } = await params;
  const professor = professorById(id);
  if (!professor) notFound();

  const taught = coursesOfProfessor(professor);
  const { supabase, user } = await getViewer();

  // Reviews are only fetched for logged-in users.
  const reviews = user
    ? ((
        await supabase
          .from("reviews")
          .select("id, course, rating, semester, body, created_at")
          .eq("professor", professor.name)
          .order("created_at", { ascending: false })
      ).data ?? [])
    : null;
  const average = reviews ? averageRating(reviews.map((r) => r.rating)) : null;

  return (
    <div className="container page">
      <header className="page-head">
        <Breadcrumbs trail={[{ label: "Discover", href: "/" }, { label: "Professors", href: "/professors" }, { label: professor.name }]} />
        <div className="page-head-row">
          <p className="kicker">{professor.title}</p>
          <SampleBadge />
        </div>
        <div className="profile-head">
          <h1 className="page-title">{professor.name}</h1>
          <Link href={`/app?professor=${professor.id}`} className="btn btn-primary">Write a review</Link>
        </div>
      </header>

      <div className="split">
        <section aria-labelledby="teaches-title" className="split-side">
          <h2 id="teaches-title" className="section-label">Teaches</h2>
          {taught.length === 0 ? (
            <p className="empty">No courses listed yet.</p>
          ) : (
            <ul className="plain-list">
              {taught.map((c) => (
                <li key={c.id}>
                  <Link href={`/courses/${c.id}`} className="strong-link">{c.name}</Link>
                  <span className="small muted">{c.code}</span>
                  {c.degreeIds.map(degreeById).filter(Boolean).map((d) => (
                    <span key={d!.id} className="small muted">{placementOf(d!)}</span>
                  ))}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="reviews-title" className="split-main">
          <h2 id="reviews-title" className="section-label">From student reviews</h2>
          {!reviews ? (
            <LockedPreview />
          ) : reviews.length === 0 ? (
            <div className="empty-block">
              <p className="empty-title">No reviews yet</p>
              <p className="muted">Taken a class with {professor.name}? Your review will be the first one here.</p>
              <Link href={`/app?professor=${professor.id}`} className="btn btn-secondary">Write the first review</Link>
            </div>
          ) : (
            <>
              <div className="score">
                <span className="score-num">{average!.toFixed(1)}</span>
                <span className="score-meta">
                  <Stars value={average!} />
                  <span className="muted">
                    Average of {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                  </span>
                </span>
              </div>
              <p className="hint">Detailed category breakdowns arrive with structured reviews.</p>
              <ul className="review-list">
                {reviews.map((r) => (
                  <li key={r.id} className="review">
                    <div className="review-head">
                      <span className="review-course">{r.course}</span>
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
