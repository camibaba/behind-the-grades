import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { averageRating, offeringBySlug } from "@/lib/catalog";
import Stars from "@/components/Stars";

export default async function ProfessorPage({
  params,
}: {
  params: Promise<{ professor: string }>;
}) {
  const { professor: slug } = await params;
  const offering = offeringBySlug(slug);
  if (!offering) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("reviews")
    .select("id, course, rating, semester, body, created_at")
    .eq("professor", offering.professor)
    .order("created_at", { ascending: false });

  const reviews = data ?? [];
  const average = averageRating(reviews.map((r) => r.rating));

  return (
    <div className="container app-page">
      <p><Link href="/discover">← All professors</Link></p>

      <section className="card prof-summary">
        <div>
          <h1>{offering.professor}</h1>
          <p className="review-course">{offering.course}</p>
          <p className="prof-rating">
            {average === null ? (
              <span className="muted">No reviews yet</span>
            ) : (
              <>
                <Stars value={average} />
                <strong>{average.toFixed(1)} / 5</strong>
                <span className="muted">
                  ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                </span>
              </>
            )}
          </p>
        </div>
        <Link href={`/app?professor=${offering.slug}`} className="btn btn-primary">
          Write a review
        </Link>
      </section>

      <section className="reviews-section">
        <h2>Reviews</h2>
        {error ? (
          <p className="error" role="alert">{error.message}</p>
        ) : reviews.length === 0 ? (
          <p className="muted">Nobody has reviewed this professor yet. Be the first!</p>
        ) : (
          <ul className="review-list">
            {reviews.map((r) => (
              <li key={r.id} className="card review-card">
                <div className="review-top">
                  <p className="review-course">{r.course}</p>
                  <div className="review-meta">
                    <Stars value={r.rating} />
                    <span className="pill">{r.semester}</span>
                  </div>
                </div>
                <p className="review-body">{r.body}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ professor: string }> }) {
  const { professor } = await params;
  const offering = offeringBySlug(professor);
  return { title: `${offering?.professor ?? "Professor"} · Behind the Grades` };
}
