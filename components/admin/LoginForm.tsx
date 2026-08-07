"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

export default function LoginForm() {
  const router = useRouter();
  const [courriel, setCourriel] = useState("");
  const [mdp, setMdp] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [charge, setCharge] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur(null);
    setCharge(true);
    const supabase = createSupabaseBrowser();
    const { error } = await supabase.auth.signInWithPassword({
      email: courriel.trim(),
      password: mdp,
    });
    setCharge(false);
    if (error) {
      setErreur("Courriel ou mot de passe invalide.");
      return;
    }
    router.replace("/admin");
    router.refresh();
  };

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="champ champ-large">
        <label htmlFor="l-courriel">Courriel</label>
        <input
          id="l-courriel"
          type="email"
          autoComplete="email"
          value={courriel}
          onChange={(e) => setCourriel(e.target.value)}
          required
        />
      </div>
      <div className="champ champ-large">
        <label htmlFor="l-mdp">Mot de passe</label>
        <input
          id="l-mdp"
          type="password"
          autoComplete="current-password"
          value={mdp}
          onChange={(e) => setMdp(e.target.value)}
          required
        />
      </div>
      {erreur && <p className="champ-erreur">{erreur}</p>}
      <button type="submit" className="btn btn-primaire" disabled={charge}>
        {charge ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
