import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import SocialLinks from "@/components/SocialLinks";
import { CONTACT } from "@/lib/social";
import { getLocale } from "@/lib/getLocale";
import { t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Contact · Reeby Auto",
  description:
    "Contactez Reeby Auto (Jonni Langlois) à Montréal. Téléphone, courriel et réseaux sociaux.",
};

export default async function Contact() {
  const locale = await getLocale();
  return (
    <div className="contenu page">
      <header className="page-tete">
        <p className="surtitre">{t(locale, "contact.eyebrow")}</p>
        <h1 className="page-titre display">{t(locale, "contact.title")}</h1>
        <p className="page-sous">{t(locale, "contact.sub")}</p>
      </header>

      <div className="contact-grille">
        <div className="contact-infos">
          <div className="contact-bloc">
            <span className="contact-label">{t(locale, "contact.label_phone")}</span>
            <a href={CONTACT.telHref} className="contact-val">
              {CONTACT.telAffiche}
            </a>
          </div>
          <div className="contact-bloc">
            <span className="contact-label">{t(locale, "contact.label_email")}</span>
            <a href={`mailto:${CONTACT.courriel}`} className="contact-val">
              {CONTACT.courriel}
            </a>
          </div>
          <div className="contact-bloc">
            <span className="contact-label">{t(locale, "contact.label_region")}</span>
            <span className="contact-val">{t(locale, "region.value")}</span>
          </div>
          <div className="contact-bloc">
            <span className="contact-label">{t(locale, "contact.label_social")}</span>
            <SocialLinks />
          </div>
        </div>

        <div className="contact-form panneau">
          <ContactForm locale={locale} />
        </div>
      </div>
    </div>
  );
}
