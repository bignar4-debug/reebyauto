"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

/**
 * Formulaire "Vendez votre auto".
 * Validation côté client (Zod). L'ENVOI RÉEL (courriel Resend + enregistrement
 * de la demande dans Supabase) sera branché à la Phase 7 — pour l'instant on
 * valide et on affiche une confirmation.
 */
const schema = z.object({
  nom: z.string().min(2, "Votre nom est requis."),
  telephone: z.string().min(8, "Un numéro de téléphone valide est requis."),
  courriel: z.string().min(1, "Courriel requis.").email("Courriel invalide."),
  vehicule: z.string().min(2, "Indiquez la marque et le modèle."),
  annee: z.string().optional(),
  kilometrage: z.string().optional(),
  prix: z.string().optional(),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function VendezForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const [envoye, setEnvoye] = useState(false);

  const onSubmit = async (data: FormData) => {
    // TODO Phase 7 : POST vers une route API -> Resend (courriel) + Supabase (demande).
    await new Promise((r) => setTimeout(r, 500));
    console.log("Demande de vente:", data);
    setEnvoye(true);
    reset();
  };

  if (envoye) {
    return (
      <div className="form-succes" role="status">
        <strong>Merci !</strong> Votre demande a bien été reçue. Jonni vous
        contactera sous peu au sujet de votre véhicule.
      </div>
    );
  }

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="form-grille">
        <div className="champ">
          <label htmlFor="nom">Nom complet</label>
          <input id="nom" type="text" autoComplete="name" {...register("nom")} />
          {errors.nom && <span className="champ-erreur">{errors.nom.message}</span>}
        </div>

        <div className="champ">
          <label htmlFor="telephone">Téléphone</label>
          <input
            id="telephone"
            type="tel"
            autoComplete="tel"
            {...register("telephone")}
          />
          {errors.telephone && (
            <span className="champ-erreur">{errors.telephone.message}</span>
          )}
        </div>

        <div className="champ">
          <label htmlFor="courriel">Courriel</label>
          <input
            id="courriel"
            type="email"
            autoComplete="email"
            {...register("courriel")}
          />
          {errors.courriel && (
            <span className="champ-erreur">{errors.courriel.message}</span>
          )}
        </div>

        <div className="champ">
          <label htmlFor="vehicule">Véhicule (marque et modèle)</label>
          <input
            id="vehicule"
            type="text"
            placeholder="ex. Porsche 911 Carrera S"
            {...register("vehicule")}
          />
          {errors.vehicule && (
            <span className="champ-erreur">{errors.vehicule.message}</span>
          )}
        </div>

        <div className="champ">
          <label htmlFor="annee">Année</label>
          <input id="annee" type="text" inputMode="numeric" {...register("annee")} />
        </div>

        <div className="champ">
          <label htmlFor="kilometrage">Kilométrage</label>
          <input
            id="kilometrage"
            type="text"
            inputMode="numeric"
            {...register("kilometrage")}
          />
        </div>

        <div className="champ champ-large">
          <label htmlFor="prix">Prix demandé (optionnel)</label>
          <input id="prix" type="text" inputMode="numeric" {...register("prix")} />
        </div>

        <div className="champ champ-large">
          <label htmlFor="message">Message (optionnel)</label>
          <textarea id="message" rows={4} {...register("message")} />
        </div>
      </div>

      <button type="submit" className="btn btn-primaire" disabled={isSubmitting}>
        {isSubmitting ? "Envoi…" : "Envoyer ma demande"}
      </button>
    </form>
  );
}
