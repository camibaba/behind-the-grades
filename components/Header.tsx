import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./LogoutButton";
import NavLinks from "./NavLinks";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand">
          <span className="brand-mark" aria-hidden="true">★</span> Behind the Grades
        </Link>
        <nav className={`header-nav${user ? " header-nav-user" : ""}`} aria-label="Main">
          {user ? (
            <>
              <NavLinks />
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost">Log in</Link>
              <Link href="/signup" className="btn btn-primary">Sign up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
