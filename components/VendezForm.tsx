"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMemo, useState } from "react";
import { t, type Locale } from "@/lib/i18n";

/**
 * Formulaire "Vendez votre auto". Validation côté client (Zod), messages
 * traduits. L'ENVOI RÉEL (courriel Resend + enregistrement de la demande dans
 * Supabase) sera branché à la Phase 7 — pour l'instant on valide et on affiche
 * une confirmation.
 */
function makeSchema(locale: Locale) {
  return z.object({
    nom: z.string().min(2, t(locale, "form.err_name")),
    telephone: z.string().min(8, t(locale, "form.err_phone")),
    courriel: z
      .string()
      .min(1, t(locale, "form.err_email_req"))
      .email(t(locale, "form.err_email")),
    vehicule: z.string().min(2, t(locale, "form.err_vehicle")),
    annee: z.string().optional(),
    kilometrage: z.string().optional(),
    prix: z.string().optional(),
    message: z.string().optional(),
  });
}

type FormData = z.infer<ReturnType<typeof makeSchema>>;

export default function VendezForm({ locale = "fr" }: { locale?: Locale }) {
  const schema = useMemo(() => makeSchema(locale), [locale]);
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
        {t(locale, "form.success_sell")}
      </div>
    );
  }

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="form-grille">
        <div className="champ">
          <label htmlFor="nom">{t(locale, "form.name")}</label>
          <input id="nom" type="text" autoComplete="name" {...register("nom")} />
          {errors.nom && <span className="champ-erreur">{errors.nom.message}</span>}
        </div>

        <div className="champ">
          <label htmlFor="telephone">{t(locale, "form.phone")}</label>
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
          <label htmlFor="courriel">{t(locale, "form.email")}</label>
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
          <label htmlFor="vehicule">{t(locale, "form.vehicle")}</label>
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
          <label htmlFor="annee">{t(locale, "form.year")}</label>
          <input id="annee" type="text" inputMode="numeric" {...register("annee")} />
        </div>

        <div className="champ">
          <label htmlFor="kilometrage">{t(locale, "form.mileage")}</label>
          <input
            id="kilometrage"
            type="text"
            inputMode="numeric"
            {...register("kilometrage")}
          />
        </div>

        <div className="champ champ-large">
          <label htmlFor="prix">{t(locale, "form.price_opt")}</label>
          <input id="prix" type="text" inputMode="numeric" {...register("prix")} />
        </div>

        <div className="champ champ-large">
          <label htmlFor="message">{t(locale, "form.message_opt")}</label>
          <textarea id="message" rows={4} {...register("message")} />
        </div>
      </div>

      <button type="submit" className="btn btn-primaire" disabled={isSubmitting}>
        {isSubmitting ? t(locale, "form.sending") : t(locale, "form.send_request")}
      </button>
    </form>
  );
}
