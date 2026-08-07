import type { Metadata } from "next";
import VendezForm from "@/components/VendezForm";

export const metadata: Metadata = {
  title: "Vendez votre auto · Reeby Auto",
  description:
    "Confiez la vente de votre véhicule à un courtier. 1 % de commission, aucun risque. Grande région de Montréal.",
};

const ETAPES = [
  {
    num: "01",
    titre: "Client contacté",
    texte:
      "On vous rencontre, on évalue votre véhicule et on établit ensemble le juste prix du marché.",
  },
  {
    num: "02",
    titre: "Mise en ligne",
    texte:
      "Photos soignées, annonce diffusée sur les meilleures plateformes et mise de l'avant sur les réseaux sociaux.",
  },
  {
    num: "03",
    titre: "Vente conclue",
    texte:
      "On filtre les acheteurs, on négocie et on vous accompagne jusqu'à la signature. Seulement 1 % de commission.",
  },
];

const FORFAITS = [
  {
    nom: "Essentiel",
    tagline: "La base gagnante",
    prix: "1 % de commission",
    prixNote: "seulement à la vente · aucun frais d'activation",
    populaire: false,
    heritage: null as string | null,
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
];

export default function Vendez() {
  return (
    <div className="contenu page">
      <header className="page-tete">
        <p className="surtitre">Vendez votre auto</p>
        <h1 className="page-titre display">
          Confiez-nous la vente, on s&apos;occupe du reste.
        </h1>
        <p className="page-sous">
          Un accompagnement complet par un courtier. 1 % de commission, aucun
          risque.
        </p>
      </header>

      {/* Processus en 3 étapes */}
      <section className="process" aria-label="Notre processus">
        {ETAPES.map((e) => (
          <div key={e.num} className="etape">
            <span className="etape-num">{e.num}</span>
            <h2 className="etape-titre">{e.titre}</h2>
            <p className="etape-texte">{e.texte}</p>
          </div>
        ))}
      </section>

      {/* Forfaits de services */}
      <section className="forfaits" aria-label="Nos forfaits">
        <header className="forfaits-tete">
          <p className="surtitre">Nos forfaits</p>
          <h2 className="forfaits-titre display">Choisissez votre formule</h2>
        </header>
        <div className="forfaits-grille">
          {FORFAITS.map((forf) => (
            <div
              key={forf.nom}
              className={`forfait panneau ${forf.populaire ? "forfait--populaire" : ""}`}
            >
              {forf.populaire && (
                <span className="forfait-ruban">Le plus populaire</span>
              )}
              <p className="forfait-nom">Forfait {forf.nom}</p>
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
                <span>Idéal pour</span>
                {forf.ideal}
              </p>
            </div>
          ))}
        </div>
        <p className="forfaits-note">
          Aucun frais d&apos;avance, aucun risque. 1 % de commission seulement à
          la vente du véhicule.
        </p>
      </section>

      {/* Formulaire */}
      <section className="form-section panneau" aria-label="Formulaire de vente">
        <h2 className="form-titre">Parlez-nous de votre véhicule</h2>
        <p className="form-intro">
          Remplissez ce formulaire et Jonni vous recontactera rapidement.
        </p>
        <VendezForm />
      </section>
    </div>
  );
}
