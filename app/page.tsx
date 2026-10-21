import Link from "next/link";
import { ArrowDoodle, StarDoodle, UnderlineDoodle } from "@/components/Doodle";
import FolderStack from "@/components/FolderStack";
import SampleBadge from "@/components/SampleBadge";
import { getViewer } from "@/lib/reviews";

export default async function HomePage() {
  const { user } = await getViewer();

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <h1 className="hero-title">
            Know your{" "}
            <span className="underlined">
              professors
              <UnderlineDoodle />
            </span>{" "}
            before you enroll.
          </h1>
          <p className="hero-sub">
            RANKED is where IE University students rank professors and share honest reviews of their
            classes, school by school.
          </p>
          <div className="hero-cta">
            {/* The one primary button. Logged out it is the sign-up button. */}
            <Link href={user ? "#schools" : "/signup"} className="btn btn-primary btn-lg">
              {user ? "Get to know your professors" : "Sign up: get to know your professors"}
            </Link>
            <p className="hero-note">
              {user ? (
                "Pick a school below to start."
              ) : (
                <>Free sign-up with your email. Already a member? <Link href="/login">Log in</Link></>
              )}
            </p>
          </div>
          <ArrowDoodle className="hero-arrow" />
        </div>
      </section>

      <section id="schools" className="container schools" aria-labelledby="schools-title">
        <div className="schools-head">
          <h2 id="schools-title" className="section-title">
            Pick a school <StarDoodle size={20} />
          </h2>
          <SampleBadge />
        </div>
        <p className="muted schools-intro">
          Each folder holds a school&apos;s courses by year and the professors who teach them.
        </p>
        <FolderStack />
      </section>
    </>
  );
}
