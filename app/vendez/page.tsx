import type { Metadata } from "next";
import VendezForm from "@/components/VendezForm";
import { getLocale } from "@/lib/getLocale";
import { t, type Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Vendez votre auto · Reeby Auto",
  description:
    "Confiez la vente de votre véhicule à un courtier. 1 % de commission, aucun risque. Grande région de Montréal.",
};

type Forfait = {
  nom: string;
  tagline: string;
  prix: string;
  prixNote: string;
  populaire: boolean;
  heritage: string | null;
  inclus: string[];
  ideal: string;
};

const FORFAITS: Record<Locale, Forfait[]> = {
  fr: [
    {
      nom: "Essentiel",
      tagline: "La base gagnante",
      prix: "1 % de commission",
      prixNote: "seulement à la vente · aucun frais d'activation",
      populaire: false,
      heritage: null,
      inclus: [
        "Évaluation stratégique du véhicule",
        "Photos professionnelles HD",
        "Création d'une annonce optimisée",
        "Diffusion sur toutes les plateformes",
        "Gestion des appels et messages",
        "Qualification des acheteurs",
        "Organisation des visites et essais",
        "Accompagnement jusqu'à la vente",
      ],
      ideal:
        "Les propriétaires qui veulent un service efficace, rapide et sans tracas.",
    },
    {
      nom: "Service Signature",
      tagline: "La mise en valeur professionnelle",
      prix: "299 $",
      prixNote: "valeur de plus de 1 000 $",
      populaire: true,
      heritage: "Tout ce qui est inclus dans Essentiel, plus :",
      inclus: [
        "Lavage intérieur et extérieur professionnel",
        "Rapport Carfax",
        "Vidéo de présentation professionnelle",
        "Annonce mise en vedette",
        "Campagne publicitaire ciblée",
        "Suivi prioritaire des acheteurs qualifiés",
      ],
      ideal: "Ceux qui veulent se démarquer et vendre plus rapidement.",
    },
    {
      nom: "Concierge VIP",
      tagline: "L'expérience haut de gamme",
      prix: "499 $",
      prixNote: "valeur de plus de 2 000 $",
      populaire: false,
      heritage: "Tout ce qui est inclus dans Signature, plus :",
      inclus: [
        "Detailing complet intérieur et extérieur",
        "Séance photo et vidéo cinématographique",
        "Prises de vue au drone (si pertinent)",
        "Campagne publicitaire premium (Facebook, Instagram, Google)",
        "Réseau privé d'acheteurs sérieux",
        "Accompagnement VIP personnalisé",
      ],
      ideal: "Les véhicules d'exception, rares ou de collection.",
    },
  ],
  en: [
    {
      nom: "Essential",
      tagline: "The winning foundation",
      prix: "1% commission",
      prixNote: "only when it sells · no activation fee",
      populaire: false,
      heritage: null,
      inclus: [
        "Strategic vehicle appraisal",
        "Professional HD photos",
        "Optimized listing creation",
        "Distribution across every platform",
        "Handling of calls and messages",
        "Buyer qualification",
        "Viewings and test drives arranged",
        "Support all the way to the sale",
      ],
      ideal: "Owners who want efficient, fast, hassle-free service.",
    },
    {
      nom: "Signature Service",
      tagline: "Professional showcasing",
      prix: "$299",
      prixNote: "over $1,000 in value",
      populaire: true,
      heritage: "Everything in Essential, plus:",
      inclus: [
        "Professional interior and exterior wash",
        "Carfax report",
        "Professional presentation video",
        "Featured listing",
        "Targeted ad campaign",
        "Priority follow-up with qualified buyers",
      ],
      ideal: "Those who want to stand out and sell faster.",
    },
    {
      nom: "VIP Concierge",
      tagline: "The premium experience",
      prix: "$499",
      prixNote: "over $2,000 in value",
      populaire: false,
      heritage: "Everything in Signature, plus:",
      inclus: [
        "Full interior and exterior detailing",
        "Cinematic photo and video session",
        "Drone footage (when relevant)",
        "Premium ad campaign (Facebook, Instagram, Google)",
        "Private network of serious buyers",
        "Personalized VIP support",
      ],
      ideal: "Exceptional, rare or collector vehicles.",
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
              <p className="forfait-nom">
                {t(locale, "forfait.prefix")} {forf.nom}
              </p>
              <p className="forfait-tagline">{forf.tagline}</p>
              <p className="forfait-prix">{forf.prix}</p>
              <p className="forfait-prix-note">{forf.prixNote}</p>
              {forf.heritage && (
                <p className="forfait-heritage">{forf.heritage}</p>
              )}
              <ul className="forfait-inclus">
                {forf.inclus.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="forfait-ideal">
                <span>{t(locale, "forfait.ideal")}</span>
                {forf.ideal}
              </p>
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
