# Kaylow Sphere — site officiel

Site vitrine de **Kaylow Sphere** (anciennement SphereWeb), la marque de David Antoina,
développeur freelance fullstack (micro-entreprise, Eure-et-Loir · 28).

> « Kaylow Sphere, le centre de gravité de votre projet web. »

Référence du projet : [`docs/Charte_SphereWeb.docx`](docs/Charte_SphereWeb.docx) (v2.0 — Août 2026,
rédigée sous l'ancien nom SphereWeb — contenu toujours valable, seuls le nom et le domaine changent).

Décisions postérieures à la charte :
- **Next.js** (la charte prévoyait React + Vite). L'« API interne Node/Express » du formulaire
  de contact est une **Route Handler Next** (`app/api/contact/route.ts`).
- Renommage : **Kaylow Sphere**, domaine **`kaylowsphere.com`** (anciennement SphereWeb /
  `sphereweb-dev.com`, avant ça `sphere-web.com` dans la charte d'origine).
- Hébergement : **Hostinger** mutualisé Business avec application Node.js (la charte mentionnait IONOS).
- E-mail de contact : `david.antoina@kaylowsphere.com` — ⚠️ boîte à recréer sur le nouveau domaine.

## Stack

| Couche | Choix |
|---|---|
| Framework | Next.js 15 (App Router) + React 19 + TypeScript |
| Style | Tailwind CSS (palette et typo de la charte) |
| Polices | `next/font` — Poppins (titres), Inter (texte), JetBrains Mono (code) |
| SEO | Metadata API, `app/sitemap.ts`, `app/robots.ts` |
| Formulaire contact | Route Handler `app/api/contact` → nodemailer → SMTP |
| Hébergement | Hostinger mutualisé (Business) avec application Node.js — domaine `kaylowsphere.com` |

## Arborescence

```
kaylow-sphere/
├─ app/
│  ├─ layout.tsx            En-tête / pied de page / polices / metadata globale
│  ├─ page.tsx              Accueil
│  ├─ services/             Services
│  ├─ portfolio/            Liste + [slug] (détail projet, SSG)
│  ├─ a-propos/             À propos
│  ├─ contact/              Page contact (formulaire = composant client)
│  ├─ mentions-legales/     Pages légales (noindex)
│  ├─ confidentialite/
│  ├─ api/contact/route.ts  API du formulaire (validation zod + anti-spam + e-mail)
│  ├─ sitemap.ts / robots.ts
│  └─ not-found.tsx
├─ components/              Header, Footer, Logo, Icon, Section, CtaBand, ContactForm, ProjectMedia, LegalDoc
├─ scripts/gen-icons.mjs    Génération du jeu d'icônes + image OG (sharp)
├─ lib/
│  ├─ site.ts               Contenu éditorial (source unique — textes, services, projets)
│  ├─ seo.ts                Fabrique de metadata par page
│  └─ mailer.ts             Envoi d'e-mail (nodemailer)
├─ public/                  favicon.svg, site.webmanifest
├─ assets/                  Fichiers source de marque (logo)
└─ docs/                    Charte de projet
```

## Démarrage

Prérequis : Node.js ≥ 20.

```bash
npm install

# Config e-mail : copier et renseigner les identifiants SMTP
cp .env.example .env.local

npm run dev      # http://localhost:3000
```

## Build & déploiement

```bash
npm run build
npm run start    # sert le build en local (http://localhost:3000)
```

Le formulaire de contact nécessite un runtime Node (route `/api/contact` dynamique) :
un export 100 % statique n'est donc pas possible tel quel.

### Hostinger (mutualisé Business — application Node.js)

`next.config.mjs` active `output: 'standalone'` : `next build` produit un serveur autonome
dans `.next/standalone/`.

1. hPanel → **Site web → Avancé → Node.js** : créer l'application (version Node ≥ 20),
   dossier applicatif = racine du projet, fichier de démarrage = `server.js`
   (celui de `.next/standalone/`, à copier à la racine applicative lors du déploiement).
2. Déployer les fichiers (Git ou SFTP) : le dossier `.next/standalone/` **plus**
   `.next/static/` (à placer dans `.next/static/`) et `public/`.
3. Renseigner les variables d'environnement (`SMTP_*`, `MAIL_*`) dans l'interface Node.js de hPanel.
4. Redémarrer l'application depuis hPanel.

> Alternative de déploiement : builder en CI, puis `rsync` de `.next/standalone` + `.next/static` + `public`.

## Variables d'environnement

| Variable | Rôle |
|---|---|
| `SMTP_HOST` `SMTP_PORT` `SMTP_SECURE` | Serveur SMTP de la boîte (`smtp.hostinger.com`, 465, `true` si e-mail Hostinger) |
| `SMTP_USER` `SMTP_PASS` | Identifiants de la boîte mail |
| `MAIL_FROM` `MAIL_TO` | Expéditeur / destinataire des messages du formulaire |

## Icônes de marque

Source : `assets/Logo-sphere.jpg` (PNG transparent 1024²), plus `assets/favicon.ico`.
`npm run icons` régénère `public/` : `favicon-16/32`, `apple-touch-icon`, `icon-192/512`, `og-image`.

## À compléter avant mise en production

- [x] ~~Logo + favicons~~ (fournis, `public/` généré via `npm run icons`)
- [x] ~~Mentions légales : SIRET, TVA~~ (adresse postale : sur demande, cf. page)
- [x] ~~Confidentialité : durée de conservation~~ (3 ans ; aucun analytics pour l'instant)
- [ ] **Domaine `kaylowsphere.com`** : achat + DNS pointés vers Hostinger
- [ ] **Boîte mail `david.antoina@kaylowsphere.com`** à créer côté Hostinger, puis identifiants
      SMTP à jour dans `.env.local` / hPanel
- [ ] Liens profils Malt / Codeur.com (`lib/site.ts` → `site.profiles`)
- [ ] Captures d'écran des projets du portfolio (`public/portfolio/<slug>/`, cf. son README)
- [ ] URL publiques des projets en ligne (`lib/site.ts` → `project.url`)
- [ ] Page CGV si devis / paiements en ligne (Charte §4)
- [ ] Adresse postale complète dans les mentions légales si tu préfères l'afficher
- [ ] Éventuel outil d'audience sans cookie (Plausible / Matomo) — à décider
- [ ] Rate-limiting partagé (Redis/Upstash) si déploiement multi-instances (`app/api/contact/route.ts`)
