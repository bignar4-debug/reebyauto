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
