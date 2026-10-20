"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { OFFERINGS, recentSemesters } from "@/lib/catalog";
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

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    const text = body.trim();
    if (!text) return;
    setSaving(true);
    setError(null);

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
    <>
      <section className="card">
        <h1>Write a review</h1>
        <form onSubmit={handleAdd} className="review-form">
          <label className="field field-wide">
            <span>Professor &amp; course</span>
            <select value={offering} onChange={(e) => setOffering(Number(e.target.value))}>
              {OFFERINGS.map((o, i) => (
                <option key={i} value={i}>
                  {o.professor} — {o.course}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Rating</span>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {"★".repeat(n)} ({n})
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Semester</span>
            <select value={semester} onChange={(e) => setSemester(e.target.value)}>
              {semesters.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="field field-wide">
            <span>Your review</span>
            <input
              type="text"
              placeholder="e.g. Clear lectures, fair exams, heavy reading"
              maxLength={500}
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              data-testid="core-input"
            />
          </label>
          <button
            type="submit"
            className="btn btn-primary field-wide"
            disabled={saving}
            data-testid="core-submit"
          >
            {saving ? "Saving…" : "Post review"}
          </button>
        </form>
        {error && <p className="error" role="alert">{error}</p>}
      </section>

      <section className="reviews-section">
        <div className="reviews-head">
          <h2>All reviews</h2>
          <label className="search">
            <span className="sr-only">Search by professor or course</span>
            <input
              type="search"
              placeholder="Search professor or course…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </div>

        {loading ? (
          <p className="muted">Loading reviews…</p>
        ) : visible.length === 0 ? (
          <p className="muted">{q ? "No reviews match your search." : "No reviews yet. Be the first!"}</p>
        ) : (
          <ul className="review-list">
            {visible.map((r) => {
              const mine = r.user_id === userId;
              const editing = editingId === r.id;
              return (
                <li key={r.id} className="card review-card" data-testid="core-item">
                  <div className="review-top">
                    <div>
                      <p className="review-prof">{r.professor}</p>
                      <p className="review-course">{r.course}</p>
                    </div>
                    <div className="review-meta">
                      <Stars value={editing ? editRating : r.rating} />
                      <span className="pill">{r.semester}</span>
                    </div>
                  </div>

                  {editing ? (
                    <div className="stack">
                      <label className="field">
                        <span>Rating</span>
                        <select value={editRating} onChange={(e) => setEditRating(Number(e.target.value))}>
                          {[5, 4, 3, 2, 1].map((n) => (
                            <option key={n} value={n}>{n}</option>
                          ))}
                        </select>
                      </label>
                      <label className="field">
                        <span>Review</span>
                        <input
                          type="text"
                          maxLength={500}
                          value={editBody}
                          onChange={(e) => setEditBody(e.target.value)}
                        />
                      </label>
                      <div className="row">
                        <button type="button" className="btn btn-primary" onClick={() => saveEdit(r.id)}>Save</button>
                        <button type="button" className="btn btn-ghost" onClick={() => setEditingId(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <p className="review-body">{r.body}</p>
                  )}

                  {mine && !editing && (
                    <div className="row review-actions">
                      <span className="pill pill-mine">Your review</span>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => startEdit(r)}>Edit</button>
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id)}>Delete</button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
