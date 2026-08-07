/**
 * Formats des données de véhicules, adaptés à la langue (fr-CA / en-CA).
 */
import { t, type Locale } from "./i18n";

/** 84500 -> "84 500 $" (fr) / "$84,500" (en). null -> "Prix sur demande". */
export function formatPrix(
  valeur: number | null | undefined,
  locale: Locale = "fr"
): string {
  if (valeur == null) return t(locale, "price.on_request");
  const nf = new Intl.NumberFormat(locale === "en" ? "en-CA" : "fr-CA");
  return locale === "en" ? `$${nf.format(valeur)}` : `${nf.format(valeur)} $`;
}

/** 83000 -> "83 000 km" (fr) / "83,000 km" (en). null -> n/d · n/a. */
export function formatKm(
  valeur: number | null | undefined,
  locale: Locale = "fr"
): string {
  if (valeur == null) return t(locale, "value.na");
  const nf = new Intl.NumberFormat(locale === "en" ? "en-CA" : "fr-CA");
  return `${nf.format(valeur)} km`;
}

const CARROSSERIE_SLUGS = [
  "coupe",
  "convertible",
  "sedan",
  "suv",
  "hatchback",
  "wagon",
  "truck",
];

/** Libellé traduit de la carrosserie (slug -> texte). */
export function carrosserieLabel(
  slug: string | null | undefined,
  locale: Locale = "fr"
): string {
  if (!slug) return t(locale, "value.na");
  return CARROSSERIE_SLUGS.includes(slug) ? t(locale, `body.${slug}`) : slug;
}

/** Options du menu carrosserie (admin, français uniquement). */
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
