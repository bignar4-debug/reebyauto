import Image from "next/image";
import Link from "next/link";
import { formatPrix, formatKm } from "@/lib/format";
import { carImage } from "@/lib/carImage";
import { primaryPhotoUrl, type VehiclePhoto } from "@/lib/photos";

/**
 * Carte véhicule (aperçu), cliquable vers la fiche /vehicule/[slug].
 * Affiche la photo si elle existe (/public/cars/<slug>.jpg), sinon un repli SVG.
 * Les vraies photos remplaceront les placeholders à la Phase 6.
 */
type Vehicle = {
  slug: string;
  make: string;
  model: string;
  year: number;
  price: number | null;
  mileage_km: number | null;
  body_type: string | null;
  status: string;
  vehicle_photos?: VehiclePhoto[] | null;
};

const STATUTS: Record<string, string> = {
  available: "Disponible",
  reserved: "Réservé",
  sold: "Vendu",
};

export default function VehicleCard({
  v,
  featured = false,
}: {
  v: Vehicle;
  featured?: boolean;
}) {
  const statut = STATUTS[v.status] ?? v.status;
  const img = primaryPhotoUrl(v.vehicle_photos) ?? carImage(v.slug);

  return (
    <Link
      href={`/vehicule/${v.slug}`}
      className={`vcard panneau ${featured ? "vcard--featured" : ""}`}
    >
      <div className="vcard-media">
        <span className={`badge badge-${v.status}`}>{statut}</span>
        {(v.status === "reserved" || v.status === "sold") && (
          <div className={`media-overlay media-overlay--${v.status}`}>
            <span>{v.status === "sold" ? "Vendu" : "Réservé"}</span>
          </div>
        )}
        {img ? (
          <Image
            src={img}
            alt={`${v.make} ${v.model}`}
            fill
            sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 400px"
            className="vcard-photo"
          />
        ) : (
          <svg
            className="vcard-silhouette"
            viewBox="0 0 200 90"
            aria-hidden="true"
            fill="none"
          >
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
        )}
      </div>

      <div className="vcard-body">
        <h3 className="vcard-titre">
          {v.make} {v.model}
        </h3>
        <p className="vcard-meta mono">
          {v.year} · {formatKm(v.mileage_km)}
        </p>
        <p className="vcard-prix mono">{formatPrix(v.price)}</p>
      </div>
    </Link>
  );
}
