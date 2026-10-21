"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ACCOUNT_LINKS, initialOf } from "./AccountMenu";
import Icon from "./Icon";
import Logo from "./Logo";
import LogoutButton from "./LogoutButton";
import { NAV } from "@/lib/nav";

// Bottom sheet for small screens, built on <dialog> for focus trapping and Esc to close.
export default function MobileMenu({ email, showSignup }: { email: string | null; showSignup: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    ref.current?.close();
  }, [pathname]);

  const close = () => ref.current?.close();

  return (
    <>
      <button
        type="button"
        className={email ? "avatar mobile-trigger" : "icon-btn mobile-trigger"}
        aria-label="Open menu"
        aria-haspopup="dialog"
        onClick={() => ref.current?.showModal()}
      >
        {email ? initialOf(email) : <Icon name="menu" />}
      </button>

      <dialog
        ref={ref}
        className="sheet"
        aria-label="Menu"
        onClick={(e) => {
          // Clicking the backdrop (the dialog element itself) closes the sheet.
          if (e.target === e.currentTarget) close();
        }}
      >
        <div className="sheet-inner">
          <div className="sheet-head">
            <Logo asLink={false} />
            <button type="button" className="icon-btn" aria-label="Close menu" onClick={close}>
              <Icon name="close" />
            </button>
          </div>

          <nav aria-label="Mobile">
            <ul className="sheet-list">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} aria-current={item.match(pathname) ? "page" : undefined} onClick={close}>
                    {item.label}
                  </Link>
                </li>
              ))}
              {email && (
                <li>
                  <Link href="/app" aria-current={pathname === "/app" ? "page" : undefined} onClick={close}>Write a review</Link>
                </li>
              )}
            </ul>
          </nav>

          {email ? (
            <>
              <p className="sheet-label">Signed in as {email}</p>
              <ul className="sheet-list">
                {ACCOUNT_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} onClick={close}>{l.label}</Link>
                  </li>
                ))}
              </ul>
              <LogoutButton className="account-logout" />
            </>
          ) : (
            <div className="sheet-auth">
              <Link href="/login" className="btn btn-secondary" onClick={close}>Log in</Link>
              {showSignup && <Link href="/signup" className="btn btn-primary" onClick={close}>Sign up</Link>}
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
