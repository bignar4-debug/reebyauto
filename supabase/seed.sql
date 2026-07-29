-- ============================================================
-- REEBY AUTO — SEED (Phase 2) : 6 véhicules de départ (données provisoires)
-- Véhicules d'exception (sport / luxe), textes en français québécois.
-- Aucune photo pour l'instant (les photos arrivent en Phase 6).
-- Idempotent : on écrase par slug.
-- ============================================================
insert into public.vehicles
  (slug, make, model, year, price, mileage_km, body_type, transmission,
   drivetrain, fuel, exterior_color, interior_color, status, published,
   featured, display_order, description)
values
  ('porsche-911-carrera-s-2021', 'Porsche', '911 Carrera S', 2021, 128900, 24500,
   'coupe', 'automatique (PDK)', 'RWD', 'essence', 'Blanc Carrara', 'Noir',
   'available', true, true, 1,
   'Une 911 Carrera S impeccable, inspectée et jamais accidentée. Entretien complet en concession. Vente de particulier : une seule taxe (TVQ).'),

  ('chevrolet-corvette-stingray-3lt-2023', 'Chevrolet', 'Corvette Stingray 3LT', 2023, 114000, 9800,
   'coupe', 'automatique (DCT)', 'RWD', 'essence', 'Rouge Torch', 'Beige Naturel',
   'available', true, true, 2,
   'Corvette Stingray 3LT quasi neuve, à peine rodée. Groupe Z51 disponible, sonorité exceptionnelle. Inspectée, jamais accidentée.'),

  ('bmw-m4-competition-2022', 'BMW', 'M4 Competition', 2022, 92500, 18900,
   'coupe', 'automatique', 'RWD', 'essence', 'Gris Brooklyn', 'Rouge Kyalami',
   'reserved', true, false, 3,
   'M4 Competition avec ensemble carbone. Réservée — contactez-nous pour être avisé si elle redevient disponible. Inspectée, jamais accidentée.'),

  ('audi-rs5-sportback-2021', 'Audi', 'RS 5 Sportback', 2021, 79900, 39200,
   'hatchback', 'automatique (Tiptronic)', 'AWD', 'essence', 'Noir Mythos', 'Noir/Rouge',
   'available', true, false, 4,
   'RS 5 Sportback en excellent état, traction intégrale quattro idéale pour l''hiver québécois. Historique d''entretien complet. Une seule taxe.'),

  ('mercedes-benz-c43-amg-2020', 'Mercedes-Benz', 'C 43 AMG', 2020, 54900, 61000,
   'sedan', 'automatique (9G-Tronic)', 'AWD', 'essence', 'Argent Iridium', 'Noir',
   'available', true, false, 5,
   'C 43 AMG 4MATIC bien entretenue, V6 biturbo. Confort et performance au quotidien. Inspectée et jamais accidentée. Vente de particulier.'),

  ('range-rover-sport-hse-2019', 'Land Rover', 'Range Rover Sport HSE', 2019, 61500, 72400,
   'suv', 'automatique', 'AWD', 'essence', 'Noir Santorini', 'Ivoire',
   'sold', true, false, 6,
   'Range Rover Sport HSE — VENDU. Exemple récent du type de véhicule que nous proposons. Contactez-nous pour une recherche similaire.')
on conflict (slug) do update set
  make = excluded.make,
  model = excluded.model,
  year = excluded.year,
  price = excluded.price,
  mileage_km = excluded.mileage_km,
  body_type = excluded.body_type,
  transmission = excluded.transmission,
  drivetrain = excluded.drivetrain,
  fuel = excluded.fuel,
  exterior_color = excluded.exterior_color,
  interior_color = excluded.interior_color,
  status = excluded.status,
  published = excluded.published,
  featured = excluded.featured,
  display_order = excluded.display_order,
  description = excluded.description;
