import { SOCIAL } from "@/lib/social";

/**
 * Liens réseaux sociaux (Instagram + Facebook) avec icônes.
 */
export default function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`social ${className}`}>
      <a
        href={SOCIAL.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram de Reeby Auto"
        className="social-lien"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <circle
            cx="12"
            cy="12"
            r="4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
        </svg>
      </a>
      <a
        href={SOCIAL.facebook}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook de Jonni Langlois"
        className="social-lien"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path
            fill="currentColor"
            d="M15.12 5.32H17V2.14A26.11 26.11 0 0 0 14.26 2c-2.72 0-4.58 1.66-4.58 4.7v2.6H6.6v3.56h3.08V22h3.68v-9.14h3.06l.46-3.56h-3.52V7.05c0-1.03.29-1.73 1.76-1.73z"
          />
        </svg>
      </a>
    </div>
  );
}
