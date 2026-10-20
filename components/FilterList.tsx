"use client";

import { useId, useState } from "react";
import Link from "next/link";

export type FilterItem = {
  href: string;
  title: string;
  kicker: string;
  detail: string;
  side?: React.ReactNode;
};

const normalise = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

// A list with an instant text filter (used by /courses and /professors).
export default function FilterList({ items, label }: { items: FilterItem[]; label: string }) {
  const [q, setQ] = useState("");
  const id = useId();
  const needle = normalise(q.trim());
  const visible = needle
    ? items.filter((i) => normalise(`${i.title} ${i.kicker} ${i.detail}`).includes(needle))
    : items;

  return (
    <>
      <div className="filter">
        <label htmlFor={id} className="field-label">{label}</label>
        <input id={id} type="search" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
        <p className="small muted" aria-live="polite">
          {visible.length} of {items.length} shown
        </p>
      </div>

      {visible.length === 0 ? (
        <p className="empty">Nothing matches “{q.trim()}”.</p>
      ) : (
        <ul className="course-rows">
          {visible.map((item) => (
            <li key={item.href} className="course-row">
              <div className="course-row-main">
                <span className="course-code">{item.kicker}</span>
                <Link href={item.href} className="course-row-title">{item.title}</Link>
                <span className="course-row-profs">{item.detail}</span>
              </div>
              {item.side && <div className="course-row-side">{item.side}</div>}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
