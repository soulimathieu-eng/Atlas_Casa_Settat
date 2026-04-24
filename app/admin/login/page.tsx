"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("Email ou mot de passe incorrect.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "linear-gradient(135deg, var(--primary) 0%, #0f2540 100%)" }}>
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl p-10 shadow-2xl" style={{ background: "white" }}>
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg" style={{ background: "var(--primary)" }}>
              🗺️
            </div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--primary)" }}>Espace Administrateur</h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Atlas Numérique — Casablanca-Settat</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@atlas-casablanca.ma"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{ border: "1.5px solid var(--border)", background: "var(--bg)" }}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{ border: "1.5px solid var(--border)", background: "var(--bg)" }}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>

            {error && (
              <div className="rounded-xl px-4 py-3 text-sm flex items-center gap-2" style={{ background: "#fee2e2", color: "#dc2626" }}>
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: "var(--primary)", color: "white" }}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-xs hover:underline" style={{ color: "var(--text-muted)" }}>
              ← Retour à l'atlas public
            </Link>
          </div>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">Accès réservé aux administrateurs autorisés</p>
      </div>
    </div>
  );
}
