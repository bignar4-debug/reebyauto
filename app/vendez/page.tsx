import type { Metadata } from "next";
import VendezForm from "@/components/VendezForm";
import { getLocale } from "@/lib/getLocale";
import { t, type Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Vendez votre auto · Reeby Auto",
  description:
    "Aucun frais à l'avance, 1 % au succès seulement si l'acheteur provient de Reeby Auto. Options Signature et Promotion. Grande région de Montréal.",
};

const INCLUS: Record<Locale, string[]> = {
  fr: [
    "Création et optimisation de l'annonce",
    "Publication sur reebyauto.com",
    "Diffusion sur nos plateformes et réseaux sociaux",
    "Qualification des acheteurs provenant de Reeby Auto",
    "Transmission des offres au vendeur",
    "Aide à la négociation",
    "Accompagnement jusqu'à la transaction",
  ],
  en: [
    "Listing creation and optimization",
    "Published on reebyauto.com",
    "Promotion across our platforms and social media",
    "Qualification of buyers from Reeby Auto",
    "Offers presented to the seller",
    "Negotiation assistance",
    "Support through the transaction",
  ],
};

const SIGNATURE: Record<Locale, string[]> = {
  fr: [
    "Photos professionnelles",
    "Vidéo professionnelle",
    "Montage Reel",
    "Contenu optimisé pour les réseaux sociaux",
  ],
  en: [
    "Professional photos",
    "Professional video",
    "Reel editing",
    "Content optimized for social media",
  ],
};

export default async function Vendez() {
  const locale = await getLocale();
  const inclus = INCLUS[locale];
  const signature = SIGNATURE[locale];
  const signaturePrix = locale === "en" ? "+$350" : "+350 $";
  const etapes = [
    { num: "01", titre: t(locale, "sell.step1_title"), texte: t(locale, "sell.step1_text") },
    { num: "02", titre: t(locale, "sell.step2_title"), texte: t(locale, "sell.step2_text") },
    { num: "03", titre: t(locale, "sell.step3_title"), texte: t(locale, "sell.step3_text") },
  ];

  return (
    <div className="contenu page">
      <header className="page-tete">
        <p className="surtitre">{t(locale, "sell.eyebrow")}</p>
        <h1 className="page-titre display">{t(locale, "sell.hero_title")}</h1>
        <p className="page-sous">{t(locale, "sell.hero_sub")}</p>
      </header>

      {/* Offre principale : 0 $ à l'avance, 1 % au succès */}
      <section className="offre-principale panneau" aria-label={t(locale, "sell.eyebrow")}>
        <div className="offre-prix">
          <p className="offre-avance">{t(locale, "sell.offer_upfront")}</p>
          <p className="offre-pourcent">1&nbsp;%</p>
          <p className="offre-succes">{t(locale, "sell.offer_success")}</p>
          <p className="offre-condition">{t(locale, "sell.offer_condition")}</p>
        </div>
        <div className="offre-inclus-bloc">
          <p className="offre-inclus-titre">{t(locale, "sell.offer_includes")}</p>
          <ul className="offre-inclus">
            {inclus.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Options supplémentaires */}
      <section className="options" aria-label={t(locale, "sell.options_title")}>
        <h2 className="options-titre display">{t(locale, "sell.options_title")}</h2>
        <div className="options-grille">
          <div className="option-card panneau">
            <p className="option-eyebrow">{t(locale, "sell.opt_signature")}</p>
            <p className="option-prix">{signaturePrix}</p>
            <ul className="option-liste">
              {signature.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="option-card panneau">
            <p className="option-eyebrow">{t(locale, "sell.opt_promotion")}</p>
            <p className="option-prix">{t(locale, "sell.opt_promotion_price")}</p>
            <p className="option-desc">{t(locale, "sell.opt_promotion_desc")}</p>
          </div>
        </div>
      </section>

      {/* Processus en 3 étapes */}
      <section className="process" aria-label={t(locale, "sell.eyebrow")}>
        {etapes.map((e) => (
          <div key={e.num} className="etape">
            <span className="etape-num">{e.num}</span>
            <h2 className="etape-titre">{e.titre}</h2>
            <p className="etape-texte">{e.texte}</p>
          </div>
        ))}
      </section>

      {/* Formulaire */}
      <section className="form-section panneau" aria-label={t(locale, "sell.form_title")}>
        <h2 className="form-titre">{t(locale, "sell.form_title")}</h2>
        <p className="form-intro">{t(locale, "sell.form_intro")}</p>
        <VendezForm locale={locale} />
      </section>
    </div>
  );
}
