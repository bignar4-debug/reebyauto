"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";
import { createSupabaseBrowser } from "@/lib/supabase/browser";
import { SUPABASE_URL } from "@/lib/supabase/config";
import { slugify, CARROSSERIE_OPTIONS } from "@/lib/format";

type Photo = {
  id: string;
  storage_path: string;
  is_primary: boolean;
  position: number;
};

type VehicleRow = {
  id?: string;
  slug?: string;
  make?: string;
  model?: string;
  year?: number;
  price?: number | null;
  mileage_km?: number | null;
  body_type?: string | null;
  transmission?: string | null;
  drivetrain?: string | null;
  fuel?: string | null;
  exterior_color?: string | null;
  interior_color?: string | null;
  description?: string | null;
  status?: string;
  published?: boolean;
  featured?: boolean;
  display_order?: number;
};

function photoUrl(path: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/vehicle-photos/${path}`;
}

const str = (v: unknown) => (v == null ? "" : String(v));

export default function VehicleEditor({
  vehicle,
  initialPhotos,
}: {
  vehicle: VehicleRow | null;
  initialPhotos: Photo[];
}) {
  const router = useRouter();
  const supabase = createSupabaseBrowser();
  const vehicleId = vehicle?.id ?? null;

  const [f, setF] = useState({
    make: str(vehicle?.make),
    model: str(vehicle?.model),
    year: str(vehicle?.year ?? new Date().getFullYear()),
    price: str(vehicle?.price),
    mileage_km: str(vehicle?.mileage_km),
    body_type: str(vehicle?.body_type) || "coupe",
    transmission: str(vehicle?.transmission),
    drivetrain: str(vehicle?.drivetrain),
    fuel: str(vehicle?.fuel),
    exterior_color: str(vehicle?.exterior_color),
    interior_color: str(vehicle?.interior_color),
    description: str(vehicle?.description),
    slug: str(vehicle?.slug),
    status: str(vehicle?.status) || "available",
    published: vehicle?.published ?? true,
    featured: vehicle?.featured ?? false,
    display_order: str(vehicle?.display_order ?? 0),
  });
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = (k: keyof typeof f, v: string | boolean) =>
    setF((prev) => ({ ...prev, [k]: v }));

  const nbOrNull = (s: string) => {
    const t = s.trim();
    if (t === "") return null;
    const n = parseInt(t.replace(/\s/g, ""), 10);
    return Number.isFinite(n) ? n : null;
  };

  async function save() {
    setMsg(null);
    if (!f.make.trim() || !f.model.trim()) {
      setMsg("Marque et modèle sont requis.");
      return;
    }
    setSaving(true);
    const slug =
      f.slug.trim() || slugify(`${f.make} ${f.model} ${f.year}`);
    const payload = {
      slug,
      make: f.make.trim(),
      model: f.model.trim(),
      year: nbOrNull(f.year) ?? new Date().getFullYear(),
      price: nbOrNull(f.price),
      mileage_km: nbOrNull(f.mileage_km),
      body_type: f.body_type || null,
      transmission: f.transmission.trim() || null,
      drivetrain: f.drivetrain.trim() || null,
      fuel: f.fuel.trim() || null,
      exterior_color: f.exterior_color.trim() || null,
      interior_color: f.interior_color.trim() || null,
      description: f.description.trim() || null,
      status: f.status,
      published: f.published,
      featured: f.featured,
      display_order: nbOrNull(f.display_order) ?? 0,
    };

    if (vehicleId) {
      const { error } = await supabase
        .from("vehicles")
        .update(payload)
        .eq("id", vehicleId);
      setSaving(false);
      if (error) {
        setMsg("Erreur : " + error.message);
        return;
      }
      setMsg("Enregistré.");
      router.refresh();
    } else {
      const { data, error } = await supabase
        .from("vehicles")
        .insert(payload)
        .select("id")
        .single();
      setSaving(false);
      if (error || !data) {
        setMsg("Erreur : " + (error?.message ?? "création impossible"));
        return;
      }
      router.push(`/admin/vehicule/${data.id}`);
      router.refresh();
    }
  }

  async function uploadPhotos(files: FileList | null) {
    if (!files || !vehicleId) return;
    setUploading(true);
    setMsg(null);
    const nouveaux: Photo[] = [];
    let pos = photos.length;
    for (const file of Array.from(files)) {
      try {
        const compressed = await imageCompression(file, {
          maxWidthOrHeight: 2000,
          maxSizeMB: 1.5,
          fileType: "image/webp",
          initialQuality: 0.82,
          useWebWorker: true,
        });
        const path = `${vehicleId}/${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 7)}.webp`;
        const { error: upErr } = await supabase.storage
          .from("vehicle-photos")
          .upload(path, compressed, {
            contentType: "image/webp",
            upsert: false,
          });
        if (upErr) {
          setMsg("Upload échoué : " + upErr.message);
          continue;
        }
        const isPrimary = photos.length === 0 && nouveaux.length === 0;
        const { data, error } = await supabase
          .from("vehicle_photos")
          .insert({
            vehicle_id: vehicleId,
            storage_path: path,
            position: pos++,
            is_primary: isPrimary,
          })
          .select("id, storage_path, is_primary, position")
          .single();
        if (!error && data) nouveaux.push(data as Photo);
      } catch (e) {
        setMsg("Erreur de traitement d'image.");
      }
    }
    setPhotos((prev) => [...prev, ...nouveaux]);
    setUploading(false);
    router.refresh();
  }

  async function setPrimary(id: string) {
    if (!vehicleId) return;
    await supabase
      .from("vehicle_photos")
      .update({ is_primary: false })
      .eq("vehicle_id", vehicleId);
    await supabase
      .from("vehicle_photos")
      .update({ is_primary: true })
      .eq("id", id);
    setPhotos((prev) =>
      prev.map((p) => ({ ...p, is_primary: p.id === id }))
    );
    router.refresh();
  }

  async function deletePhoto(p: Photo) {
    await supabase.storage.from("vehicle-photos").remove([p.storage_path]);
    await supabase.from("vehicle_photos").delete().eq("id", p.id);
    setPhotos((prev) => prev.filter((x) => x.id !== p.id));
    router.refresh();
  }

  async function deleteVehicle() {
    if (!vehicleId) return;
    if (!confirm("Supprimer ce véhicule et ses photos ?")) return;
    const paths = photos.map((p) => p.storage_path);
    if (paths.length) await supabase.storage.from("vehicle-photos").remove(paths);
    await supabase.from("vehicles").delete().eq("id", vehicleId);
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="editor">
      <div className="form">
        <div className="form-grille">
          <Field label="Marque" v={f.make} on={(x) => set("make", x)} />
          <Field label="Modèle" v={f.model} on={(x) => set("model", x)} />
          <Field label="Année" v={f.year} on={(x) => set("year", x)} num />
          <Field
            label="Prix ($) — vide = « Prix sur demande »"
            v={f.price}
            on={(x) => set("price", x)}
            num
          />
          <Field
            label="Kilométrage"
            v={f.mileage_km}
            on={(x) => set("mileage_km", x)}
            num
          />
          <div className="champ">
            <label>Carrosserie</label>
            <select
              value={f.body_type}
              onChange={(e) => set("body_type", e.target.value)}
            >
              {CARROSSERIE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="champ">
            <label>Statut</label>
            <select
              value={f.status}
              onChange={(e) => set("status", e.target.value)}
            >
              <option value="available">Disponible</option>
              <option value="reserved">Réservé</option>
              <option value="sold">Vendu</option>
            </select>
          </div>
          <Field
            label="Ordre d'affichage (0 = en premier)"
            v={f.display_order}
            on={(x) => set("display_order", x)}
            num
          />
          <Field
            label="Transmission"
            v={f.transmission}
            on={(x) => set("transmission", x)}
          />
          <Field
            label="Rouage (RWD, AWD…)"
            v={f.drivetrain}
            on={(x) => set("drivetrain", x)}
          />
          <Field label="Carburant" v={f.fuel} on={(x) => set("fuel", x)} />
          <Field
            label="Couleur extérieure"
            v={f.exterior_color}
            on={(x) => set("exterior_color", x)}
          />
          <Field
            label="Couleur intérieure"
            v={f.interior_color}
            on={(x) => set("interior_color", x)}
          />
          <div className="champ champ-large">
            <label>
              Description (1re ligne = intro, lignes suivantes = caractéristiques)
            </label>
            <textarea
              rows={7}
              value={f.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>
          <div className="champ champ-large editor-toggles">
            <label className="editor-check">
              <input
                type="checkbox"
                checked={f.published}
                onChange={(e) => set("published", e.target.checked)}
              />
              En ligne (visible sur le site)
            </label>
            <label className="editor-check">
              <input
                type="checkbox"
                checked={f.featured}
                onChange={(e) => set("featured", e.target.checked)}
              />
              En vedette
            </label>
          </div>
        </div>

        {msg && <p className="editor-msg">{msg}</p>}

        <div className="editor-barre">
          <button
            type="button"
            className="btn btn-primaire"
            onClick={save}
            disabled={saving}
          >
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
          {vehicleId && (
            <button
              type="button"
              className="btn btn-secondaire editor-supprimer"
              onClick={deleteVehicle}
            >
              Supprimer le véhicule
            </button>
          )}
        </div>
      </div>

      {/* Photos */}
      <div className="editor-photos">
        <h2 className="editor-sous-titre">Photos</h2>
        {!vehicleId ? (
          <p className="editor-hint">
            Enregistrez d&apos;abord le véhicule, puis vous pourrez ajouter des
            photos.
          </p>
        ) : (
          <>
            <label className="btn btn-secondaire editor-upload">
              {uploading ? "Téléversement…" : "+ Ajouter des photos"}
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                disabled={uploading}
                onChange={(e) => uploadPhotos(e.target.files)}
              />
            </label>
            {photos.length === 0 ? (
              <p className="editor-hint">Aucune photo pour l&apos;instant.</p>
            ) : (
              <div className="editor-grille-photos">
                {photos.map((p) => (
                  <div
                    key={p.id}
                    className={`editor-photo ${p.is_primary ? "est-principale" : ""}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photoUrl(p.storage_path)} alt="" />
                    {p.is_primary && (
                      <span className="editor-badge-primaire">Principale</span>
                    )}
                    <div className="editor-photo-actions">
                      {!p.is_primary && (
                        <button
                          type="button"
                          onClick={() => setPrimary(p.id)}
                        >
                          Définir principale
                        </button>
                      )}
                      <button
                        type="button"
                        className="editor-suppr-photo"
                        onClick={() => deletePhoto(p)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  v,
  on,
  num,
}: {
  label: string;
  v: string;
  on: (x: string) => void;
  num?: boolean;
}) {
  return (
    <div className="champ">
      <label>{label}</label>
      <input
        type="text"
        inputMode={num ? "numeric" : undefined}
        value={v}
        onChange={(e) => on(e.target.value)}
      />
    </div>
  );
}
