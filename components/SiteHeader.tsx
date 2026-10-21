"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AccountMenu from "./AccountMenu";
import LogoutButton from "./LogoutButton";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import { NAV } from "@/lib/nav";

export default function SiteHeader({ email }: { email: string | null }) {
  const pathname = usePathname();
  const loggedIn = email !== null;
  // The landing page has its own sign-up button; the contract wants only one there.
  const showSignup = !loggedIn && pathname !== "/";

  return (
    <header className="site-header">
      <a href="#main" className="skip-link">Skip to content</a>
      <div className="container header-inner">
        <Logo />

        <nav className="main-nav" aria-label="Main">
          {NAV.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link${active ? " is-active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="header-actions">
          {loggedIn ? (
            <>
              <Link href="/app" className="btn btn-primary btn-sm header-write" aria-label="Write a review">
                <span className="label-long">Write a review</span>
                <span className="label-short">Review</span>
              </Link>
              <AccountMenu email={email} />
              <LogoutButton primary className="logout-discreet" />
            </>
          ) : (
            <>
              <Link href="/login" className="nav-link nav-login">Log in</Link>
            </>
          )}

          <MobileMenu email={email} showSignup={showSignup} />
        </div>
      </div>
    </header>
  );
}
