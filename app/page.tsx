import Link from "next/link";
import LevelCard from "@/components/LevelCard";
import SampleBadge from "@/components/SampleBadge";
import SearchBox from "@/components/SearchBox";
import {
  coursesOfUniversity,
  degreesOfUniversity,
  professors,
  courses,
  schoolsOf,
  universities,
} from "@/lib/catalog";
import { getViewer } from "@/lib/reviews";

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

export default async function HomePage() {
  const { user } = await getViewer();

  return (
    <>
      <section className="intro">
        <div className="container intro-grid">
          <div className="intro-copy">
            <p className="kicker">For IE students choosing their courses</p>
            <h1 className="display">Know the course before you enrol.</h1>
            <p className="lead">
              Behind the Grades collects structured, honest feedback from students who have taken the
              class: workload, grading, teaching style and what to expect. Choose professors and courses
              with confidence.
            </p>
            <div className="intro-actions">
              {user ? (
                <Link href="/app" className="btn btn-primary btn-lg">Write a review</Link>
              ) : (
                <>
                  <Link href="/signup" className="btn btn-primary btn-lg">Sign up</Link>
                  <span className="muted">
                    Free for students. Already a member? <Link href="/login">Log in</Link>
                  </span>
                </>
              )}
            </div>
          </div>

          <ol className="intro-steps" aria-label="How it works">
            <li>
              <span className="step-num">01</span>
              <span><strong>Explore</strong> universities, schools, degrees, courses and professors.</span>
            </li>
            <li>
              <span className="step-num">02</span>
              <span><strong>Read</strong> structured reviews on clarity, workload, grading and more.</span>
            </li>
            <li>
              <span className="step-num">03</span>
              <span><strong>Share</strong> your own experience. Reviews never show your name.</span>
            </li>
          </ol>
        </div>
      </section>

      <section className="container section" aria-labelledby="explore-title">
        <div className="section-head">
          <div>
            <h2 id="explore-title" className="section-title">Explore the catalog</h2>
            <p className="muted">Start with a university, or search for anything below.</p>
          </div>
          <SampleBadge />
        </div>

        <SearchBox />

        <ul className="level-grid">
          {universities.map((u, i) => {
            const schoolCount = schoolsOf(u.id).length;
            return (
              <LevelCard
                key={u.id}
                index={i}
                href={`/discover/${u.id}`}
                kicker={`University · ${u.city}`}
                title={u.name}
                description={u.description}
                meta={[
                  schoolCount ? plural(schoolCount, "school") : null,
                  plural(degreesOfUniversity(u.id).length, "degree"),
                  plural(coursesOfUniversity(u.id).length, "course"),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              />
            );
          })}
        </ul>

        <div className="browse-all">
          <Link href="/courses" className="browse-link">
            <span className="kicker">Browse</span>
            <span>All {courses.length} courses</span>
          </Link>
          <Link href="/professors" className="browse-link">
            <span className="kicker">Browse</span>
            <span>All {professors.length} professors</span>
          </Link>
        </div>
      </section>
    </>
  );
}
