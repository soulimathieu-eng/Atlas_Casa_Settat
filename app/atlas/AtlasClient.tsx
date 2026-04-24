"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import MapCard from "@/components/MapCard";
import FicheModal from "@/components/FicheModal";
import { CATEGORIES, CATEGORY_COLORS, CATEGORY_ICONS, FICHES, type Fiche, type Categorie } from "@/lib/fiches-data";

export interface FicheOverrides {
  titre?: string;
  messagePrincipal?: string;
  source?: string;
  annee?: string;
  typeRepresentation?: string;
  logiciel?: string;
  auteur?: string;
}

interface MapRecord {
  id: string;
  title: string;
  categorie: string;
  cloudinary_url: string;
  cloudinary_public_id: string;
  fiche_key: string;
  published: boolean;
  display_order: number;
  created_at: string;
  fiche_overrides?: FicheOverrides;
}

export default function AtlasClient() {
  const searchParams = useSearchParams();
  const [maps, setMaps] = useState<MapRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("Toutes");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedMap, setSelectedMap] = useState<{ map: MapRecord; fiche: Fiche } | null>(null);

  // Merge hardcoded fiche data with Supabase overrides (overrides take priority)
  const mergeFiche = (baseFiche: Fiche, overrides?: FicheOverrides): Fiche => {
    if (!overrides || Object.keys(overrides).length === 0) return baseFiche;
    return {
      ...baseFiche,
      ...(overrides.titre && { titre: overrides.titre }),
      ...(overrides.messagePrincipal && { messagePrincipal: overrides.messagePrincipal }),
      ...(overrides.source && { source: overrides.source }),
      ...(overrides.annee && { annee: overrides.annee }),
      ...(overrides.typeRepresentation && { typeRepresentation: overrides.typeRepresentation }),
      ...(overrides.logiciel && { logiciel: overrides.logiciel }),
      ...(overrides.auteur && { auteur: overrides.auteur }),
    };
  };

  useEffect(() => {
    const cat = searchParams.get("cat");
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  const fetchMaps = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/maps");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMaps(data.maps ?? []);
    } catch {
      setError("Impossible de charger les cartes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMaps(); }, [fetchMaps]);

  const filtered = maps.filter((m) => {
    const fiche = FICHES.find((f) => f.key === m.fiche_key);
    const matchCat = activeCategory === "Toutes" || m.categorie === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      m.title.toLowerCase().includes(q) ||
      fiche?.messagePrincipal.toLowerCase().includes(q) ||
      fiche?.source.toLowerCase().includes(q) ||
      fiche?.categorie.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const countByCategory = (cat: string) => maps.filter((m) => m.categorie === cat).length;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>

      {/* ── TOP BAR ── */}
      <div className="sticky top-0 z-40 shadow-md" style={{ background: "var(--primary)" }}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4 flex-wrap">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
              style={{ background: "var(--accent)" }}>🗺️</div>
            <span className="font-bold text-white text-sm hidden sm:block group-hover:opacity-80 transition-opacity">
              Atlas Casablanca-Settat
            </span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-md relative min-w-0">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>🔍</span>
            <input
              type="text"
              placeholder="Rechercher une carte..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 rounded-full text-sm text-white placeholder-white/40 outline-none"
              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
            />
            {search && (
              <button onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-lg leading-none"
                style={{ color: "rgba(255,255,255,0.6)" }}>×</button>
            )}
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 rounded-full p-1 flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.1)" }}>
            {(["grid", "list"] as const).map((v) => (
              <button key={v} onClick={() => setViewMode(v)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all`}
                style={viewMode === v ? { background: "white", color: "#111" } : { color: "rgba(255,255,255,0.7)" }}>
                {v === "grid" ? "⊞ Grille" : "≡ Liste"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CATEGORY TABS ── */}
      <div className="sticky z-30 overflow-x-auto shadow-sm"
        style={{ top: "57px", background: "white", borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-1.5 px-6 py-3 max-w-7xl mx-auto" style={{ minWidth: "max-content" }}>
          <button
            onClick={() => setActiveCategory("Toutes")}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap"
            style={activeCategory === "Toutes"
              ? { background: "var(--primary)", color: "white" }
              : { color: "var(--text-muted)" }}>
            🗂 Toutes ({maps.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = countByCategory(cat);
            const isActive = activeCategory === cat;
            const color = CATEGORY_COLORS[cat];
            return (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 whitespace-nowrap"
                style={isActive ? { background: color, color: "white" } : { color: "var(--text-muted)" }}>
                {CATEGORY_ICONS[cat as Categorie]} {cat}
                {count > 0 && (
                  <span className="text-xs px-1.5 rounded-full"
                    style={isActive ? { background: "rgba(255,255,255,0.3)" } : { background: "#f3f4f6" }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Info bar */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {loading ? "Chargement..." : (
              <>
                <span className="font-semibold" style={{ color: "var(--primary)" }}>{filtered.length}</span>
                {" "}carte{filtered.length !== 1 ? "s" : ""}
                {activeCategory !== "Toutes" && <span> — {activeCategory}</span>}
                {search && <span> pour « {search} »</span>}
              </>
            )}
          </p>
          {search && (
            <button onClick={() => setSearch("")}
              className="text-xs px-3 py-1 rounded-full"
              style={{ background: "#fee2e2", color: "#dc2626" }}>
              × Effacer la recherche
            </button>
          )}
        </div>

        {/* ── SKELETON ── */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-white" style={{ border: "1px solid var(--border)" }}>
                <div className="skeleton" style={{ height: "200px" }} />
                <div className="p-4 space-y-2">
                  <div className="skeleton rounded h-4 w-3/4" />
                  <div className="skeleton rounded h-3 w-1/2" />
                  <div className="skeleton rounded h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── ERROR ── */}
        {!loading && error && (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">⚠️</div>
            <p className="text-lg font-semibold mb-2" style={{ color: "var(--primary)" }}>Erreur de chargement</p>
            <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>{error}</p>
            <button onClick={fetchMaps}
              className="px-6 py-2.5 rounded-full text-white text-sm font-semibold"
              style={{ background: "var(--primary)" }}>Réessayer</button>
          </div>
        )}

        {/* ── EMPTY ── */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">{maps.length === 0 ? "🗺️" : "🔍"}</div>
            <p className="text-xl font-bold mb-2" style={{ color: "var(--primary)" }}>
              {maps.length === 0 ? "Aucune carte publiée" : "Aucun résultat"}
            </p>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
              {maps.length === 0
                ? "L'administrateur doit importer des cartes depuis le backoffice."
                : "Essayez un autre mot-clé ou une autre catégorie."}
            </p>
            {maps.length === 0
              ? <Link href="/admin/login" className="px-6 py-3 rounded-full text-white font-semibold text-sm"
                style={{ background: "var(--primary)" }}>Accès Administrateur</Link>
              : <button onClick={() => { setSearch(""); setActiveCategory("Toutes"); }}
                className="px-6 py-3 rounded-full text-white font-semibold text-sm"
                style={{ background: "var(--primary)" }}>Réinitialiser</button>
            }
          </div>
        )}

        {/* ── GRID VIEW ── */}
        {!loading && !error && filtered.length > 0 && viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((m, i) => {
              const baseFiche = FICHES.find((f) => f.key === m.fiche_key);
              if (!baseFiche) return null;
              const fiche = mergeFiche(baseFiche, m.fiche_overrides);
              return (
                <MapCard
                  key={m.id}
                  id={m.id}
                  title={m.title}
                  categorie={m.categorie}
                  cloudinaryUrl={m.cloudinary_url}
                  fiche={fiche}
                  index={i}
                />
              );
            })}
          </div>
        )}

        {/* ── LIST VIEW ── */}
        {!loading && !error && filtered.length > 0 && viewMode === "list" && (
          <div className="space-y-2">
            {filtered.map((m) => {
              const baseFiche = FICHES.find((f) => f.key === m.fiche_key);
              if (!baseFiche) return null;
              const fiche = mergeFiche(baseFiche, m.fiche_overrides);
              const color = CATEGORY_COLORS[fiche.categorie] ?? "var(--primary)";
              return (
                <div key={m.id}
                  className="flex items-center gap-5 p-4 rounded-2xl bg-white cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
                  style={{ border: "1px solid var(--border)" }}
                  onClick={() => setSelectedMap({ map: m, fiche })}>
                  <div className="w-20 h-16 rounded-xl overflow-hidden flex-shrink-0" style={{ background: "#f4f6fa" }}>
                    <img src={m.cloudinary_url} alt={m.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded-full text-white font-medium" style={{ background: color }}>
                        {CATEGORY_ICONS[fiche.categorie as Categorie]} {fiche.categorie}
                      </span>
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>📅 {fiche.annee}</span>
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>· {fiche.source.split("—")[0].trim()}</span>
                    </div>
                    <h3 className="font-semibold text-sm truncate" style={{ color: "var(--text)" }}>{m.title}</h3>
                    <p className="text-xs mt-1 line-clamp-1" style={{ color: "var(--text-muted)" }}>{fiche.messagePrincipal}</p>
                  </div>
                  <span className="text-xs font-semibold flex-shrink-0" style={{ color }}>Voir →</span>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 mt-6" style={{ borderTop: "1px solid var(--border)", color: "var(--text-muted)" }}>
        <p className="text-sm">Atlas Numérique — Région Casablanca-Settat · © 2024 · Données : HCP Maroc</p>
      </footer>

      {/* ── FICHE MODAL (list view) ── */}
      {selectedMap && (
        <FicheModal
          fiche={selectedMap.fiche}
          imageUrl={selectedMap.map.cloudinary_url}
          onClose={() => setSelectedMap(null)}
        />
      )}
    </div>
  );
}
