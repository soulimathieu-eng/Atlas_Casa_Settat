import { Suspense } from "react";
import AtlasClient from "./AtlasClient";

export default function AtlasPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="text-center space-y-4">
          <div className="text-6xl">🗺️</div>
          <p className="text-lg font-semibold" style={{ color: "var(--primary)" }}>Chargement de l'atlas...</p>
        </div>
      </div>
    }>
      <AtlasClient />
    </Suspense>
  );
}
