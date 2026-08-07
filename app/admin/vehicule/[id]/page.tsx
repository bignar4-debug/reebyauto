import type { Metadata } from "next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { ADMIN_USER_ID } from "@/lib/admin";
import VehicleEditor from "@/components/admin/VehicleEditor";

export const metadata: Metadata = { robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function EditVehicule({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.id !== ADMIN_USER_ID) redirect("/admin/connexion");

  const { data: v } = await supabase
    .from("vehicles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!v) notFound();

  const { data: photos } = await supabase
    .from("vehicle_photos")
    .select("id, storage_path, is_primary, position")
    .eq("vehicle_id", id)
    .order("position", { ascending: true });

  return (
    <div className="contenu admin">
      <Link href="/admin" className="fiche-retour">
        ← Retour à l&apos;inventaire
      </Link>
      <h1 className="admin-titre">
        {v.make} {v.model}
      </h1>
      <VehicleEditor vehicle={v} initialPhotos={photos ?? []} />
    </div>
  );
}
