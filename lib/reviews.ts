import { COURSES, PROFESSORS, averageRating, type Professor } from "./catalog";
import { createClient } from "./supabase/server";

// Server-only helpers. They read reviews only when a user is logged in, so
// logged-out visitors never receive ratings or review content (RLS would refuse anyway).

export type RatingRow = { professor: string; course: string; rating: number };
export type Stats = { average: number | null; count: number };

// Fewer reviews than this and a rating is flagged "Few reviews yet".
export const FEW_REVIEWS = 3;

export async function getViewer() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

// Minimal columns for averages, counts and rankings. Returns null for logged-out visitors.
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

export type Ranked = { professor: Professor; average: number; count: number; rank: number };

// Professors ranked by average rating (ties: more reviews first, then name).
// With `year`, only reviews of that year's courses count. Professors without
// matching reviews are returned separately as `unrated`.
export function rankProfessors(rows: RatingRow[], opts: { schoolId?: string; year?: number } = {}) {
  const yearCourses = opts.year
    ? new Set(COURSES.filter((c) => c.year === opts.year).map((c) => c.name))
    : null;
  const pool = PROFESSORS.filter((p) => {
    if (opts.schoolId && p.schoolId !== opts.schoolId) return false;
    if (opts.year && !COURSES.some((c) => c.year === opts.year && p.courseIds.includes(c.id))) return false;
    return true;
  });

  const scored = pool.map((p) => {
    const s = statsFor(rows, (r) => r.professor === p.name && (!yearCourses || yearCourses.has(r.course)));
    return { professor: p, average: s.average, count: s.count };
  });

  const ranked: Ranked[] = scored
    .filter((x): x is { professor: Professor; average: number; count: number } => x.average !== null)
    .sort((a, b) => b.average - a.average || b.count - a.count || a.professor.name.localeCompare(b.professor.name))
    .map((x, i) => ({ ...x, rank: i + 1 }));
  const unrated = scored.filter((x) => x.average === null).map((x) => x.professor);

  return { ranked, unrated };
}
