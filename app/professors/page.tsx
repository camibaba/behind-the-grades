import Breadcrumbs from "@/components/Breadcrumbs";
import FilterList from "@/components/FilterList";
import RatingInline from "@/components/RatingInline";
import SampleBadge from "@/components/SampleBadge";
import { coursesOfProfessor, professors } from "@/lib/catalog";
import { getRatingRows, statsFor } from "@/lib/reviews";

export const metadata = { title: "Professors · Behind the Grades" };

export default async function ProfessorsPage() {
  const rows = await getRatingRows();
  const sorted = [...professors].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="container page">
      <header className="page-head">
        <Breadcrumbs trail={[{ label: "Discover", href: "/" }, { label: "Professors" }]} />
        <div className="page-head-row">
          <p className="kicker">Catalog</p>
          <SampleBadge />
        </div>
        <h1 className="page-title">Professors</h1>
        <p className="lead">Fictional sample professors and the courses they teach.</p>
      </header>

      <FilterList
        label="Filter by professor or course"
        items={sorted.map((p) => ({
          href: `/professors/${p.id}`,
          title: p.name,
          kicker: p.title,
          detail: coursesOfProfessor(p).map((c) => c.name).join(", "),
          side: rows ? <RatingInline stats={statsFor(rows, (r) => r.professor === p.name)} /> : undefined,
        }))}
      />
    </div>
  );
}
