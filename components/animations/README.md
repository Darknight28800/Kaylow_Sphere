# Animations

Toutes les animations sont **côté client** et respectent
`prefers-reduced-motion`. Principe directeur : **peu d'effets, bien faits**, animés
uniquement via `transform` / `opacity` / `filter` (pas de lecture de layout en boucle).

## Ce dossier

| Fichier | Rôle | Dépendance |
|---|---|---|
| `SmoothScroll.tsx` | Défilement fluide global (inertie) + synchro ScrollTrigger | lenis + gsap |
| `useGsapScope.ts` | Hook : animations GSAP scopées, nettoyage auto | gsap |
| `ScrollParallax.tsx` | Parallaxe d'une couche au scroll (halo du hero) | gsap/ScrollTrigger |
| `HeroBackground3D.tsx` + `HeroScene.tsx` | Sphère 3D du hero (lazy, desktop uniquement, en pause pendant l'intro et hors écran) | three + r3f + drei |

## Ailleurs dans `components/`

| Fichier | Rôle |
|---|---|
| `Reveal.tsx` | Apparition unique au scroll : fondu + montée + flou qui se dissipe |
| `Stagger.tsx` | Même effet, en cascade sur les enfants `<StaggerItem>` (+ soulèvement au survol) |
| `HeroTitle.tsx` | Titre du hero révélé ligne par ligne (masque) |
| `ProcessSteps.tsx` | Récit au défilement de la méthode : colonne sticky + étape active |
| `ScrollProgress.tsx` | Barre de progression de lecture (scaleX) |
| `Spotlight.tsx` | Halo qui suit la souris sur les `.glass-panel` (souris uniquement) |
| `IntroLoader.tsx` | Intro « hyper-espace » (~5 s, une fois par session) |
| `app/template.tsx` | Transition d'entrée de page |

## Ajouter une animation

1. Préférer `Reveal` / `Stagger` existants plutôt qu'un nouveau composant.
2. Jamais de `requestAnimationFrame` permanent : se mettre en pause hors écran
   (`IntersectionObserver`) et pendant l'intro (`data-intro` sur `<html>`).
3. Toujours un repli `prefers-reduced-motion`.
4. Mesurer avant / après avec Lighthouse (mobile, 2 passes : les mesures locales sont bruitées).
