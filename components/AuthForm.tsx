"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Mode = "signup" | "login";

export default function AuthForm({ mode }: { mode: Mode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const isSignup = mode === "signup";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    // Read the fields directly too: values typed before React finished loading
    // the page are in the inputs but never reached state.
    const form = new FormData(e.currentTarget);
    const creds = {
      email: String(form.get("email") || email),
      password: String(form.get("password") || password),
    };

    const supabase = createClient();
    const { data, error } = isSignup
      ? await supabase.auth.signUp(creds)
      : await supabase.auth.signInWithPassword(creds);

    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }

    if (!data.session) {
      // Only happens if "Confirm email" is still enabled in Supabase.
      setError("Account created, but email confirmation is enabled in Supabase. Disable it so users can log in right away.");
      setBusy(false);
      return;
    }

    window.location.assign("/app");
  }

  return (
    <div className="auth-layout">
      <div className="auth-aside">
        <p className="kicker">RANKED</p>
        <h1 className="page-title">{isSignup ? "Create your account" : "Welcome back"}</h1>
        <p className="lead">
          {isSignup
            ? "Read structured reviews from past students and share your own. It takes less than a minute."
            : "Log in to read reviews and share your experience."}
        </p>
        <ul className="dash-list auth-points">
          <li>Reviews never show names or emails</li>
          <li>Only members can read reviews</li>
        </ul>
      </div>

      <div className="auth-panel">
        <form onSubmit={handleSubmit} className="stack">
          <label className="field">
            <span className="field-label">Email</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid={`${mode}-email`}
            />
          </label>
          <label className="field">
            <span className="field-label">Password</span>
            <input
              type="password"
              name="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid={`${mode}-password`}
            />
            {isSignup && <small className="muted">At least 6 characters.</small>}
          </label>

          {error && <p className="error" role="alert">{error}</p>}

          <button type="submit" className="btn btn-primary btn-block" disabled={busy} data-testid={`${mode}-submit`}>
            {busy ? "Please wait…" : isSignup ? "Sign up" : "Log in"}
          </button>
        </form>

        <p className="small muted auth-switch">
          {isSignup ? (
            <>Already have an account? <Link href="/login">Log in</Link></>
          ) : (
            <>New here? <Link href="/signup">Create an account</Link></>
          )}
        </p>
      </div>
    </div>
  );
}
