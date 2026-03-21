create table early_access (
  email text primary key,
  status boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table early_access enable row level security;

create policy "Users can read their own early access"
  on early_access for select
  using (auth.email() = email);

create policy "Service role can insert early access"
  on early_access for insert
  with check (true);

create trigger on_early_access_updated
  before update on early_access
  for each row execute procedure public.handle_updated_at();
