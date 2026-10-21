import {
  COURSES,
  PROFESSORS,
  SCHOOLS,
  YEARS,
  type Course,
  type FolderColor,
  type Professor,
  type School,
} from "@/data/catalog";

export type { Course, FolderColor, Professor, School };
export { COURSES, PROFESSORS, SCHOOLS, YEARS };

// ---------- Lookups ----------

export const schoolById = (id: string) => SCHOOLS.find((s) => s.id === id);
export const courseById = (id: string) => COURSES.find((c) => c.id === id);
export const professorById = (id: string) => PROFESSORS.find((p) => p.id === id);

export const coursesOfSchool = (schoolId: string, year?: number) =>
  COURSES.filter((c) => c.schoolId === schoolId && (year === undefined || c.year === year));
export const professorsOfSchool = (schoolId: string) => PROFESSORS.filter((p) => p.schoolId === schoolId);
export const professorsOfCourse = (courseId: string) => PROFESSORS.filter((p) => p.courseIds.includes(courseId));
export const coursesOfProfessor = (p: Professor) =>
  p.courseIds.map(courseById).filter((c): c is Course => Boolean(c));

// ---------- Breadcrumbs ----------

export type Crumb = { label: string; href?: string };

export function schoolTrail(s: School): Crumb[] {
  return [{ label: "Home", href: "/" }, { label: s.short, href: `/schools/${s.id}` }];
}

// ---------- Search ----------

export type SearchResult = {
  kind: "School" | "Course" | "Professor";
  title: string;
  context: string;
  href: string;
};

const normalise = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function searchCatalog(query: string, limit = 50): SearchResult[] {
  const q = normalise(query.trim());
  if (!q) return [];
  const hit = (...fields: string[]) => fields.some((f) => normalise(f).includes(q));
  const results: SearchResult[] = [];

  for (const p of PROFESSORS) {
    if (hit(p.name, p.title)) {
      results.push({ kind: "Professor", title: p.name, context: schoolById(p.schoolId)?.name ?? "", href: `/professors/${p.id}` });
    }
  }
  for (const c of COURSES) {
    if (hit(c.name, c.code)) {
      results.push({ kind: "Course", title: c.name, context: `${c.code} · Year ${c.year} · ${schoolById(c.schoolId)?.short ?? ""}`, href: `/courses/${c.id}` });
    }
  }
  for (const s of SCHOOLS) {
    if (hit(s.name, s.short)) {
      results.push({ kind: "School", title: s.name, context: s.description, href: `/schools/${s.id}` });
    }
  }
  return results.slice(0, limit);
}

// ---------- Review form options ----------

// One option per professor + course pair, in school order. `slug` is the
// professor id so that /app?professor=<id> keeps working.
export const OFFERINGS = SCHOOLS.flatMap((s) =>
  professorsOfSchool(s.id).flatMap((p) =>
    coursesOfProfessor(p).map((c) => ({
      slug: p.id,
      courseId: c.id,
      professor: p.name,
      course: c.name,
    }))
  )
);

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
