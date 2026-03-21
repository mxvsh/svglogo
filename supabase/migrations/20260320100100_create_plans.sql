create table plans (
  id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table plans enable row level security;

create policy "Users can read their own plan"
  on plans for select
  using (auth.uid() = id);

create trigger on_plan_updated
  before update on plans
  for each row execute procedure public.handle_updated_at();
