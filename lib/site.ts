// Contenu de référence — anciennement Charte SphereWeb v2.0 (Août 2026),
// rebaptisé Kaylow Sphere. Source unique de vérité pour les textes,
// coordonnées et métadonnées.

export const site = {
  name: 'Kaylow Sphere',
  legalName: 'David ANTOINA',
  role: 'Développeur web et web mobile fullstack',
  baseline: 'Kaylow Sphere, le centre de gravité de votre projet web',
  // Domaine officiel (anciennement sphereweb-dev.com, avant ça sphere-web.com).
  url: 'https://kaylowsphere.com',
  email: 'david.antoina@kaylowsphere.com',
  location: 'Eure-et-Loir (28)',
  status: 'Micro-entrepreneur',
  siret: '10673178900017',
  vat: 'TVA non applicable, art. 293 B du CGI',
  // Durée de conservation des messages du formulaire de contact.
  contactRetention: '3 ans à compter du dernier échange',
  // Profils plateformes — liens à compléter quand disponibles (Charte §3.4).
  profiles: {
    malt: '',
    codeur: '',
  },
} as const;

/**
 * Partenaire affiché dans le pied de page.
 * Remplacer `logo` par le fichier définitif dans public/partners/.
 */
export const partner = {
  name: 'ARTNumérique',
  url: 'https://www.xn--artnumrique-gbb.fr',
  logo: '/partners/artnumerique.png',
  contactName: 'Renaud Vaillant',
  // Affichage en unicode, href en punycode pour la compatibilité des clients mail.
  email: 'renaud.vaillant@artnumérique.fr',
  emailHref: 'renaud.vaillant@xn--artnumrique-gbb.fr',
} as const;

export type ServiceKey = 'sites-vitrines' | 'applications-sur-mesure' | 'maintenance';

export interface Service {
  key: ServiceKey;
  title: string;
  short: string;
  description: string;
  points: string[];
  icon: 'window' | 'code' | 'shield';
}

export const services: Service[] = [
  {
    key: 'sites-vitrines',
    title: 'Sites vitrines',
    short:
      'Sites vitrines responsives et rapides, optimisés pour le référencement naturel dès la mise en ligne.',
    description:
      "Je conçois et développe des sites vitrines sur mesure : une présence en ligne claire, rapide à charger et pensée mobile d'abord. Le référencement naturel de base est intégré dès la livraison — titres, descriptions, structure des contenus et sitemap.",
    points: [
      'Design sur mesure, fidèle à votre identité',
      'Responsive, testé mobile en priorité',
      'Temps de chargement optimisés (images compressées, chargement différé)',
      'SEO de base : balises title/description, structure Hn, sitemap.xml',
      'Conformité RGPD (mentions légales, consentement)',
    ],
    icon: 'window',
  },
  {
    key: 'applications-sur-mesure',
    title: 'Applications web sur mesure',
    short:
      'Applications métier full-stack (React, Node.js/Express), du MVP jusqu’à la mise en production.',
    description:
      "Vous avez un besoin métier qu'aucun outil du marché ne couvre ? Je développe l'application de A à Z : cadrage, maquettes, développement front et back, mise en production. Je privilégie une première version utile rapidement (MVP), puis on itère.",
    points: [
      'Cadrage du besoin et priorisation des fonctionnalités',
      'Front-end React, back-end Node.js / Express',
      'Base de données et API sur mesure',
      'Livraison progressive : un MVP utilisable, puis des itérations',
      'Mise en production et accompagnement au démarrage',
    ],
    icon: 'code',
  },
  {
    key: 'maintenance',
    title: 'Maintenance & évolutions',
    short:
      'Suivi technique après la mise en ligne : corrections, mises à jour de sécurité, ajout de fonctionnalités.',
    description:
      'Un site ou une application, ça vit. Je reste disponible après la livraison pour corriger, mettre à jour et faire évoluer votre outil au rythme de votre activité — sans que vous ayez à devenir technique.',
    points: [
      'Corrections de bugs et ajustements',
      'Mises à jour de sécurité et de dépendances',
      'Ajout de nouvelles fonctionnalités',
      'Surveillance de la disponibilité et des performances',
      'Interlocuteur unique, réponses en français clair',
    ],
    icon: 'shield',
  },
];

export interface ProjectImage {
  /** Chemin depuis /public — déposer les fichiers dans public/portfolio/<slug>/. */
  src: string;
  alt: string;
}

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  stack: string[];
  type: string;
  year?: string;
  status?: 'en ligne' | 'en cours' | 'produit personnel';
  context: string;
  solution: string;
  highlights: string[];
  /** Lien public du projet (affiché s'il est renseigné). */
  url?: string;
  /**
   * Captures d'écran. Laisser vide tant qu'elles ne sont pas prêtes :
   * un visuel de remplacement s'affiche automatiquement.
   * Convention : public/portfolio/<slug>/01.png, 02.png, …
   */
  images?: ProjectImage[];
}

export const projects: Project[] = [
  {
    slug: 'trouve-ton-artisan',
    name: 'Trouve Ton Artisan (TTA)',
    tagline: "Plateforme d'annuaire d'artisans.",
    stack: ['React', 'Node.js', 'Express'],
    type: 'Plateforme / annuaire',
    status: 'en ligne',
    context:
      "Mettre en relation des particuliers et des artisans d'une région à travers un annuaire consultable et filtrable par métier et par secteur.",
    solution:
      'Application React côté public, API Node.js/Express côté serveur, avec fiches artisans détaillées, recherche multi-critères et formulaire de mise en relation.',
    highlights: [
      'Recherche et filtres par métier et par secteur géographique',
      'Fiches artisans détaillées',
      'Formulaire de contact vers l’artisan',
    ],
    // url: 'https://…',
    // images: [
    //   { src: '/portfolio/trouve-ton-artisan/01.png', alt: 'Page d’accueil de Trouve Ton Artisan' },
    //   { src: '/portfolio/trouve-ton-artisan/02.png', alt: 'Résultats de recherche filtrés' },
    // ],
  },
  {
    slug: 'maintenance-ramonage-services',
    name: 'Maintenance Ramonage Services',
    tagline: "Site vitrine d'un artisan ramoneur, avec prise de rendez-vous en ligne.",
    stack: ['Astro', 'TypeScript', 'Tailwind CSS', 'GSAP'],
    type: 'Site vitrine client',
    status: 'en cours',
    context:
      'Kévin, artisan ramoneur en Eure-et-Loir, intervient sur les poêles à granulés, poêles à bois, inserts et cheminées. Les trois quarts de sa clientèle ont plus de 60 ans : le site devait être avant tout lisible et simple à utiliser.',
    solution:
      'Site Astro pré-généré en HTML statique (très peu de JavaScript), avec une petite API Node pour les formulaires : demandes de devis et rendez-vous sont transmis à FacturePro. Texte en grand, boutons larges, téléphone toujours visible, aucun pop-up.',
    highlights: [
      'Pensé pour une clientèle senior : lisibilité, contraste, grandes zones cliquables',
      "Prise de rendez-vous en ligne pour le ramonage et l'entretien",
      'Formulaire de devis relié à FacturePro',
      "Zone d'intervention vérifiée par commune",
    ],
    images: [
      {
        src: '/portfolio/maintenance-ramonage-services/01.jpg',
        alt: "Page d'accueil du site Maintenance Ramonage Services",
      },
    ],
  },
  {
    slug: 'tpak',
    name: 'Touche Pas Au Klaxon (TPAK)',
    tagline: 'Application de covoiturage.',
    stack: ['PHP', 'MVC'],
    type: 'Application de covoiturage',
    context:
      'Proposer une application de covoiturage : publication de trajets, recherche par itinéraire et réservation de places.',
    solution:
      'Application développée en PHP suivant une architecture MVC : gestion des comptes, publication et recherche de trajets, réservation et historique.',
    highlights: [
      'Architecture MVC structurée',
      'Publication et recherche de trajets',
      'Gestion des réservations et de l’historique',
    ],
  },
  {
    slug: 'gdf',
    name: 'FacturePro',
    tagline:
      'SaaS gestion de devis et de facturation et de gestion financière pour freelances, PME et Grande Entreprise.',
    stack: ['TypeScript', 'Express', 'Sequelize'],
    type: 'SaaS de facturation',
    status: 'produit personnel',
    context:
      'Outil personnel devenu produit : aider les freelances à gérer devis, factures et suivi financier au même endroit, sans tableur.',
    solution:
      'Back-end TypeScript / Express avec Sequelize pour la persistance, génération de devis et factures, suivi des encaissements et tableau de bord financier.',
    highlights: [
      'Devis et factures conformes',
      'Suivi des encaissements et des impayés',
      'Tableau de bord financier',
      'Produit développé et maintenu en propre',
    ],
    images: [
      {
        src: '/portfolio/gdf/01.jpg',
        alt: "Page d'accueil de FacturePro : « Vos devis et factures, gérés simplement »",
      },
    ],
  },
  {
    slug: 'nexus',
    name: 'Nexus',
    tagline: 'Application personnelle en cours de développement.',
    stack: ['React', 'Node.js'],
    type: 'Projet personnel',
    status: 'en cours',
    context:
      'Projet personnel en cours de conception. Les détails seront publiés au fil de son avancement.',
    solution: 'Développement en cours.',
    highlights: ['En développement actif'],
  },
];

export interface NavItem {
  label: string;
  to: string;
}

export const nav: NavItem[] = [
  // `label` = texte affiché (le header le met en minuscules).
  // `to`    = URL de la page — NE PAS toucher sauf si le dossier de `app/` est renommé.
  { label: 'Accueil', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'À propos', to: '/a-propos' },
  { label: 'Contact', to: '/contact' },
];
