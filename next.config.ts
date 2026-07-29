import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Origine Supabase (API + Storage), dérivée de l'URL du projet.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseOrigin = supabaseUrl ? new URL(supabaseUrl).origin : "";
const supabaseHost = supabaseUrl ? new URL(supabaseUrl).hostname : "";

/**
 * Content-Security-Policy.
 * - Aucun 'unsafe-eval' en production (exigence sécurité).
 * - En développement, Next a besoin de 'unsafe-eval' + WebSocket pour le
 *   rechargement à chaud (HMR) ; on les autorise UNIQUEMENT en dev.
 * - 'unsafe-inline' sur script/style reste nécessaire pour l'hydratation Next
 *   et next/font ; on le durcira avec une CSP à nonce à une phase ultérieure.
 * - Supabase autorisé sur connect-src (API/Realtime) et img-src (Storage).
 */
const csp = [
  "default-src 'self'",
  isDev
    ? "script-src 'self' 'unsafe-eval' 'unsafe-inline'"
    : "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${supabaseOrigin}`.trim(),
  "font-src 'self'",
  isDev
    ? `connect-src 'self' ws: ${supabaseOrigin}`.trim()
    : `connect-src 'self' ${supabaseOrigin}`.trim(),
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
]
  .filter(Boolean)
  .join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  // Autorise next/image à servir les photos depuis Supabase Storage (Phase 6).
  images: supabaseHost
    ? {
        remotePatterns: [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/**",
          },
        ],
      }
    : undefined,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
