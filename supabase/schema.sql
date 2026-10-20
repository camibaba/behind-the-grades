-- Behind the Grades: reviews table with Row Level Security.
-- Paste into Supabase Dashboard > SQL Editor > New query, then click "Run".

create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  professor   text not null check (char_length(professor) between 1 and 120),
  course      text not null check (char_length(course) between 1 and 120),
  rating      smallint not null default 3 check (rating between 1 and 5),
  semester    text not null check (char_length(semester) between 1 and 40),
  body        text not null check (char_length(trim(body)) between 1 and 1000),
  created_at  timestamptz not null default now()
);

create index if not exists reviews_created_at_idx on public.reviews (created_at desc);

alter table public.reviews enable row level security;

-- Logged-out visitors (anon role) get nothing.
revoke all on public.reviews from anon;
grant select, insert, update, delete on public.reviews to authenticated;

-- Any logged-in user can read every review.
drop policy if exists "Logged-in users can read reviews" on public.reviews;
create policy "Logged-in users can read reviews"
  on public.reviews for select
  to authenticated
  using (auth.uid() is not null);

-- Users can only create reviews as themselves.
drop policy if exists "Users can insert their own reviews" on public.reviews;
create policy "Users can insert their own reviews"
  on public.reviews for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Users can only edit their own reviews.
drop policy if exists "Users can update their own reviews" on public.reviews;
create policy "Users can update their own reviews"
  on public.reviews for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Users can only delete their own reviews.
drop policy if exists "Users can delete their own reviews" on public.reviews;
create policy "Users can delete their own reviews"
  on public.reviews for delete
  to authenticated
  using (auth.uid() = user_id);
