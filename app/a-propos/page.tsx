import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "@/lib/getLocale";
import { t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "À propos · Jonni Langlois, Reeby Auto",
  description:
    "Jonni Langlois, courtier automobile à Montréal. Expertise, connaissance du marché et nombreuses transactions au service des acheteurs et des vendeurs.",
};

export default async function APropos() {
  const locale = await getLocale();
  return (
    <div className="contenu page">
      <header className="page-tete">
        <p className="surtitre">{t(locale, "about.eyebrow")}</p>
        <h1 className="page-titre display">{t(locale, "about.title")}</h1>
      </header>

      <div className="apropos-corps">
        <div className="prose">
          <p>
            {t(locale, "about.p1_a")}
            <strong>{t(locale, "about.p1_strong")}</strong>
            {t(locale, "about.p1_b")}
          </p>
          <p>
            {t(locale, "about.p2_a")}
            <strong>{t(locale, "about.p2_strong")}</strong>
            {t(locale, "about.p2_b")}
          </p>
        </div>
      </div>

      <section className="cta-bande">
        <Link href="/inventaire" className="btn btn-primaire">
          {t(locale, "hero.cta_inventory")}
        </Link>
        <Link href="/vendez" className="btn btn-secondaire">
          {t(locale, "hero.cta_sell")}
        </Link>
      </section>
    </div>
  );
}
