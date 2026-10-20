import {
  courses,
  degrees,
  professors,
  schools,
  universities,
  type Course,
  type Degree,
  type Professor,
  type School,
  type University,
} from "@/data/catalog";

export type { Course, Degree, Professor, School, University };
export { courses, degrees, professors, schools, universities };

// ---------- Lookups ----------

export const universityById = (id: string) => universities.find((u) => u.id === id);
export const schoolById = (id: string) => schools.find((s) => s.id === id);
export const degreeById = (id: string) => degrees.find((d) => d.id === id);
export const courseById = (id: string) => courses.find((c) => c.id === id);
export const professorById = (id: string) => professors.find((p) => p.id === id);

export const schoolsOf = (universityId: string) => schools.filter((s) => s.universityId === universityId);
export const degreesOfSchool = (schoolId: string) => degrees.filter((d) => d.schoolId === schoolId);
// Degrees that sit directly under a university (no school level).
export const looseDegreesOf = (universityId: string) =>
  degrees.filter((d) => d.universityId === universityId && !d.schoolId);
export const degreesOfUniversity = (universityId: string) => degrees.filter((d) => d.universityId === universityId);
export const coursesOfDegree = (degreeId: string) => courses.filter((c) => c.degreeIds.includes(degreeId));
export const professorsOfCourse = (courseId: string) => professors.filter((p) => p.courseIds.includes(courseId));
export const coursesOfProfessor = (p: Professor) =>
  p.courseIds.map(courseById).filter((c): c is Course => Boolean(c));

export function coursesOfUniversity(universityId: string): Course[] {
  const ids = new Set(degreesOfUniversity(universityId).map((d) => d.id));
  return courses.filter((c) => c.degreeIds.some((id) => ids.has(id)));
}

// ---------- URLs ----------

export function degreeHref(d: Degree): string {
  return d.schoolId
    ? `/discover/${d.universityId}/${d.schoolId}/${d.id}`
    : `/discover/${d.universityId}/${d.id}`;
}

// Breadcrumb trail for a degree: Discover > University > (School) > Degree.
export type Crumb = { label: string; href?: string };

export function degreeTrail(d: Degree): Crumb[] {
  const trail: Crumb[] = [{ label: "Discover", href: "/" }];
  const u = universityById(d.universityId);
  if (u) trail.push({ label: u.name, href: `/discover/${u.id}` });
  const s = d.schoolId ? schoolById(d.schoolId) : undefined;
  if (s) trail.push({ label: s.name, href: `/discover/${d.universityId}/${s.id}` });
  trail.push({ label: d.name, href: degreeHref(d) });
  return trail;
}

// Where a course is offered, e.g. "Sample University · School of Business · BBA".
export function placementOf(d: Degree): string {
  const u = universityById(d.universityId);
  const s = d.schoolId ? schoolById(d.schoolId) : undefined;
  return [u?.name, s?.name, d.name].filter(Boolean).join(" · ");
}

// ---------- Search ----------

export type SearchResult = {
  kind: "University" | "School" | "Degree" | "Course" | "Professor";
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

  for (const p of professors) {
    if (hit(p.name, p.title)) {
      results.push({ kind: "Professor", title: p.name, context: coursesOfProfessor(p).map((c) => c.name).join(", "), href: `/professors/${p.id}` });
    }
  }
  for (const c of courses) {
    if (hit(c.name, c.code)) {
      results.push({ kind: "Course", title: c.name, context: c.code, href: `/courses/${c.id}` });
    }
  }
  for (const d of degrees) {
    if (hit(d.name)) {
      results.push({ kind: "Degree", title: d.name, context: universityById(d.universityId)?.name ?? "", href: degreeHref(d) });
    }
  }
  for (const s of schools) {
    if (hit(s.name)) {
      results.push({ kind: "School", title: s.name, context: universityById(s.universityId)?.name ?? "", href: `/discover/${s.universityId}/${s.id}` });
    }
  }
  for (const u of universities) {
    if (hit(u.name, u.city)) {
      results.push({ kind: "University", title: u.name, context: u.city, href: `/discover/${u.id}` });
    }
  }
  return results.slice(0, limit);
}

// ---------- Review form options ----------

// One option per professor + course pair. `slug` is the professor id so that
// /app?professor=<id> keeps working.
export const OFFERINGS = professors.flatMap((p) =>
  coursesOfProfessor(p).map((c) => ({
    slug: p.id,
    courseId: c.id,
    professor: p.name,
    course: c.name,
  }))
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
