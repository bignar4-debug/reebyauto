import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { allPhotoUrls } from "@/lib/photos";
import { formatPrix, formatKm, carrosserieLabel } from "@/lib/format";
import VehicleGallery from "@/components/VehicleGallery";
import { getLocale } from "@/lib/getLocale";
import { t } from "@/lib/i18n";

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
  const locale = await getLocale();
  const v = await getVehicule(slug);
  if (!v) notFound();

  const photos = allPhotoUrls(v.vehicle_photos);
  const na = t(locale, "value.na");

  const specs = [
    [t(locale, "fiche.year"), String(v.year)],
    [t(locale, "fiche.mileage"), formatKm(v.mileage_km, locale)],
    [t(locale, "fiche.body"), carrosserieLabel(v.body_type, locale)],
    [t(locale, "fiche.transmission"), v.transmission ?? na],
    [t(locale, "fiche.drivetrain"), v.drivetrain ?? na],
    [t(locale, "fiche.fuel"), v.fuel ?? na],
    [t(locale, "fiche.ext_color"), v.exterior_color ?? na],
    [t(locale, "fiche.int_color"), v.interior_color ?? na],
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
        {t(locale, "fiche.back")}
      </Link>

      <div className="fiche-grille">
        {/* Galerie */}
        <VehicleGallery
          photos={photos}
          alt={`${v.make} ${v.model} ${v.year}`}
          status={v.status}
          locale={locale}
        />

        {/* Infos */}
        <div className="fiche-infos">
          <p className="surtitre">{carrosserieLabel(v.body_type, locale)}</p>
          <h1 className="fiche-titre">
            {v.make} {v.model}
          </h1>
          <p className="fiche-prix mono">{formatPrix(v.price, locale)}</p>

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
              {t(locale, "fiche.cta")}
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
