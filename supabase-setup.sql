-- Run this once in your Supabase project:
-- Dashboard → SQL Editor → New query → paste → Run

-- =========================================================
-- Chat messages
-- =========================================================
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

grant select, insert, update, delete on public.chat_messages to authenticated;
grant all on public.chat_messages to service_role;

alter table public.chat_messages enable row level security;

create policy "Users manage their own chat messages"
  on public.chat_messages for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists chat_messages_user_id_created_at_idx
  on public.chat_messages (user_id, created_at);

-- =========================================================
-- Document analyses
-- =========================================================
create table if not exists public.document_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  file_name text not null,
  analysis text not null,
  session_id text,
  created_at timestamptz not null default now()
);

grant select, insert, update, delete on public.document_analyses to authenticated;
grant all on public.document_analyses to service_role;

alter table public.document_analyses enable row level security;

create policy "Users manage their own analyses"
  on public.document_analyses for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists document_analyses_user_id_created_at_idx
  on public.document_analyses (user_id, created_at);
