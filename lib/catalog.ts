// Made-up sample professors and courses (not real IE staff).
// `slug` is used in URLs: /discover/[slug] and /app?professor=[slug].
export const OFFERINGS = [
  { slug: "elena-marin", professor: "Prof. Elena Marín", course: "Introduction to Microeconomics" },
  { slug: "david-okafor", professor: "Prof. David Okafor", course: "Data Analytics with Python" },
  { slug: "lucia-herrera", professor: "Prof. Lucía Herrera", course: "International Relations Theory" },
  { slug: "marco-bellini", professor: "Prof. Marco Bellini", course: "Corporate Finance" },
  { slug: "sarah-lindqvist", professor: "Prof. Sarah Lindqvist", course: "Design Thinking & Innovation" },
  { slug: "javier-ortega", professor: "Prof. Javier Ortega", course: "Business Law Fundamentals" },
] as const;

export type Offering = (typeof OFFERINGS)[number];

export function offeringBySlug(slug: string): Offering | undefined {
  return OFFERINGS.find((o) => o.slug === slug);
}

export function averageRating(ratings: number[]): number | null {
  if (ratings.length === 0) return null;
  return ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
}

// Aug–Dec = Fall, Jan–May = Spring, Jun–Jul = Summer.
export function semesterFor(date: Date): string {
  const month = date.getMonth();
  const year = date.getFullYear();
  if (month >= 7) return `Fall ${year}`;
  if (month <= 4) return `Spring ${year}`;
  return `Summer ${year}`;
}

// Current semester first, then the previous few, so older courses can be reviewed too.
export function recentSemesters(count = 6): string[] {
  const result: string[] = [];
  const cursor = new Date();
  while (result.length < count) {
    const s = semesterFor(cursor);
    if (!result.includes(s)) result.push(s);
    cursor.setMonth(cursor.getMonth() - 1);
  }
  return result;
}
