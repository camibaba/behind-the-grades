import { averageRating } from "./catalog";
import { createClient } from "./supabase/server";

// Server-only helpers. They read reviews only when a user is logged in, so
// logged-out visitors never receive review content (RLS would refuse anyway).

export type RatingRow = { professor: string; course: string; rating: number };
export type Stats = { average: number | null; count: number };

export async function getViewer() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

// Minimal columns for averages and counts. Returns null for logged-out visitors.
export async function getRatingRows(): Promise<RatingRow[] | null> {
  const { supabase, user } = await getViewer();
  if (!user) return null;
  const { data } = await supabase.from("reviews").select("professor, course, rating");
  return data ?? [];
}

export function statsFor(rows: RatingRow[], match: (r: RatingRow) => boolean): Stats {
  const ratings = rows.filter(match).map((r) => r.rating);
  return { average: averageRating(ratings), count: ratings.length };
}
