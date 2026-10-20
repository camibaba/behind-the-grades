import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OFFERINGS, averageRating } from "@/lib/catalog";
import DiscoverGrid, { type ProfessorStats } from "@/components/DiscoverGrid";

export const metadata = { title: "Discover · Behind the Grades" };

export default async function DiscoverPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Only the columns needed for the averages.
  const { data, error } = await supabase.from("reviews").select("professor, rating");

  const stats: ProfessorStats[] = OFFERINGS.map((o) => {
    const ratings = (data ?? []).filter((r) => r.professor === o.professor).map((r) => r.rating);
    return { ...o, average: averageRating(ratings), count: ratings.length };
  });

  return (
    <div className="container app-page">
      <h1>Discover professors</h1>
      <p className="muted">See how past students rate each professor and course.</p>
      {error ? (
        <p className="error" role="alert">{error.message}</p>
      ) : (
        <DiscoverGrid professors={stats} />
      )}
    </div>
  );
}
