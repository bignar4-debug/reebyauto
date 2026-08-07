import Link from "next/link";
import Hero from "@/components/Hero";
import VehicleCard from "@/components/VehicleCard";
import { supabase } from "@/lib/supabase";
import { getLocale } from "@/lib/getLocale";
import { t } from "@/lib/i18n";

export default async function Accueil() {
  const locale = await getLocale();
  const { data: vehicules } = await supabase
    .from("vehicles")
    .select(
      "slug, make, model, year, price, mileage_km, body_type, status, vehicle_photos(storage_path, is_primary, position)"
    )
    .eq("published", true)
    .order("status", { ascending: true }) // available, reserved, sold
    .order("display_order", { ascending: true });

  return (
    <>
      <Hero locale={locale} />

      <section id="vehicules" className="contenu vehicules">
        <header className="vehicules-tete">
          <div>
            <p className="surtitre">{t(locale, "home.eyebrow")}</p>
            <h2 className="vehicules-titre display">{t(locale, "home.title")}</h2>
          </div>
          <Link href="/inventaire" className="vehicules-lien">
            {t(locale, "home.all")}
          </Link>
        </header>

        {vehicules && vehicules.length > 0 ? (
          <>
            <div className="vehicules-featured">
              <VehicleCard v={vehicules[0]} featured locale={locale} />
            </div>
            {vehicules.length > 1 && (
              <div className="vehicules-grille">
                {vehicules.slice(1).map((v) => (
                  <VehicleCard key={v.slug} v={v} locale={locale} />
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="vehicules-vide">{t(locale, "home.empty")}</p>
        )}
      </section>
    </>
  );
}
