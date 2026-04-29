"use client";
import { useEffect, useState } from "react";
import { Fiche, CATEGORY_COLORS } from "@/lib/fiches-data";

interface Props {
  fiche: Fiche;
  imageUrl: string;
  onClose: () => void;
}

export default function FicheModal({ fiche, imageUrl, onClose }: Props) {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { 
      if (e.key === "Escape") {
        if (isZoomOpen) {
          setIsZoomOpen(false);
          setZoomScale(1);
          setImagePosition({ x: 0, y: 0 });
        } else {
          onClose();
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, isZoomOpen]);

  const color = CATEGORY_COLORS[fiche.categorie] ?? "#1a3a5c";

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fiche.titre.replace(/[^a-z0-9]/gi, '_')}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      window.open(imageUrl, '_blank');
    }
  };

  const handleZoomIn = () => {
    setZoomScale(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoomScale(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - imagePosition.x,
      y: e.clientY - imagePosition.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

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
              {fiche.sousTitre && <p className="text-white/80 text-sm mt-1 max-w-lg">{fiche.sousTitre}</p>}
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
              {/* Action buttons overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 gap-2">
                <button
                  onClick={handleDownload}
                  className="bg-white rounded-full px-3 py-1.5 text-xs font-semibold shadow hover:scale-105 transition-transform"
                  style={{ color: "var(--primary)" }}
                >
                  ⬇ Télécharger
                </button>
                <button
                  onClick={() => setIsZoomOpen(true)}
                  className="bg-white rounded-full px-3 py-1.5 text-xs font-semibold shadow hover:scale-105 transition-transform"
                  style={{ color: color }}
                >
                  🔍 Zoom
                </button>
              </div>
            </div>
          </div>

          {/* Info panel */}
          <div className="lg:w-1/2 p-8 space-y-6">
            {/* Message principal */}
            <div className="rounded-2xl p-5" style={{ background: `${color}12`, borderLeft: `4px solid ${color}` }}>
              <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color }}>💡 Message principal</p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>{fiche.messagePrincipal}</p>
            </div>

            {/* Essential info grid */}
            <div className="grid grid-cols-2 gap-3">
              <InfoItem label="Thème" value={fiche.theme} fullWidth />
              {fiche.sousTheme && <InfoItem label="Sous-thème" value={fiche.sousTheme} fullWidth />}
              <InfoItem label="Source" value={fiche.source} />
              <InfoItem label="Année" value={fiche.annee} />
              {fiche.logiciel && <InfoItem label="Logiciel" value={fiche.logiciel} />}
              <InfoItem label="Type de carte" value={fiche.typeRepresentation} fullWidth />
              {fiche.variableRepresentee && <InfoItem label="Variable représentée" value={fiche.variableRepresentee} fullWidth />}
            </div>

            {/* Construction de l'indice */}
            {fiche.constructionIndice && (
              <div className="rounded-2xl p-4" style={{ background: "#f8f9fa", borderLeft: `3px solid ${color}` }}>
                <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color }}>🔧 Construction de l'indice</p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text)" }}>{fiche.constructionIndice}</p>
                {fiche.formule && (
                  <div className="mt-2 p-2 rounded-lg bg-white/70 font-mono text-xs" style={{ color: color }}>
                    {fiche.formule}
                  </div>
                )}
              </div>
            )}

            {/* Classes */}
            {fiche.classesValeurs && (
              <div className="rounded-2xl p-3" style={{ background: "#f0f8ff" }}>
                <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: color }}>📊 Classes</p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text)" }}>{fiche.classesValeurs}</p>
              </div>
            )}

            {/* Statistiques */}
            {fiche.statsDescriptives && (
              <div className="rounded-2xl p-3" style={{ background: "#f0fff4" }}>
                <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: color }}>📈 Statistiques clés</p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text)" }}>{fiche.statsDescriptives}</p>
              </div>
            )}

            {/* Limites */}
            {fiche.limites && (
              <div className="rounded-2xl p-3" style={{ background: "#fafafa", border: "1px solid #e0e0e0" }}>
                <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: "#666" }}>⚠️ Limites</p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{fiche.limites}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 flex justify-between items-center rounded-b-3xl" style={{ background: "#f8f9fb", borderTop: "1px solid #e5e7eb" }}>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>Source : {fiche.source.split('—')[0].trim()}</span>
          <button onClick={handleDownload}
            className="px-5 py-2 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: color }}>
            ⬇ Télécharger la carte
          </button>
        </div>
      </div>

      {/* Zoom Modal */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-[60] bg-black/95 flex flex-col" onClick={() => setIsZoomOpen(false)}>
          {/* Zoom controls header */}
          <div className="flex items-center justify-between p-4 bg-black/50" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              <button
                onClick={handleZoomOut}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
                disabled={zoomScale <= 0.5}
              >
                −
              </button>
              <span className="text-white text-sm font-medium min-w-[3rem] text-center">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
                disabled={zoomScale >= 3}
              >
                +
              </button>
              <button
                onClick={handleResetZoom}
                className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-medium transition-colors"
              >
                Reset
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-medium transition-colors"
              >
                ⬇ Télécharger
              </button>
              <button
                onClick={() => setIsZoomOpen(false)}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors text-xl"
              >
                ×
              </button>
            </div>
          </div>

          {/* Zoomable image container */}
          <div 
            className="flex-1 relative overflow-hidden cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={imageUrl}
                alt={fiche.titre}
                className="max-w-full max-h-full object-contain select-none transition-transform duration-200"
                style={{
                  transform: `scale(${zoomScale}) translate(${imagePosition.x / zoomScale}px, ${imagePosition.y / zoomScale}px)`,
                  cursor: isDragging ? 'grabbing' : 'grab'
                }}
                draggable={false}
              />
            </div>
          </div>

          {/* Instructions footer */}
          <div className="p-4 bg-black/50 text-center" onClick={(e) => e.stopPropagation()}>
            <p className="text-white/60 text-xs">
              Utilisez les boutons +/- pour zoomer • Cliquez et glissez pour déplacer • Échap pour fermer
            </p>
          </div>
        </div>
      )}
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
