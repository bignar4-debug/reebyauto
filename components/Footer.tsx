import Image from "next/image";

/**
 * Pied de page. Coordonnées réelles du client.
 * Deux colonnes : marque + contact. Pas de barre de copyright en bas.
 */
export default function Footer() {
  return (
    <footer className="pied">
      <div className="pied-grille">
        {/* Colonne marque */}
        <div className="pied-marque">
          <Image
            src="/logo.png"
            alt="Reeby Auto"
            width={200}
            height={89}
            className="pied-logo"
          />
          <p className="pied-region">Grande région de Montréal</p>
        </div>

        {/* Colonne contact */}
        <div className="pied-contact">
          <h2 className="pied-titre">Contact</h2>
          <ul className="pied-liste">
            <li>
              <a href="tel:+14385264388" className="mono">
                438 526-4388
              </a>
            </li>
            <li>
              <a href="mailto:jonni@reebyauto.ca">jonni@reebyauto.ca</a>
            </li>
            <li>
              <a
                href="https://instagram.com/reeby_auto"
                target="_blank"
                rel="noopener noreferrer"
              >
                @reeby_auto
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
