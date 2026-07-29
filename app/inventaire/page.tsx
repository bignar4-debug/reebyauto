import type { Metadata } from "next";
import VehicleCard from "@/components/VehicleCard";
import { supabase } from "@/lib/supabase";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Inventaire · Reeby Auto",
  description:
    "Notre sélection de véhicules d'exception, inspectés et jamais accidentés. Grande région de Montréal.",
};

export default async function Inventaire() {
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
        <p className="surtitre">Inventaire</p>
        <h1 className="page-titre display">Notre inventaire</h1>
        <p className="page-sous">
          Des véhicules d&apos;exception, inspectés et jamais accidentés. Vente
          de particulier : une seule taxe.
        </p>
      </header>

      {vehicules && vehicules.length > 0 ? (
        <div className="vehicules-grille">
          {vehicules.map((v) => (
            <VehicleCard key={v.slug} v={v} />
          ))}
        </div>
      ) : (
        <p className="vehicules-vide">
          Aucun véhicule pour le moment. Revenez bientôt.
        </p>
      )}
    </div>
  );
}
