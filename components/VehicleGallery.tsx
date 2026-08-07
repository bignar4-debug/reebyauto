"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { t, type Locale } from "@/lib/i18n";

function Silhouette() {
  return (
    <svg className="vcard-silhouette" viewBox="0 0 200 90" aria-hidden="true" fill="none">
      <path
        d="M14 62c8 2 164 2 172 0M22 62c-4 0-8-3-8-8 0-6 10-10 22-14 10-10 22-18 40-20 22-2 40 6 54 18 10 2 42 4 48 10 3 3 2 14-4 14"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="58" cy="64" r="12" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="146" cy="64" r="12" stroke="currentColor" strokeWidth="2.2" />
    </svg>
  );
}

export default function VehicleGallery({
  photos,
  alt,
  status,
  locale = "fr",
}: {
  photos: string[];
  alt: string;
  status: string;
  locale?: Locale;
}) {
  const [i, setI] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const n = photos.length;
  const label =
    status === "reserved" || status === "sold"
      ? t(locale, `status.${status}`)
      : undefined;

  const prev = useCallback(() => setI((x) => (x - 1 + n) % n), [n]);
  const next = useCallback(() => setI((x) => (x + 1) % n), [n]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, prev, next]);

  const overlay = label ? (
    <div className={`media-overlay media-overlay--${status}`}>
      <span>{label}</span>
    </div>
  ) : null;

  if (n === 0) {
    return (
      <div className="fiche-media">
        {overlay}
        <Silhouette />
      </div>
    );
  }

  return (
    <div className="gallery">
      <div
        className="gallery-main"
        onClick={() => setLightbox(true)}
        role="button"
        aria-label={t(locale, "gallery.zoom")}
      >
        <Image
          src={photos[i]}
          alt={alt}
          fill
          sizes="(max-width: 900px) 100vw, 720px"
          className="gallery-img"
          priority
        />
        {overlay}
        {n > 1 && (
          <>
            <button
              type="button"
              className="gallery-fleche gallery-fleche--g"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label={t(locale, "gallery.prev")}
            >
              ‹
            </button>
            <button
              type="button"
              className="gallery-fleche gallery-fleche--d"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label={t(locale, "gallery.next")}
            >
              ›
            </button>
            <span className="gallery-compteur">
              {i + 1} / {n}
            </span>
          </>
        )}
      </div>

      {n > 1 && (
        <div className="gallery-vignettes">
          {photos.map((url, idx) => (
            <button
              key={url}
              type="button"
              className={`gallery-vignette ${idx === i ? "active" : ""}`}
              onClick={() => setI(idx)}
              aria-label={`Photo ${idx + 1}`}
            >
              <Image src={url} alt="" fill sizes="120px" />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(false)}>
          <button
            type="button"
            className="lightbox-fermer"
            onClick={() => setLightbox(false)}
            aria-label={t(locale, "gallery.close")}
          >
            ✕
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photos[i]}
            alt={alt}
            className="lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
          {n > 1 && (
            <>
              <button
                type="button"
                className="lightbox-fleche lightbox-fleche--g"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label={t(locale, "gallery.prev")}
              >
                ‹
              </button>
              <button
                type="button"
                className="lightbox-fleche lightbox-fleche--d"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label={t(locale, "gallery.next")}
              >
                ›
              </button>
              <span className="lightbox-compteur">
                {i + 1} / {n}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
