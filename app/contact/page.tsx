import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import SocialLinks from "@/components/SocialLinks";
import { CONTACT } from "@/lib/social";

export const metadata: Metadata = {
  title: "Contact · Reeby Auto",
  description:
    "Contactez Reeby Auto (Jonni Langlois, CAE) à Montréal. Téléphone, courriel et réseaux sociaux.",
};

export default function Contact() {
  return (
    <div className="contenu page">
      <header className="page-tete">
        <p className="surtitre">Contact</p>
        <h1 className="page-titre display">Parlons de votre projet.</h1>
        <p className="page-sous">
          Une question, un véhicule en tête, ou l&apos;envie de vendre ? Écrivez
          à Jonni ou joignez-le directement.
        </p>
      </header>

      <div className="contact-grille">
        <div className="contact-infos">
          <div className="contact-bloc">
            <span className="contact-label">Téléphone</span>
            <a href={CONTACT.telHref} className="contact-val">
              {CONTACT.telAffiche}
            </a>
          </div>
          <div className="contact-bloc">
            <span className="contact-label">Courriel</span>
            <a href={`mailto:${CONTACT.courriel}`} className="contact-val">
              {CONTACT.courriel}
            </a>
          </div>
          <div className="contact-bloc">
            <span className="contact-label">Territoire</span>
            <span className="contact-val">{CONTACT.region}</span>
          </div>
          <div className="contact-bloc">
            <span className="contact-label">Réseaux</span>
            <SocialLinks />
          </div>
        </div>

        <div className="contact-form panneau">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
