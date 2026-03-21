create table collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  logo jsonb not null,
  saved_at timestamptz not null default now()
);

create index collections_user_id_idx on collections(user_id, saved_at desc);

-- RLS
alter table collections enable row level security;

create policy "Users can read their own collections"
  on collections for select
  using (auth.uid() = user_id);

create policy "Users can insert their own collections"
  on collections for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own collections"
  on collections for delete
  using (auth.uid() = user_id);
