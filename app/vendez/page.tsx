import type { Metadata } from "next";
import VendezForm from "@/components/VendezForm";
import { getLocale } from "@/lib/getLocale";
import { t, type Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Vendez votre auto · Reeby Auto",
  description:
    "Trois forfaits pour vendre votre véhicule : Visibilité, Signature ou Mandat exclusif. Grande région de Montréal.",
};

type Forfait = {
  nom: string;
  tagline: string;
  prix: string;
  prixNote: string;
  populaire: boolean;
  heritage: string | null;
  inclus: string[];
};

const FORFAITS: Record<Locale, Forfait[]> = {
  fr: [
    {
      nom: "Visibilité",
      tagline: "On active votre annonce. Vous gérez la vente.",
      prix: "50 $",
      prixNote: "",
      populaire: false,
      heritage: null,
      inclus: [
        "Activation de l'annonce sur les plateformes Reeby Auto",
        "Évaluation du véhicule et stratégie de vente",
        "Le client fournit ses photos",
        "Annonce optimisée",
        "Diffusion sur notre site web et nos réseaux sociaux",
        "Budget publicitaire au choix",
        "Le client gère les demandes et la vente",
      ],
    },
    {
      nom: "Signature",
      tagline: "Une présentation premium de votre véhicule.",
      prix: "350 $",
      prixNote: "",
      populaire: false,
      heritage: "Tout ce qui est inclus dans Visibilité, plus :",
      inclus: [
        "Photos professionnelles",
        "Vidéo professionnelle du véhicule",
        "Montage vidéo / Reel",
        "Mise en vedette sur nos plateformes",
        "Promotion renforcée sur les réseaux sociaux",
        "Le client gère les demandes et la vente",
      ],
    },
    {
      nom: "Mandat exclusif",
      tagline: "Service complet — nous prenons en charge votre vente de A à Z.",
      prix: "350 $ + 1 %",
      prixNote: "Frais de mise en marché + commission au succès",
      populaire: true,
      heritage: "Tout ce qui est inclus dans Signature, plus :",
      inclus: [
        "Gestion des demandes",
        "Qualification des acheteurs",
        "Planification des rendez-vous",
        "Accompagnement complet jusqu'à la vente",
      ],
    },
  ],
  en: [
    {
      nom: "Visibility",
      tagline: "We activate your listing. You manage the sale.",
      prix: "$50",
      prixNote: "",
      populaire: false,
      heritage: null,
      inclus: [
        "Listing activated on Reeby Auto platforms",
        "Vehicle appraisal and sales strategy",
        "You provide the photos",
        "Optimized listing",
        "Published on our website and social media",
        "Advertising budget of your choice",
        "You handle the inquiries and the sale",
      ],
    },
    {
      nom: "Signature",
      tagline: "A premium presentation of your vehicle.",
      prix: "$350",
      prixNote: "",
      populaire: false,
      heritage: "Everything in Visibility, plus:",
      inclus: [
        "Professional photos",
        "Professional vehicle video",
        "Video editing / Reel",
        "Featured on our platforms",
        "Boosted social media promotion",
        "You handle the inquiries and the sale",
      ],
    },
    {
      nom: "Exclusive Mandate",
      tagline: "Full service — we handle your sale from A to Z.",
      prix: "$350 + 1%",
      prixNote: "Marketing fee + success commission",
      populaire: true,
      heritage: "Everything in Signature, plus:",
      inclus: [
        "Inquiry management",
        "Buyer qualification",
        "Appointment scheduling",
        "Full support through to the sale",
      ],
    },
  ],
};

export default async function Vendez() {
  const locale = await getLocale();
  const etapes = [
    { num: "01", titre: t(locale, "sell.step1_title"), texte: t(locale, "sell.step1_text") },
    { num: "02", titre: t(locale, "sell.step2_title"), texte: t(locale, "sell.step2_text") },
    { num: "03", titre: t(locale, "sell.step3_title"), texte: t(locale, "sell.step3_text") },
  ];
  const forfaits = FORFAITS[locale];

  return (
    <div className="contenu page">
      <header className="page-tete">
        <p className="surtitre">{t(locale, "sell.eyebrow")}</p>
        <h1 className="page-titre display">{t(locale, "sell.title")}</h1>
        <p className="page-sous">{t(locale, "sell.sub")}</p>
      </header>

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

      {/* Forfaits de services */}
      <section className="forfaits" aria-label={t(locale, "sell.packages_eyebrow")}>
        <header className="forfaits-tete">
          <p className="surtitre">{t(locale, "sell.packages_eyebrow")}</p>
          <h2 className="forfaits-titre display">
            {t(locale, "sell.packages_title")}
          </h2>
        </header>
        <div className="forfaits-grille">
          {forfaits.map((forf) => (
            <div
              key={forf.nom}
              className={`forfait panneau ${forf.populaire ? "forfait--populaire" : ""}`}
            >
              {forf.populaire && (
                <span className="forfait-ruban">{t(locale, "sell.popular")}</span>
              )}
              <p className="forfait-nom">{forf.nom}</p>
              <p className="forfait-tagline">{forf.tagline}</p>
              <p className="forfait-prix">{forf.prix}</p>
              {forf.prixNote && (
                <p className="forfait-prix-note">{forf.prixNote}</p>
              )}
              {forf.heritage && (
                <p className="forfait-heritage">{forf.heritage}</p>
              )}
              <ul className="forfait-inclus">
                {forf.inclus.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="forfaits-note">{t(locale, "sell.packages_note")}</p>
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
