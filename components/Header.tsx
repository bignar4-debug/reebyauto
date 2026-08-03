"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Barre de navigation.
 * Sur l'accueil : cachée en haut (hero plein écran), apparaît dès qu'on défile.
 * Sur les autres pages : toujours visible.
 */

const LIENS = [
  { href: "/", label: "Accueil" },
  { href: "/inventaire", label: "Inventaire" },
  { href: "/vendez", label: "Vendez votre auto" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [ouvert, setOuvert] = useState(false);
  const estAccueil = pathname === "/";
  const [montre, setMontre] = useState(!estAccueil);

  useEffect(() => {
    setOuvert(false);
    if (!estAccueil) {
      setMontre(true);
      return;
    }
    const onScroll = () => setMontre(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [estAccueil]);

  const estActif = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className={`entete ${montre ? "est-visible" : ""}`}>
      <nav className="nav-inner" aria-label="Navigation principale">
        <Link href="/" className="nav-logo" onClick={() => setOuvert(false)}>
          <Image
            src="/logo.png"
            alt="Reeby Auto"
            width={200}
            height={89}
            className="nav-logo-img"
            priority
          />
        </Link>

        {/* Liens : rangée horizontale sur écran large, menu déroulant sur mobile */}
        <ul className={`nav-liens ${ouvert ? "est-ouvert" : ""}`}>
          {LIENS.map((lien) => (
            <li key={lien.href}>
              <Link
                href={lien.href}
                className={`nav-lien ${estActif(lien.href) ? "actif" : ""}`}
                aria-current={estActif(lien.href) ? "page" : undefined}
                onClick={() => setOuvert(false)}
              >
                {lien.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-droite">
          {/* Bouton menu : visible seulement sur mobile (via CSS) */}
          <button
            type="button"
            className="nav-menu-btn"
            aria-label={ouvert ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={ouvert}
            onClick={() => setOuvert((v) => !v)}
          >
            <span className="nav-menu-barre" />
            <span className="nav-menu-barre" />
            <span className="nav-menu-barre" />
          </button>
        </div>
      </nav>
    </header>
  );
}
