"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

/**
 * Formulaire de contact. Validation côté client (Zod).
 * L'envoi par courriel (Resend) sera branché à la Phase 7 ; en attendant,
 * les coordonnées directes (téléphone, courriel, réseaux) sont pleinement
 * fonctionnelles sur la page.
 */
const schema = z.object({
  nom: z.string().min(2, "Votre nom est requis."),
  courriel: z.string().min(1, "Courriel requis.").email("Courriel invalide."),
  telephone: z.string().optional(),
  message: z.string().min(5, "Écrivez-nous quelques mots."),
});

type FormData = z.infer<typeof schema>;

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const [envoye, setEnvoye] = useState(false);

  const onSubmit = async (data: FormData) => {
    // TODO Phase 7 : envoi via Resend + enregistrement de la demande.
    await new Promise((r) => setTimeout(r, 500));
    console.log("Message de contact:", data);
    setEnvoye(true);
    reset();
  };

  if (envoye) {
    return (
      <div className="form-succes" role="status">
        <strong>Merci !</strong> Votre message a bien été reçu. On vous répond
        rapidement. Pour une réponse immédiate, appelez le 438 526-4388.
      </div>
    );
  }

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="form-grille">
        <div className="champ">
          <label htmlFor="c-nom">Nom complet</label>
          <input id="c-nom" type="text" autoComplete="name" {...register("nom")} />
          {errors.nom && <span className="champ-erreur">{errors.nom.message}</span>}
        </div>

        <div className="champ">
          <label htmlFor="c-tel">Téléphone (optionnel)</label>
          <input
            id="c-tel"
            type="tel"
            autoComplete="tel"
            {...register("telephone")}
          />
        </div>

        <div className="champ champ-large">
          <label htmlFor="c-courriel">Courriel</label>
          <input
            id="c-courriel"
            type="email"
            autoComplete="email"
            {...register("courriel")}
          />
          {errors.courriel && (
            <span className="champ-erreur">{errors.courriel.message}</span>
          )}
        </div>

        <div className="champ champ-large">
          <label htmlFor="c-message">Message</label>
          <textarea id="c-message" rows={5} {...register("message")} />
          {errors.message && (
            <span className="champ-erreur">{errors.message.message}</span>
          )}
        </div>
      </div>

      <button type="submit" className="btn btn-primaire" disabled={isSubmitting}>
        {isSubmitting ? "Envoi…" : "Envoyer le message"}
      </button>
    </form>
  );
}
