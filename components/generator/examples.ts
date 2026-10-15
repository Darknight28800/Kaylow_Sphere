/**
 * Prompts d'exemple de la démo IA — stockés côté frontend (pas de base de
 * données). Chaque exemple précise secteur, ambiance et palette suggérée,
 * et se charge dans le champ éditable au clic.
 */

export interface PromptExample {
  id: string;
  sector: string;
  /** Aperçu du style : 2-3 pastilles de couleur (CSS). */
  swatches: [string, string, string];
  /** Résumé court affiché sur la carte. */
  vibe: string;
  /** Texte injecté dans le champ éditable. */
  prompt: string;
}

export const EXAMPLES: PromptExample[] = [
  {
    id: 'restaurant',
    sector: 'Restaurant bistronomique',
    swatches: ['#1b1b1b', '#c8a24a', '#f4efe6'],
    vibe: 'Chaleureux, élégant, artisanal',
    prompt:
      "Site pour un restaurant bistronomique de quartier. Ambiance chaleureuse et élégante, cuisine de saison, produits locaux. Palette : noir profond, doré/laiton, crème. Typo à empattements pour les titres. Mettre en avant la carte, l'ambiance de la salle et la réservation.",
  },
  {
    id: 'coach-sportif',
    sector: 'Coach sportif',
    swatches: ['#0a0a0a', '#e8ff3a', '#e5e5e5'],
    vibe: 'Énergique, moderne, tranchant',
    prompt:
      "Site pour un coach sportif indépendant : coaching individuel, small group, programmes en ligne. Ambiance énergique et moderne, contrastée. Palette : noir, jaune fluo, gris clair. Titres percutants. Mettre en avant les formules d'accompagnement et la prise de contact.",
  },
  {
    id: 'cabinet-avocats',
    sector: "Cabinet d'avocats",
    swatches: ['#10243e', '#8c7853', '#f2f2ef'],
    vibe: 'Sobre, institutionnel, rassurant',
    prompt:
      "Site pour un cabinet d'avocats en droit des affaires et droit social. Ambiance sobre, institutionnelle et rassurante. Palette : bleu nuit, bronze discret, blanc cassé. Typographie classique. Présenter les domaines d'intervention et la prise de rendez-vous.",
  },
  {
    id: 'salon-coiffure',
    sector: 'Salon de coiffure',
    swatches: ['#2b1d24', '#d98a8a', '#faf3f0'],
    vibe: 'Doux, contemporain, féminin',
    prompt:
      "Site pour un salon de coiffure et beauté. Ambiance douce, contemporaine et soignée. Palette : prune sombre, rose poudré, ivoire. Formes arrondies, beaucoup d'air. Mettre en avant les prestations (coupe, couleur, soins) et la réservation en ligne.",
  },
  {
    id: 'menuisier',
    sector: 'Artisan menuisier',
    swatches: ['#2e2117', '#a9742f', '#efe7db'],
    vibe: 'Authentique, robuste, naturel',
    prompt:
      'Site pour un artisan menuisier-ébéniste : agencement sur mesure, mobilier, pose. Ambiance authentique et robuste, matière bois. Palette : brun foncé, ocre/bois, sable. Titres solides. Mettre en avant le savoir-faire, les types de réalisations et le devis.',
  },
];
