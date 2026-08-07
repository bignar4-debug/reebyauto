export type Locale = "fr" | "en";
export const LOCALES: Locale[] = ["fr", "en"];

/**
 * Dictionnaire de traductions de l'interface (contenu client).
 * Les descriptions de véhicules (saisies par l'admin) restent en français.
 */
const dict: Record<Locale, Record<string, string>> = {
  fr: {
    "nav.home": "Accueil",
    "nav.inventory": "Inventaire",
    "nav.sell": "Vendez votre auto",
    "nav.about": "À propos",
    "nav.contact": "Contact",

    "hero.cta_inventory": "Voir l'inventaire",
    "hero.cta_sell": "Vendez votre auto",

    "home.eyebrow": "Inventaire",
    "home.title": "Nos véhicules",
    "home.all": "Tout l'inventaire →",
    "home.empty": "Aucun véhicule pour le moment. Revenez bientôt.",

    "status.available": "Disponible",
    "status.reserved": "Réservé",
    "status.sold": "Vendu",
    "price.on_request": "Prix sur demande",
    "value.na": "n/d",

    "body.coupe": "Coupé",
    "body.convertible": "Cabriolet",
    "body.sedan": "Berline",
    "body.suv": "VUS",
    "body.hatchback": "Sportback",
    "body.wagon": "Familiale",
    "body.truck": "Camion",

    "fiche.back": "← Retour à l'inventaire",
    "fiche.year": "Année",
    "fiche.mileage": "Kilométrage",
    "fiche.body": "Carrosserie",
    "fiche.transmission": "Transmission",
    "fiche.drivetrain": "Rouage",
    "fiche.fuel": "Carburant",
    "fiche.ext_color": "Couleur extérieure",
    "fiche.int_color": "Couleur intérieure",
    "fiche.cta": "Demander de l'information",

    "inv.eyebrow": "Inventaire",
    "inv.title": "Notre inventaire",
    "inv.sub":
      "Des véhicules d'exception, inspectés et jamais accidentés. Vente de particulier : une seule taxe.",
    "inv.empty": "Aucun véhicule pour le moment. Revenez bientôt.",

    "sell.eyebrow": "Vendez votre auto",
    "sell.title": "Confiez-nous la vente, on s'occupe du reste.",
    "sell.sub":
      "Un accompagnement complet par un courtier. 1 % de commission, aucun risque.",
    "sell.step1_title": "Client contacté",
    "sell.step1_text":
      "On vous rencontre, on évalue votre véhicule et on établit ensemble le juste prix du marché.",
    "sell.step2_title": "Mise en ligne",
    "sell.step2_text":
      "Photos soignées, annonce diffusée sur les meilleures plateformes et mise de l'avant sur les réseaux sociaux.",
    "sell.step3_title": "Vente conclue",
    "sell.step3_text":
      "On filtre les acheteurs, on négocie et on vous accompagne jusqu'à la signature. Seulement 1 % de commission.",
    "sell.packages_eyebrow": "Nos forfaits",
    "sell.packages_title": "Choisissez votre formule",
    "sell.packages_note":
      "Aucun frais d'avance, aucun risque. 1 % de commission seulement à la vente du véhicule.",
    "sell.form_title": "Parlez-nous de votre véhicule",
    "sell.form_intro":
      "Remplissez ce formulaire et Jonni vous recontactera rapidement.",
    "forfait.prefix": "Forfait",
    "forfait.ideal": "Idéal pour",
    "sell.popular": "Le plus populaire",

    "gallery.zoom": "Agrandir la photo",
    "gallery.prev": "Photo précédente",
    "gallery.next": "Photo suivante",
    "gallery.close": "Fermer",

    "form.name": "Nom complet",
    "form.phone": "Téléphone",
    "form.phone_opt": "Téléphone (optionnel)",
    "form.email": "Courriel",
    "form.vehicle": "Véhicule (marque et modèle)",
    "form.year": "Année",
    "form.mileage": "Kilométrage",
    "form.price_opt": "Prix demandé (optionnel)",
    "form.message": "Message",
    "form.message_opt": "Message (optionnel)",
    "form.send_request": "Envoyer ma demande",
    "form.send_message": "Envoyer le message",
    "form.sending": "Envoi…",
    "form.err_name": "Votre nom est requis.",
    "form.err_phone": "Un numéro de téléphone valide est requis.",
    "form.err_email_req": "Courriel requis.",
    "form.err_email": "Courriel invalide.",
    "form.err_vehicle": "Indiquez la marque et le modèle.",
    "form.err_message": "Écrivez-nous quelques mots.",
    "form.success_sell":
      "Merci ! Votre demande a bien été reçue. Jonni vous contactera sous peu au sujet de votre véhicule.",
    "form.success_contact":
      "Merci ! Votre message a bien été reçu. On vous répond rapidement. Pour une réponse immédiate, appelez le 438 526-4388.",

    "about.eyebrow": "À propos",
    "about.title": "Jonni Langlois, votre courtier de confiance.",
    "about.p1_a": "Fondateur de Reeby Auto, Jonni Langlois a bâti sa réputation sur une passion sincère pour l'automobile et un souci constant du détail. Au fil de ",
    "about.p1_strong": "nombreuses transactions",
    "about.p1_b":
      ", il a accompagné autant des acheteurs exigeants que des vendeurs soucieux d'obtenir la meilleure valeur pour leur véhicule.",
    "about.p2_a": "Sa ",
    "about.p2_strong": "connaissance approfondie du marché",
    "about.p2_b":
      " lui permet d'évaluer un véhicule avec justesse, de déceler l'exception et d'éviter les pièges. Chaque voiture qu'il propose est inspectée, jamais accidentée, et sélectionnée avec la même rigueur qu'il appliquerait à la sienne.",

    "contact.eyebrow": "Contact",
    "contact.title": "Parlons de votre projet.",
    "contact.sub":
      "Une question, un véhicule en tête, ou l'envie de vendre ? Écrivez à Jonni ou joignez-le directement.",
    "contact.label_phone": "Téléphone",
    "contact.label_email": "Courriel",
    "contact.label_region": "Territoire",
    "contact.label_social": "Réseaux",

    "footer.region": "Grande région de Montréal",
    "footer.contact": "Contact",

    "region.value": "Grande région de Montréal",
  },

  en: {
    "nav.home": "Home",
    "nav.inventory": "Inventory",
    "nav.sell": "Sell your car",
    "nav.about": "About",
    "nav.contact": "Contact",

    "hero.cta_inventory": "View inventory",
    "hero.cta_sell": "Sell your car",

    "home.eyebrow": "Inventory",
    "home.title": "Our vehicles",
    "home.all": "Full inventory →",
    "home.empty": "No vehicles yet. Check back soon.",

    "status.available": "Available",
    "status.reserved": "Reserved",
    "status.sold": "Sold",
    "price.on_request": "Price on request",
    "value.na": "n/a",

    "body.coupe": "Coupe",
    "body.convertible": "Convertible",
    "body.sedan": "Sedan",
    "body.suv": "SUV",
    "body.hatchback": "Sportback",
    "body.wagon": "Wagon",
    "body.truck": "Truck",

    "fiche.back": "← Back to inventory",
    "fiche.year": "Year",
    "fiche.mileage": "Mileage",
    "fiche.body": "Body type",
    "fiche.transmission": "Transmission",
    "fiche.drivetrain": "Drivetrain",
    "fiche.fuel": "Fuel",
    "fiche.ext_color": "Exterior color",
    "fiche.int_color": "Interior color",
    "fiche.cta": "Request information",

    "inv.eyebrow": "Inventory",
    "inv.title": "Our inventory",
    "inv.sub":
      "Exceptional vehicles, inspected and never in an accident. Private sale: only one tax.",
    "inv.empty": "No vehicles yet. Check back soon.",

    "sell.eyebrow": "Sell your car",
    "sell.title": "Leave the sale to us, we handle the rest.",
    "sell.sub":
      "Full support from a broker. 1% commission, no risk.",
    "sell.step1_title": "Client contacted",
    "sell.step1_text":
      "We meet with you, appraise your vehicle and set the right market price together.",
    "sell.step2_title": "Listed online",
    "sell.step2_text":
      "Polished photos, your listing published on the best platforms and promoted on social media.",
    "sell.step3_title": "Sale closed",
    "sell.step3_text":
      "We screen buyers, negotiate and support you through to signing. Only 1% commission.",
    "sell.packages_eyebrow": "Our packages",
    "sell.packages_title": "Choose your package",
    "sell.packages_note":
      "No upfront fees, no risk. 1% commission only when the vehicle sells.",
    "sell.form_title": "Tell us about your vehicle",
    "sell.form_intro":
      "Fill out this form and Jonni will get back to you shortly.",
    "forfait.prefix": "Package",
    "forfait.ideal": "Ideal for",
    "sell.popular": "Most popular",

    "gallery.zoom": "Enlarge photo",
    "gallery.prev": "Previous photo",
    "gallery.next": "Next photo",
    "gallery.close": "Close",

    "form.name": "Full name",
    "form.phone": "Phone",
    "form.phone_opt": "Phone (optional)",
    "form.email": "Email",
    "form.vehicle": "Vehicle (make and model)",
    "form.year": "Year",
    "form.mileage": "Mileage",
    "form.price_opt": "Asking price (optional)",
    "form.message": "Message",
    "form.message_opt": "Message (optional)",
    "form.send_request": "Send my request",
    "form.send_message": "Send message",
    "form.sending": "Sending…",
    "form.err_name": "Your name is required.",
    "form.err_phone": "A valid phone number is required.",
    "form.err_email_req": "Email required.",
    "form.err_email": "Invalid email.",
    "form.err_vehicle": "Enter the make and model.",
    "form.err_message": "Write us a few words.",
    "form.success_sell":
      "Thank you! Your request has been received. Jonni will contact you soon about your vehicle.",
    "form.success_contact":
      "Thank you! Your message has been received. We'll reply shortly. For an immediate answer, call 438 526-4388.",

    "about.eyebrow": "About",
    "about.title": "Jonni Langlois, your trusted broker.",
    "about.p1_a": "Founder of Reeby Auto, Jonni Langlois built his reputation on a genuine passion for cars and a constant eye for detail. Through ",
    "about.p1_strong": "many transactions",
    "about.p1_b":
      ", he has guided both demanding buyers and sellers looking to get the best value for their vehicle.",
    "about.p2_a": "His ",
    "about.p2_strong": "deep knowledge of the market",
    "about.p2_b":
      " lets him appraise a vehicle accurately, spot the exceptional and avoid the pitfalls. Every car he offers is inspected, never in an accident, and selected with the same care he would give his own.",

    "contact.eyebrow": "Contact",
    "contact.title": "Let's talk about your project.",
    "contact.sub":
      "A question, a vehicle in mind, or looking to sell? Write to Jonni or reach him directly.",
    "contact.label_phone": "Phone",
    "contact.label_email": "Email",
    "contact.label_region": "Area",
    "contact.label_social": "Social",

    "footer.region": "Greater Montreal area",
    "footer.contact": "Contact",

    "region.value": "Greater Montreal area",
  },
};

export function t(locale: Locale, key: string): string {
  return dict[locale]?.[key] ?? dict.fr[key] ?? key;
}
