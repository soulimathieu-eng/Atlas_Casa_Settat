"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { FICHES, CATEGORIES, CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/fiches-data";

interface FicheOverrides {
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

type Tab = "maps" | "upload";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("maps");
  const [maps, setMaps] = useState<MapRecord[]>([]);
  const [loadingMaps, setLoadingMaps] = useState(true);

  // Upload form state
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [ficheKey, setFicheKey] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [publishing, setPublishing] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [filterCat, setFilterCat] = useState("Toutes");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Edit modal state
  const [editMap, setEditMap] = useState<MapRecord | null>(null);
  const [editFields, setEditFields] = useState<FicheOverrides & { title?: string }>({});
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const openEditModal = (map: MapRecord) => {
    const baseFiche = FICHES.find((f) => f.key === map.fiche_key);
    const overrides = map.fiche_overrides ?? {};
    setEditFields({
      title: map.title,
      titre: overrides.titre ?? baseFiche?.titre ?? "",
      messagePrincipal: overrides.messagePrincipal ?? baseFiche?.messagePrincipal ?? "",
      source: overrides.source ?? baseFiche?.source ?? "",
      annee: overrides.annee ?? baseFiche?.annee ?? "",
      typeRepresentation: overrides.typeRepresentation ?? baseFiche?.typeRepresentation ?? "",
      logiciel: overrides.logiciel ?? baseFiche?.logiciel ?? "",
      auteur: overrides.auteur ?? baseFiche?.auteur ?? "",
    });
    setSaveMsg(null);
    setEditMap(map);
  };

  const saveEdits = async () => {
    if (!editMap) return;
    setSaving(true);
    setSaveMsg(null);
    try {
      const { title, ...ficheOverrides } = editFields;
      const res = await fetch("/api/maps", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editMap.id,
          title: title ?? editMap.title,
          fiche_overrides: ficheOverrides,
        }),
      });
      if (!res.ok) throw new Error();
      setSaveMsg({ type: "success", text: "✅ Modifications enregistrées !" });
      fetchMaps();
      setTimeout(() => setEditMap(null), 1200);
    } catch {
      setSaveMsg({ type: "error", text: "❌ Erreur lors de la sauvegarde." });
    }
    setSaving(false);
  };

  // Auth guard
  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
  }, [status, router]);

  useEffect(() => { fetchMaps(); }, []);

  async function fetchMaps() {
    setLoadingMaps(true);
    try {
      const res = await fetch("/api/maps-admin");
      const data = await res.json();
      setMaps(data.maps ?? []);
    } catch { setMaps([]); }
    setLoadingMaps(false);
  }

  // When a fiche is selected, pre-fill the title
  const handleFicheSelect = (key: string) => {
    setFicheKey(key);
    const fiche = FICHES.find((f) => f.key === key);
    if (fiche) setCustomTitle(fiche.titre);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setUploadMsg(null);
  };

  const handleUpload = async () => {
    if (!file || !ficheKey) return;
    setUploading(true);
    setUploadMsg(null);

    try {
      // 1. Upload to Cloudinary
      const fd = new FormData();
      fd.append("file", file);
      fd.append("filename", ficheKey);
      const upRes = await fetch("/api/upload", { method: "POST", body: fd });
      if (!upRes.ok) throw new Error("Erreur upload");
      const { url, publicId } = await upRes.json();

      // 2. Save metadata in Supabase
      const fiche = FICHES.find((f) => f.key === ficheKey)!;
      const saveRes = await fetch("/api/maps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: customTitle || fiche.titre,
          categorie: fiche.categorie,
          cloudinary_url: url,
          cloudinary_public_id: publicId,
          fiche_key: ficheKey,
          published: publishing,
          display_order: maps.length,
        }),
      });
      if (!saveRes.ok) throw new Error("Erreur sauvegarde");

      setUploadMsg({ type: "success", text: `✅ "${customTitle || fiche.titre}" ajoutée avec succès !` });
      setFile(null);
      setPreview("");
      setFicheKey("");
      setCustomTitle("");
      if (fileRef.current) fileRef.current.value = "";
      fetchMaps();
      setTimeout(() => setTab("maps"), 1500);
    } catch (err) {
      setUploadMsg({ type: "error", text: "❌ Erreur lors de l'import. Vérifiez vos clés Cloudinary/Supabase." });
    }
    setUploading(false);
  };

  const togglePublish = async (map: MapRecord) => {
    await fetch("/api/maps", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: map.id, published: !map.published }),
    });
    fetchMaps();
  };

  const deleteMap = async (id: string) => {
    await fetch("/api/maps", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setDeleteConfirm(null);
    fetchMaps();
  };

  const filteredMaps = filterCat === "Toutes" ? maps : maps.filter((m) => m.categorie === filterCat);
  const selectedFiche = FICHES.find((f) => f.key === ficheKey);

  if (status === "loading") return <div className="min-h-screen flex items-center justify-center text-gray-400">Chargement...</div>;

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg)" }}>
      {/* ── SIDEBAR ── */}
      <aside className="w-64 flex-shrink-0 flex flex-col" style={{ background: "var(--primary)", minHeight: "100vh" }}>
        {/* Logo */}
        <div className="p-6 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🗺️</span>
            <span className="font-bold text-white text-sm leading-tight">Atlas<br />Casablanca-Settat</span>
          </div>
          <p className="text-white/40 text-xs mt-2">Espace administrateur</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {([["maps", "📋", "Mes cartes"], ["upload", "⬆️", "Importer une carte"]] as const).map(([t, icon, label]) => (
            <button key={t} onClick={() => setTab(t)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition-all ${tab === t ? "text-white" : "text-white/60 hover:text-white hover:bg-white/5"}`}
              style={tab === t ? { background: "rgba(200,168,75,0.25)", color: "var(--accent)" } : {}}>
              <span>{icon}</span> {label}
            </button>
          ))}
        </nav>

        {/* Stats */}
        <div className="p-4 space-y-2">
          <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.06)" }}>
            <p className="text-white/40 text-xs mb-1">Total cartes</p>
            <p className="text-white font-bold text-2xl">{maps.length}</p>
          </div>
          <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.06)" }}>
            <p className="text-white/40 text-xs mb-1">Publiées</p>
            <p className="font-bold text-2xl" style={{ color: "var(--accent)" }}>{maps.filter((m) => m.published).length}</p>
          </div>
        </div>

        {/* User */}
        <div className="p-4 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <p className="text-white/60 text-xs mb-3 truncate">{session?.user?.email}</p>
          <div className="flex gap-2">
            <Link href="/atlas" className="flex-1 py-2 rounded-xl text-xs text-center font-medium" style={{ background: "rgba(255,255,255,0.08)", color: "white" }}>
              Voir Atlas
            </Link>
            <button onClick={() => signOut({ callbackUrl: "/admin/login" })} className="flex-1 py-2 rounded-xl text-xs font-medium" style={{ background: "rgba(239,68,68,0.2)", color: "#fca5a5" }}>
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 overflow-auto">
        {/* ── TAB: UPLOAD ── */}
        {tab === "upload" && (
          <div className="p-8 max-w-3xl">
            <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--primary)" }}>Importer une carte</h1>
            <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>L'image sera automatiquement envoyée sur Cloudinary et publiée dans l'atlas.</p>

            <div className="space-y-6">
              {/* Step 1: Select fiche */}
              <div className="bg-white rounded-2xl p-6" style={{ border: "1px solid var(--border)" }}>
                <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--primary)" }}>
                  <span className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center" style={{ background: "var(--primary)" }}>1</span>
                  Sélectionner la fiche technique
                </h2>

                {/* Category filter */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {["Toutes", ...CATEGORIES].map((cat) => (
                    <button key={cat} onClick={() => {}}
                      className="px-3 py-1 rounded-full text-xs font-medium border transition-all"
                      style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="grid gap-2 max-h-64 overflow-y-auto">
                  {FICHES.map((f) => {
                    const isSelected = ficheKey === f.key;
                    const color = CATEGORY_COLORS[f.categorie];
                    return (
                      <button key={f.key} onClick={() => handleFicheSelect(f.key)}
                        className={`text-left p-3 rounded-xl border-2 transition-all flex items-start gap-3 ${isSelected ? "border-current shadow-sm" : "hover:bg-gray-50"}`}
                        style={isSelected ? { borderColor: color, background: `${color}08` } : { borderColor: "var(--border)" }}>
                        <span className="text-xs px-2 py-0.5 rounded-full text-white mt-0.5 flex-shrink-0" style={{ background: color }}>{CATEGORY_ICONS[f.categorie]}</span>
                        <div>
                          <p className="font-medium text-sm leading-snug" style={{ color: isSelected ? color : "var(--text)" }}>{f.titre}</p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{f.source} · {f.annee}</p>
                        </div>
                        {isSelected && <span className="ml-auto text-lg" style={{ color }}>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Selected fiche preview */}
              {selectedFiche && (
                <div className="rounded-2xl p-5" style={{ background: `${CATEGORY_COLORS[selectedFiche.categorie]}10`, border: `1.5px solid ${CATEGORY_COLORS[selectedFiche.categorie]}40` }}>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: CATEGORY_COLORS[selectedFiche.categorie] }}>Fiche sélectionnée</p>
                  <h3 className="font-bold text-sm mb-1" style={{ color: "var(--primary)" }}>{selectedFiche.titre}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{selectedFiche.messagePrincipal}</p>
                </div>
              )}

              {/* Step 2: Custom title */}
              {ficheKey && (
                <div className="bg-white rounded-2xl p-6" style={{ border: "1px solid var(--border)" }}>
                  <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--primary)" }}>
                    <span className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center" style={{ background: "var(--primary)" }}>2</span>
                    Titre de la carte (modifiable)
                  </h2>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ border: "1.5px solid var(--border)", background: "var(--bg)" }}
                  />
                </div>
              )}

              {/* Step 3: Upload image */}
              {ficheKey && (
                <div className="bg-white rounded-2xl p-6" style={{ border: "1px solid var(--border)" }}>
                  <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--primary)" }}>
                    <span className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center" style={{ background: "var(--primary)" }}>3</span>
                    Importer l'image de la carte
                  </h2>

                  {/* Drop zone */}
                  <div
                    className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all hover:bg-blue-50"
                    style={{ borderColor: file ? "var(--accent)" : "var(--border)" }}
                    onClick={() => fileRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const f = e.dataTransfer.files[0];
                      if (f) {
                        setFile(f);
                        setPreview(URL.createObjectURL(f));
                      }
                    }}
                  >
                    {preview ? (
                      <div className="space-y-3">
                        <img src={preview} alt="preview" className="max-h-48 mx-auto rounded-xl shadow object-contain" />
                        <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>{file?.name}</p>
                        <button onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(""); }} className="text-xs text-red-500 hover:underline">
                          × Supprimer
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="text-5xl mb-3">📁</div>
                        <p className="font-medium text-sm" style={{ color: "var(--primary)" }}>Glissez l'image ici ou cliquez pour parcourir</p>
                        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>JPG, PNG, PDF — max 10 MB</p>
                      </>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileChange} />

                  {/* Options */}
                  <div className="flex items-center gap-3 mt-4">
                    <input type="checkbox" id="pub" checked={publishing} onChange={(e) => setPublishing(e.target.checked)} className="w-4 h-4 accent-blue-600" />
                    <label htmlFor="pub" className="text-sm" style={{ color: "var(--text)" }}>Publier immédiatement</label>
                  </div>
                </div>
              )}

              {/* Upload button */}
              {file && ficheKey && (
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full py-4 rounded-2xl font-bold text-white transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ background: "var(--primary)" }}
                >
                  {uploading ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Import en cours...
                    </>
                  ) : "⬆️ Importer vers Cloudinary & Publier"}
                </button>
              )}

              {uploadMsg && (
                <div className={`rounded-2xl p-4 text-sm text-center font-medium ${uploadMsg.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                  {uploadMsg.text}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB: MAPS ── */}
        {tab === "maps" && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold" style={{ color: "var(--primary)" }}>Gestion des cartes</h1>
                <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>{maps.length} carte(s) · {maps.filter((m) => m.published).length} publiée(s)</p>
              </div>
              <button onClick={() => setTab("upload")} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: "var(--primary)" }}>
                + Importer
              </button>
            </div>

            {/* Filter */}
            <div className="flex gap-2 flex-wrap mb-6">
              {["Toutes", ...CATEGORIES].map((cat) => (
                <button key={cat} onClick={() => setFilterCat(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all`}
                  style={filterCat === cat ? { background: "var(--primary)", color: "white", borderColor: "var(--primary)" } : { borderColor: "var(--border)", color: "var(--text-muted)" }}>
                  {cat}
                </button>
              ))}
            </div>

            {loadingMaps ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden bg-white" style={{ border: "1px solid var(--border)" }}>
                    <div className="skeleton h-36" />
                    <div className="p-3 space-y-2"><div className="skeleton h-3 rounded w-3/4" /><div className="skeleton h-3 rounded w-1/2" /></div>
                  </div>
                ))}
              </div>
            ) : filteredMaps.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-3">📭</div>
                <p className="font-semibold" style={{ color: "var(--primary)" }}>Aucune carte</p>
                <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Importez votre première carte</p>
                <button onClick={() => setTab("upload")} className="mt-4 px-6 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: "var(--primary)" }}>
                  Importer
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredMaps.map((map) => {
                  const fiche = FICHES.find((f) => f.key === map.fiche_key);
                  const color = fiche ? CATEGORY_COLORS[fiche.categorie] : "#1a3a5c";
                  return (
                    <div key={map.id} className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                      <div className="relative h-36 overflow-hidden" style={{ background: "#f4f6fa" }}>
                        <img src={map.cloudinary_url} alt={map.title} className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map.published ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"}`}>
                            {map.published ? "● Publié" : "○ Brouillon"}
                          </span>
                        </div>
                        <div className="absolute top-2 left-2">
                          <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ background: color }}>{map.categorie}</span>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="font-semibold text-xs leading-snug line-clamp-2 mb-2" style={{ color: "var(--text)" }}>{map.title}</p>
                        <div className="flex gap-2 flex-wrap">
                          <button onClick={() => openEditModal(map)}
                            className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all"
                            style={{ background: "#eff6ff", color: "#1d4ed8" }}>
                            ✏️ Modifier
                          </button>
                          <button onClick={() => togglePublish(map)}
                            className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all"
                            style={{ background: map.published ? "#fef3c7" : "#d1fae5", color: map.published ? "#92400e" : "#065f46" }}>
                            {map.published ? "Dépublier" : "Publier"}
                          </button>
                          <button onClick={() => setDeleteConfirm(map.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                            style={{ background: "#fee2e2", color: "#dc2626" }}>
                            🗑
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── EDIT MODAL ── */}
      {editMap && (
        <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setEditMap(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 rounded-t-2xl" style={{ background: "var(--primary)" }}>
              <div>
                <p className="text-white/60 text-xs uppercase tracking-widest">Modifier la fiche</p>
                <h3 className="text-white font-bold text-base leading-tight mt-0.5 truncate max-w-xs">{editMap.title}</h3>
              </div>
              <button onClick={() => setEditMap(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-white/20 text-xl font-bold flex-shrink-0">
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              {([
                { key: "title", label: "Titre de la carte (affiché dans l'atlas)", multiline: false },
                { key: "titre", label: "Titre de la fiche technique", multiline: false },
                { key: "messagePrincipal", label: "Message principal", multiline: true },
                { key: "source", label: "Source", multiline: false },
                { key: "annee", label: "Année", multiline: false },
                { key: "typeRepresentation", label: "Type de représentation", multiline: false },
                { key: "logiciel", label: "Logiciel utilisé", multiline: false },
                { key: "auteur", label: "Auteur", multiline: false },
              ] as { key: keyof typeof editFields; label: string; multiline: boolean }[]).map(({ key, label, multiline }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--text-muted)" }}>
                    {label}
                  </label>
                  {multiline ? (
                    <textarea
                      rows={3}
                      value={editFields[key] ?? ""}
                      onChange={(e) => setEditFields((prev) => ({ ...prev, [key]: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
                      style={{ border: "1.5px solid var(--border)", background: "var(--bg)" }}
                    />
                  ) : (
                    <input
                      type="text"
                      value={editFields[key] ?? ""}
                      onChange={(e) => setEditFields((prev) => ({ ...prev, [key]: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                      style={{ border: "1.5px solid var(--border)", background: "var(--bg)" }}
                    />
                  )}
                </div>
              ))}

              {saveMsg && (
                <div className={`rounded-xl p-3 text-sm text-center font-medium ${
                  saveMsg.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}>
                  {saveMsg.text}
                </div>
              )}

              <button
                onClick={saveEdits}
                disabled={saving}
                className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ background: "var(--primary)" }}
              >
                {saving ? (
                  <><span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Enregistrement...</>
                ) : "💾 Enregistrer les modifications"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteConfirm && (
        <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="text-5xl mb-4">🗑️</div>
            <h3 className="font-bold text-lg mb-2" style={{ color: "var(--primary)" }}>Supprimer cette carte ?</h3>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>Cette action est irréversible. La carte sera supprimée de Supabase (l&apos;image reste sur Cloudinary).</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{ background: "var(--bg)", color: "var(--text)" }}>
                Annuler
              </button>
              <button onClick={() => deleteMap(deleteConfirm)} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: "#dc2626" }}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
