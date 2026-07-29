import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase public (clé anon).
 * Utilisable côté serveur pour les lectures publiques (véhicules publiés),
 * la RLS garantit qu'on ne voit que les données autorisées.
 * L'authentification par cookies (admin) sera ajoutée à la Phase 4.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Variables Supabase manquantes : vérifie NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});
