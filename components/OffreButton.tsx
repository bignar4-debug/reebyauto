"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useMemo, useState } from "react";
import { t, type Locale } from "@/lib/i18n";

/**
 * Bouton « Faire une offre » présent sur chaque fiche véhicule.
 * Ouvre une fenêtre modale avec un formulaire simple ; le véhicule est associé
 * automatiquement. L'offre est enregistrée (table leads) et envoyée par courriel
 * via /api/lead (type "offre").
 */
function makeSchema(locale: Locale) {
  return z.object({
    nom: z.string().min(2, t(locale, "form.err_name")),
    courriel: z
      .string()
      .min(1, t(locale, "form.err_email_req"))
      .email(t(locale, "form.err_email")),
    telephone: z.string().min(8, t(locale, "form.err_phone")),
    montant: z.string().min(1, t(locale, "offer.err_amount")),
    message: z.string().optional(),
    company: z.string().optional(), // honeypot
  });
}

type FormData = z.infer<ReturnType<typeof makeSchema>>;

export default function OffreButton({
  vehicleId,
  vehicleLabel,
  locale = "fr",
}: {
  vehicleId: string;
  vehicleLabel: string;
  locale?: Locale;
}) {
  const [ouvert, setOuvert] = useState(false);
  const [envoye, setEnvoye] = useState(false);
  const [erreur, setErreur] = useState(false);
  const schema = useMemo(() => makeSchema(locale), [locale]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!ouvert) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOuvert(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [ouvert]);

  const onSubmit = async (data: FormData) => {
    setErreur(false);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "offre",
          name: data.nom,
          email: data.courriel,
          phone: data.telephone,
          offer_amount: data.montant,
          message: data.message,
          vehicle: vehicleLabel,
          vehicle_id: vehicleId,
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

  return (
    <>
      <button
        type="button"
        className="btn btn-primaire"
        onClick={() => {
          setEnvoye(false);
          setErreur(false);
          setOuvert(true);
        }}
      >
        {t(locale, "offer.cta")}
      </button>

      {ouvert && (
        <div
          className="offre-overlay"
          onClick={() => setOuvert(false)}
          role="dialog"
          aria-modal="true"
          aria-label={t(locale, "offer.title")}
        >
          <div className="offre-modale" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="offre-fermer"
              onClick={() => setOuvert(false)}
              aria-label={t(locale, "offer.close")}
            >
              ✕
            </button>

            <p className="offre-surtitre">{t(locale, "offer.title")}</p>
            <p className="offre-vehicule">{vehicleLabel}</p>

            {envoye ? (
              <div className="form-succes" role="status">
                {t(locale, "offer.success")}
              </div>
            ) : (
              <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
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
                    <label htmlFor="o-nom">{t(locale, "form.name")}</label>
                    <input
                      id="o-nom"
                      type="text"
                      autoComplete="name"
                      {...register("nom")}
                    />
                    {errors.nom && (
                      <span className="champ-erreur">{errors.nom.message}</span>
                    )}
                  </div>

                  <div className="champ">
                    <label htmlFor="o-tel">{t(locale, "form.phone")}</label>
                    <input
                      id="o-tel"
                      type="tel"
                      autoComplete="tel"
                      {...register("telephone")}
                    />
                    {errors.telephone && (
                      <span className="champ-erreur">
                        {errors.telephone.message}
                      </span>
                    )}
                  </div>

                  <div className="champ">
                    <label htmlFor="o-courriel">{t(locale, "form.email")}</label>
                    <input
                      id="o-courriel"
                      type="email"
                      autoComplete="email"
                      {...register("courriel")}
                    />
                    {errors.courriel && (
                      <span className="champ-erreur">
                        {errors.courriel.message}
                      </span>
                    )}
                  </div>

                  <div className="champ">
                    <label htmlFor="o-montant">{t(locale, "offer.amount")}</label>
                    <input
                      id="o-montant"
                      type="text"
                      inputMode="numeric"
                      placeholder="$"
                      {...register("montant")}
                    />
                    {errors.montant && (
                      <span className="champ-erreur">
                        {errors.montant.message}
                      </span>
                    )}
                  </div>

                  <div className="champ champ-large">
                    <label htmlFor="o-message">
                      {t(locale, "form.message_opt")}
                    </label>
                    <textarea id="o-message" rows={3} {...register("message")} />
                  </div>
                </div>

                {erreur && (
                  <p className="champ-erreur" role="alert">
                    {t(locale, "form.error")}
                  </p>
                )}
                <button
                  type="submit"
                  className="btn btn-primaire offre-envoyer"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? t(locale, "form.sending")
                    : t(locale, "offer.send")}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
