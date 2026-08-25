import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { ADMIN_USER_ID } from "@/lib/admin";

export const runtime = "nodejs";

/**
 * Traduction FR -> EN d'une description de véhicule (réservée à l'admin).
 * Utilisée par l'éditeur pour remplir automatiquement la version anglaise :
 * Jonni écrit en français, l'anglais est généré sans double saisie.
 *
 * Nécessite ANTHROPIC_API_KEY (variable d'env, côté serveur). Sans clé, la
 * route répond `configured: false` et l'éditeur enregistre le français seul
 * (les pages EN retombent alors sur le français).
 */
export async function POST(req: Request) {
  // 1) Accès admin uniquement (protection anti-abus / coûts).
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.id !== ADMIN_USER_ID) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: false, configured: false });
  }

  let text = "";
  try {
    const body = (await req.json()) as { text?: unknown };
    if (typeof body.text === "string") text = body.text;
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }
  text = text.trim();
  if (!text) return NextResponse.json({ ok: true, text: "" });
  if (text.length > 8000) {
    return NextResponse.json({ ok: false, error: "too_long" }, { status: 413 });
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 2000,
        system:
          "You are a professional automotive listing translator for a Quebec car broker. " +
          "Translate the user's French vehicle description into natural, professional English. " +
          "Rules: preserve the exact line structure and blank lines; keep every number, unit, " +
          "price, model name, trim, brand and proper noun unchanged; do not add, remove or " +
          "reorder content; do not add any commentary. Output ONLY the translated text.",
        messages: [{ role: "user", content: text }],
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[translate] anthropic error:", res.status, detail.slice(0, 300));
      return NextResponse.json({ ok: false, error: "provider" }, { status: 502 });
    }

    const data = (await res.json()) as {
      content?: { type: string; text?: string }[];
    };
    const out =
      data.content
        ?.filter((b) => b.type === "text")
        .map((b) => b.text ?? "")
        .join("")
        .trim() ?? "";

    return NextResponse.json({ ok: true, text: out });
  } catch (e) {
    console.error("[translate] exception:", e);
    return NextResponse.json({ ok: false, error: "exception" }, { status: 502 });
  }
}
