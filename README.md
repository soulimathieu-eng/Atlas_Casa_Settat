# 🗺️ Atlas Numérique — Région Casablanca-Settat

Atlas cartographique interactif de la région Casablanca-Settat (Maroc), développé avec Next.js, Supabase et Cloudinary.

---

## ✨ Fonctionnalités

**Frontend public**
- Galerie de cartes avec filtres par catégorie
- Barre de recherche en temps réel
- Fiches techniques en pop-up au clic
- Vue grille et vue liste
- Design responsive (mobile, tablette, desktop)
- Téléchargement de chaque carte

**Backoffice admin**
- Connexion sécurisée (email + mot de passe)
- Import d'images → Cloudinary automatique
- Sélection de la fiche technique associée
- Gestion publication/dépublication
- Suppression de cartes

---

## 🚀 Installation

### Prérequis
- Node.js 18+
- Compte Supabase (gratuit) → https://supabase.com
- Compte Cloudinary (gratuit) → https://cloudinary.com

---

### Étape 1 — Cloner et installer

```bash
git clone <repo>
cd atlas-casablanca-settat
npm install
```

---

### Étape 2 — Configurer Supabase

1. Créer un projet sur https://app.supabase.com
2. Aller dans **SQL Editor** et exécuter le contenu de `supabase-schema.sql`
3. Récupérer vos clés dans **Settings → API** :
   - `Project URL`
   - `anon public` key
   - `service_role` key (⚠️ garder secrète)

---

### Étape 3 — Configurer Cloudinary

1. Aller sur https://cloudinary.com → Dashboard
2. Récupérer :
   - Cloud Name
   - API Key
   - API Secret

---

### Étape 4 — Variables d'environnement

Copier `.env.example` en `.env.local` et remplir :

```env
# Cloudinary
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# NextAuth (générer un secret aléatoire : openssl rand -base64 32)
NEXTAUTH_SECRET=votre_secret_32_caracteres_minimum
NEXTAUTH_URL=http://localhost:3000

# Identifiants administrateur
ADMIN_EMAIL=admin@votre-domaine.ma
ADMIN_PASSWORD=votre_mot_de_passe_securise
```

---

### Étape 5 — Lancer en local

```bash
npm run dev
```

Ouvrir http://localhost:3000

---

## 📦 Déploiement sur Vercel (gratuit)

1. Pousser le projet sur GitHub
2. Importer sur https://vercel.com/new
3. Dans **Environment Variables**, ajouter toutes les variables de `.env.local`
4. Pour `NEXTAUTH_URL`, mettre l'URL Vercel : `https://votre-projet.vercel.app`
5. Déployer ✅

---

## 🗂 Structure du projet

```
atlas-casablanca-settat/
├── app/
│   ├── page.tsx                    ← Homepage publique
│   ├── atlas/
│   │   ├── page.tsx                ← Galerie (wrapper Suspense)
│   │   └── AtlasClient.tsx         ← Galerie interactive
│   ├── admin/
│   │   ├── login/page.tsx          ← Connexion admin
│   │   └── dashboard/page.tsx      ← Backoffice complet
│   └── api/
│       ├── auth/[...nextauth]/     ← Auth NextAuth
│       ├── maps/route.ts           ← CRUD cartes
│       ├── maps-admin/route.ts     ← Lecture admin (toutes)
│       └── upload/route.ts         ← Upload Cloudinary
├── components/
│   ├── MapCard.tsx                 ← Carte interactive
│   ├── FicheModal.tsx              ← Pop-up fiche technique
│   └── AuthProvider.tsx            ← Session NextAuth
├── lib/
│   ├── fiches-data.ts              ← 30 fiches techniques intégrées
│   ├── supabase.ts                 ← Client Supabase
│   └── cloudinary.ts               ← Upload Cloudinary
├── middleware.ts                   ← Protection routes admin
├── supabase-schema.sql             ← Script SQL à exécuter
└── .env.example                    ← Template variables d'env
```

---

## 🗺️ Cartes disponibles (30)

| Catégorie | Cartes |
|-----------|--------|
| Démographie | 6 |
| Social & Éducation | 5 |
| Emploi & Activité | 6 |
| Économie | 3 |
| Territoire & Urbain | 5 |
| Accidents & Mobilité | 3 |
| Environnement | 1 |

---

## 🔐 Accès backoffice

- URL : `/admin/login`
- Email et mot de passe configurés dans `.env.local`
- Session valable 24h
- Routes `/admin/dashboard/*` protégées par middleware

---

## 🛠 Technologies

- **Next.js 16** — Framework full-stack (App Router)
- **Tailwind CSS 4** — Styles utilitaires
- **Supabase** — Base de données PostgreSQL + API
- **Cloudinary** — Hébergement et transformation d'images
- **NextAuth.js** — Authentification admin
- **Vercel** — Hébergement (plan gratuit)

---

## 📞 Support

Données cartographiques : **HCP Maroc** (Haut-Commissariat au Plan)  
RGPH 2014 et 2024 · Annuaire Statistique 2018
