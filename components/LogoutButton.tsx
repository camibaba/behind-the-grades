"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

// `primary` marks the always-visible header button that carries data-testid="logout".
// The copy inside the account menu must not repeat the test id.
export default function LogoutButton({
  primary = false,
  className = "",
}: {
  primary?: boolean;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);

  async function handleLogout() {
    setBusy(true);
    await createClient().auth.signOut();
    window.location.assign("/");
  }

  return (
    <button
      type="button"
      data-testid={primary ? "logout" : undefined}
      className={className}
      onClick={handleLogout}
      disabled={busy}
    >
      {busy ? "Logging out…" : "Log out"}
    </button>
  );
}
