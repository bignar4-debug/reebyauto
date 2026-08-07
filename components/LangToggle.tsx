"use client";

import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n";

/**
 * Sélecteur de langue FR / EN (contenu client seulement).
 * Écrit le choix dans le cookie `locale` (1 an) puis rafraîchit la page pour
 * que le rendu serveur reprenne la nouvelle langue.
 */
export default function LangToggle({ current }: { current: Locale }) {
  const router = useRouter();

  const choisir = (loc: Locale) => {
    if (loc === current) return;
    document.cookie = `locale=${loc}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  };

  return (
    <div className="lang-toggle" role="group" aria-label="Langue / Language">
      <button
        type="button"
        className={`lang-opt ${current === "fr" ? "actif" : ""}`}
        onClick={() => choisir("fr")}
        aria-pressed={current === "fr"}
      >
        FR
      </button>
      <span className="lang-sep" aria-hidden="true">
        /
      </span>
      <button
        type="button"
        className={`lang-opt ${current === "en" ? "actif" : ""}`}
        onClick={() => choisir("en")}
        aria-pressed={current === "en"}
      >
        EN
      </button>
    </div>
  );
}
