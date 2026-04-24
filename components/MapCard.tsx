"use client";
import { useState } from "react";
import { Fiche, CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/fiches-data";
import FicheModal from "./FicheModal";

interface MapCardProps {
  id: string;
  title: string;
  categorie: string;
  cloudinaryUrl: string;
  fiche: Fiche;
  index?: number;
}

export default function MapCard({ title, categorie, cloudinaryUrl, fiche, index = 0 }: MapCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [imgError, setImgError] = useState(false);
  const color = CATEGORY_COLORS[fiche.categorie] ?? "#1a3a5c";
  const icon = CATEGORY_ICONS[fiche.categorie] ?? "🗺️";

  return (
    <>
      <div
        className="map-card rounded-2xl overflow-hidden cursor-pointer bg-white animate-fade-in-up"
        style={{
          border: "1px solid var(--border)",
          animationDelay: `${index * 0.05}s`,
          animationFillMode: "both",
        }}
        onClick={() => setShowModal(true)}
      >
        {/* Image */}
        <div className="relative overflow-hidden group" style={{ height: "200px", background: "#f4f6fa" }}>
          {!imgError ? (
            <img
              src={cloudinaryUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2" style={{ color: "var(--text-muted)" }}>
              <span className="text-5xl opacity-30">🗺️</span>
              <span className="text-xs">Image non disponible</span>
            </div>
          )}

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-white shadow-md"
              style={{ background: color }}>
              {icon} {categorie}
            </span>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: "rgba(26,58,92,0.65)" }}>
            <span className="bg-white rounded-full px-5 py-2 font-semibold text-sm shadow-lg" style={{ color: "var(--primary)" }}>
              📋 Voir la fiche
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-sm leading-snug mb-2 line-clamp-2" style={{ color: "var(--text)" }}>
            {title}
          </h3>

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>📅 {fiche.annee}</span>
            <span className="text-xs px-2 py-0.5 rounded-lg font-medium truncate max-w-[120px]"
              style={{ background: `${color}15`, color }}>
              {fiche.source.split("—")[0].trim()}
            </span>
          </div>

          {/* Message teaser */}
          <p className="text-xs mt-3 leading-relaxed line-clamp-2" style={{ color: "var(--text-muted)" }}>
            {fiche.messagePrincipal}
          </p>

          {/* Bottom */}
          <div className="mt-4 pt-3 flex items-center gap-3" style={{ borderTop: "1px solid var(--border)" }}>
            <div className="flex-1 h-1 rounded-full" style={{ background: `${color}20` }}>
              <div className="h-full rounded-full" style={{ background: color, width: "100%" }} />
            </div>
            <button className="text-xs font-semibold whitespace-nowrap hover:underline flex-shrink-0"
              style={{ color }}>
              Détails →
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <FicheModal fiche={fiche} imageUrl={cloudinaryUrl} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
