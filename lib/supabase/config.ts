/**
 * URL + clé anon Supabase (publiques, protégées par la RLS).
 * Valeurs par défaut pour que le build fonctionne sans variables d'env.
 */
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://qhgpcrrnglgzonarnkwb.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoZ3BjcnJuZ2xnem9uYXJua3diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxMDM2OTksImV4cCI6MjEwMDY3OTY5OX0.X5viBabzuRlSJa5ItcAgTztXKdMeyop328KwB_p6FNQ";
