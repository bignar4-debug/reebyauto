import type { Metadata } from "next";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Connexion · Admin Reeby Auto",
  robots: { index: false, follow: false },
};

export default function Connexion() {
  return (
    <div className="contenu admin-connexion">
      <div className="admin-login-card panneau">
        <p className="surtitre">Espace admin</p>
        <h1 className="admin-login-titre">Connexion</h1>
        <p className="admin-login-sous">Gérez votre inventaire Reeby Auto.</p>
        <LoginForm />
      </div>
    </div>
  );
}
