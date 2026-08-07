import { cookies } from "next/headers";
import type { Locale } from "./i18n";

/**
 * Lit la langue choisie par le visiteur depuis le cookie `locale`.
 * Français par défaut. Utilisé par les composants serveur (pages, cartes).
 */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  return store.get("locale")?.value === "en" ? "en" : "fr";
}
