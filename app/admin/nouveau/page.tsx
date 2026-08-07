import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { ADMIN_USER_ID } from "@/lib/admin";
import VehicleEditor from "@/components/admin/VehicleEditor";

export const metadata: Metadata = { robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function NouveauVehicule() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.id !== ADMIN_USER_ID) redirect("/admin/connexion");

  return (
    <div className="contenu admin">
      <Link href="/admin" className="fiche-retour">
        ← Retour à l&apos;inventaire
      </Link>
      <h1 className="admin-titre">Nouveau véhicule</h1>
      <VehicleEditor vehicle={null} initialPhotos={[]} />
    </div>
  );
}
