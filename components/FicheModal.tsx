"use client";
import { useEffect } from "react";
import { Fiche, CATEGORY_COLORS } from "@/lib/fiches-data";

interface Props {
  fiche: Fiche;
  imageUrl: string;
  onClose: () => void;
}

export default function FicheModal({ fiche, imageUrl, onClose }: Props) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const color = CATEGORY_COLORS[fiche.categorie] ?? "#1a3a5c";

  return (
    <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
        style={{ background: "white" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header band */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-5 rounded-t-3xl" style={{ background: color }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🗺️</span>
            <div>
              <p className="text-white/70 text-xs uppercase tracking-widest font-medium">{fiche.categorie}</p>
              <h2 className="text-white font-bold text-lg leading-tight max-w-lg">{fiche.titre}</h2>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors text-xl font-bold flex-shrink-0">
            ×
          </button>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Image panel */}
          <div className="lg:w-1/2 p-6 flex items-start justify-center" style={{ background: "#f8f9fb" }}>
            <div className="relative w-full rounded-2xl overflow-hidden shadow-lg group">
              <img src={imageUrl} alt={fiche.titre} className="w-full object-contain max-h-80" />
              {/* Download overlay */}
              <a
                href={imageUrl}
                download
                target="_blank"
                rel="noreferrer"
                className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
              >
                <span className="bg-white rounded-full px-4 py-2 text-sm font-semibold shadow" style={{ color: "var(--primary)" }}>
                  ⬇ Télécharger
                </span>
              </a>
            </div>
          </div>

          {/* Info panel */}
          <div className="lg:w-1/2 p-8 space-y-6">
            {/* Message principal */}
            <div className="rounded-2xl p-5" style={{ background: `${color}12`, borderLeft: `4px solid ${color}` }}>
              <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color }}>💡 Message principal</p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>{fiche.messagePrincipal}</p>
            </div>

            {/* Metadata grid */}
            <div className="grid grid-cols-2 gap-3">
              <InfoItem label="Source" value={fiche.source} />
              <InfoItem label="Année" value={fiche.annee} />
              <InfoItem label="Type de carte" value={fiche.typeRepresentation} fullWidth />
              {fiche.variables && <InfoItem label="Variables" value={fiche.variables} fullWidth />}
              {fiche.methodologie && <InfoItem label="Méthode" value={fiche.methodologie} fullWidth />}
              {fiche.logiciel && <InfoItem label="Logiciel" value={fiche.logiciel} />}
              {fiche.auteur && <InfoItem label="Auteur" value={fiche.auteur} />}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 flex justify-between items-center rounded-b-3xl" style={{ background: "#f8f9fb", borderTop: "1px solid #e5e7eb" }}>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>Données : HCP Maroc</span>
          <a href={imageUrl} download target="_blank" rel="noreferrer"
            className="px-5 py-2 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: color }}>
            ⬇ Télécharger la carte
          </a>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value, fullWidth }: { label: string; value: string; fullWidth?: boolean }) {
  return (
    <div className={`rounded-xl p-3 ${fullWidth ? "col-span-2" : ""}`} style={{ background: "#f4f6fa" }}>
      <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--text-muted)" }}>{label}</p>
      <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{value}</p>
    </div>
  );
}
