# Kaylow Sphere — Récapitulatif & reprise sur un autre poste

> Document de passation. Généré le 2026-09-02, **mis à jour le 2026-10-18**.
> À transmettre à Claude Code sur l'autre PC pour reprendre le travail.
> Commencer par la section **0** (dernière session), le reste décrit le socle.

---

## 0 bis. Session du 18/10/2026

| Sujet | Où | Détail |
|---|---|---|
| **Prix uniquement sur /tarifs** | `app/page.tsx`, `app/services/page.tsx`, `lib/local.ts`, `app/creation-site-internet/[ville]/page.tsx`, `lib/blog.ts` | Demande explicite : **aucun montant hors de la page Tarifs** (renvoi « Voir les tarifs » à la place). Seule exception : les amendes de l'article « mentions légales » (sanctions, pas des prix). Ne pas réintroduire de prix ailleurs. |
| **Pages par métier** | `lib/trades.ts`, `app/site-internet/` | `/site-internet` + 4 pages : artisan-batiment, ramoneur-chauffagiste (exemple : site de Kévin), commercant, association. Texte propre à chaque métier, FAQ en JSON-LD, liens dans le pied de page, le sitemap et le hub local. Sans prix. |
| **Retour en haut** | `components/BackToTop.tsx` (dans `app/layout.tsx`) | Apparaît après 1,5 écran, remonte via Lenis. |
| **Lisibilité galaxie** | `components/SiteGalaxy.tsx` | Voile `bg-navy/75` sur mentions légales, confidentialité et articles de blog. |
| **Image de partage** | `public/og-image.png`, `scripts/gen-icons.mjs` | Régénérée avec le nouveau logo (`public/logo-sphere.png`). `node scripts/gen-icons.mjs --og-only` = image OG seule. **Favicons encore à l'ancien logo « S »** : à régénérer seulement si l'utilisateur valide. |
| **Tests prod** | — | Envois réels Contact (réf. `KS-TEST`) et Avis OK (HTTP 200) ; contrôle de réception dans le webmail Hostinger à faire par l'utilisateur. |

Délai de livraison : déjà affiché sur chaque formule de /tarifs (idée de veille close).

## 0. Dernières sessions (16 et 17/10/2026) — à lire en premier

### Reprendre sur l'autre PC

```bash
git pull
npm install        # des paquets ont été RETIRÉS (three, @react-three/*, postprocessing)
rm -rf .next       # repartir d'un cache propre
npm run dev        # http://localhost:3000
```

- Tout est commité et poussé sur `origin/main` (rien en attente localement).
- Vérification avant commit : `npm run check` (types + lint + Prettier) puis `npm run build`.
- **Après chaque déploiement** (push sur `main` → Hostinger redéploie tout seul) :
  hPanel → carte « Cache » → **Vider le cache**, puis Ctrl+Shift+R. Sinon le CDN sert
  l'ancien HTML → écran blanc.

### Ce qui a été fait

| Sujet | Où | Détail |
|---|---|---|
| **Trou noir du hero** | `components/BlackHole.tsx` | Shader WebGL maison (aucune lib 3D) : rayons courbés par la gravité, disque d'accrétion **horizontal**, effet Doppler, étoiles en orbite képlérienne, ciel en rotation lente. Rendu à la **résolution native** (jusqu'à la 4K), qualité adaptative si le GPU rame, pause hors écran / onglet masqué / pendant l'intro, image fixe si animations réduites, repli CSS sans WebGL. |
| **Hero** | `app/page.tsx`, `components/BlackHoleHero.tsx`, `components/HeroTitle.tsx` | Textes et boutons **centrés sous le header**, trou noir **pleine largeur** en dessous. Au scroll, le bloc texte est **aspiré** vers le centre du trou noir (`GravityPull`). Titre réduit (max 4,25rem). |
| **Halo « géante bleue »** | `app/globals.css` (`.giant-light`, `.giant-lit`) | Géante **invisible**, cachée derrière le trou noir : seule sa lumière éclaire légèrement le bloc texte (lueur + reflet). |
| **Big Bang** | `components/BigBang.tsx` | Accueil : zone de scroll entre Portfolio et Méthode → éclair, onde de choc, éjection des étoiles, formation d'une **galaxie spirale**. Elle reste en fond jusqu'en bas ; remonter rejoue à l'envers. **Couleurs à ne pas toucher** (demande explicite). |
| **Galaxie sur les autres pages** | `components/SiteGalaxy.tsx` (monté dans `app/layout.tsx`) | Toutes les pages sauf `/` : galaxie déjà formée en fond (`BigBang mode="galaxy"`). Pose `data-galaxy` sur `<html>` → les sections `navy` et les en-têtes de page deviennent transparents (`.section-navy`). L'accueil reste strictement inchangé. |
| **Couleurs** | `tailwind.config.ts`, `app/globals.css` | **Plus de cyan** : `accent` = `#5B8CFF` (bleu électrique du logo), `brand` = `#5B3DF6` (violet). Seul le Big Bang garde son cyan (demande explicite). |
| **Portfolio** | `lib/site.ts`, `public/portfolio/` | Cards de l'accueil : **TTA, Maintenance Ramonage Services (Kévin), FacturePro** (TPAK retiré de l'accueil, toujours sur `/portfolio`). Captures : `trouve-ton-artisan/01.jpg`, `maintenance-ramonage-services/01.jpg`, `gdf/01.jpg` (1600×1000). |
| **Nettoyage** | — | Supprimés : `HeroBackground3D.tsx`, `HeroScene.tsx` et les paquets three / @react-three/* / postprocessing. |

### Session du 17/10

| Sujet | Où | Détail |
|---|---|---|
| **Page Tarifs** | `app/tarifs/page.tsx`, données dans `lib/site.ts` (`offers`, `assoOffers`, `extras`, `priceFactors`, `pricingFaq`) | Fourchettes : Essentiel 500–900 €, Vitrine 1 000–1 900 €, Vitrine Pro 2 000–3 500 €, sur mesure dès 3 000 €, Asso 350–600 € / 700–1 200 €, Refonte 800–2 500 €, Optimisation 150–600 €, Suivi Sérénité **50 €/mois** (30 € associations), à la demande 35 €/h. Tableau « Ce qui fait varier le prix », FAQ. Engagements affichés et validés : prix nets (TVA non applicable), paiement en 2 ou 3 fois sans frais, devis fixe, domaine au nom du client. Montants formatés par `OfferCard` (espace insécable à partir de 1 000). |
| **Avis clients** | `app/avis/page.tsx`, `components/ReviewForm.tsx`, `app/api/avis/route.ts`, `lib/mailer.ts` (`sendReviewEmail`), `components/Testimonials.tsx` | L'avis arrive **par e-mail pour modération**, avec un bloc prêt à coller dans `testimonials` (`lib/site.ts`). Section « Avis » affichée seulement si la liste n'est pas vide (accueil, tarifs, avis). Aucun avis publié pour l'instant. Lien « Laisser un avis » dans le pied de page. |
| **Téléphone** | `lib/site.ts` (`phone`, `phoneHref`) | 06 58 16 86 89, dans le pied de page et sur Contact. Pas de réseaux sociaux (choix de l'utilisateur, rien à publier pour l'instant). |
| **Ticket de contact premium** | `components/ReceiptPrinter.tsx`, `app/globals.css` (`.printer-*`, `.ticket-*`) | Imprimante métal sombre, ticket papier grainé, bande holographique, talon détachable, tampon « Demande reçue ». La référence `KS-XXXX` est envoyée à l'API et figure dans **le sujet de l'e-mail** de contact. |
| **Cartes opaques** | `app/globals.css` (`.glass`, `.glass-panel`) | Fond bleu nuit à 88 % sur tout le site, pour rester lisible devant la galaxie. |
| **Centrage mobile** | `components/CtaBand.tsx`, `components/Footer.tsx`, `app/contact/page.tsx`, `app/avis/page.tsx` | Bandeau Contact et pied de page centrés sur mobile ; grille Contact/Avis en `min-w-0` (le ticket débordait à droite). Vérifié en 360 et 390 px. |

**Documents (Claude Docs, hors dépôt)** :
- [Questionnaire client — création de site](https://claude.ai/code/artifact/4b3001e4-b2c7-4a63-86a3-a3732ff9fa72) (version éditable de toutes les questions)
- [Footer et mentions légales selon le type de site](https://claude.ai/code/artifact/e86bba4a-93e9-4e95-8258-907cd8974c9d) (mémo juridique pour les sites clients, sources service-public / CNIL)

**Veille concurrentielle (en cours)** : l'utilisateur envoie des sites de développeurs web un par un
pour y piocher des idées ; analyser en lecture seule, proposer, puis attendre sa validation avant de
coder. Fait : antoine-koe.fr/tarifs → Tarifs, avis, FAQ, téléphone réalisés. Idées encore ouvertes :
pages par métier (ex. « site internet pour artisan / ramoneur ») pour le référencement local,
délai de livraison affiché, bouton « retour en haut ».

### Acquisition clients (17/10, fin de journée)

- **Sur le site** : `/audit-gratuit` (offre d'appel, formulaire → `/api/contact` avec le type
  « Audit gratuit » ; promesse : rapport sous 48 h ouvrées), pages locales
  `/creation-site-internet` + Chartres, Châteaudun, Bonneval, Voves (`lib/local.ts`, FAQ en
  JSON-LD), `/blog` avec 5 articles (`lib/blog.ts`, liens internes `[texte](/chemin)` rendus
  par `components/RichText.tsx`). Menu : + « Audit gratuit » et « Blog » ; bouton secondaire du
  hero → audit gratuit ; villes dans le pied de page ; téléphone et villes dans le JSON-LD.
- **Hors du site** : kit marketing dans **`C:\Dev\KaylowSphere-Marketing`** (dépôt GitHub **privé** `Darknight28800/KaylowSphere-Marketing` ; sur l'autre PC :
  `git clone https://github.com/Darknight28800/KaylowSphere-Marketing.git C:\Dev\KaylowSphere-Marketing`) : positionnement, fiche Google, prospection, outil d'audit
  automatique (`04-audit-gratuit/audit.mjs`, rapport HTML aux couleurs Kaylow Sphere), CRM,
  LinkedIn, annuaires, **plan 90 jours** (point de départ).
- Refusé volontairement : faux témoignages (interdit), volumes de contenu « remplissage »,
  SaaS d'automatisation (prématuré).

### Questionnaires clients (PDF remplissables, ajout du 17/10)

- `docs/questionnaires/` : un PDF par formule (Essentiel, Vitrine, Vitrine Pro, sur mesure,
  associations, refonte, suivi), à envoyer aux clients ; ils répondent dans les champs et
  renvoient le fichier par e-mail. Remplissage vérifié par programme ; **pas encore testé dans
  Adobe Reader, Aperçu (Mac) ni sur téléphone** : faire un essai complet avant le premier envoi.
- Questions dans `scripts/questionnaires/questions.py`, mise en page dans `generate.py`.
  Régénérer : `python -m pip install reportlab fonttools brotli` (une fois) puis
  `python scripts/questionnaires/generate.py`.

### Non vérifié / à faire ensuite

- **Médiateur de la consommation** : obligatoire dès qu'on travaille pour des particuliers
  (pas pour les clients professionnels). L'utilisateur n'en a pas encore : s'il adhère à un
  médiateur, ajouter son nom et son site aux mentions légales (et sur les devis). Proposé aussi :
  une question « Avez-vous un médiateur ? » dans les questionnaires (pas encore faite).
- **Tester en production** après déploiement : un vrai message depuis Contact (référence dans le
  sujet) et un vrai avis depuis /avis (e-mail avec le bloc à coller). Seuls des envois
  interceptés ont été testés en local.
- **Mobile** : Contact, ticket et pied de page vérifiés en 360/390 px (navigateur automatisé).
  Reste à voir sur un vrai téléphone : hero (trou noir, aspiration), Big Bang, galaxie,
  **fluidité** (trou noir en résolution native).
- **Lisibilité** : sur les pages très textuelles (mentions légales), le cœur de la galaxie passe
  derrière le texte central. Atténuer la galaxie sur ces pages si ça gêne.
- **`og-image.png` contient encore du cyan**. `scripts/gen-icons.mjs` est corrigé (bleu) mais
  part de `assets/Logo-sphere.jpg`, qui semble être **l'ancien logo** : ne pas lancer
  `npm run icons` sans d'abord pointer le script vers le nouveau logo
  (`public/logo-sphere.png`), sinon les icônes actuelles seraient écrasées.
- Site de Kévin (`C:\Dev\Kevin_ramoneur`) : encore en maquette (`"provisoire": true`).
  Quand il sera en ligne (domaine prévu `ramonage-idf.fr`) → passer le projet en
  `status: 'en ligne'` et ajouter `url` dans `lib/site.ts`. Vérifier que Kévin est d'accord
  pour figurer au portfolio.

### Pièges rencontrés

- **Ne jamais lancer `npm run build` pendant que `npm run dev` tourne** (dossier `.next`
  partagé) : le dev server se retrouve sans ses fichiers → page sans JavaScript, canvas vides.
  Arrêter le dev, `rm -rf .next`, relancer.
- **Lenis** (défilement fluide) restaure la position de scroll au rechargement : pour tester
  le haut de page, `history.scrollRestoration = 'manual'` ou touche Début.
- Pour sauter l'intro en test : `sessionStorage.setItem('sw-intro-played', '1')`.
- Tests mobiles : la fenêtre Chrome ne se redimensionne pas et la CSP bloque l'aperçu en
  iframe → utiliser Playwright avec un viewport mobile (il est installé dans
  `C:\Dev\Kevin_ramoneur`, utilisable en lecture via `createRequire`).
- Ne jamais tester les formulaires avec un vrai envoi : intercepter `/api/contact` ou
  `/api/avis` (sinon un vrai e-mail part).
- Un `position: fixed` placé sous `app/template.tsx` (qui applique un `transform`) n'est plus
  fixe : les canvas plein écran sont **portés dans `<body>`** (`createPortal`).

---

## 1. Le projet en deux lignes

Site vitrine officiel de **Kaylow Sphere**, la marque de **David Antoina**, développeur
freelance fullstack (micro-entreprise, Eure-et-Loir · 28).
Baseline : « Kaylow Sphere, le centre de gravité de votre projet web. »

- **Dépôt** : https://github.com/Darknight28800/SphereWeb.git (branche `main`)
- **Domaine cible** : `kaylowsphere.com`
- **E-mail contact** : `david.antoina@kaylowsphere.com` (boîte Hostinger)
- **Hébergement prévu** : Hostinger, offre mutualisée **Business avec application Node.js**
  (hPanel → Site web → Avancé → Node.js). `next.config.mjs` est en `output: 'standalone'`.
- **Charte de référence** : `docs/Charte_SphereWeb.docx` (v2.0, Août 2026).
  Elle prévoyait React + Vite ; le projet est finalement en **Next.js** (décision de l'utilisateur).

---

## 2. Stack technique

| Domaine | Choix |
|---|---|
| Framework | **Next.js 15** (App Router) + **React 19** + **TypeScript** |
| Style | **Tailwind CSS 3.4** (tokens dans `tailwind.config.ts`) |
| Polices | `next/font/google` — Poppins (titres), Inter (texte), JetBrains Mono (mono / libellés) |
| Animation | **framer-motion** (révélations au scroll, cascades, transitions de page) + `<canvas>` maison (intro, particules, jet de lumière) |
| Formulaire contact | Route Handler `app/api/contact/route.ts` → **nodemailer** → SMTP Hostinger. Validation **zod**, honeypot, rate-limit en mémoire |
| Images | **sharp** (dev) pour générer le jeu d'icônes + image OG |
| SEO | Metadata API, `app/sitemap.ts`, `app/robots.ts` |

---

## 3. Installation sur le nouveau poste

### Prérequis
- **Node.js ≥ 20** (le poste actuel tourne en v24.20, npm 11). Vérifier : `node -v`
- **Git**
- Un éditeur (VS Code conseillé)

### Étapes

```bash
# 1. Récupérer le code
git clone https://github.com/Darknight28800/SphereWeb.git
cd SphereWeb
# (ou, si déjà cloné : git pull)

# 2. Installer les dépendances (lit package.json — rien à installer à la main)
npm install

# 3. Configurer l'e-mail du formulaire de contact
cp .env.example .env.local
#   puis éditer .env.local avec le vrai mot de passe SMTP de la boîte Hostinger

# 4. Lancer le serveur de dev
npm run dev            # http://localhost:3000
```

### Scripts disponibles

| Commande | Effet |
|---|---|
| `npm run dev` | Serveur de développement (port 3000) |
| `npm run build` | Build de production (`.next/`) |
| `npm run start` | Sert le build |
| `npm run lint` | ESLint (`next lint`) |
| `npm run icons` | Régénère `public/` (favicons + `og-image.png`) depuis `assets/Logo-sphere.jpg` via sharp |

### ⚠️ Piège connu (dev + build)
Ne **jamais** lancer `npm run build` pendant que `npm run dev` tourne : les deux
partagent le dossier `.next/` et le build échoue (`PageNotFoundError /_error`).
Arrêter le dev (Ctrl+C) avant de builder. En cas de souci : `rm -rf .next` puis rebuild.

### Dépendances (déjà dans package.json, installées par `npm install`)

**Runtime** : `next`, `react`, `react-dom`, `framer-motion`, `nodemailer`, `zod`
**Dev** : `typescript`, `tailwindcss`, `postcss`, `autoprefixer`, `eslint`,
`eslint-config-next`, `sharp`, `@types/*`

Rien d'autre à installer globalement.

---

## 4. Ce qui a été fait (30/08 → 02/09)

### Socle (30/08 – 01/09)
- Initialisation du projet Next.js 15 / App Router / TS / Tailwind.
- Arborescence complète : Accueil, Services, Portfolio (+ page détail projet en SSG),
  À propos, Contact, Mentions légales, Confidentialité, 404.
- Contenu éditorial centralisé dans **`lib/site.ts`** (source unique : textes, services,
  projets, coordonnées, partenaire).
- Formulaire de contact : route API + nodemailer + zod + honeypot + rate-limit.
- SEO : `lib/seo.ts` (metadata par page), `app/sitemap.ts`, `app/robots.ts`.
- Passage de la cible d'hébergement à **Hostinger** + domaine **kaylowsphere.com**
  + `output: 'standalone'`.

### Marque / contenu légal
- Logo réel de l'utilisateur (`assets/Logo-sphere.jpg`, PNG transparent) intégré.
- Jeu d'icônes + image Open Graph générés (`scripts/gen-icons.mjs`, `npm run icons`).
- Mentions légales : **SIRET 10673178900017**, TVA franchise en base (art. 293 B CGI),
  siège Eure-et-Loir, adresse postale « sur demande ».
- Confidentialité : conservation des messages **3 ans**, **aucun cookie ni analytics**
  → pas de bandeau de consentement.
- Pied de page : bloc **« En partenariat avec ARTNumérique »** (logo placeholder
  `public/partners/artnumerique.svg` à remplacer) + 2ᵉ e-mail contact
  `renaud.vaillant@artnumérique.fr`.

### Direction visuelle « liquid glass »
- Refonte pour se démarquer du site de référence (artnumérique.fr) : **panneaux verre
  dépoli** (`.glass`, `.glass-panel`, `.glass-sheen`), halos diffus (`.aura`), palette
  fond **`#050B2B`** (aligné sur le portfolio de l'utilisateur), **voix monospace**
  (nav, libellés de section indexés `01/02/03`, méta, libellés de boutons).
- Suppression de la trame « blueprint » de fond.
- Sections claires bannies → tout en verre sombre.

### Animations
- **Intro cinématique « hyper-espace »** (`components/IntroLoader.tsx`) au 1ᵉʳ chargement
  de session (`sessionStorage['sw-intro-played']`, cache noir inline dans `layout.tsx`
  avant hydratation). Séquence en 6 phases (~12,5 s) : croisière 2,8 s / décélération 2 s
  / arrêt sphère 3 s (barre « Bienvenue au cœur du web » + compteur %) / ré-accélération 2 s
  / hyper-espace retour 1,3 s / révélation. Bouton « Passer l'intro », coupé si
  `prefers-reduced-motion`. Rendu `<canvas>` + rAF. **Durées ajustables** dans l'objet
  `PHASE` en tête du composant.
- **Sphère du hero** (`components/HeroSphere.tsx`) : grand format, rotation 35 s,
  battement zoom/dézoom + halo pulsé synchronisé (cycle 6 s). Visible aussi sur mobile.
- **Champ de particules** (`components/ParticleField.tsx`) : ~64 étoiles qui dérivent sur
  toute la page (canvas fixe, `pointer-events: none`), repoussées par le curseur
  (`REPEL_RADIUS` = 100 px).
- **Motion design framer-motion** :
  - `components/Reveal.tsx` — fondu ascendant **bidirectionnel** (apparaît en scrollant
    vers le bas, disparaît en remontant). Amplitude volontairement subtile (10 px).
  - `components/Stagger.tsx` — `Stagger` + `StaggerItem` : cascade sur les grilles de
    cartes + léger soulèvement au survol (`whileHover`).
  - `app/template.tsx` — transition d'entrée de page à chaque navigation.
- **Jet de lumière global** (`components/CardBeam.tsx`) : un unique faisceau diagonal
  balaye l'écran de gauche à droite (~10 s), pause 6 s, en coordonnées viewport →
  visible **uniquement sur les panneaux** (`.glass-panel`, `.beam-target`). S'estompe
  au survol d'une carte, revient à la sortie.

---

## 5. État actuel

- ✅ `npm run build` OK, `npm run lint` OK (0 erreur), 16 routes générées.
- ✅ Tout est commité et poussé sur `origin/main` (dernier commit : `e7cbe86`).
- 🔧 Serveur de dev en cours d'itération sur le design / les animations avec l'utilisateur.

---

## 6. Ce qu'il reste à faire (par ordre de priorité)

1. **Identifiants SMTP Hostinger** dans `.env.local` (le formulaire renvoie une erreur
   gracieuse tant que ce n'est pas fait — c'est normal).
2. **Logo ARTNumérique définitif** → remplacer `public/partners/artnumerique.svg`
   (voir `public/partners/README.md`).
3. **Captures d'écran des projets** → faites pour TTA, Maintenance Ramonage Services et
   FacturePro (16/10). Restent `tpak` et `nexus` : déposer dans `public/portfolio/<slug>/`
   puis renseigner `images[]` dans `lib/site.ts` (voir `public/portfolio/README.md`).
4. **URL publiques des projets en ligne** → `lib/site.ts` → `project.url`.
5. **Liens profils Malt / Codeur.com** → `lib/site.ts` → `site.profiles`.
6. **Poursuite du travail design / motion** avec l'utilisateur (itératif).
7. Page **CGV** si devis / paiements en ligne (Charte §4).
8. Éventuel **outil d'audience sans cookie** (Plausible / Matomo) — à décider.
9. **Déploiement Hostinger** : en place — intégration Git de Hostinger, chaque push sur
   `main` redéploie (Hostinger lance lui-même le build). **Vider le cache Hostinger après
   chaque déploiement** (voir section 0).

---

## 7. Carte des fichiers clés

```
app/
├─ layout.tsx           Métadonnées globales, polices, script d'intro inline,
│                       montage de IntroLoader / ScrollProgress / SiteGalaxy, #app-shell
├─ template.tsx         Transition d'entrée de page (framer-motion)
├─ globals.css          Design system : .glass*, .btn*, .eyebrow, .aura, jet de lumière,
│                       CSS de l'intro (fond noir #03040c)
├─ page.tsx             Accueil
├─ services/ portfolio/ [slug]/ a-propos/ contact/ mentions-legales/ confidentialite/
├─ api/contact/route.ts API du formulaire
├─ sitemap.ts robots.ts
components/
├─ IntroLoader.tsx      Intro hyper-espace (canvas, phases dans `PHASE`)
├─ BlackHole.tsx        Trou noir WebGL du hero (shader GLSL)
├─ BlackHoleHero.tsx    Hero : BlackHoleHero / BlackHoleLayer / GravityPull (aspiration)
├─ BigBang.tsx          Big Bang au scroll + galaxie (mode `galaxy` pour les pages internes)
├─ SiteGalaxy.tsx       Galaxie en fond hors accueil (data-galaxy sur <html>)
├─ animations/          SmoothScroll (Lenis), ScrollParallax (GSAP) — voir son README
├─ Reveal.tsx           Révélation bidirectionnelle au scroll
├─ Stagger.tsx          Cascade + hover sur les grilles
├─ Header.tsx Footer.tsx Logo.tsx Icon.tsx Section.tsx CtaBand.tsx
├─ ContactForm.tsx      Formulaire (client)
├─ ProjectMedia.tsx     Vignettes / galerie projet (+ placeholder)
└─ LegalDoc.tsx         Gabarit des pages légales
lib/
├─ site.ts              CONTENU — source unique (textes, services, projets, partenaire)
├─ seo.ts               Fabrique de metadata par page
└─ mailer.ts            Envoi d'e-mail (nodemailer)
scripts/gen-icons.mjs   Génération des icônes (npm run icons)
public/                 favicons, og-image, manifest, partners/, portfolio/
assets/                 Sources de marque (logo, favicon.ico)
docs/                   Charte + ce document
```

---

## 8. Variables d'environnement (`.env.local`)

| Variable | Valeur |
|---|---|
| `SMTP_HOST` | `smtp.hostinger.com` |
| `SMTP_PORT` | `465` |
| `SMTP_SECURE` | `true` |
| `SMTP_USER` | `david.antoina@kaylowsphere.com` |
| `SMTP_PASS` | *(mot de passe de la boîte mail — à renseigner)* |
| `MAIL_FROM` | `"Kaylow Sphere <david.antoina@kaylowsphere.com>"` |
| `MAIL_TO` | `david.antoina@kaylowsphere.com` |

`.env.local` est ignoré par git (ne jamais committer les identifiants).
