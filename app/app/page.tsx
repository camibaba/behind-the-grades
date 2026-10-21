import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OFFERINGS } from "@/lib/catalog";
import ReviewsApp from "@/components/ReviewsApp";

export const metadata = { title: "Write a review" };

export default async function AppPage({
  searchParams,
}: {
  searchParams: Promise<{ professor?: string; course?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // /app?professor=<id>[&course=<id>] preselects that option; anything else falls back to the first one.
  const { professor, course } = await searchParams;
  const exact = OFFERINGS.findIndex((o) => o.slug === professor && o.courseId === course);
  const index = exact !== -1 ? exact : OFFERINGS.findIndex((o) => o.slug === professor);

  return (
    <div className="container page">
      <ReviewsApp userId={user.id} initialOffering={index === -1 ? 0 : index} />
    </div>
  );
}
