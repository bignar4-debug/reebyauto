import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase/config";
import { ADMIN_USER_ID } from "@/lib/admin";

/**
 * Protège /admin : redirige vers /admin/connexion si non connecté,
 * et rafraîchit la session (cookies) à chaque requête admin.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const estConnexion = path === "/admin/connexion";
  const estAdmin = user?.id === ADMIN_USER_ID; // seul Jonni est admin

  if (!estAdmin && !estConnexion) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/connexion";
    return NextResponse.redirect(url);
  }
  if (estAdmin && estConnexion) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
