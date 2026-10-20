"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

export const ACCOUNT_LINKS = [
  { href: "/me/reviews", label: "My reviews" },
  { href: "/me/saved", label: "Saved" },
  { href: "/me/account", label: "Account settings" },
];

export function initialOf(email: string) {
  return email.charAt(0).toUpperCase();
}

// Avatar button with a disclosure dropdown. Esc and outside clicks close it.
export default function AccountMenu({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    function onClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    wrapRef.current?.querySelector<HTMLElement>(".account-panel a")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div className="account" ref={wrapRef}>
      <button
        ref={buttonRef}
        type="button"
        className="avatar"
        aria-expanded={open}
        aria-controls="account-panel"
        aria-label="Account menu"
        onClick={() => setOpen((o) => !o)}
      >
        {initialOf(email)}
      </button>

      {open && (
        <div id="account-panel" className="account-panel">
          <p className="account-email">Signed in as<br /><strong>{email}</strong></p>
          <ul>
            {ACCOUNT_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
          <LogoutButton className="account-logout" />
        </div>
      )}
    </div>
  );
}
