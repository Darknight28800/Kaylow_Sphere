// Pages locales « Création de site internet à <ville> » (app/creation-site-internet).
// Chaque ville a un texte propre : des pages identiques au nom près seraient
// ignorées, voire pénalisées, par Google.

import type { FaqItem } from './site';

export interface City {
  slug: string;
  name: string;
  /** « à Chartres », « à Châteaudun »… */
  at: string;
  /** Titre de la page (balise title, sans le suffixe du site). */
  seoTitle: string;
  description: string;
  intro: string;
  /** Pourquoi un site compte pour les entreprises de cette ville. */
  context: string[];
  /** Entreprises typiques accompagnées. */
  audiences: string[];
  /** Communes voisines desservies. */
  nearby: string[];
  faq: FaqItem[];
}

const commonFaq = (at: string): FaqItem[] => [
  {
    q: `Combien coûte un site internet ${at} ?`,
    a: 'Le prix dépend du nombre de pages et des fonctionnalités : à partir de 500 € pour un site d’une page, 1 000 à 1 900 € pour un site vitrine complet. Le devis est gratuit et fixe une fois validé ; le paiement peut se faire en 2 ou 3 fois.',
  },
  {
    q: 'En combien de temps mon site peut-il être en ligne ?',
    a: 'Environ une semaine pour un site d’une page, deux à trois semaines pour un site vitrine, à partir du moment où j’ai vos textes et vos photos (je peux vous aider à les préparer).',
  },
];

export const cities: City[] = [
  {
    slug: 'chartres',
    name: 'Chartres',
    at: 'à Chartres',
    seoTitle: 'Création de site internet à Chartres',
    description:
      'Développeur web freelance près de Chartres : création de site internet pour artisans, commerçants, indépendants et associations de Chartres métropole. Devis gratuit, dès 500 €.',
    intro:
      'Préfecture d’Eure-et-Loir, Chartres concentre une grande partie des commerces, artisans et services du département. Vos clients comparent sur Google avant d’appeler : un site clair et rapide vous fait choisir plutôt qu’un concurrent.',
    context: [
      'Être visible sur les recherches « + Chartres » de votre métier, face aux enseignes et aux agences de la métropole.',
      'Rassurer les nombreux visiteurs de passage (tourisme, cathédrale) qui découvrent votre commerce sur leur téléphone.',
      'Recevoir des demandes de devis qualifiées plutôt que des appels pour de simples renseignements.',
    ],
    audiences: [
      'Commerçants du centre-ville',
      'Artisans du bâtiment de l’agglomération',
      'Professions libérales et indépendants',
      'Associations sportives et culturelles',
    ],
    nearby: ['Lucé', 'Mainvilliers', 'Lèves', 'Luisant', 'Champhol'],
    faq: [
      {
        q: 'Vous déplacez-vous à Chartres pour un premier rendez-vous ?',
        a: 'Oui. Je travaille à proximité et je me déplace volontiers à Chartres et dans l’agglomération pour un premier échange, gratuit et sans engagement.',
      },
      ...commonFaq('à Chartres'),
    ],
  },
  {
    slug: 'chateaudun',
    name: 'Châteaudun',
    at: 'à Châteaudun',
    seoTitle: 'Création de site internet à Châteaudun',
    description:
      'Création de site internet à Châteaudun et dans le Dunois : sites vitrines pour artisans, commerçants et associations, par un développeur web local. Devis gratuit, dès 500 €.',
    intro:
      'Sous-préfecture au bord du Loir, Châteaudun vit de ses commerces, de ses artisans et d’un tissu associatif actif. Beaucoup d’entreprises du Dunois n’ont encore qu’une page Facebook ou un site vieillissant : c’est une vraie occasion de se démarquer.',
    context: [
      'Apparaître quand un habitant du Dunois cherche un professionnel près de chez lui.',
      'Remplacer un site ancien, lent ou illisible sur téléphone par un site moderne.',
      'Montrer vos réalisations et vos avis pour gagner la confiance avant le premier appel.',
    ],
    audiences: [
      'Artisans et entreprises du bâtiment',
      'Commerces et restaurants',
      'Services à la personne',
      'Associations du Dunois',
    ],
    nearby: ['Jallans', 'Cloyes-les-Trois-Rivières', 'Marboué', 'La Chapelle-du-Noyer'],
    faq: [
      {
        q: 'Travaillez-vous avec des entreprises de Châteaudun ?',
        a: 'Oui, Châteaudun fait partie de ma zone d’intervention. Je peux venir vous rencontrer sur place, ou échanger par téléphone et en visio si vous préférez.',
      },
      ...commonFaq('à Châteaudun'),
    ],
  },
  {
    slug: 'bonneval',
    name: 'Bonneval',
    at: 'à Bonneval',
    seoTitle: 'Création de site internet à Bonneval',
    description:
      'Développeur web freelance à Bonneval (28) : création de site internet pour artisans, commerçants et associations entre Chartres et Châteaudun. Devis gratuit, dès 500 €.',
    intro:
      'Entre Chartres et Châteaudun, Bonneval compte de nombreux artisans et commerces de proximité dont la clientèle dépasse la commune. Un site bien référencé vous rend visible dans tout le secteur, pas seulement auprès de ceux qui vous connaissent déjà.',
    context: [
      'Être trouvé par les habitants des communes voisines qui cherchent un professionnel de confiance.',
      'Présenter clairement vos prestations, vos horaires et votre zone d’intervention.',
      'Un interlocuteur proche, que vous pouvez rencontrer facilement.',
    ],
    audiences: [
      'Artisans (bâtiment, chauffage, ramonage…)',
      'Commerces de proximité',
      'Agriculteurs et entreprises rurales',
      'Associations et comités des fêtes',
    ],
    nearby: ['Alluyes', 'Montboissier', 'Saint-Maur-sur-le-Loir', 'Dangeau'],
    faq: [
      {
        q: 'Êtes-vous vraiment basé près de Bonneval ?',
        a: 'Oui, je travaille dans le secteur entre Bonneval, Voves, Châteaudun et Chartres. Un rendez-vous en personne est donc facile à organiser.',
      },
      ...commonFaq('à Bonneval'),
    ],
  },
  {
    slug: 'voves',
    name: 'Voves',
    at: 'à Voves',
    seoTitle: 'Création de site internet à Voves',
    description:
      'Création de site internet à Voves et en Beauce : sites vitrines simples et efficaces pour artisans, commerçants, entreprises agricoles et associations. Devis gratuit, dès 500 €.',
    intro:
      'Au cœur de la Beauce, Voves et ses communes voisines comptent artisans, commerces et entreprises agricoles qui travaillent sur un large secteur. Un site vous fait connaître au-delà du bouche-à-oreille, sans y passer vos soirées.',
    context: [
      'Être visible dans les recherches locales, même sur un territoire rural.',
      'Un site simple à faire vivre, avec un suivi possible si vous n’avez pas le temps.',
      'Des tarifs pensés pour les petites structures et les associations.',
    ],
    audiences: [
      'Artisans et entreprises du bâtiment',
      'Entreprises agricoles et agroalimentaires',
      'Commerces de proximité',
      'Associations sportives et culturelles',
    ],
    nearby: ['Les Villages Vovéens', 'Prasville', 'Ymonville', 'Allonnes'],
    faq: [
      {
        q: 'Intervenez-vous en Beauce, autour de Voves ?',
        a: 'Oui, Voves et les communes alentour font partie de ma zone d’intervention. Je me déplace pour un premier rendez-vous gratuit.',
      },
      ...commonFaq('à Voves'),
    ],
  },
];
