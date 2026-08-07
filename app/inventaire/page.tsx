import type { Metadata } from "next";
import VehicleCard from "@/components/VehicleCard";
import { supabase } from "@/lib/supabase";
import { getLocale } from "@/lib/getLocale";
import { t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Inventaire · Reeby Auto",
  description:
    "Notre sélection de véhicules d'exception, inspectés et jamais accidentés. Grande région de Montréal.",
};

export default async function Inventaire() {
  const locale = await getLocale();
  const { data: vehicules } = await supabase
    .from("vehicles")
    .select(
      "slug, make, model, year, price, mileage_km, body_type, status, vehicle_photos(storage_path, is_primary, position)"
    )
    .eq("published", true)
    .order("display_order", { ascending: true });

  return (
    <div className="contenu page">
      <header className="page-tete">
        <p className="surtitre">{t(locale, "inv.eyebrow")}</p>
        <h1 className="page-titre display">{t(locale, "inv.title")}</h1>
        <p className="page-sous">{t(locale, "inv.sub")}</p>
      </header>

      {vehicules && vehicules.length > 0 ? (
        <div className="vehicules-grille">
          {vehicules.map((v) => (
            <VehicleCard key={v.slug} v={v} locale={locale} />
          ))}
        </div>
      ) : (
        <p className="vehicules-vide">{t(locale, "inv.empty")}</p>
      )}
    </div>
  );
}
