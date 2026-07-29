import fs from "node:fs";
import path from "node:path";

/**
 * Retourne le chemin public de l'image d'un véhicule si le fichier existe
 * dans /public/cars/<slug>.jpg, sinon null (on affiche alors un repli SVG).
 * PLACEHOLDER : ces images sont temporaires — elles seront remplacées par les
 * vraies photos téléversées par Jonni (Phase 6, via Supabase Storage).
 */
export function carImage(slug: string): string | null {
  const abs = path.join(process.cwd(), "public", "cars", `${slug}.jpg`);
  try {
    return fs.existsSync(abs) ? `/cars/${slug}.jpg` : null;
  } catch {
    return null;
  }
}
