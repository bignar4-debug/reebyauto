import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { allPhotoUrls } from "@/lib/photos";
import { formatPrix, formatKm, carrosserieLabel } from "@/lib/format";
import VehicleGallery from "@/components/VehicleGallery";

export const revalidate = 60;

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

  const photos = allPhotoUrls(v.vehicle_photos);

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
  const descText: string =
    typeof v.description === "string" ? v.description : "";
  const descLignes: string[] = descText
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
        {/* Galerie */}
        <VehicleGallery
          photos={photos}
          alt={`${v.make} ${v.model} ${v.year}`}
          status={v.status}
        />

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
