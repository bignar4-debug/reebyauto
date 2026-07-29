-- ============================================================
-- REEBY AUTO — SCHEMA (Phase 2)
-- Postgres / Supabase. Source of truth for the app's data model.
-- Run this once in the Supabase SQL Editor (or via the connector).
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE where possible.
-- ============================================================

-- Needed for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ---------- updated_at helper ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- TABLE: vehicles
-- Prices are stored as whole CAD dollars (integer). Mileage in km.
-- body_type is a lowercase slug (used for SVG fallbacks in the UI):
--   coupe | sedan | suv | convertible | hatchback | wagon | truck
-- status: available | reserved | sold  (Disponible | Réservé | Vendu)
-- ============================================================
create table if not exists public.vehicles (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),

  slug           text not null unique,
  make           text not null,           -- marque
  model          text not null,           -- modèle
  year           int  not null,           -- année
  price          int,                     -- prix en $ CAD (entier)
  mileage_km     int,                     -- kilométrage
  body_type      text,                    -- carrosserie (slug ci-dessus)
  transmission   text,                    -- ex: 'automatique', 'manuelle'
  drivetrain     text,                    -- ex: 'AWD', 'RWD', 'FWD'
  fuel           text,                    -- ex: 'essence', 'hybride'
  exterior_color text,
  interior_color text,
  description    text,                    -- français québécois

  status         text not null default 'available'
                 check (status in ('available','reserved','sold')),
  published      boolean not null default false,   -- visible sur le site public
  featured       boolean not null default false,   -- carte vedette
  display_order  int not null default 0            -- ordre d'affichage (asc)
);

drop trigger if exists trg_vehicles_updated_at on public.vehicles;
create trigger trg_vehicles_updated_at
  before update on public.vehicles
  for each row execute function public.set_updated_at();

create index if not exists idx_vehicles_public
  on public.vehicles (published, display_order);

-- ============================================================
-- TABLE: vehicle_photos  (les fichiers arrivent en Phase 6)
-- storage_path = chemin dans le bucket Storage 'vehicle-photos'
-- ============================================================
create table if not exists public.vehicle_photos (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  vehicle_id   uuid not null references public.vehicles(id) on delete cascade,
  storage_path text not null,
  position     int  not null default 0,          -- ordre des photos
  is_primary   boolean not null default false     -- photo principale
);

create index if not exists idx_photos_vehicle
  on public.vehicle_photos (vehicle_id, position);

-- ============================================================
-- ROW LEVEL SECURITY
-- Lecture publique : seulement les véhicules publiés.
-- Écriture : réservée aux utilisateurs authentifiés (l'admin unique, Jonni).
-- ============================================================
alter table public.vehicles       enable row level security;
alter table public.vehicle_photos enable row level security;

-- vehicles : lecture publique des publiés
drop policy if exists "vehicles_public_read" on public.vehicles;
create policy "vehicles_public_read"
  on public.vehicles for select
  to anon, authenticated
  using (published = true);

-- vehicles : accès complet pour l'admin authentifié
drop policy if exists "vehicles_admin_all" on public.vehicles;
create policy "vehicles_admin_all"
  on public.vehicles for all
  to authenticated
  using (true) with check (true);

-- photos : lecture publique si le véhicule est publié
drop policy if exists "photos_public_read" on public.vehicle_photos;
create policy "photos_public_read"
  on public.vehicle_photos for select
  to anon, authenticated
  using (exists (
    select 1 from public.vehicles v
    where v.id = vehicle_photos.vehicle_id and v.published = true
  ));

-- photos : accès complet pour l'admin authentifié
drop policy if exists "photos_admin_all" on public.vehicle_photos;
create policy "photos_admin_all"
  on public.vehicle_photos for all
  to authenticated
  using (true) with check (true);

-- ============================================================
-- STORAGE : bucket public en lecture pour les photos de véhicules.
-- Lecture publique (servi via next/image), écriture réservée à l'admin.
-- ============================================================
insert into storage.buckets (id, name, public)
values ('vehicle-photos', 'vehicle-photos', true)
on conflict (id) do nothing;

drop policy if exists "vehicle_photos_public_read" on storage.objects;
create policy "vehicle_photos_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'vehicle-photos');

drop policy if exists "vehicle_photos_admin_write" on storage.objects;
create policy "vehicle_photos_admin_write"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'vehicle-photos')
  with check (bucket_id = 'vehicle-photos');
