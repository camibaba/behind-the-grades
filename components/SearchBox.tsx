"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { searchCatalog } from "@/lib/catalog";
import Icon from "./Icon";

// Live search over the public catalog. Enter opens the full results page.
export default function SearchBox({
  initial = "",
  autoFocus = false,
  live = true,
}: {
  initial?: string;
  autoFocus?: boolean;
  live?: boolean;
}) {
  const [q, setQ] = useState(initial);
  const router = useRouter();
  const id = useId();
  const results = live ? searchCatalog(q, 6) : [];

  return (
    <div className="searchbox">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
        }}
      >
        <label htmlFor={id} className="sr-only">Search universities, schools, degrees, courses and professors</label>
        <span className="searchbox-field">
          <span className="searchbox-icon"><Icon name="search" /></span>
          <input
            id={id}
            type="search"
            placeholder="Professor, course or degree"
            value={q}
            autoFocus={autoFocus}
            autoComplete="off"
            onChange={(e) => setQ(e.target.value)}
          />
        </span>
        <button type="submit" className="btn btn-dark">Search</button>
      </form>

      {live && q.trim() && (
        <div className="search-results" aria-live="polite">
          {results.length === 0 ? (
            <p className="muted">Nothing matches “{q.trim()}”.</p>
          ) : (
            <ul>
              {results.map((r) => (
                <li key={r.href}>
                  <Link href={r.href}>
                    <span className="result-kind">{r.kind}</span>
                    <span className="result-title">{r.title}</span>
                    <span className="result-context">{r.context}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
