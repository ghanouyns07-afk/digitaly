-- À coller dans Supabase > SQL Editor > Run
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  price integer not null default 0,
  duration text not null default '1 mois',
  image_url text not null default '',
  available boolean not null default true,
  position bigint generated always as identity,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

-- Tout le monde peut lire le catalogue
create policy "Lecture publique" on public.products
  for select using (true);

-- Seul un utilisateur connecté (toi, l'admin) peut modifier
create policy "Admin modifie" on public.products
  for all to authenticated using (true) with check (true);

insert into public.products (name, description, price, duration, available) values
 ('Canva Pro', 'Crée des designs professionnels avec tous les outils premium.', 1800, '12 mois', true),
 ('ChatGPT Pro', 'Accès prioritaire aux modèles avancés et aux outils premium.', 4200, '1 mois', true),
 ('CapCut Pro', 'Montage vidéo sans limites, effets et exports haute qualité.', 2400, '3 mois', true),
 ('Gemini Pro', 'L''assistant IA de Google avec fonctionnalités avancées.', 3500, '1 mois', false),
 ('Adobe Creative Cloud', 'Photoshop, Illustrator et les outils créatifs essentiels.', 5600, '3 mois', true),
 ('Netflix Premium', 'Films et séries en 4K sur tous tes appareils.', 1500, '1 mois', true);
