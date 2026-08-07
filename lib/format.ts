/**
 * Formats français québécois pour les données de véhicules.
 */

const nf = new Intl.NumberFormat("fr-CA");

/** 84500 -> "84 500 $" (espaces insécables, $ à la fin). */
export function formatPrix(valeur: number | null | undefined): string {
  if (valeur == null) return "Prix sur demande";
  return `${nf.format(valeur)} $`;
}

/** 83000 -> "83 000 km". */
export function formatKm(valeur: number | null | undefined): string {
  if (valeur == null) return "n/d";
  return `${nf.format(valeur)} km`;
}

/** Libellé français de la carrosserie (slug -> texte). */
const CARROSSERIES: Record<string, string> = {
  coupe: "Coupé",
  sedan: "Berline",
  suv: "VUS",
  hatchback: "Sportback",
  wagon: "Familiale",
  convertible: "Cabriolet",
  truck: "Camion",
};

export function carrosserieLabel(slug: string | null | undefined): string {
  if (!slug) return "n/d";
  return CARROSSERIES[slug] ?? slug;
}

export const CARROSSERIE_OPTIONS = [
  { value: "coupe", label: "Coupé" },
  { value: "convertible", label: "Cabriolet" },
  { value: "sedan", label: "Berline" },
  { value: "suv", label: "VUS" },
  { value: "hatchback", label: "Sportback" },
  { value: "wagon", label: "Familiale" },
  { value: "truck", label: "Camion" },
];

/** "Porsche 911 Carrera S 2021" -> "porsche-911-carrera-s-2021" */
export function slugify(texte: string): string {
  return texte
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
