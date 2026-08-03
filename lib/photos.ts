/**
 * Photos de véhicules stockées dans Supabase Storage (bucket public
 * "vehicle-photos"). On construit l'URL publique et on choisit la photo
 * principale (is_primary, sinon la plus petite position).
 */
export type VehiclePhoto = {
  storage_path: string;
  is_primary: boolean | null;
  position: number | null;
};

export function primaryPhotoUrl(
  photos: VehiclePhoto[] | null | undefined
): string | null {
  if (!photos || photos.length === 0) return null;
  const sorted = [...photos].sort((a, b) => {
    const pa = a.is_primary ? 1 : 0;
    const pb = b.is_primary ? 1 : 0;
    if (pb !== pa) return pb - pa;
    return (a.position ?? 0) - (b.position ?? 0);
  });
  const base =
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    "https://qhgpcrrnglgzonarnkwb.supabase.co";
  return `${base}/storage/v1/object/public/vehicle-photos/${sorted[0].storage_path}`;
}
