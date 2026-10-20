"use client";

import { useState } from "react";
import Link from "next/link";
import Stars from "./Stars";

export type ProfessorStats = {
  slug: string;
  professor: string;
  course: string;
  average: number | null;
  count: number;
};

export default function DiscoverGrid({ professors }: { professors: ProfessorStats[] }) {
  const [search, setSearch] = useState("");

  const q = search.trim().toLowerCase();
  const visible = q
    ? professors.filter(
        (p) => p.professor.toLowerCase().includes(q) || p.course.toLowerCase().includes(q)
      )
    : professors;

  return (
    <>
      <label className="search discover-search">
        <span className="sr-only">Search by professor or course</span>
        <input
          type="search"
          placeholder="Search professor or course…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>

      {visible.length === 0 ? (
        <p className="muted">No professors match your search.</p>
      ) : (
        <ul className="prof-grid">
          {visible.map((p) => (
            <li key={p.slug}>
              <Link href={`/discover/${p.slug}`} className="card prof-card">
                <span className="review-prof">{p.professor}</span>
                <span className="review-course">{p.course}</span>
                <span className="prof-rating">
                  {p.average === null ? (
                    <span className="muted">No reviews yet</span>
                  ) : (
                    <>
                      <Stars value={p.average} />
                      <strong>{p.average.toFixed(1)}</strong>
                      <span className="muted">
                        ({p.count} {p.count === 1 ? "review" : "reviews"})
                      </span>
                    </>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
