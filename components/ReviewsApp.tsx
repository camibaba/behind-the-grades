"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { OFFERINGS, recentSemesters } from "@/lib/catalog";
import { useHydrated } from "@/lib/useHydrated";
import Stars from "./Stars";

type Review = {
  id: string;
  user_id: string;
  professor: string;
  course: string;
  rating: number;
  semester: string;
  body: string;
  created_at: string;
};

const COLUMNS = "id, user_id, professor, course, rating, semester, body, created_at";

export default function ReviewsApp({
  userId,
  initialOffering = 0,
}: {
  userId: string;
  initialOffering?: number;
}) {
  const supabase = useMemo(() => createClient(), []);
  const semesters = useMemo(() => recentSemesters(), []);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state (everything except the text has a valid default).
  const [offering, setOffering] = useState(initialOffering);
  const [rating, setRating] = useState(3);
  const [semester, setSemester] = useState(semesters[0]);
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const hydrated = useHydrated();
  const [justSaved, setJustSaved] = useState(false);

  const [search, setSearch] = useState("");

  // Inline edit state.
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBody, setEditBody] = useState("");
  const [editRating, setEditRating] = useState(3);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("reviews")
        .select(COLUMNS)
        .order("created_at", { ascending: false });
      if (error) setError(error.message);
      else setReviews(data ?? []);
      setLoading(false);
    }
    load();
  }, [supabase]);

  async function handleAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Read the field itself as well as state: text typed before React finished
    // loading the page is in the input but never reached `body`.
    const input = e.currentTarget.elements.namedItem("body") as HTMLInputElement | null;
    const text = (input?.value || body).trim();
    if (!text) return;
    setSaving(true);
    setError(null);
    setJustSaved(false);

    const { professor, course } = OFFERINGS[offering];
    const { data, error } = await supabase
      .from("reviews")
      .insert({ professor, course, rating, semester, body: text })
      .select(COLUMNS)
      .single();

    if (error) setError(error.message);
    else if (data) {
      setReviews((prev) => [data, ...prev]);
      setBody("");
      if (input) input.value = "";
      setJustSaved(true);
    }
    setSaving(false);
  }

  function startEdit(r: Review) {
    setEditingId(r.id);
    setEditBody(r.body);
    setEditRating(r.rating);
  }

  async function saveEdit(id: string) {
    const text = editBody.trim();
    if (!text) return;
    const { data, error } = await supabase
      .from("reviews")
      .update({ body: text, rating: editRating })
      .eq("id", id)
      .select(COLUMNS)
      .single();
    if (error) setError(error.message);
    else if (data) {
      setReviews((prev) => prev.map((r) => (r.id === id ? data : r)));
      setEditingId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this review?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) setError(error.message);
    else setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  const q = search.trim().toLowerCase();
  const visible = q
    ? reviews.filter(
        (r) => r.professor.toLowerCase().includes(q) || r.course.toLowerCase().includes(q)
      )
    : reviews;

  return (
    <div className="write-layout">
      <section className="write-panel" aria-labelledby="write-title">
        <p className="kicker">Share your experience</p>
        <h1 id="write-title" className="page-title">Write a review</h1>
        <p className="muted">Anonymous: other students never see your name or email.</p>

        <form onSubmit={handleAdd} className="review-form">
          <label className="field field-wide">
            <span className="field-label">Professor and course</span>
            <select value={offering} onChange={(e) => setOffering(Number(e.target.value))}>
              {OFFERINGS.map((o, i) => (
                <option key={`${o.slug}-${o.courseId}`} value={i}>
                  {o.professor} — {o.course}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="field-label">Overall rating</span>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} out of 5
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="field-label">Semester</span>
            <select value={semester} onChange={(e) => setSemester(e.target.value)}>
              {semesters.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="field field-wide">
            <span className="field-label">Your review in one line</span>
            <input
              type="text"
              name="body"
              placeholder="e.g. Clear lectures, fair exams, heavy reading"
              maxLength={500}
              required
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
                setJustSaved(false);
              }}
              data-testid="core-input"
            />
          </label>
          <button
            type="submit"
            className="btn btn-primary field-wide"
            disabled={saving || !hydrated}
            data-testid="core-submit"
          >
            {saving ? "Saving…" : "Post review"}
          </button>
        </form>
        {justSaved && <p className="notice" role="status">Thanks. Your review is live.</p>}
        {error && <p className="error" role="alert">{error}</p>}
      </section>

      <section className="reviews-section" aria-labelledby="all-title">
        <div className="reviews-head">
          <h2 id="all-title" className="section-title">Latest reviews</h2>
          <label className="search-inline">
            <span className="sr-only">Search reviews by professor or course</span>
            <input
              type="search"
              placeholder="Filter by professor or course"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </div>

        {loading ? (
          <p className="muted">Loading reviews…</p>
        ) : visible.length === 0 ? (
          <p className="empty">{q ? "No reviews match your search." : "No reviews yet. Be the first."}</p>
        ) : (
          <ul className="review-list">
            {visible.map((r) => {
              const mine = r.user_id === userId;
              const editing = editingId === r.id;
              return (
                <li key={r.id} className="review" data-testid="core-item">
                  <div className="review-head">
                    <div>
                      <p className="review-prof">{r.professor}</p>
                      <p className="review-course">{r.course}</p>
                    </div>
                    <div className="review-meta">
                      <Stars value={editing ? editRating : r.rating} size={14} />
                      <span className="tag">{r.semester}</span>
                    </div>
                  </div>

                  {editing ? (
                    <div className="stack">
                      <label className="field">
                        <span className="field-label">Rating</span>
                        <select value={editRating} onChange={(e) => setEditRating(Number(e.target.value))}>
                          {[5, 4, 3, 2, 1].map((n) => (
                            <option key={n} value={n}>{n} out of 5</option>
                          ))}
                        </select>
                      </label>
                      <label className="field">
                        <span className="field-label">Review</span>
                        <input
                          type="text"
                          maxLength={500}
                          value={editBody}
                          onChange={(e) => setEditBody(e.target.value)}
                        />
                      </label>
                      <div className="row">
                        <button type="button" className="btn btn-primary btn-sm" onClick={() => saveEdit(r.id)}>Save</button>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <p className="review-body">{r.body}</p>
                  )}

                  {mine && !editing && (
                    <div className="review-actions">
                      <span className="tag tag-mine">Your review</span>
                      <button type="button" className="text-btn" onClick={() => startEdit(r)}>Edit</button>
                      <button type="button" className="text-btn text-btn-danger" onClick={() => handleDelete(r.id)}>Delete</button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
