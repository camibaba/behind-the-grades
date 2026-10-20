import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <p className="eyebrow">For IE students</p>
          <h1>Honest course reviews from students who&apos;ve been there.</h1>
          <p className="lead">
            Behind the Grades helps IE students read honest reviews from past students so they
            choose courses and professors with confidence.
          </p>
          <Link href="/signup" className="btn btn-primary btn-lg">Sign up — it&apos;s free</Link>
          <p className="muted small">Already a member? <Link href="/login">Log in</Link></p>
        </div>
      </section>

      <section className="container features">
        <div className="feature card">
          <h2>Read real experiences</h2>
          <p>See what past students say about workload, teaching style and grading before you enroll.</p>
        </div>
        <div className="feature card">
          <h2>Rate in seconds</h2>
          <p>Pick a professor and course, give it stars and write a short review. That&apos;s it.</p>
        </div>
        <div className="feature card">
          <h2>Anonymous by design</h2>
          <p>Reviews never show names or emails, so students can be honest. Only members can read them.</p>
        </div>
      </section>
    </>
  );
}
