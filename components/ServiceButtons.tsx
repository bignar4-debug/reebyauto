"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useMemo, useState } from "react";
import { t, type Locale } from "@/lib/i18n";

/**
 * Quatre boutons de services sur la fiche véhicule (CARFAX, inspection,
 * financement, transport). Chaque bouton ouvre une fenêtre avec un formulaire
 * simple ; le véhicule et le service sont associés automatiquement. La demande
 * est enregistrée (table leads, type "service") et envoyée par courriel à Jonni.
 */
type ServiceKey = "carfax" | "inspection" | "financing" | "transport";

const SERVICES: { key: ServiceKey; btn: string; title: string }[] = [
  { key: "carfax", btn: "service.carfax_btn", title: "service.carfax" },
  { key: "inspection", btn: "service.inspection_btn", title: "service.inspection" },
  { key: "financing", btn: "service.financing_btn", title: "service.financing" },
  { key: "transport", btn: "service.transport_btn", title: "service.transport" },
];

function makeSchema(locale: Locale) {
  return z.object({
    nom: z.string().min(2, t(locale, "form.err_name")),
    courriel: z
      .string()
      .min(1, t(locale, "form.err_email_req"))
      .email(t(locale, "form.err_email")),
    telephone: z.string().min(8, t(locale, "form.err_phone")),
    message: z.string().optional(),
    company: z.string().optional(), // honeypot
  });
}

type FormData = z.infer<ReturnType<typeof makeSchema>>;

export default function ServiceButtons({
  vehicleId,
  vehicleLabel,
  locale = "fr",
}: {
  vehicleId: string;
  vehicleLabel: string;
  locale?: Locale;
}) {
  const [active, setActive] = useState<ServiceKey | null>(null);
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
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  const open = (key: ServiceKey) => {
    setEnvoye(false);
    setErreur(false);
    reset();
    setActive(key);
  };

  const onSubmit = async (data: FormData) => {
    if (!active) return;
    setErreur(false);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "service",
          service: active,
          name: data.nom,
          email: data.courriel,
          phone: data.telephone,
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

  const activeTitle = active
    ? t(locale, SERVICES.find((s) => s.key === active)!.title)
    : "";

  return (
    <>
      <div className="fiche-services">
        {SERVICES.map((s) => (
          <button
            key={s.key}
            type="button"
            className="service-btn"
            onClick={() => open(s.key)}
          >
            {t(locale, s.btn)}
          </button>
        ))}
      </div>

      {active && (
        <div
          className="offre-overlay"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-label={activeTitle}
        >
          <div className="offre-modale" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="offre-fermer"
              onClick={() => setActive(null)}
              aria-label={t(locale, "offer.close")}
            >
              ✕
            </button>

            <p className="offre-surtitre">{activeTitle}</p>
            <p className="offre-vehicule">{vehicleLabel}</p>

            {envoye ? (
              <div className="form-succes" role="status">
                {t(locale, "service.success")}
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
                    <label htmlFor="s-nom">{t(locale, "form.name")}</label>
                    <input
                      id="s-nom"
                      type="text"
                      autoComplete="name"
                      {...register("nom")}
                    />
                    {errors.nom && (
                      <span className="champ-erreur">{errors.nom.message}</span>
                    )}
                  </div>

                  <div className="champ">
                    <label htmlFor="s-tel">{t(locale, "form.phone")}</label>
                    <input
                      id="s-tel"
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

                  <div className="champ champ-large">
                    <label htmlFor="s-courriel">{t(locale, "form.email")}</label>
                    <input
                      id="s-courriel"
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

                  <div className="champ champ-large">
                    <label htmlFor="s-message">
                      {t(locale, "form.message_opt")}
                    </label>
                    <textarea id="s-message" rows={3} {...register("message")} />
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
                    : t(locale, "form.send_request")}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
