import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "À propos · Jonni Langlois, Reeby Auto",
  description:
    "Jonni Langlois, courtier automobile à Montréal. Expertise, connaissance du marché et nombreuses transactions au service des acheteurs et des vendeurs.",
};

export default function APropos() {
  return (
    <div className="contenu page">
      <header className="page-tete">
        <p className="surtitre">À propos</p>
        <h1 className="page-titre display">
          Jonni Langlois, votre courtier de confiance.
        </h1>
      </header>

      <div className="apropos-corps">
        <div className="prose">
          <p>
            Fondateur de Reeby Auto, Jonni Langlois a bâti sa réputation sur une
            passion sincère pour l&apos;automobile et
            un souci constant du détail. Au fil de{" "}
            <strong>nombreuses transactions</strong>, il a accompagné autant des
            acheteurs exigeants que des vendeurs soucieux d&apos;obtenir la
            meilleure valeur pour leur véhicule.
          </p>
          <p>
            Sa <strong>connaissance approfondie du marché</strong> lui permet
            d&apos;évaluer un véhicule avec justesse, de déceler l&apos;exception
            et d&apos;éviter les pièges. Chaque voiture qu&apos;il propose est
            inspectée, jamais accidentée, et sélectionnée avec la même rigueur
            qu&apos;il appliquerait à la sienne.
          </p>
        </div>
      </div>

      <section className="cta-bande">
        <Link href="/inventaire" className="btn btn-primaire">
          Voir l&apos;inventaire
        </Link>
        <Link href="/vendez" className="btn btn-secondaire">
          Vendez votre auto
        </Link>
      </section>
    </div>
  );
}
