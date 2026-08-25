import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { ADMIN_USER_ID } from "@/lib/admin";

export const runtime = "nodejs";

/**
 * Traduction FR -> EN d'une description de véhicule (réservée à l'admin).
 * Jonni écrit en français ; l'anglais est généré automatiquement, sans double
 * saisie et sans configuration.
 *
 * - Par défaut : traducteur gratuit sans clé (MyMemory), ligne par ligne pour
 *   préserver la structure (1re ligne = intro, suivantes = caractéristiques).
 * - Si ANTHROPIC_API_KEY est défini : on utilise Claude (meilleure qualité).
 */

async function translateFree(text: string): Promise<string> {
  const lines = text.split("\n").slice(0, 80);
  const out: string[] = [];
  for (const line of lines) {
    const s = line.trim();
    if (!s) {
      out.push("");
      continue;
    }
    try {
      const url =
        "https://api.mymemory.translated.net/get?langpair=fr|en&q=" +
        encodeURIComponent(line);
      const r = await fetch(url);
      const d = (await r.json()) as {
        responseData?: { translatedText?: string };
      };
      const tr = d.responseData?.translatedText;
      out.push(typeof tr === "string" && tr.trim() ? tr : line);
    } catch {
      out.push(line);
    }
  }
  return out.join("\n");
}

async function translateClaude(text: string, apiKey: string): Promise<string> {
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
  if (!res.ok) throw new Error("anthropic_" + res.status);
  const data = (await res.json()) as {
    content?: { type: string; text?: string }[];
  };
  return (
    data.content
      ?.filter((b) => b.type === "text")
      .map((b) => b.text ?? "")
      .join("")
      .trim() ?? ""
  );
}

export async function POST(req: Request) {
  // Accès admin uniquement (protection anti-abus).
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.id !== ADMIN_USER_ID) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
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

  const apiKey = process.env.ANTHROPIC_API_KEY;
  try {
    const out = apiKey
      ? await translateClaude(text, apiKey)
      : await translateFree(text);
    if (!out) return NextResponse.json({ ok: false, error: "empty" }, { status: 502 });
    return NextResponse.json({ ok: true, text: out });
  } catch (e) {
    // Repli sur le traducteur gratuit si Claude échoue.
    try {
      const out = await translateFree(text);
      if (out) return NextResponse.json({ ok: true, text: out });
    } catch {}
    console.error("[translate] failed:", e);
    return NextResponse.json({ ok: false, error: "provider" }, { status: 502 });
  }
}
