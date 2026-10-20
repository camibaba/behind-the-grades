import Breadcrumbs from "@/components/Breadcrumbs";
import FilterList from "@/components/FilterList";
import RatingInline from "@/components/RatingInline";
import SampleBadge from "@/components/SampleBadge";
import { courses, professorsOfCourse } from "@/lib/catalog";
import { getRatingRows, statsFor } from "@/lib/reviews";

export const metadata = { title: "Courses · Behind the Grades" };

export default async function CoursesPage() {
  const rows = await getRatingRows();
  const sorted = [...courses].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="container page">
      <header className="page-head">
        <Breadcrumbs trail={[{ label: "Discover", href: "/" }, { label: "Courses" }]} />
        <div className="page-head-row">
          <p className="kicker">Catalog</p>
          <SampleBadge />
        </div>
        <h1 className="page-title">Courses</h1>
        <p className="lead">Every course in the catalog, with who teaches it.</p>
      </header>

      <FilterList
        label="Filter by course name, code or professor"
        items={sorted.map((c) => {
          const profs = professorsOfCourse(c.id);
          return {
            href: `/courses/${c.id}`,
            title: c.name,
            kicker: c.code,
            detail: profs.length ? profs.map((p) => p.name).join(", ") : "Professor not listed yet",
            side: rows ? <RatingInline stats={statsFor(rows, (r) => r.course === c.name)} /> : undefined,
          };
        })}
      />
    </div>
  );
}
