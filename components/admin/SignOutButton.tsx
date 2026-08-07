"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

export default function SignOutButton() {
  const router = useRouter();
  const onClick = async () => {
    const supabase = createSupabaseBrowser();
    await supabase.auth.signOut();
    router.replace("/admin/connexion");
    router.refresh();
  };
  return (
    <button type="button" className="btn btn-secondaire" onClick={onClick}>
      Déconnexion
    </button>
  );
}
