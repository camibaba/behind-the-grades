import Link from "next/link";
import { SCHOOLS, coursesOfSchool, professorsOfSchool } from "@/lib/catalog";
import Icon from "./Icon";

// A filing-cabinet stack: one tabbed paper folder per school. Later folders
// overlap earlier ones; hovering lifts a folder so more of it peeks out.
export default function FolderStack() {
  return (
    <ul className="folders">
      {SCHOOLS.map((s, i) => (
        <li key={s.id} className={`folder folder-${s.color}`} style={{ "--i": i } as React.CSSProperties}>
          <Link href={`/schools/${s.id}`} className="folder-link">
            <span className="folder-tab">{s.short}</span>
            <span className="folder-body">
              <span className="folder-name">{s.name}</span>
              <span className="folder-desc">{s.description}</span>
              <span className="folder-meta">
                {coursesOfSchool(s.id).length} courses · {professorsOfSchool(s.id).length} professors
                <Icon name="arrow" size={18} />
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
