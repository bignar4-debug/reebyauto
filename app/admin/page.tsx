import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { ADMIN_USER_ID } from "@/lib/admin";
import SignOutButton from "@/components/admin/SignOutButton";
import { formatPrix, formatKm } from "@/lib/format";

export const metadata: Metadata = {
  title: "Admin · Reeby Auto",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const STATUTS: Record<string, string> = {
  available: "Disponible",
  reserved: "Réservé",
  sold: "Vendu",
};

export default async function AdminDashboard() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.id !== ADMIN_USER_ID) redirect("/admin/connexion");

  const { data: vehicules } = await supabase
    .from("vehicles")
    .select("id, make, model, year, price, mileage_km, status, published")
    .order("display_order", { ascending: true });

  return (
    <div className="contenu admin">
      <header className="admin-tete">
        <div>
          <p className="surtitre">Admin</p>
          <h1 className="admin-titre">Inventaire</h1>
        </div>
        <div className="admin-actions">
          <Link href="/admin/nouveau" className="btn btn-primaire">
            + Nouveau véhicule
          </Link>
          <SignOutButton />
        </div>
      </header>

      <div className="admin-liste">
        <div className="admin-ligne admin-ligne--tete">
          <span>Véhicule</span>
          <span>Prix</span>
          <span>Statut</span>
          <span>En ligne</span>
          <span></span>
        </div>
        {vehicules && vehicules.length > 0 ? (
          vehicules.map((v) => (
            <div key={v.id} className="admin-ligne">
              <span className="admin-veh">
                <strong>
                  {v.make} {v.model}
                </strong>
                <em className="mono">
                  {v.year} · {formatKm(v.mileage_km)}
                </em>
              </span>
              <span className="mono">{formatPrix(v.price)}</span>
              <span className={`admin-statut admin-statut--${v.status}`}>
                {STATUTS[v.status] ?? v.status}
              </span>
              <span>{v.published ? "Oui" : "Non"}</span>
              <span>
                <Link href={`/admin/vehicule/${v.id}`} className="admin-modifier">
                  Modifier
                </Link>
              </span>
            </div>
          ))
        ) : (
          <p className="vehicules-vide">Aucun véhicule. Ajoutez-en un.</p>
        )}
      </div>
    </div>
  );
}
