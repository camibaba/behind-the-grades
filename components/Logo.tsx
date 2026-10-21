import Link from "next/link";
import { StarDoodle } from "./Doodle";

// RANKED wordmark: Space Grotesk Bold with a hand-drawn star.
export default function Logo({ asLink = true }: { asLink?: boolean }) {
  const mark = (
    <>
      <span className="logo-text">RANKED</span>
      <StarDoodle className="logo-star" size={18} />
    </>
  );
  return asLink ? (
    <Link href="/" className="logo" aria-label="RANKED, home">{mark}</Link>
  ) : (
    <span className="logo">{mark}</span>
  );
}
