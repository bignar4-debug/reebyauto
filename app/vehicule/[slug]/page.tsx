import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { carImage } from "@/lib/carImage";
import { primaryPhotoUrl } from "@/lib/photos";
import { formatPrix, formatKm, carrosserieLabel } from "@/lib/format";

export const revalidate = 60;

const STATUTS: Record<string, string> = {
  available: "Disponible",
  reserved: "Réservé",
  sold: "Vendu",
};

async function getVehicule(slug: string) {
  const { data } = await supabase
    .from("vehicles")
    .select("*, vehicle_photos(storage_path, is_primary, position)")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const v = await getVehicule(slug);
  if (!v) return { title: "Véhicule introuvable · Reeby Auto" };
  return {
    title: `${v.make} ${v.model} ${v.year} · Reeby Auto`,
    description: v.description ?? undefined,
  };
}

export default async function FicheVehicule({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const v = await getVehicule(slug);
  if (!v) notFound();

  const img = primaryPhotoUrl(v.vehicle_photos) ?? carImage(v.slug);
  const statut = STATUTS[v.status] ?? v.status;

  const specs = [
    ["Année", String(v.year)],
    ["Kilométrage", formatKm(v.mileage_km)],
    ["Carrosserie", carrosserieLabel(v.body_type)],
    ["Transmission", v.transmission ?? "n/d"],
    ["Rouage", v.drivetrain ?? "n/d"],
    ["Carburant", v.fuel ?? "n/d"],
    ["Couleur extérieure", v.exterior_color ?? "n/d"],
    ["Couleur intérieure", v.interior_color ?? "n/d"],
  ];

  // Description : 1re ligne = phrase d'intro, les suivantes = caractéristiques (rangées).
  const descLignes = (v.description ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const descLead = descLignes[0] ?? null;
  const descPoints = descLignes.slice(1);

  return (
    <div className="contenu page fiche">
      <Link href="/#vehicules" className="fiche-retour">
        ← Retour à l&apos;inventaire
      </Link>

      <div className="fiche-grille">
        {/* Visuel */}
        <div className="fiche-media">
          <span className={`badge badge-${v.status}`}>{statut}</span>
          {img ? (
            <Image
              src={img}
              alt={`${v.make} ${v.model} ${v.year}`}
              fill
              sizes="(max-width: 900px) 100vw, 720px"
              className="fiche-photo"
              priority
            />
          ) : (
            <svg
              className="vcard-silhouette"
              viewBox="0 0 200 90"
              aria-hidden="true"
              fill="none"
            >
              <path
                d="M14 62c8 2 164 2 172 0M22 62c-4 0-8-3-8-8 0-6 10-10 22-14 10-10 22-18 40-20 22-2 40 6 54 18 10 2 42 4 48 10 3 3 2 14-4 14"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="58" cy="64" r="12" stroke="currentColor" strokeWidth="2.2" />
              <circle cx="146" cy="64" r="12" stroke="currentColor" strokeWidth="2.2" />
            </svg>
          )}
        </div>

        {/* Infos */}
        <div className="fiche-infos">
          <p className="surtitre">{carrosserieLabel(v.body_type)}</p>
          <h1 className="fiche-titre">
            {v.make} {v.model}
          </h1>
          <p className="fiche-prix mono">{formatPrix(v.price)}</p>

          {descLead && <p className="fiche-lead">{descLead}</p>}
          {descPoints.length > 0 && (
            <ul className="fiche-points">
              {descPoints.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          )}

          <div className="fiche-actions">
            <Link href="/contact" className="btn btn-primaire">
              Demander de l&apos;information
            </Link>
          </div>
        </div>
      </div>

      {/* Spécifications */}
      <section className="fiche-specs" aria-label="Spécifications">
        <dl className="specs-grille">
          {specs.map(([label, val]) => (
            <div key={label} className="spec">
              <dt className="spec-label">{label}</dt>
              <dd className="spec-val mono">{val}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
