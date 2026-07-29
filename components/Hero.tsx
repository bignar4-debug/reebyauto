"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/**
 * Hero : vidéo de fond + logo Reeby centré par-dessus.
 * Séquence d'intro : au chargement, une lumière dorée fait le tour du logo
 * (~1 s), puis la vidéo démarre derrière, le logo restant à la même place.
 */
export default function Hero() {
  const [lance, setLance] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const reduit = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const demarrer = () => {
      setLance(true);
      videoRef.current?.play().catch(() => {});
    };

    if (reduit) {
      demarrer();
      return;
    }
    const t = setTimeout(demarrer, 1100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className={`hero-v ${lance ? "est-lance" : ""}`}>
      <video
        ref={videoRef}
        className="hero-v-video"
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>
      <div className="hero-v-voile" aria-hidden="true" />

      <div className="hero-v-centre">
        <div className="hero-v-logo">
          <span className="hero-v-ring" aria-hidden="true" />
          <Image
            src="/logo.png"
            alt="Reeby Auto"
            width={779}
            height={348}
            className="hero-v-logo-img"
            priority
          />
        </div>

        <div className="hero-v-actions">
          <Link href="/inventaire" className="btn btn-primaire">
            Voir l&apos;inventaire
          </Link>
          <Link href="/vendez" className="btn btn-secondaire">
            Vendez votre auto
          </Link>
        </div>
      </div>

      <a href="#vehicules" className="hero-scroll" aria-label="Défiler">
        Nos véhicules
      </a>
    </section>
  );
}
