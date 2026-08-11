import { NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

/**
 * Réception des formulaires (contact + vendez).
 * 1) Sauvegarde la demande dans la table `leads` (filet de sécurité, clé anon).
 * 2) Envoie un courriel de notification via Resend (si RESEND_API_KEY configuré).
 * Le visiteur reçoit un succès dès qu'au moins un des deux a fonctionné, pour
 * qu'aucune demande ne soit perdue même avant la configuration du courriel.
 */
const schema = z.object({
  type: z.enum(["contact", "vendez"]),
  name: z.string().min(1).max(200),
  email: z.string().max(320).optional(),
  phone: z.string().max(60).optional(),
  vehicle: z.string().max(200).optional(),
  year: z.string().max(20).optional(),
  mileage: z.string().max(40).optional(),
  price: z.string().max(40).optional(),
  message: z.string().max(5000).optional(),
  // Honeypot anti-spam : champ caché qui doit rester vide.
  company: z.string().max(200).optional(),
});

// Limiteur de débit best-effort (par IP, fenêtre fixe). Défense en profondeur
// contre le spam du formulaire ; l'état vit dans l'instance serverless chaude.
const RL_WINDOW_MS = 60_000;
const RL_MAX = 5;
const rlHits = new Map<string, { count: number; reset: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  if (rlHits.size > 5000) {
    for (const [k, v] of rlHits) if (now > v.reset) rlHits.delete(k);
  }
  const e = rlHits.get(ip);
  if (!e || now > e.reset) {
    rlHits.set(ip, { count: 1, reset: now + RL_WINDOW_MS });
    return false;
  }
  e.count += 1;
  return e.count > RL_MAX;
}

const clean = (s: string | undefined) =>
  s && s.trim() !== "" ? s.trim() : null;

const esc = (s: string | null) =>
  (s ?? "").replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string
  );

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  const d = parsed.data;

  // Honeypot rempli => bot. On répond succès sans rien traiter.
  if (d.company && d.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const lead = {
    type: d.type,
    name: d.name.trim(),
    email: clean(d.email),
    phone: clean(d.phone),
    vehicle: clean(d.vehicle),
    year: clean(d.year),
    mileage: clean(d.mileage),
    price: clean(d.price),
    message: clean(d.message),
  };

  let saved = false;
  let emailed = false;

  // 1) Sauvegarde en base (filet de sécurité).
  try {
    const { error } = await supabase.from("leads").insert(lead);
    if (error) console.error("[lead] insert error:", error.message);
    else saved = true;
  } catch (e) {
    console.error("[lead] insert exception:", e);
  }

  // 2) Courriel via Resend.
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);
      const to = process.env.LEAD_TO_EMAIL ?? "jonni@reebyauto.com";
      const from =
        process.env.LEAD_FROM_EMAIL ?? "Reeby Auto <onboarding@resend.dev>";

      const subject =
        d.type === "vendez"
          ? `Nouvelle demande de vente — ${lead.vehicle ?? lead.name}`
          : `Nouveau message — ${lead.name}`;

      const champs: [string, string | null][] = [
        ["Type", d.type === "vendez" ? "Vendez votre auto" : "Contact"],
        ["Nom", lead.name],
        ["Courriel", lead.email],
        ["Téléphone", lead.phone],
        ["Véhicule", lead.vehicle],
        ["Année", lead.year],
        ["Kilométrage", lead.mileage],
        ["Prix demandé", lead.price],
        ["Message", lead.message],
      ];
      const rows = champs
        .filter(([, v]) => v)
        .map(
          ([k, v]) =>
            `<tr><td style="padding:6px 14px 6px 0;color:#8a8a8f;vertical-align:top;white-space:nowrap">${k}</td><td style="padding:6px 0;color:#111">${esc(
              v
            ).replace(/\n/g, "<br>")}</td></tr>`
        )
        .join("");

      const html = `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px">
        <h2 style="margin:0 0 4px">${subject}</h2>
        <p style="margin:0 0 16px;color:#8a8a8f">Reçu depuis reebyauto.com</p>
        <table style="border-collapse:collapse;font-size:15px">${rows}</table>
      </div>`;

      await resend.emails.send({
        from,
        to,
        replyTo: lead.email ?? undefined,
        subject,
        html,
      });
      emailed = true;
    } catch (e) {
      console.error("[lead] resend error:", e);
    }
  }

  if (!saved && !emailed) {
    return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
