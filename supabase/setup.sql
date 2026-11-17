-- WebBuilder Studio: tabla de proyectos. Pegalo en Supabase → SQL Editor → Run.
create table if not exists public.projects (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  id      text not null,
  meta    jsonb not null,
  data    jsonb not null,
  updated bigint not null default 0,
  primary key (user_id, id)
);

-- Seguridad: cada usuario solo puede ver y modificar sus propios proyectos.
alter table public.projects enable row level security;
drop policy if exists "ver los propios"      on public.projects;
drop policy if exists "crear los propios"    on public.projects;
drop policy if exists "editar los propios"   on public.projects;
drop policy if exists "borrar los propios"   on public.projects;
create policy "ver los propios"    on public.projects for select using (auth.uid() = user_id);
create policy "crear los propios"  on public.projects for insert with check (auth.uid() = user_id);
create policy "editar los propios" on public.projects for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "borrar los propios" on public.projects for delete using (auth.uid() = user_id);
