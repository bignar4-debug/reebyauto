import Link from "next/link";
import Hero from "@/components/Hero";
import VehicleCard from "@/components/VehicleCard";
import { supabase } from "@/lib/supabase";

// Revalidation 60s des requêtes publiques (contrainte bande passante Supabase).
export const revalidate = 60;

export default async function Accueil() {
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
      <Hero />

      <section id="vehicules" className="contenu vehicules">
        <header className="vehicules-tete">
          <div>
            <p className="surtitre">Inventaire</p>
            <h2 className="vehicules-titre display">Nos véhicules</h2>
          </div>
          <Link href="/inventaire" className="vehicules-lien">
            Tout l&apos;inventaire →
          </Link>
        </header>

        {vehicules && vehicules.length > 0 ? (
          <>
            <div className="vehicules-featured">
              <VehicleCard v={vehicules[0]} featured />
            </div>
            {vehicules.length > 1 && (
              <div className="vehicules-grille">
                {vehicules.slice(1).map((v) => (
                  <VehicleCard key={v.slug} v={v} />
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="vehicules-vide">
            Aucun véhicule pour le moment. Revenez bientôt.
          </p>
        )}
      </section>
    </>
  );
}
