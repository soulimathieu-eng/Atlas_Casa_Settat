-- ============================================================
-- ATLAS NUMÉRIQUE — Région Casablanca-Settat
-- Schéma Supabase — à exécuter dans l'éditeur SQL Supabase
-- ============================================================

-- Table principale des cartes
CREATE TABLE IF NOT EXISTS public.maps (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title                 TEXT NOT NULL,
  categorie             TEXT NOT NULL,
  cloudinary_url        TEXT NOT NULL,
  cloudinary_public_id  TEXT NOT NULL,
  fiche_key             TEXT NOT NULL,
  published             BOOLEAN DEFAULT false,
  display_order         INTEGER DEFAULT 0,
  created_at            TIMESTAMPTZ DEFAULT now(),
  updated_at            TIMESTAMPTZ DEFAULT now()
);

-- Index pour les requêtes courantes
CREATE INDEX IF NOT EXISTS idx_maps_published    ON public.maps (published);
CREATE INDEX IF NOT EXISTS idx_maps_categorie    ON public.maps (categorie);
CREATE INDEX IF NOT EXISTS idx_maps_display_order ON public.maps (display_order);

-- RLS (Row Level Security) — lecture publique, écriture via service role uniquement
ALTER TABLE public.maps ENABLE ROW LEVEL SECURITY;

-- Politique : lecture publique des cartes publiées
CREATE POLICY "Lecture publique des cartes publiées"
  ON public.maps FOR SELECT
  USING (published = true);

-- Politique : toutes les opérations via service role (backoffice)
CREATE POLICY "Service role accès complet"
  ON public.maps
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Trigger auto-update de updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER maps_updated_at
  BEFORE UPDATE ON public.maps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
