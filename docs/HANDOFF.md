# Kaylow Sphere — Récapitulatif & reprise sur un autre poste

> Document de passation. Généré le 2026-09-02, **mis à jour le 2026-10-18**.
> À transmettre à Claude Code sur l'autre PC pour reprendre le travail.
> Commencer par la section **0 ter** (dernière session), puis **0 bis** et **0**, le reste décrit le socle.

---

## 0 ter. Session du 19/10/2026 — À EXÉCUTER EN PREMIER sur l'autre PC

Correctif de sécurité Hostinger (PR #1, `hostinger[bot]`) fusionné : `next` 15.5.24 → **15.5.28**, `sharp` 0.35.4 → **0.35.5** (`package.json` + `package-lock.json`, commits `2b99a2f` et `d9d75d6`). Les `node_modules` de l'autre PC sont donc périmés :

```bash
git pull
npm install        # installe next 15.5.28 et sharp 0.35.5
rm -rf .next       # cache propre
npm run check && npm run build   # doit passer
```

- Vérifier ensuite : `grep '"version"' node_modules/next/package.json` → 15.5.28.
- À l'avenir, ne pas fusionner une PR `hostinger[bot]` directement sur GitHub : elle ne met pas à jour le lockfile. La fusionner en local, `npm install`, vérifier, puis pousser `package-lock.json`.

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

- **Dépôt** : https://github.com/Darknight28800/Kaylow_Sphere.git (branche `main`).
  Ancien nom `SphereWeb.git` : GitHub redirige, mais mettre à jour le remote local :
  `git remote set-url origin https://github.com/Darknight28800/Kaylow_Sphere.git`
- **En ligne** : https://kaylowsphere.com (Hostinger, application web Node.js reliée à GitHub)
- **E-mail** : `david.antoina@kaylowsphere.com` (boîte Hostinger, webmail Hostinger) ·
  **Téléphone** : 06 58 16 86 89
- **Charte d'origine** : `docs/Charte_SphereWeb.docx` (v2.0, août 2026, ancien nom ;
  prévoyait React + Vite, le projet est en **Next.js** par décision de l'utilisateur).

---

## 2. Stack technique

| Domaine | Choix |
|---|---|
| Framework | **Next.js 15** (App Router) + **React 19** + **TypeScript**, `output: 'standalone'` |
| Style | **Tailwind CSS 3.4** (tokens dans `tailwind.config.ts`), design system dans `app/globals.css` |
| Polices | **Auto-hébergées** : `next/font/local`, fichiers dans `app/fonts/` (Inter, Poppins, JetBrains Mono, licence OFL). Plus de `next/font/google` : un téléchargement raté au build faisait échouer le déploiement. |
| Animation | **framer-motion** (révélations, cascades, transitions de page), **Lenis** + GSAP (défilement fluide), **WebGL maison** sans bibliothèque 3D (`BlackHole.tsx`, `BigBang.tsx`), canvas 2D (intro) |
| Formulaires | Route Handlers `app/api/contact` et `app/api/avis` → **nodemailer** → SMTP Hostinger. Validation **zod**, honeypot, contrôle d'origine, limites par IP + plafond global (`lib/http.ts`, `lib/rate-limit.ts`) |
| Sécurité | En-têtes dans `next.config.mjs` : CSP (`frame-src 'none'`), HSTS, COOP, nosniff… |
| SEO | Metadata API (`lib/seo.ts`), JSON-LD (activité locale + FAQ), `app/sitemap.ts`, `app/robots.ts`, Google Search Console validée |
| Images | **sharp** (dev) : favicons + `og-image.png` via `scripts/gen-icons.mjs` |
| Qualité | Prettier (`.prettierrc.json`) + ESLint ; `npm run check` |

---

## 3. Installation sur un poste

### Prérequis
- **Node.js ≥ 20** (Hostinger construit en Node 20 ; poste principal en v24). Vérifier : `node -v`
- **Git**, VS Code conseillé.

### Étapes

```bash
git clone https://github.com/Darknight28800/Kaylow_Sphere.git SphereWeb
cd SphereWeb                  # (ou, si déjà cloné : git pull)
npm install
cp .env.example .env.local    # puis y mettre le vrai mot de passe SMTP (voir §8)
npm run dev                   # http://localhost:3000
```

### Scripts

| Commande | Effet |
|---|---|
| `npm run dev` | Serveur de développement (port 3000) |
| `npm run build` / `npm run start` | Build de production / le servir |
| `npm run check` | Types + lint + Prettier : **à lancer avant chaque commit** |
| `npm run format` | Formate tout le dépôt avec Prettier |
| `npm run icons` | Régénère favicons + `og-image.png` depuis **`public/logo-sphere.png`** (nouveau logo). `node scripts/gen-icons.mjs --og-only` = image OG seule. `assets/Logo-sphere.jpg` est l'**ancien** logo : ne plus l'utiliser. Les favicons actuels montrent encore l'ancien « S » : ne les régénérer qu'avec l'accord de l'utilisateur. |

### Pièges connus
- Ne **jamais** lancer `npm run build` pendant que `npm run dev` tourne (dossier `.next/`
  partagé). Arrêter le dev, `rm -rf .next`, relancer.
- Poste Windows : Norton ralentit fortement `dev` et `build` (repli WASM de SWC) et peut
  verrouiller brièvement des fichiers de `.git` (relancer la commande). Les mesures
  Lighthouse locales sont très bruitées : comparer sur le site en ligne.
- `.env.local` : `SMTP_TLS_INSECURE=true` contourne l'inspection TLS de Norton en dev.
  **Jamais en production.**

### Dépendances
**Runtime** : `next`, `react`, `react-dom`, `framer-motion`, `gsap`, `lenis`, `nodemailer`, `zod`.
**Dev** : `typescript`, `tailwindcss`, `postcss`, `autoprefixer`, `eslint`,
`eslint-config-next`, `eslint-config-prettier`, `prettier`, `sharp`, `@types/*`.
Retirés : `three`, `@react-three/*`, `postprocessing`, `@anthropic-ai/sdk` (démo IA supprimée).

---

## 4. Historique résumé

- **30/08 → 02/09** : socle Next.js, pages principales, contenu centralisé dans
  `lib/site.ts`, formulaire de contact, SEO de base, direction « liquid glass ».
- **11/09** : renommage SphereWeb → **Kaylow Sphere**, mise en ligne sur kaylowsphere.com.
- **15/10** : audit Lighthouse et allègement des animations (particules, jet de lumière et
  bordures LED supprimés), intro raccourcie à ~5 s, sécurité (IP fiable, plafonds globaux,
  CSP/HSTS), Prettier, ticket de confirmation (imprimante) sur Contact, **démo IA
  supprimée** (`/demo` redirige vers l'accueil), e-mail du partenaire retiré du pied de page,
  polices auto-hébergées, **SMTP de production réparé** (voir §8).
- **16-17/10** : trou noir WebGL, Big Bang, galaxie, Tarifs, Avis, téléphone, Audit gratuit,
  pages locales, blog, questionnaires PDF (détail en section 0).
- **18/10** : prix uniquement sur /tarifs, pages par métier, retour en haut, voile de
  lecture, nouvelle image de partage (section 0 bis).

### Repères de comportement
- **Intro « hyper-espace »** (`components/IntroLoader.tsx`) : ~5 s, une fois par session
  (`sessionStorage['sw-intro-played']`) ; la page apparaît dès que la sphère disparaît.
  Durées dans l'objet `PHASE`. Coupée si `prefers-reduced-motion`.
- **`Reveal` / `Stagger`** : apparition **unique** au scroll (fondu + montée + léger flou),
  plus de disparition en remontant.
- **Pied de page** : logo et lien ARTNumérique conservés, **sans l'e-mail du partenaire**
  (demande de l'utilisateur).
- **Prix** : **uniquement sur /tarifs** (demande de l'utilisateur). Ailleurs, renvoyer vers
  la page Tarifs.

---

## 5. Déploiement et production

- **Automatique** : un `git push` sur `main` déclenche le build Hostinger (~1 min), visible
  dans hPanel → Sites web → kaylowsphere.com → **Déploiements** (journal de build).
- **Après chaque déploiement** : hPanel → carte « Cache » → **Vider le cache**, puis
  Ctrl+Shift+R (sinon le CDN peut servir l'ancien HTML).
- Un build qui échoue laisse l'ancienne version en ligne : toujours lire le journal.
- Le journal de build affiche une ligne `[env] SMTP_HOST=OK …` : contrôle de présence des
  variables (noms seulement, jamais les valeurs).
- En cas d'échec d'envoi, l'API répond 502 avec un `code` : `smtp_config` (variable
  manquante), `smtp_auth` (mot de passe refusé), `smtp_connect`, `smtp_envelope`, `smtp_other`.

---

## 6. Ce qu'il reste à faire

1. **Portfolio** : captures de `tpak` et `nexus` (dans `public/portfolio/<slug>/`, puis
   `images[]` dans `lib/site.ts`) ; URL publiques des projets en ligne (`project.url`).
2. **Liens Malt / Codeur.com** → `site.profiles` dans `lib/site.ts`.
3. **Favicons** à l'ancien logo « S » : à régénérer si l'utilisateur valide (§3).
4. **Médiateur de la consommation** (si clients particuliers), voir section 0.
5. Page **CGV** si devis ou paiements en ligne (Charte §4).
6. Éventuel **outil d'audience sans cookie** (Plausible / Matomo), à décider.
7. Vérifier sur un **vrai téléphone** : trou noir, Big Bang, galaxie, fluidité.
8. Google Search Console : renvoyer le sitemap après ajout de pages.

---

## 7. Carte des fichiers clés

```
app/
├─ layout.tsx            Métadonnées, polices locales, JSON-LD, intro, ScrollProgress,
│                        SiteGalaxy, Spotlight, SmoothScroll, BackToTop, #app-shell
├─ template.tsx          Transition d'entrée de page (applique un transform : voir pièges §0)
├─ globals.css           Design system (.glass*, .btn*, .eyebrow, géante bleue, ticket…)
├─ fonts/                Polices woff2 auto-hébergées (+ README licences)
├─ page.tsx              Accueil (trou noir, Big Bang, galaxie)
├─ services/ tarifs/ portfolio/[slug]/ a-propos/ contact/ avis/ audit-gratuit/
├─ creation-site-internet/[ville]/   Pages locales (données : lib/local.ts)
├─ site-internet/[metier]/           Pages par métier (données : lib/trades.ts)
├─ blog/[slug]/                      Articles (données : lib/blog.ts)
├─ mentions-legales/ confidentialite/ not-found.tsx
├─ api/contact/ api/avis/            Envoi des formulaires
└─ sitemap.ts robots.ts
components/
├─ IntroLoader.tsx                   Intro hyper-espace (~5 s)
├─ BlackHole.tsx BlackHoleHero.tsx   Trou noir WebGL du hero + aspiration du texte
├─ BigBang.tsx SiteGalaxy.tsx        Big Bang (accueil) / galaxie de fond (autres pages,
│                                    voile de lecture sur légal et articles)
├─ ContactForm.tsx ReceiptPrinter.tsx AuditForm.tsx ReviewForm.tsx
├─ OfferCard.tsx Testimonials.tsx Faq.tsx RichText.tsx ProjectMedia.tsx
├─ Header.tsx Footer.tsx PageHeader.tsx Section.tsx CtaBand.tsx LegalDoc.tsx
├─ Reveal.tsx Stagger.tsx ScrollProgress.tsx Spotlight.tsx BackToTop.tsx ProcessSteps.tsx
└─ animations/           SmoothScroll (Lenis), ScrollParallax, useGsapScope (+ README)
lib/
├─ site.ts               CONTENU : source unique (textes, services, offres, projets, avis)
├─ local.ts trades.ts blog.ts   Pages locales / métiers / articles
├─ seo.ts                Metadata par page + JSON-LD
├─ mailer.ts             E-mails (contact, avis)
└─ http.ts rate-limit.ts IP client, contrôle d'origine, limites anti-abus
scripts/                 gen-icons.mjs, questionnaires/ (PDF clients)
public/                  favicons, og-image, logo-sphere.png, portfolio/, partners/
docs/                    Charte (ancien nom), ce document, questionnaires PDF
```

---

## 8. Variables d'environnement

**Production** : hPanel → Sites web → kaylowsphere.com → **Variables d'environnement**
(import d'un fichier `.env` possible). Elles sont lues **au moment du build** puis
intégrées au code serveur (`env` dans `next.config.mjs`, jamais dans le JavaScript envoyé
au navigateur) : **après toute modification, redéployer**.
**Développement** : `.env.local` (ignoré par git, ne jamais le committer).

| Variable | Valeur |
|---|---|
| `SMTP_HOST` | `smtp.hostinger.com` |
| `SMTP_PORT` | `465` |
| `SMTP_SECURE` | `true` |
| `SMTP_USER` | `david.antoina@kaylowsphere.com` |
| `SMTP_PASS` | mot de passe de la boîte mail (réinitialisable dans hPanel → E-mails) |
| `MAIL_FROM` | `Kaylow Sphere <david.antoina@kaylowsphere.com>` |
| `MAIL_TO` | `david.antoina@kaylowsphere.com` |
| `TRUSTED_PROXY_COUNT` | facultatif, **1 par défaut** (mesuré sur Hostinger : la dernière adresse de `X-Forwarded-For` est la bonne). Diagnostic : ligne « Chaîne XFF » des e-mails de contact. |
| `SMTP_TLS_INSECURE` | **dev uniquement** (antivirus local), jamais en production |
