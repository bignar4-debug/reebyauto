import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase public (clé anon).
 * Utilisable côté serveur pour les lectures publiques (véhicules publiés) ;
 * la RLS garantit qu'on ne voit que les données autorisées.
 *
 * L'URL et la clé "anon" sont PUBLIQUES par nature (elles sont conçues pour
 * être exposées au navigateur, protégées par la RLS). On les met donc comme
 * valeurs par défaut pour que le build/déploiement fonctionne même sans
 * variables d'environnement. Les variables d'env restent prioritaires.
 *
 * La clé SECRÈTE (service_role) n'est JAMAIS ici : elle reste dans les
 * variables d'environnement, côté serveur uniquement (admin, Phase 4).
 */
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://qhgpcrrnglgzonarnkwb.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoZ3BjcnJuZ2xnem9uYXJua3diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxMDM2OTksImV4cCI6MjEwMDY3OTY5OX0.X5viBabzuRlSJa5ItcAgTztXKdMeyop328KwB_p6FNQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});
