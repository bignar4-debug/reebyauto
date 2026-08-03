import Image from "next/image";
import SocialLinks from "@/components/SocialLinks";
import { CONTACT } from "@/lib/social";

/**
 * Pied de page (présent sur toutes les pages).
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
          <p className="pied-region">{CONTACT.region}</p>
          <SocialLinks className="pied-social" />
        </div>

        {/* Colonne contact */}
        <div className="pied-contact">
          <h2 className="pied-titre">Contact</h2>
          <ul className="pied-liste">
            <li>
              <a href={CONTACT.telHref} className="mono">
                {CONTACT.telAffiche}
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT.courriel}`}>{CONTACT.courriel}</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
