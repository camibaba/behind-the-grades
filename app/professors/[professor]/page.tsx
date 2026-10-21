import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import LockedPreview from "@/components/LockedPreview";
import ReviewItem from "@/components/ReviewItem";
import SampleBadge from "@/components/SampleBadge";
import Stars from "@/components/Stars";
import { coursesOfProfessor, professorById, schoolById, schoolTrail } from "@/lib/catalog";
import { FEW_REVIEWS, getViewer, rankProfessors, type RatingRow } from "@/lib/reviews";

type Params = { params: Promise<{ professor: string }> };

export async function generateMetadata({ params }: Params) {
  const { professor } = await params;
  return { title: professorById(professor)?.name ?? "Professor" };
}

export default async function ProfessorPage({ params }: Params) {
  const { professor: id } = await params;
  const professor = professorById(id);
  if (!professor) notFound();
  const school = schoolById(professor.schoolId)!;
  const taught = coursesOfProfessor(professor);

  // Ratings, rank and reviews are only fetched for logged-in users.
  const { supabase, user } = await getViewer();
  let reviews: { id: string; course: string; rating: number; semester: string; body: string }[] | null = null;
  let schoolRank: ReturnType<typeof rankProfessors> | null = null;
  if (user) {
    const [mine, all] = await Promise.all([
      supabase
        .from("reviews")
        .select("id, course, rating, semester, body, created_at")
        .eq("professor", professor.name)
        .order("created_at", { ascending: false }),
      supabase.from("reviews").select("professor, course, rating"),
    ]);
    reviews = mine.data ?? [];
    schoolRank = rankProfessors((all.data ?? []) as RatingRow[], { schoolId: school.id });
  }
  const entry = schoolRank?.ranked.find((r) => r.professor.id === professor.id);
  const rankedCount = schoolRank?.ranked.length ?? 0;

  return (
    <div className="container page">
      <header className="page-head">
        <Breadcrumbs trail={[...schoolTrail(school), { label: professor.name }]} />
        <div className="page-head-row">
          <p className="kicker">{professor.title} · {school.short}</p>
          <SampleBadge />
        </div>
        <h1 className="page-title">{professor.name}</h1>
      </header>

      <div className="split">
        <div className="split-side">
          <section aria-labelledby="bio-title">
            <h2 id="bio-title" className="section-label">Background</h2>
            <p className="bio">{professor.bio}</p>
          </section>

          <section aria-labelledby="teaches-title" className="section-gap">
            <h2 id="teaches-title" className="section-label">Courses taught</h2>
            <ul className="plain-list">
              {taught.map((c) => (
                <li key={c.id}>
                  <Link href={`/courses/${c.id}`} className="strong-link">{c.name}</Link>
                  <span className="small muted">{c.code} · Year {c.year}</span>
                </li>
              ))}
            </ul>
          </section>

          <Link href={`/app?professor=${professor.id}`} className="btn btn-secondary section-gap">
            Write a review
          </Link>
        </div>

        <section className="split-main" aria-labelledby="reviews-title">
          <h2 id="reviews-title" className="section-label">Rating and student reviews</h2>
          {!reviews ? (
            <LockedPreview title="This professor's rating and rank are for members" />
          ) : reviews.length === 0 ? (
            <div className="empty-block">
              <p className="empty-title">No reviews yet</p>
              <p className="muted">
                {professor.name} is not ranked yet. Taken one of their classes? Your review will be the first one here.
              </p>
              <Link href={`/app?professor=${professor.id}`} className="btn btn-secondary">Write the first review</Link>
            </div>
          ) : (
            <>
              <div className="scorecard">
                <div className="score-block">
                  <span className="score-num">{entry!.average.toFixed(1)}</span>
                  <span className="score-meta">
                    <Stars value={entry!.average} />
                    <span>
                      {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                    </span>
                  </span>
                </div>
                <div className="score-block score-rank">
                  <span className="score-num">#{entry!.rank}</span>
                  <span className="score-meta">
                    <span>of {rankedCount} ranked</span>
                    <Link href={`/rankings?school=${school.id}`}>in {school.short}</Link>
                  </span>
                </div>
              </div>
              {reviews.length < FEW_REVIEWS && (
                <p className="few-note"><span className="badge-few">Few reviews yet</span> Treat this rating with care until more students review.</p>
              )}
              <ul className="review-list">
                {reviews.map((r) => (
                  <ReviewItem key={r.id} review={r} heading={r.course} />
                ))}
              </ul>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
