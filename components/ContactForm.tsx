"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMemo, useState } from "react";
import { t, type Locale } from "@/lib/i18n";

/**
 * Formulaire de contact. Validation côté client (Zod), messages traduits.
 * L'envoi par courriel (Resend) sera branché à la Phase 7 ; en attendant,
 * les coordonnées directes (téléphone, courriel, réseaux) sont pleinement
 * fonctionnelles sur la page.
 */
function makeSchema(locale: Locale) {
  return z.object({
    nom: z.string().min(2, t(locale, "form.err_name")),
    courriel: z
      .string()
      .min(1, t(locale, "form.err_email_req"))
      .email(t(locale, "form.err_email")),
    telephone: z.string().optional(),
    message: z.string().min(5, t(locale, "form.err_message")),
    company: z.string().optional(), // honeypot anti-spam
  });
}

type FormData = z.infer<ReturnType<typeof makeSchema>>;

export default function ContactForm({ locale = "fr" }: { locale?: Locale }) {
  const schema = useMemo(() => makeSchema(locale), [locale]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const [envoye, setEnvoye] = useState(false);
  const [erreur, setErreur] = useState(false);

  const onSubmit = async (data: FormData) => {
    setErreur(false);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact",
          name: data.nom,
          email: data.courriel,
          phone: data.telephone,
          message: data.message,
          company: data.company,
        }),
      });
      if (!res.ok) throw new Error("send_failed");
      setEnvoye(true);
      reset();
    } catch {
      setErreur(true);
    }
  };

  if (envoye) {
    return (
      <div className="form-succes" role="status">
        {t(locale, "form.success_contact")}
      </div>
    );
  }

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Honeypot anti-spam : caché aux humains, rempli par les bots. */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="champ-pot"
        {...register("company")}
      />
      <div className="form-grille">
        <div className="champ">
          <label htmlFor="c-nom">{t(locale, "form.name")}</label>
          <input id="c-nom" type="text" autoComplete="name" {...register("nom")} />
          {errors.nom && <span className="champ-erreur">{errors.nom.message}</span>}
        </div>

        <div className="champ">
          <label htmlFor="c-tel">{t(locale, "form.phone_opt")}</label>
          <input
            id="c-tel"
            type="tel"
            autoComplete="tel"
            {...register("telephone")}
          />
        </div>

        <div className="champ champ-large">
          <label htmlFor="c-courriel">{t(locale, "form.email")}</label>
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
          <label htmlFor="c-message">{t(locale, "form.message")}</label>
          <textarea id="c-message" rows={5} {...register("message")} />
          {errors.message && (
            <span className="champ-erreur">{errors.message.message}</span>
          )}
        </div>
      </div>

      {erreur && (
        <p className="champ-erreur" role="alert">
          {t(locale, "form.error")}
        </p>
      )}
      <button type="submit" className="btn btn-primaire" disabled={isSubmitting}>
        {isSubmitting ? t(locale, "form.sending") : t(locale, "form.send_message")}
      </button>
    </form>
  );
}
