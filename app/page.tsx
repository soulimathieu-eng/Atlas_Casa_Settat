"use client";
import Link from "next/link";
import { CATEGORIES, CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/fiches-data";

const STATS = [
  { value: "30+", label: "Cartes thématiques" },
  { value: "7", label: "Catégories" },
  { value: "9", label: "Provinces & Préfectures" },
  { value: "2024", label: "Données actualisées" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <nav style={{ background: "var(--primary)" }} className="sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg" style={{ background: "var(--accent)" }}>🗺️</div>
            <span className="font-bold text-white text-lg">Atlas Casablanca-Settat</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-white/80 hover:text-white text-sm font-medium transition-colors">Accueil</Link>
            <Link href="/atlas" className="text-white/80 hover:text-white text-sm font-medium transition-colors">Atlas</Link>
            <Link href="/atlas" className="px-4 py-2 rounded-full text-sm font-semibold transition-all hover:opacity-90" style={{ background: "var(--accent)", color: "var(--primary)" }}>
              Explorer →
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--primary) 0%, #0f2540 100%)", minHeight: "88vh", display: "flex", alignItems: "center" }}>
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full opacity-5" style={{ background: "var(--accent)" }} />
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full opacity-5" style={{ background: "var(--accent)" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 flex flex-col lg:flex-row items-center gap-16 w-full">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6" style={{ background: "rgba(200,168,75,0.15)", color: "var(--accent)" }}>
              🇲🇦 Région Casablanca-Settat · Maroc
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Atlas Numérique<br /><span style={{ color: "var(--accent)" }}>Interactif</span>
            </h1>
            <p className="text-xl text-white/70 leading-relaxed mb-10 max-w-xl">
              Explorez la région Casablanca-Settat à travers des cartes thématiques couvrant la démographie, l'économie, l'emploi et le territoire.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/atlas" className="px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 inline-flex items-center gap-2" style={{ background: "var(--accent)", color: "var(--primary)" }}>
                🗺️ Explorer l'Atlas
              </Link>
              <a href="#categories" className="px-8 py-4 rounded-full font-semibold text-lg border-2 text-white transition-all hover:bg-white/10 inline-flex items-center gap-2" style={{ borderColor: "rgba(255,255,255,0.3)" }}>
                Voir les thèmes ↓
              </a>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4 max-w-sm">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl p-6 text-center transition-all hover:scale-105" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
                <div className="text-4xl font-bold mb-1" style={{ color: "var(--accent)" }}>{s.value}</div>
                <div className="text-white/60 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f4f6fa" />
          </svg>
        </div>
      </section>

      <section id="categories" className="py-20 max-w-7xl mx-auto px-6 w-full">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold mb-4" style={{ color: "var(--primary)" }}>Thèmes cartographiques</h2>
          <p style={{ color: "var(--text-muted)" }} className="text-lg">7 grandes thématiques pour comprendre le territoire régional</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((cat) => (
            <Link key={cat} href={`/atlas?cat=${encodeURIComponent(cat)}`}
              className="group rounded-2xl p-6 text-center transition-all hover:-translate-y-1 hover:shadow-xl cursor-pointer"
              style={{ background: "white", border: "1px solid var(--border)" }}>
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform inline-block">{CATEGORY_ICONS[cat]}</div>
              <div className="w-12 h-1 rounded-full mx-auto mb-3" style={{ background: CATEGORY_COLORS[cat] }} />
              <p className="font-semibold text-sm" style={{ color: "var(--primary)" }}>{cat}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-20" style={{ background: "white" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-4" style={{ color: "var(--primary)" }}>Fonctionnalités</h2>
            <p style={{ color: "var(--text-muted)" }} className="text-lg">Un atlas conçu pour l'exploration et la compréhension</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "🔍", title: "Fiches techniques", desc: "Chaque carte est accompagnée de sa fiche : source, méthode, message principal — accessible en un clic." },
              { icon: "⚡", title: "Filtres dynamiques", desc: "Filtrez par thème, recherchez par mot-clé et naviguez entre les 7 catégories instantanément." },
              { icon: "🖼️", title: "Visualisation immersive", desc: "Zoom, plein écran, téléchargement — explorez chaque carte dans les moindres détails." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl p-8 transition-all hover:shadow-lg" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold mb-3" style={{ color: "var(--primary)" }}>{f.title}</h3>
                <p style={{ color: "var(--text-muted)" }} className="leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 text-center" style={{ background: "linear-gradient(135deg, var(--primary), #0f2540)" }}>
        <h2 className="text-4xl font-bold text-white mb-4">Prêt à explorer ?</h2>
        <p className="text-white/70 text-lg mb-8">30+ cartes thématiques vous attendent</p>
        <Link href="/atlas" className="px-10 py-4 rounded-full font-bold text-lg inline-flex items-center gap-2 transition-all hover:scale-105" style={{ background: "var(--accent)", color: "var(--primary)" }}>
          🗺️ Ouvrir l'Atlas
        </Link>
      </section>

      <footer className="py-8 text-center" style={{ background: "var(--primary)" }}>
        <p className="text-white/50 text-sm">© 2024 Atlas Numérique — Région Casablanca-Settat · Données : HCP Maroc</p>
      </footer>
    </div>
  );
}
