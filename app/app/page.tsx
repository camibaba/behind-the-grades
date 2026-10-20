import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OFFERINGS } from "@/lib/catalog";
import ReviewsApp from "@/components/ReviewsApp";

export const metadata = { title: "Write a review · Behind the Grades" };

export default async function AppPage({
  searchParams,
}: {
  searchParams: Promise<{ professor?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // /app?professor=<slug> preselects that professor; anything else falls back to the first one.
  const { professor } = await searchParams;
  const index = OFFERINGS.findIndex((o) => o.slug === professor);

  return (
    <div className="container app-page">
      <ReviewsApp userId={user.id} initialOffering={index === -1 ? 0 : index} />
    </div>
  );
}
